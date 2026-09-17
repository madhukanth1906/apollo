"""
ArUco Real-World Measurement System - Main Entry Point
======================================================
CLI Application supporting:
1. Live camera feed mode:  python main.py --camera 0
2. Single image mode:      python main.py --image input/product.jpg

Features:
- Lens undistortion
- ArUco metric scaling & planar homography
- Product package segmentation & oriented bounding box dimensions
- Small printed text detection & character height measurement
- Precision accuracy/error indicators
- Automated JSON & JPEG export
"""

import argparse
import os
import sys
from pathlib import Path
import cv2

import config
from measurement import MeasurementEngine


def run_image_mode(
    image_path: str,
    engine: MeasurementEngine,
    output_dir: str = config.OUTPUT_DIR,
    save_rectified: bool = False,
):
    """Processes a single input image and exports measurement artifacts."""
    img_path = Path(image_path)
    if not img_path.is_file():
        print(f"[ERROR] Image file not found: {image_path}")
        sys.exit(1)

    image = cv2.imread(str(img_path))
    if image is None:
        print(f"[ERROR] Unable to load image: {image_path}")
        sys.exit(1)

    print(f"[*] Processing image: {img_path.name} ({image.shape[1]}x{image.shape[0]} px)...")
    res = engine.process_frame(image)
    rep = res["report"]

    # Rectified top-down view if requested and homography exists
    rectified_view = None
    if save_rectified and res["aruco"].get("homography_px_to_mm") is not None:
        rectified_view = engine.get_rectified_view(
            res["raw_corrected_frame"], res["aruco"]["homography_px_to_mm"]
        )

    # Save artifacts
    img_out, json_out = engine.save_results(
        output_image=res["annotated_frame"],
        report=rep,
        output_dir=output_dir,
        image_name=f"measured_{img_path.stem}.jpg",
        json_name=f"measurement_{img_path.stem}.json",
        rectified_image=rectified_view,
    )

    # Print clean summary table to stdout
    print("\n" + "=" * 65)
    print(" MEASUREMENT PIPELINE RESULTS")
    print("=" * 65)
    print(f"Timestamp:             {rep['timestamp']}")
    print(f"Camera Calibrated:     {'YES' if rep['camera_calibrated'] else 'NO (Uncalibrated lens fallback)'}")
    print("-" * 65)

    # ArUco Marker details
    m = rep["marker"]
    if m["detected"]:
        status_q = "EXCELLENT" if m["error_percentage"] < 1.0 else ("GOOD" if m["error_percentage"] < 3.0 else "FAIR")
        print(f"ArUco Marker ID:       {m['marker_id']}")
        print(f"Reference Size:        {m['known_size_mm']:.2f} mm")
        print(f"Measured Marker:       {m['measured_size_mm']:.2f} mm")
        print(f"Reconstruction Error:  {m['error_mm']:.2f} mm ({m['error_percentage']:.2f}%) [{status_q}]")
        print(f"Scale:                 {m['pixels_per_mm']:.2f} px/mm ({m['mm_per_pixel']:.4f} mm/px)")
    else:
        print("[!] ArUco Marker:      NOT DETECTED")

    print("-" * 65)

    # Product & Object details
    p = rep["product"]
    if p["detected"]:
        all_objs = p.get("all_objects", [])
        if len(all_objs) > 1:
            print(f"Detected Objects:      {len(all_objs)} object(s) in scene")
            for obj in all_objs:
                label = "Primary Product" if obj["object_id"] == 1 else f"Object #{obj['object_id']}"
                print(f"  -> {label}: {obj['width_mm']:.1f} mm (W) x {obj['height_mm']:.1f} mm (H) | Area: {obj['area_cm2']:.2f} cm² | Angle: {obj['orientation_degrees']:.1f}°")
        else:
            print(f"Product Width:         {p['width_mm']:.1f} mm")
            print(f"Product Height:        {p['height_mm']:.1f} mm")
            print(f"PDP Display Area:      {p['area_cm2']:.2f} cm²")
            print(f"Orientation Angle:     {p['orientation_degrees']:.1f}°")
    else:
        print("[!] Product Package:   NOT DETECTED")

    print("-" * 65)

    # Text details
    t = rep["text"]
    print(f"Text Status:           {t['status_message']}")
    if t["detected"]:
        for reg in t["regions"]:
            print(f"  -> Region {reg['region_id']}: {reg['width_mm']:.1f} mm (W) x {reg['height_mm']:.1f} mm (H) | Est. Char Height: {reg['estimated_char_height_mm']:.1f} mm")
    elif not t["reliable"]:
        print("  -> Text measurement unreliable due to image resolution.")

    if rep["warnings"]:
        print("-" * 65)
        print("Warnings:")
        for w in rep["warnings"]:
            print(f"  * {w}")

    print("=" * 65)
    print(f"[+] Output Image Saved: {img_out}")
    print(f"[+] JSON Report Saved:  {json_out}")
    if rectified_view is not None:
        print(f"[+] Rectified Plane:    {output_dir}/rectified_product.jpg")
    print("=" * 65 + "\n")


