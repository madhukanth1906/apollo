"""
Measurement Pipeline Orchestrator and Visual Annotator
======================================================
Executes the full measurement pipeline:
Camera Calibration -> Image Undistortion -> ArUco Detection ->
Planar Homography Estimation -> Product Dimension Calculation ->
Small Text Size Measurement -> Visual Annotations & JSON Report Generation.
"""

import json
import os
import time
from pathlib import Path
from typing import Dict, Optional, Tuple, Any
import cv2
import numpy as np

import config
from aruco_detector import ArucoDetector
from product_detector import ProductDetector
from text_detector import TextDetector


class MeasurementEngine:
    def __init__(
        self,
        marker_size_mm: float = config.MARKER_SIZE_MM,
        target_marker_id: Optional[int] = config.MARKER_ID,
        calibration_file: str = config.CALIBRATION_FILE_PATH,
    ):
        self.marker_size_mm = float(marker_size_mm)
        self.target_marker_id = target_marker_id
        self.calibration_file = calibration_file

        # Initialize sub-modules
        self.aruco_detector = ArucoDetector(
            marker_size_mm=self.marker_size_mm,
            target_marker_id=self.target_marker_id,
            dict_name=config.ARUCO_DICT_NAME,
        )
        self.product_detector = ProductDetector()
        self.text_detector = TextDetector()

        # Load camera calibration parameters
        self.camera_matrix: Optional[np.ndarray] = None
        self.dist_coeffs: Optional[np.ndarray] = None
        self.is_calibrated = False
        self._load_calibration()

    def _load_calibration(self) -> bool:
        """Loads camera calibration matrices from .npz file if present."""
        calib_path = Path(self.calibration_file)
        if calib_path.is_file():
            try:
                data = np.load(str(calib_path))
                self.camera_matrix = data["camera_matrix"]
                self.dist_coeffs = data["dist_coeffs"]
                self.is_calibrated = True
                print(f"[INFO] Successfully loaded camera calibration from: {calib_path.name}")
                return True
            except Exception as e:
                print(f"[WARN] Failed to read calibration file {self.calibration_file}: {e}")
                self.is_calibrated = False
        else:
            print("[INFO] No camera calibration file found.")
            print("       Running in uncalibrated mode. For optimal metric accuracy, run:")
            print("       python calibrate_camera.py --camera 0")
            self.is_calibrated = False
        return False

    def undistort_frame(self, frame: np.ndarray) -> np.ndarray:
        """Applies lens distortion correction if camera calibration is loaded."""
        if not self.is_calibrated or self.camera_matrix is None or self.dist_coeffs is None:
            return frame
        h, w = frame.shape[:2]
        new_cam_matrix, roi = cv2.getOptimalNewCameraMatrix(
            self.camera_matrix, self.dist_coeffs, (w, h), 1, (w, h)
        )
        undistorted = cv2.undistort(frame, self.camera_matrix, self.dist_coeffs, None, new_cam_matrix)
        return undistorted

    def process_frame(self, frame: np.ndarray) -> Dict[str, Any]:
        """
        Executes the entire measurement pipeline on a single image frame.
        """
        start_time = time.time()

        # Step 1: Lens distortion correction
        corrected_frame = self.undistort_frame(frame)

        # Step 2: ArUco Marker Detection & Planar Homography
        aruco_res = self.aruco_detector.detect(corrected_frame)

        # Step 3: Product Detection & Metric Sizing
        product_res = self.product_detector.detect(
            corrected_frame,
            aruco_corners_px=aruco_res.get("corners_px"),
            H_px_to_mm=aruco_res.get("homography_px_to_mm"),
            mm_per_pixel_fallback=aruco_res.get("mm_per_pixel", 0.0),
        )

        # Step 4: Small Text Detection & Measurement
        text_res = self.text_detector.detect_and_measure(
            corrected_frame,
            product_roi_rect=product_res.get("roi_rect"),
            product_box_corners_px=product_res.get("box_corners_px"),
            H_px_to_mm=aruco_res.get("homography_px_to_mm"),
            mm_per_pixel_fallback=aruco_res.get("mm_per_pixel", 0.0),
        )

        # Step 5: Visual Annotation & Rendering
        annotated_frame = self.render_visual_output(
            corrected_frame, aruco_res, product_res, text_res
        )

        elapsed_ms = (time.time() - start_time) * 1000.0

        # Construct comprehensive structured measurement report
        report = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "processing_time_ms": round(elapsed_ms, 2),
            "camera_calibrated": self.is_calibrated,
            "marker": {
                "detected": aruco_res["found"],
                "marker_id": aruco_res.get("marker_id"),
                "known_size_mm": self.marker_size_mm,
                "measured_size_mm": aruco_res.get("measured_marker_size_mm"),
                "error_mm": aruco_res.get("error_mm", 0.0),
                "error_percentage": aruco_res.get("error_percentage", 0.0),
                "pixels_per_mm": round(aruco_res.get("pixels_per_mm", 0.0), 3),
                "mm_per_pixel": round(aruco_res.get("mm_per_pixel", 0.0), 4),
            },
            "product": {
                "detected": product_res["found"],
                "objects_count": product_res.get("objects_count", 0),
                "width_mm": product_res.get("width_mm", 0.0),
                "height_mm": product_res.get("height_mm", 0.0),
                "area_cm2": product_res.get("area_cm2", 0.0),
                "pixel_width": round(product_res.get("pixel_width", 0.0), 1),
                "pixel_height": round(product_res.get("pixel_height", 0.0), 1),
                "orientation_degrees": product_res.get("orientation_deg", 0.0),
                "all_objects": [
                    {
                        "object_id": obj["object_id"],
                        "width_mm": obj["width_mm"],
                        "height_mm": obj["height_mm"],
                        "area_cm2": obj["area_cm2"],
                        "orientation_degrees": obj["orientation_deg"],
                    }
                    for obj in product_res.get("objects", [])
                ],
            },
            "text": {
                "detected": text_res["text_found"],
                "reliable": text_res["reliable"],
                "status_message": text_res["status_message"],
                "regions_count": len(text_res["regions"]),
                "regions": [
                    {
                        "region_id": r["region_id"],
                        "width_mm": r["width_mm"],
                        "height_mm": r["height_mm"],
                        "estimated_char_height_mm": r["char_height_mm"],
                        "width_px": r["width_px"],
                        "height_px": r["height_px"],
                    }
                    for r in text_res["regions"]
                ],
            },
            "warnings": [
                w for w in [aruco_res.get("warning"), product_res.get("warning"), text_res.get("warning")] if w
            ],
        }

        return {
            "annotated_frame": annotated_frame,
            "raw_corrected_frame": corrected_frame,
            "aruco": aruco_res,
            "product": product_res,
            "text": text_res,
            "report": report,
        }

    def render_visual_output(
        self,
        image: np.ndarray,
        aruco_res: Dict[str, Any],
        product_res: Dict[str, Any],
        text_res: Dict[str, Any],
    ) -> np.ndarray:
        """
        Renders bounding boxes, dimension lines, arrows, labels, and HUD onto the frame.
        """
        output = image.copy()
        h_img, w_img = output.shape[:2]

        # 1. Render ArUco Marker
        if aruco_res.get("found", False):
            output = self.aruco_detector.draw_marker_overlay(output, aruco_res)

        # 2. Render All Detected Objects and Dimensions
        objects = product_res.get("objects", [])
        if not objects and product_res.get("found", False) and product_res.get("box_corners_px") is not None:
            objects = [{
                "object_id": 1,
                "box_corners_px": product_res["box_corners_px"],
                "width_mm": product_res["width_mm"],
                "height_mm": product_res["height_mm"],
                "center": np.mean(product_res["box_corners_px"], axis=0).astype(int),
            }]

        for obj in objects:
            box = obj["box_corners_px"].astype(np.int32)
            obj_id = obj["object_id"]
            color = config.COLOR_PRODUCT if obj_id == 1 else (255, 200, 0)

            cv2.polylines(output, [box], isClosed=True, color=color, thickness=3 if obj_id == 1 else 2)

            pt0 = tuple(box[0])
            pt1 = tuple(box[1])
            pt2 = tuple(box[2])

            w_label = f"W: {obj['width_mm']:.1f} mm"
            h_label = f"H: {obj['height_mm']:.1f} mm"

            self._draw_dimension_line(output, pt0, pt1, w_label, color)
            self._draw_dimension_line(output, pt1, pt2, h_label, color)

            center = tuple(obj.get("center", np.mean(box, axis=0).astype(int)))
            badge_text = f"OBJ #{obj_id}: {obj['width_mm']:.1f} x {obj['height_mm']:.1f} mm"
            self._draw_pill_badge(output, center, badge_text, color)

        # 3. Render Text Regions
        if text_res.get("text_found", False):
            for region in text_res.get("regions", []):
                rx, ry, rw, rh = region["rect_px"]
                cv2.rectangle(output, (rx, ry), (rx + rw, ry + rh), config.COLOR_TEXT, 2)
                t_label = f"TEXT #{region['region_id']} H:{region['char_height_mm']:.1f}mm"
                cv2.putText(
                    output,
                    t_label,
                    (rx, max(ry - 4, 15)),
                    config.FONT_FACE,
                    0.42,
                    config.COLOR_TEXT,
                    1,
                    cv2.LINE_AA,
                )

        # 4. Render Professional HUD Information Banner
        self._render_hud(output, aruco_res, product_res, text_res)

        return output

    def _render_hud(
        self,
        image: np.ndarray,
        aruco_res: Dict[str, Any],
        product_res: Dict[str, Any],
        text_res: Dict[str, Any],
    ):
        """Draws top HUD status panel."""
        h_img, w_img = image.shape[:2]
        hud_height = 100
        hud_width = min(w_img - 20, 680)

        # Semi-transparent dark background
        hud_roi = image[10:10 + hud_height, 10:10 + hud_width]
        dark_bg = np.full_like(hud_roi, config.COLOR_HUD_BG)
        cv2.addWeighted(dark_bg, 0.85, hud_roi, 0.15, 0, hud_roi)
        cv2.rectangle(image, (10, 10), (10 + hud_width, 10 + hud_height), (60, 80, 110), 1)

        # Line 1: ArUco Reference Info
        if aruco_res.get("found", False):
            err_pct = aruco_res.get("error_percentage", 0.0)
            status_quality = "EXCELLENT" if err_pct < 1.0 else ("GOOD" if err_pct < 3.0 else "FAIR")
            aruco_str = (
                f"ARUCO ID: {aruco_res['marker_id']}  |  REF: {self.marker_size_mm:.1f} mm  |  "
                f"Scale: {aruco_res['pixels_per_mm']:.2f} px/mm  |  Error: {err_pct:.2f}% [{status_quality}]"
            )
            aruco_color = (0, 255, 120)
        else:
            aruco_str = "ARUCO MARKER: NOT DETECTED (Scale Uncalibrated)"
            aruco_color = config.COLOR_ALERT

        cv2.putText(image, aruco_str, (22, 33), config.FONT_FACE, 0.46, aruco_color, 1, cv2.LINE_AA)

        # Line 2: Product Measurement
        if product_res.get("found", False):
            prod_str = (
                f"PRODUCT: {product_res['width_mm']:.1f} mm (W) x {product_res['height_mm']:.1f} mm (H)  |  "
                f"Area: {product_res['area_cm2']:.1f} cm2  |  Angle: {product_res['orientation_deg']:.1f} deg"
            )
            prod_color = (255, 190, 80)
        else:
            prod_str = "PRODUCT: Searching for package contours..."
            prod_color = (180, 180, 180)

        cv2.putText(image, prod_str, (22, 57), config.FONT_FACE, 0.46, prod_color, 1, cv2.LINE_AA)

        # Line 3: Text Measurement & Calibration State
        calib_tag = "[CALIBRATED]" if self.is_calibrated else "[UNCALIBRATED LENS]"
        calib_color = (0, 220, 0) if self.is_calibrated else (0, 165, 255)

        if text_res.get("text_found", False):
            t0 = text_res["regions"][0]
            text_str = f"TEXT: {len(text_res['regions'])} region(s)  |  Primary Char Height: {t0['char_height_mm']:.1f} mm  {calib_tag}"
            text_color = (255, 230, 100)
        elif not text_res.get("reliable", True):
            text_str = f"TEXT: Unreliable due to image resolution  {calib_tag}"
            text_color = (0, 140, 255)
        else:
            text_str = f"TEXT: No text detected  {calib_tag}"
            text_color = (180, 180, 180)

        cv2.putText(image, text_str, (22, 82), config.FONT_FACE, 0.44, text_color, 1, cv2.LINE_AA)

    def _draw_dimension_line(
        self,
        image: np.ndarray,
        pt1: Tuple[int, int],
        pt2: Tuple[int, int],
        label: str,
        color: Tuple[int, int, int],
    ):
        """Draws dimension line with double arrows and text."""
        p1 = np.array(pt1, dtype=float)
        p2 = np.array(pt2, dtype=float)
        length = np.linalg.norm(p2 - p1)
        if length < 10:
            return

        # Draw arrowed line
        cv2.arrowedLine(image, pt1, pt2, color, 2, tipLength=0.08)
        cv2.arrowedLine(image, pt2, pt1, color, 2, tipLength=0.08)

        # Midpoint label
        mid = ((p1 + p2) / 2.0).astype(int)
        (lw, lh), _ = cv2.getTextSize(label, config.FONT_FACE, config.FONT_SCALE_LABEL, 1)
        cv2.rectangle(image, (mid[0] - 2, mid[1] - lh - 4), (mid[0] + lw + 4, mid[1] + 4), (15, 15, 15), -1)
        cv2.putText(image, label, (mid[0], mid[1]), config.FONT_FACE, config.FONT_SCALE_LABEL, color, 1, cv2.LINE_AA)

    def _draw_pill_badge(
        self,
        image: np.ndarray,
        pos: Tuple[int, int],
        text: str,
        color: Tuple[int, int, int],
    ):
        """Draws centered pill badge."""
        (lw, lh), _ = cv2.getTextSize(text, config.FONT_FACE, 0.48, 1)
        x = pos[0] - lw // 2
        y = pos[1] + lh // 2
        cv2.rectangle(image, (x - 6, y - lh - 6), (x + lw + 6, y + 6), (15, 23, 42), -1)
        cv2.rectangle(image, (x - 6, y - lh - 6), (x + lw + 6, y + 6), color, 1)
        cv2.putText(image, text, (x, y), config.FONT_FACE, 0.48, color, 1, cv2.LINE_AA)

    def get_rectified_view(
        self,
        frame: np.ndarray,
        H_px_to_mm: np.ndarray,
        output_scale_px_per_mm: float = 4.0,
        canvas_size_mm: Tuple[float, float] = (250.0, 250.0),
    ) -> Optional[np.ndarray]:
        """
        Warps perspective to produce a top-down, front-facing rectified image of the plane.
        """
        if H_px_to_mm is None:
            return None

        # Desired canvas in pixels
        c_w_mm, c_h_mm = canvas_size_mm
        out_w_px = int(c_w_mm * output_scale_px_per_mm)
        out_h_px = int(c_h_mm * output_scale_px_per_mm)

        # Real-world metric coords (mm) to rectified pixel coords
        # (X_mm, Y_mm) -> (X_mm * scale, Y_mm * scale)
        S_rect = np.array([
            [output_scale_px_per_mm, 0.0, 0.0],
            [0.0, output_scale_px_per_mm, 0.0],
            [0.0, 0.0, 1.0]
        ], dtype=np.float32)

        # H_px_to_rect = S_rect * H_px_to_mm
        H_px_to_rect = np.matmul(S_rect, H_px_to_mm)

        # Warp perspective
        try:
            rectified = cv2.warpPerspective(frame, H_px_to_rect, (out_w_px, out_h_px))
            return rectified
        except Exception as e:
            return None

    def save_results(
        self,
        output_image: np.ndarray,
        report: Dict[str, Any],
        output_dir: str = config.OUTPUT_DIR,
        image_name: str = "measured_product.jpg",
        json_name: str = "measurement_result.json",
        rectified_image: Optional[np.ndarray] = None,
    ) -> Tuple[str, str]:
        """Saves annotated image and measurement JSON report."""
        out_path = Path(output_dir)
        out_path.mkdir(parents=True, exist_ok=True)

        img_file = str(out_path / image_name)
        json_file = str(out_path / json_name)

        cv2.imwrite(img_file, output_image)
        with open(json_file, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)

        if rectified_image is not None:
            rect_file = str(out_path / "rectified_product.jpg")
            cv2.imwrite(rect_file, rectified_image)

        return img_file, json_file
