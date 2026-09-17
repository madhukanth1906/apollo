"""
Camera Calibration Utility
==========================
Computes intrinsic camera matrix and lens distortion coefficients using
standard OpenCV chessboard calibration.

Supports:
1. Live camera capture mode (press SPACE to capture checkerboard frames, 'c' to solve & save).
2. Folder batch mode (calibrates from directory of checkerboard photos).
3. Inspection mode (displays stored calibration parameters).

Saves to: calibration/camera_calibration.npz
"""

import argparse
import sys
from pathlib import Path
import cv2
import numpy as np

import config


def inspect_calibration(calibration_file: str = config.CALIBRATION_FILE_PATH):
    """Prints stored calibration parameters if available."""
    calib_path = Path(calibration_file)
    if not calib_path.is_file():
        print(f"[!] No calibration file found at: {calibration_file}")
        print("    Run 'python calibrate_camera.py --camera 0' to perform calibration.")
        return False

    data = np.load(calibration_file)
    camera_matrix = data["camera_matrix"]
    dist_coeffs = data["dist_coeffs"]
    img_size = data.get("image_size", None)
    reproj_err = data.get("reprojection_error", None)

    print("=" * 65)
    print(" CAMERA CALIBRATION PARAMETERS")
    print("=" * 65)
    print(f"File Path: {calibration_file}")
    if img_size is not None:
        print(f"Calibrated Image Resolution: {img_size[0]} x {img_size[1]} px")
    if reproj_err is not None:
        print(f"Mean Reprojection Error: {float(reproj_err):.4f} px (ideal: < 0.5 px)")
    print("\nIntrinsic Camera Matrix (K):")
    print(np.array2string(camera_matrix, precision=4, suppress_small=True))
    print(f"  -> Focal Length (fx, fy): ({camera_matrix[0,0]:.2f}, {camera_matrix[1,1]:.2f}) px")
    print(f"  -> Principal Point (cx, cy): ({camera_matrix[0,2]:.2f}, {camera_matrix[1,2]:.2f}) px")
    print("\nDistortion Coefficients (D) [k1, k2, p1, p2, k3]:")
    print(np.array2string(dist_coeffs.ravel(), precision=5, suppress_small=True))
    print("=" * 65)
    return True


def calibrate_from_images(image_paths, chessboard_size, square_size_mm, output_file):
    """Calculates calibration from a list of image file paths."""
    print(f"[*] Processing {len(image_paths)} images for chessboard {chessboard_size}...")

    # Prepare 3D object points in physical world units (mm)
    cols, rows = chessboard_size
    objp = np.zeros((rows * cols, 3), np.float32)
    objp[:, :2] = np.mgrid[0:cols, 0:rows].T.reshape(-1, 2) * square_size_mm

    objpoints = []  # 3D points in real world space
    imgpoints = []  # 2D points in image plane
    valid_images = 0
    img_shape = None

    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.001)

    for img_path in image_paths:
        img = cv2.imread(str(img_path))
        if img is None:
            continue
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        if img_shape is None:
            img_shape = gray.shape[::-1]  # (width, height)

        ret, corners = cv2.findChessboardCorners(
            gray,
            chessboard_size,
            cv2.CALIB_CB_ADAPTIVE_THRESH + cv2.CALIB_CB_FAST_CHECK + cv2.CALIB_CB_NORMALIZE_IMAGE
        )

        if ret:
            valid_images += 1
            refined_corners = cv2.cornerSubPix(gray, corners, (11, 11), (-1, -1), criteria)
            objpoints.append(objp)
            imgpoints.append(refined_corners)
            print(f"  [+] Detected corners in: {Path(img_path).name}")
        else:
            print(f"  [-] No corners found in: {Path(img_path).name}")

    if valid_images < 3:
        print(f"[ERROR] Insufficient valid chessboard frames ({valid_images} found, minimum 5 recommended).")
        return False

    print(f"[*] Calibrating camera matrix with {valid_images} valid captures...")
    ret, camera_matrix, dist_coeffs, rvecs, tvecs = cv2.calibrateCamera(
        objpoints, imgpoints, img_shape, None, None
    )

    # Compute mean reprojection error
    total_error = 0.0
    total_points = 0
    for i in range(len(objpoints)):
        imgpoints2, _ = cv2.projectPoints(objpoints[i], rvecs[i], tvecs[i], camera_matrix, dist_coeffs)
        error = cv2.norm(imgpoints[i], imgpoints2, cv2.NORM_L2)
        total_error += error * error
        total_points += len(objpoints[i])
    mean_error = np.sqrt(total_error / total_points)

    Path(output_file).parent.mkdir(parents=True, exist_ok=True)
    np.savez(
        output_file,
        camera_matrix=camera_matrix,
        dist_coeffs=dist_coeffs,
        image_size=np.array(img_shape),
        reprojection_error=np.array(mean_error)
    )

    print(f"[SUCCESS] Calibration saved successfully to: {output_file}")
    print(f"          Mean Reprojection Error: {mean_error:.4f} px")
    return True


