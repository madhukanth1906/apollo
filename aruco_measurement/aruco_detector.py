"""
ArUco Marker Detector and Planar Homography Estimator
=====================================================
Detects ArUco markers, extracts corners, calculates metric pixel scales,
estimates planar homography (pixels -> real-world mm), and computes
reconstruction error metrics.

Compatible across OpenCV versions (including OpenCV 4.7+ and OpenCV 5.0).
"""

from typing import Dict, List, Optional, Tuple, Any
import cv2
import numpy as np

import config


class ArucoDetector:
    def __init__(
        self,
        marker_size_mm: float = config.MARKER_SIZE_MM,
        target_marker_id: Optional[int] = config.MARKER_ID,
        dict_name: str = config.ARUCO_DICT_NAME,
    ):
        """
        Initializes the ArUco detector.
        
        Args:
            marker_size_mm: Known physical printed width/height of the marker in mm.
            target_marker_id: Optional specific marker ID to track. If None, accepts any single marker.
            dict_name: Predefined OpenCV dictionary name (e.g. 'DICT_4X4_50').
        """
        self.marker_size_mm = float(marker_size_mm)
        self.target_marker_id = target_marker_id
        self.dict_name = dict_name

        # Resolve dictionary type
        dict_id = getattr(cv2.aruco, dict_name, cv2.aruco.DICT_4X4_50)
        
        # Cross-version compatibility for OpenCV Dictionary and DetectorParameters
        if hasattr(cv2.aruco, "getPredefinedDictionary"):
            self.dictionary = cv2.aruco.getPredefinedDictionary(dict_id)
        else:
            self.dictionary = cv2.aruco.Dictionary_get(dict_id)

        if hasattr(cv2.aruco, "DetectorParameters"):
            self.parameters = cv2.aruco.DetectorParameters()
        else:
            self.parameters = cv2.aruco.DetectorParameters_create()

        # Modern OpenCV 4.7+ / 5.0 ArucoDetector class support
        self.modern_detector = None
        if hasattr(cv2.aruco, "ArucoDetector"):
            self.modern_detector = cv2.aruco.ArucoDetector(self.dictionary, self.parameters)

    def detect(self, image: np.ndarray) -> Dict[str, Any]:
        """
        Detects ArUco marker in the input image.
        
        Returns:
            Dictionary containing detection status, marker info, homography matrices,
            and error metrics.
        """
        result: Dict[str, Any] = {
            "found": False,
            "marker_id": None,
            "corners_px": None,  # 4x2 array: TL, TR, BR, BL
            "pixel_width": 0.0,
            "pixel_height": 0.0,
            "pixels_per_mm": 0.0,
            "mm_per_pixel": 0.0,
            "homography_px_to_mm": None,
            "homography_mm_to_px": None,
            "error_mm": 0.0,
            "error_percentage": 0.0,
            "all_detected_ids": [],
            "warning": None,
        }

        if image is None or image.size == 0:
            result["warning"] = "Empty or invalid image supplied."
            return result

        # Preprocessing: convert to grayscale
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image

        # Detect markers with compatibility layer
        if self.modern_detector is not None:
            corners_list, ids, rejected = self.modern_detector.detectMarkers(gray)
        else:
            corners_list, ids, rejected = cv2.aruco.detectMarkers(
                gray, self.dictionary, parameters=self.parameters
            )

        if ids is None or len(ids) == 0:
            result["warning"] = "No ArUco marker detected. Ensure good lighting and marker visibility."
            return result

        flat_ids = ids.flatten().tolist()
        result["all_detected_ids"] = flat_ids

        # Select target marker
        selected_idx = None
        if self.target_marker_id is not None:
            if self.target_marker_id in flat_ids:
                selected_idx = flat_ids.index(self.target_marker_id)
            else:
                result["warning"] = (
                    f"Target marker ID {self.target_marker_id} not found among visible IDs: {flat_ids}."
                )
                return result
        else:
            if len(flat_ids) > 1:
                result["warning"] = f"Multiple markers detected {flat_ids}; using the first marker (ID {flat_ids[0]})."
            selected_idx = 0

        # Extract 4 corners of selected marker
        # corners shape: (1, 4, 2) -> (4, 2)
        # Order: 0: Top-Left, 1: Top-Right, 2: Bottom-Right, 3: Bottom-Left
        pts_px = corners_list[selected_idx].reshape((4, 2)).astype(np.float32)
        detected_id = int(flat_ids[selected_idx])

        # Validate that marker is fully within image boundaries
        h_img, w_img = image.shape[:2]
        margin = 2
        for (x, y) in pts_px:
            if x < margin or x >= w_img - margin or y < margin or y >= h_img - margin:
                result["warning"] = "Marker is clipped or touching image boundary; measurement may be distorted."

        # Calculate edge lengths in pixels
        top_edge = np.linalg.norm(pts_px[1] - pts_px[0])
        bottom_edge = np.linalg.norm(pts_px[2] - pts_px[3])
        left_edge = np.linalg.norm(pts_px[3] - pts_px[0])
        right_edge = np.linalg.norm(pts_px[2] - pts_px[1])

        avg_px_width = float((top_edge + bottom_edge) / 2.0)
        avg_px_height = float((left_edge + right_edge) / 2.0)
        avg_marker_px = (avg_px_width + avg_px_height) / 2.0

        if avg_marker_px <= 0 or self.marker_size_mm <= 0:
            result["warning"] = "Invalid marker pixel or physical size calculation."
            return result

        px_per_mm = avg_marker_px / self.marker_size_mm
        mm_per_px = self.marker_size_mm / avg_marker_px

        # Compute Planar Homography: Image Pixels (u, v) -> Real-World Millimeters (X, Y)
        # Marker local coordinate frame:
        # Corner 0 (Top-Left):     (0, 0) mm
        # Corner 1 (Top-Right):    (S, 0) mm
        # Corner 2 (Bottom-Right): (S, S) mm
        # Corner 3 (Bottom-Left):  (0, S) mm
        S = self.marker_size_mm
        world_pts_mm = np.array([
            [0.0, 0.0],
            [S, 0.0],
            [S, S],
            [0.0, S]
        ], dtype=np.float32)

        # H_px_to_mm: transforms (x_px, y_px) to (X_mm, Y_mm)
        H_px_to_mm, _ = cv2.findHomography(pts_px, world_pts_mm)
        if H_px_to_mm is None:
            H_px_to_mm = cv2.getPerspectiveTransform(pts_px, world_pts_mm)

        try:
            H_mm_to_px = np.linalg.inv(H_px_to_mm)
        except np.linalg.LinAlgError:
            H_mm_to_px = None

        # Accuracy & Error Metric calculation:
        # Back-project detected pixel corners through Homography into mm space
        # and compare against the known ground-truth marker dimensions S
        measured_world_pts = cv2.perspectiveTransform(pts_px.reshape(-1, 1, 2), H_px_to_mm).reshape(-1, 2)
        measured_top = np.linalg.norm(measured_world_pts[1] - measured_world_pts[0])
        measured_bottom = np.linalg.norm(measured_world_pts[2] - measured_world_pts[3])
        measured_left = np.linalg.norm(measured_world_pts[3] - measured_world_pts[0])
        measured_right = np.linalg.norm(measured_world_pts[2] - measured_world_pts[1])
        measured_avg_s = float((measured_top + measured_bottom + measured_left + measured_right) / 4.0)

        # Alternatively, evaluate geometric aspect ratio distortion
        aspect_ratio_err = abs((avg_px_width / max(avg_px_height, 1e-5)) - 1.0)
        abs_error_mm = abs(measured_avg_s - S)
        # If perspective slant exists, pixel aspect ratio differs from 1.0;
        # error relative to known size:
        pct_error = (abs_error_mm / S) * 100.0

        result.update({
            "found": True,
            "marker_id": detected_id,
            "corners_px": pts_px,
            "pixel_width": avg_px_width,
            "pixel_height": avg_px_height,
            "pixels_per_mm": px_per_mm,
            "mm_per_pixel": mm_per_px,
            "homography_px_to_mm": H_px_to_mm,
            "homography_mm_to_px": H_mm_to_px,
            "measured_marker_size_mm": measured_avg_s,
            "error_mm": float(abs_error_mm),
            "error_percentage": float(pct_error),
            "perspective_aspect_distortion": float(aspect_ratio_err),
        })

        return result

    def draw_marker_overlay(self, image: np.ndarray, detection: Dict[str, Any]) -> np.ndarray:
        """Renders bounding polygon, corner highlights, and ID label onto the image."""
        if not detection.get("found", False) or detection.get("corners_px") is None:
            return image

        output = image.copy()
        corners = detection["corners_px"].astype(np.int32)

        # Draw outer polygon boundary
        cv2.polylines(output, [corners], isClosed=True, color=config.COLOR_ARUCO, thickness=3)

        # Mark corner points with distinct colors (0: TL Red, 1: TR Green, 2: BR Blue, 3: BL Yellow)
        corner_colors = [
            (0, 0, 255),    # TL
            (0, 255, 0),    # TR
            (255, 0, 0),    # BR
            (0, 255, 255),  # BL
        ]
        for idx, pt in enumerate(corners):
            cv2.circle(output, tuple(pt), 5, corner_colors[idx], -1)

        # Draw marker ID & size badge above top-left corner
        tl = corners[0]
        label = f"ArUco ID {detection['marker_id']} [{self.marker_size_mm:.1f}mm]"
        
        # Position label safely
        text_y = max(tl[1] - 10, 25)
        text_x = max(tl[0], 10)
        
        (lw, lh), _ = cv2.getTextSize(label, config.FONT_FACE, config.FONT_SCALE_LABEL, 2)
        cv2.rectangle(output, (text_x - 2, text_y - lh - 4), (text_x + lw + 4, text_y + 4), (10, 10, 10), -1)
        cv2.putText(output, label, (text_x, text_y), config.FONT_FACE, config.FONT_SCALE_LABEL, config.COLOR_ARUCO, 2)

        return output
