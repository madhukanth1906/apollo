"""
Small Printed Text Detector and Physical Size Estimator
======================================================
Identifies printed text and numeral regions on the product package using
connected component stroke analysis and horizontal line clustering.

Measures bounding box width, height, and character height in millimeters via
planar homography, while rigorously validating optical resolution limits.
"""

from typing import Dict, List, Optional, Tuple, Any
import cv2
import numpy as np

import config


class TextDetector:
    def __init__(
        self,
        min_height_px: int = config.TEXT_MIN_HEIGHT_PX,
        min_aspect_ratio: float = config.TEXT_MIN_ASPECT_RATIO,
        max_aspect_ratio: float = config.TEXT_MAX_ASPECT_RATIO,
    ):
        self.min_height_px = min_height_px
        self.min_aspect_ratio = min_aspect_ratio
        self.max_aspect_ratio = max_aspect_ratio

    def detect_and_measure(
        self,
        image: np.ndarray,
        product_roi_rect: Optional[Tuple[int, int, int, int]] = None,
        product_box_corners_px: Optional[np.ndarray] = None,
        H_px_to_mm: Optional[np.ndarray] = None,
        mm_per_pixel_fallback: float = 0.0,
        max_regions: int = 6,
    ) -> Dict[str, Any]:
        """
        Detects printed text regions inside the product boundary and measures physical dimensions.

        Args:
            image: Full original BGR image.
            product_roi_rect: (x, y, w, h) bounding box of the product.
            product_box_corners_px: 4 corners of oriented product box.
            H_px_to_mm: 3x3 Homography matrix mapping image pixels to millimeters.
            mm_per_pixel_fallback: Linear scale fallback.
            max_regions: Maximum prominent text regions to report.

        Returns:
            Dictionary containing list of detected text regions, physical measurements,
            and reliability status.
        """
        result: Dict[str, Any] = {
            "text_found": False,
            "reliable": True,
            "regions": [],
            "status_message": "Ready",
            "warning": None,
        }

        if image is None or image.size == 0:
            result["status_message"] = "Empty image provided."
            result["reliable"] = False
            return result

        h_img, w_img = image.shape[:2]

        # Determine ROI for text detection
        if product_roi_rect is not None:
            rx, ry, rw, rh = product_roi_rect
            rx = max(0, min(rx, w_img - 1))
            ry = max(0, min(ry, h_img - 1))
            rw = max(1, min(rw, w_img - rx))
            rh = max(1, min(rh, h_img - ry))
            roi = image[ry:ry + rh, rx:rx + rw]
        else:
            rx, ry, rw, rh = 0, 0, w_img, h_img
            roi = image

        if roi.shape[0] < 20 or roi.shape[1] < 20:
            result["status_message"] = "Product ROI too small for text detection."
            return result

        gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)

        # 1. Local Adaptive Thresholding (robust against uneven illumination and dark/light packaging)
        th_adapt = cv2.adaptiveThreshold(
            gray_roi,
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY_INV,
            config.TEXT_ADAPTIVE_BLOCK_SIZE,
            config.TEXT_ADAPTIVE_C
        )

        # 2. Connected Component Analysis for Individual Characters
        num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(th_adapt)

        char_mask = np.zeros_like(gray_roi)
        valid_char_stats = []
        unreliable_small_count = 0

        max_char_h = int(rh * config.TEXT_MAX_HEIGHT_RATIO)
        min_char_h = self.min_height_px

        for i in range(1, num_labels):
            cx, cy, cw, ch, area = stats[i]
            
            # Check for sub-resolution characters
            if 2 <= ch < min_char_h and 2 <= cw < 40:
                unreliable_small_count += 1
                continue

            # Character geometric constraints
            if min_char_h <= ch <= max_char_h and 3 <= cw <= 70 and area >= 8:
                char_mask[labels == i] = 255
                valid_char_stats.append((cx, cy, cw, ch))

        # Check if characters were found or if they are below resolution
        if not valid_char_stats:
            if unreliable_small_count > 5:
                result["reliable"] = False
                result["status_message"] = "Text measurement unreliable due to image resolution."
            else:
                result["status_message"] = "No distinct printed text detected."
            return result

        # 3. Horizontal Line Clustering using Morphological Closing
        line_kernel = cv2.getStructuringElement(
            cv2.MORPH_RECT,
            (config.TEXT_MORPH_KERNEL_H * 2, config.TEXT_MORPH_KERNEL_V)
        )
        lines = cv2.morphologyEx(char_mask, cv2.MORPH_CLOSE, line_kernel, iterations=1)

        # 4. Extract Text Line Contours
        line_contours, _ = cv2.findContours(lines, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        candidate_lines = []
        for cnt in line_contours:
            lx, ly, lw, lh = cv2.boundingRect(cnt)
            area = cv2.contourArea(cnt)
            
            if lw < 25 or lh < min_char_h:
                continue

            aspect = float(lw) / float(max(lh, 1))
            if aspect < self.min_aspect_ratio or aspect > self.max_aspect_ratio:
                continue

            # Find characters inside this text line to determine true character height
            chars_in_line = [
                ch for (cx, cy, cw, ch) in valid_char_stats
                if lx <= cx + cw // 2 <= lx + lw and ly <= cy + ch // 2 <= ly + lh
            ]
            
            median_char_px = float(np.median([c for c in chars_in_line])) if chars_in_line else float(lh * 0.8)

            # Global image coordinates
            gx = rx + lx
            gy = ry + ly

            candidate_lines.append({
                "global_rect_px": (gx, gy, lw, lh),
                "width_px": lw,
                "height_px": lh,
                "char_height_px": median_char_px,
                "char_count": len(chars_in_line),
                "y_pos": gy,
            })

        if not candidate_lines:
            if unreliable_small_count > 5:
                result["reliable"] = False
                result["status_message"] = "Text measurement unreliable due to image resolution."
            else:
                result["status_message"] = "No grouped text lines found."
            return result

        # Sort candidate lines vertically (top-to-bottom)
        candidate_lines.sort(key=lambda item: item["y_pos"])
        selected_lines = candidate_lines[:max_regions]

        measured_regions = []
        for idx, line_item in enumerate(selected_lines, start=1):
            gx, gy, lw, lh = line_item["global_rect_px"]
            char_px = line_item["char_height_px"]

            # Compute metric physical dimensions via Homography
            if H_px_to_mm is not None:
                box_corners = np.array([
                    [gx, gy],
                    [gx + lw, gy],
                    [gx + lw, gy + lh],
                    [gx, gy + lh]
                ], dtype=np.float32).reshape(-1, 1, 2)

                metric_pts = cv2.perspectiveTransform(box_corners, H_px_to_mm).reshape(-1, 2)
                t_w_mm = float(np.linalg.norm(metric_pts[1] - metric_pts[0]))
                t_h_mm = float(np.linalg.norm(metric_pts[3] - metric_pts[0]))

                # Scale character height via local vertical homography scale
                char_h_mm = float(t_h_mm * (char_px / max(lh, 1)))
            elif mm_per_pixel_fallback > 0:
                t_w_mm = float(lw * mm_per_pixel_fallback)
                t_h_mm = float(lh * mm_per_pixel_fallback)
                char_h_mm = float(char_px * mm_per_pixel_fallback)
            else:
                t_w_mm = 0.0
                t_h_mm = 0.0
                char_h_mm = 0.0

            measured_regions.append({
                "region_id": idx,
                "rect_px": (gx, gy, lw, lh),
                "width_px": lw,
                "height_px": lh,
                "width_mm": round(t_w_mm, 2),
                "height_mm": round(t_h_mm, 2),
                "char_height_mm": round(char_h_mm, 2),
                "char_height_px": round(char_px, 1),
                "reliable": True,
            })

        result.update({
            "text_found": len(measured_regions) > 0,
            "reliable": True,
            "regions": measured_regions,
            "status_message": f"Successfully detected and measured {len(measured_regions)} printed text lines.",
        })

        return result