def live_camera_calibration(camera_id, chessboard_size, square_size_mm, output_file):
    """Interactive GUI capture mode to calibrate directly using a live webcam."""
    cap = cv2.VideoCapture(camera_id)
    if not cap.isOpened():
        print(f"[ERROR] Could not open camera device {camera_id}.")
        return False

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, config.CAMERA_FRAME_WIDTH)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, config.CAMERA_FRAME_HEIGHT)

    cols, rows = chessboard_size
    objp = np.zeros((rows * cols, 3), np.float32)
    objp[:, :2] = np.mgrid[0:cols, 0:rows].T.reshape(-1, 2) * square_size_mm

    objpoints = []
    imgpoints = []
    captured_count = 0
    img_shape = None
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.001)

    print("\n" + "=" * 65)
    print(" LIVE CAMERA CALIBRATION MODE")
    print("=" * 65)
    print("Controls:")
    print("  [SPACE] : Capture current frame if chessboard is detected (Aim for 10-15 frames at various angles)")
    print("  [C]     : Calculate calibration and save parameters")
    print("  [Q]     : Quit without saving")
    print("=" * 65 + "\n")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("[ERROR] Failed to read frame from camera.")
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        if img_shape is None:
            img_shape = gray.shape[::-1]

        found, corners = cv2.findChessboardCorners(
            gray,
            chessboard_size,
            cv2.CALIB_CB_ADAPTIVE_THRESH + cv2.CALIB_CB_FAST_CHECK + cv2.CALIB_CB_NORMALIZE_IMAGE
        )

        display = frame.copy()
        if found:
            cv2.drawChessboardCorners(display, chessboard_size, corners, found)
            status_text = "CHESSBOARD DETECTED - Press SPACE to capture"
            status_color = (0, 255, 0)
        else:
            status_text = "Searching for chessboard pattern..."
            status_color = (0, 165, 255)

        # Draw HUD info
        cv2.rectangle(display, (10, 10), (600, 75), (20, 20, 20), -1)
        cv2.putText(display, status_text, (20, 35), config.FONT_FACE, 0.55, status_color, 2)
        cv2.putText(
            display,
            f"Frames Captured: {captured_count} (Need >= 10 for high accuracy)",
            (20, 60),
            config.FONT_FACE,
            0.50,
            (255, 255, 255),
            1
        )

        cv2.imshow("Camera Calibration", display)
        key = cv2.waitKey(1) & 0xFF

        if key == 32:  # SPACE
            if found:
                refined_corners = cv2.cornerSubPix(gray, corners, (11, 11), (-1, -1), criteria)
                objpoints.append(objp)
                imgpoints.append(refined_corners)
                captured_count += 1
                print(f"[+] Frame {captured_count} captured!")
            else:
                print("[-] Chessboard not clearly detected. Hold still and ensure all corners are in view.")

        elif key == ord('c') or key == ord('C'):
            if captured_count < 5:
                print(f"[!] Please capture at least 5 frames (currently {captured_count}).")
                continue
            print("[*] Computing calibration from captured frames...")
            ret, camera_matrix, dist_coeffs, rvecs, tvecs = cv2.calibrateCamera(
                objpoints, imgpoints, img_shape, None, None
            )
            # Reprojection error
            total_error = 0.0
            total_points = 0
            for i in range(len(objpoints)):
                imgpoints2, _ = cv2.projectPoints(objpoints[i], rvecs[i], tvecs[i], camera_matrix, dist_coeffs)
                error = cv2.norm(imgpoints[i], imgpoints2, cv2.NORM_L2)
                total_error += error * error
                total_points += len(objpoints[i])
            mean_error = np.sqrt(total_error / total_points)

            Path(output_file).parent.mkdir(parents=True, exist_ok=True)
            np.savez(
                output_file,
                camera_matrix=camera_matrix,
                dist_coeffs=dist_coeffs,
                image_size=np.array(img_shape),
                reprojection_error=np.array(mean_error)
            )
            print(f"[SUCCESS] Calibration saved to {output_file} (Error: {mean_error:.4f} px)")
            break

        elif key == ord('q') or key == ord('Q') or key == 27:
            print("[*] Calibration cancelled.")
            break

    cap.release()
    cv2.destroyAllWindows()
    return True


def main():
    parser = argparse.ArgumentParser(description="OpenCV Chessboard Camera Calibration")
    parser.add_argument("--camera", type=int, default=None, help="Camera device index for live calibration (e.g. 0)")
    parser.add_argument("--images-dir", type=str, default=None, help="Directory containing checkerboard calibration images")
    parser.add_argument("--inspect", action="store_true", help="Inspect existing calibration file parameters")
    parser.add_argument("--output", type=str, default=config.CALIBRATION_FILE_PATH, help="Output .npz file path")
    parser.add_argument("--rows", type=int, default=config.CHESSBOARD_SIZE[1], help="Number of inner corners in rows")
    parser.add_argument("--cols", type=int, default=config.CHESSBOARD_SIZE[0], help="Number of inner corners in cols")
    parser.add_argument("--square-size", type=float, default=config.CHESSBOARD_SQUARE_SIZE_MM, help="Square side size in mm")

    args = parser.parse_args()

    if args.inspect:
        inspect_calibration(args.output)
        sys.exit(0)

    chessboard_size = (args.cols, args.rows)

    if args.images_dir:
        img_dir = Path(args.images_dir)
        patterns = ["*.jpg", "*.jpeg", "*.png", "*.bmp", "*.tiff"]
        image_files = []
        for pat in patterns:
            image_files.extend(list(img_dir.glob(pat)))
        if not image_files:
            print(f"[ERROR] No image files found in directory {args.images_dir}")
            sys.exit(1)
        calibrate_from_images(image_files, chessboard_size, args.square_size, args.output)
    elif args.camera is not None:
        live_camera_calibration(args.camera, chessboard_size, args.square_size, args.output)
    else:
        # Default: inspect if file exists, else guide user
        if Path(args.output).is_file():
            inspect_calibration(args.output)
        else:
            print("[!] No calibration parameters found.")
            print("\nUsage:")
            print("  1. Live Camera Mode:      python calibrate_camera.py --camera 0")
            print("  2. Directory Images Mode: python calibrate_camera.py --images-dir ./calibration_photos")
            print("  3. Inspect Existing:      python calibrate_camera.py --inspect")


if __name__ == "__main__":
    main()