def run_camera_mode(
    camera_id: int,
    engine: MeasurementEngine,
    output_dir: str = config.OUTPUT_DIR,
):
    """Runs interactive live webcam measurement feed."""
    cap = cv2.VideoCapture(camera_id)
    if not cap.isOpened():
        print(f"[ERROR] Could not connect to camera device {camera_id}.")
        sys.exit(1)

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, config.CAMERA_FRAME_WIDTH)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, config.CAMERA_FRAME_HEIGHT)

    print("\n" + "=" * 65)
    print(" LIVE ARUCO REAL-TIME MEASUREMENT SYSTEM")
    print("=" * 65)
    print(f"Camera Device:         {camera_id}")
    print(f"Marker Reference Size: {engine.marker_size_mm} mm")
    print(f"Target Marker ID:      {engine.target_marker_id or 'Any'}")
    print(f"Lens Calibration:      {'LOADED' if engine.is_calibrated else 'UNCALIBRATED'}")
    print("=" * 65)
    print("Controls:")
    print("  [S] : Save current measurement frame and JSON report")
    print("  [R] : Toggle top-down rectified perspective preview")
    print("  [Q] : Quit application")
    print("=" * 65 + "\n")

    show_rectified = False
    save_counter = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            print("[ERROR] Lost camera frame stream.")
            break

        res = engine.process_frame(frame)
        annotated = res["annotated_frame"]

        if show_rectified and res["aruco"].get("homography_px_to_mm") is not None:
            rect_view = engine.get_rectified_view(
                res["raw_corrected_frame"], res["aruco"]["homography_px_to_mm"]
            )
            if rect_view is not None:
                cv2.imshow("Top-Down Rectified Plane", rect_view)

        cv2.imshow("ArUco Measurement System", annotated)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q') or key == ord('Q') or key == 27:
            print("[*] Exiting measurement system...")
            break
        elif key == ord('s') or key == ord('S'):
            save_counter += 1
            rect_save = engine.get_rectified_view(
                res["raw_corrected_frame"], res["aruco"].get("homography_px_to_mm")
            ) if res["aruco"].get("homography_px_to_mm") is not None else None

            img_file, json_file = engine.save_results(
                output_image=annotated,
                report=res["report"],
                output_dir=output_dir,
                image_name=f"live_capture_{save_counter}.jpg",
                json_name=f"live_capture_{save_counter}.json",
                rectified_image=rect_save,
            )
            print(f"[+] Captured Frame {save_counter} saved to {img_file}")

        elif key == ord('r') or key == ord('R'):
            show_rectified = not show_rectified
            if not show_rectified:
                cv2.destroyWindow("Top-Down Rectified Plane")
            print(f"[*] Top-Down Rectified Preview: {'ON' if show_rectified else 'OFF'}")

    cap.release()
    cv2.destroyAllWindows()


def main():
    parser = argparse.ArgumentParser(
        description="ArUco Real-World Metric Size Measurement System"
    )
    parser.add_argument("--image", type=str, default=None, help="Path to input image file")
    parser.add_argument("--camera", type=int, default=None, help="Camera device index (e.g. 0)")
    parser.add_argument("--marker-size", type=float, default=config.MARKER_SIZE_MM, help="Physical size of ArUco marker in mm (e.g. 50.0)")
    parser.add_argument("--marker-id", type=int, default=config.MARKER_ID, help="Specific ArUco marker ID to track")
    parser.add_argument("--calibration", type=str, default=config.CALIBRATION_FILE_PATH, help="Path to camera_calibration.npz file")
    parser.add_argument("--output-dir", type=str, default=config.OUTPUT_DIR, help="Directory to store output images and reports")
    parser.add_argument("--save-rectified", action="store_true", help="Also export rectified top-down perspective plane image")

    args = parser.parse_args()

    engine = MeasurementEngine(
        marker_size_mm=args.marker_size,
        target_marker_id=args.marker_id,
        calibration_file=args.calibration,
    )

    if args.image is not None:
        run_image_mode(args.image, engine, output_dir=args.output_dir, save_rectified=args.save_rectified)
    elif args.camera is not None:
        run_camera_mode(args.camera, engine, output_dir=args.output_dir)
    else:
        # Check if default input sample exists
        default_sample = Path(config.INPUT_DIR) / "sample_product.jpg"
        if default_sample.is_file():
            print(f"[*] No argument specified; running on default sample: {default_sample}")
            run_image_mode(str(default_sample), engine, output_dir=args.output_dir, save_rectified=args.save_rectified)
        else:
            print("ArUco Real-World Metric Size Measurement System")
            print("Usage:")
            print("  Single Image Mode: python main.py --image input/product.jpg")
            print("  Live Webcam Mode:  python main.py --camera 0")
            print("  Calibrate Camera:  python calibrate_camera.py --camera 0")


if __name__ == "__main__":
    main()
