"""
Product / Package Boundary Detector and Multi-Object Metric Calculator
======================================================================
Segments product contours from the scene, masks out the reference ArUco marker,
and calculates true metric physical dimensions (width, height, area) for the
primary product and any other detected objects using planar homography transformation.
"""

from typing import Dict, List, Optional, Tuple, Any
import cv2
import numpy as np

import config


class ProductDetector:
    def __init__(
        self,
        min_area_px: int = config.PRODUCT_MIN_AREA_PX,
        canny_thresh1: int = config.CANNY_THRESH1,
        canny_thresh2: int = config.CANNY_THRESH2,
        aruco_padding_px: int = config.ARUCO_MASK_PADDING_PX,
    ):
        self.min_area_px = min_area_px
        self.canny_thresh1 = canny_thresh1
        self.canny_thresh2 = canny_thresh2
        self.aruco_padding_px = aruco_padding_px

    def _measure_contour(
        self,
        contour: np.ndarray,
        object_id: int,
        image_shape: Tuple[int, int],
        H_px_to_mm: Optional[np.ndarray] = None,
        mm_per_pixel_fallback: float = 0.0,
    ) -> Dict[str, Any]:
        """Calculates metric dimensions for a single contour candidate."""
        h_img, w_img = image_shape[:2]
        rect = cv2.minAreaRect(contour)
        (center_x, center_y), (dim_w, dim_h), angle = rect
        box_pts = cv2.boxPoints(rect)
        ordered_box = self._order_points(box_pts)

        edge1_px = float(np.linalg.norm(ordered_box[1] - ordered_box[0]))
        edge2_px = float(np.linalg.norm(ordered_box[2] - ordered_box[1]))
        px_width = max(edge1_px, edge2_px)
        px_height = min(edge1_px, edge2_px)

        if H_px_to_mm is not None:
            pts_reshaped = ordered_box.reshape(-1, 1, 2)
            world_pts = cv2.perspectiveTransform(pts_reshaped, H_px_to_mm).reshape(-1, 2)

            metric_edge1 = float(np.linalg.norm(world_pts[1] - world_pts[0]))
            metric_edge2 = float(np.linalg.norm(world_pts[2] - world_pts[1]))
            metric_edge3 = float(np.linalg.norm(world_pts[3] - world_pts[2]))
            metric_edge4 = float(np.linalg.norm(world_pts[0] - world_pts[3]))

            side_a_mm = (metric_edge1 + metric_edge3) / 2.0
            side_b_mm = (metric_edge2 + metric_edge4) / 2.0

            width_mm = max(side_a_mm, side_b_mm)
            height_mm = min(side_a_mm, side_b_mm)
        elif mm_per_pixel_fallback > 0:
            width_mm = px_width * mm_per_pixel_fallback
            height_mm = px_height * mm_per_pixel_fallback
        else:
            width_mm = 0.0
            height_mm = 0.0

        area_cm2 = (width_mm * height_mm) / 100.0

        rx, ry, rw, rh = cv2.boundingRect(contour)
        pad = 5
        rx1 = max(0, rx - pad)
        ry1 = max(0, ry - pad)
        rx2 = min(w_img, rx + rw + pad)
        ry2 = min(h_img, ry + rh + pad)

        return {
            "object_id": object_id,
            "contour": contour,
            "box_corners_px": ordered_box,
            "pixel_width": round(px_width, 1),
            "pixel_height": round(px_height, 1),
            "width_mm": round(width_mm, 2),
            "height_mm": round(height_mm, 2),
            "area_cm2": round(area_cm2, 2),
            "orientation_deg": round(angle, 1),
            "roi_rect": (rx1, ry1, rx2 - rx1, ry2 - ry1),
            "center": (int(center_x), int(center_y)),
        }

    def detect(
        self,
        image: np.ndarray,
        aruco_corners_px: Optional[np.ndarray] = None,
        H_px_to_mm: Optional[np.ndarray] = None,
        mm_per_pixel_fallback: float = 0.0,
        max_objects: int = 5,
    ) -> Dict[str, Any]:
        """
        Locates all product contours and computes metric physical dimensions for each.
        """
        result: Dict[str, Any] = {
            "found": False,
            "objects_count": 0,
            "objects": [],
            # Backwards-compatible fields for primary product:
            "contour": None,
            "box_corners_px": None,
            "pixel_width": 0.0,
            "pixel_height": 0.0,
            "width_mm": 0.0,
            "height_mm": 0.0,
            "area_cm2": 0.0,
            "orientation_deg": 0.0,
            "cropped_product_roi": None,
            "roi_rect": None,
            "warning": None,
        }

        if image is None or image.size == 0:
            result["warning"] = "Empty image provided to product detector."
            return result

        h_img, w_img = image.shape[:2]
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # 1. Create mask to exclude ArUco marker region
        mask = np.ones((h_img, w_img), dtype=np.uint8) * 255
        if aruco_corners_px is not None:
            aruco_poly = aruco_corners_px.astype(np.int32)
            center = np.mean(aruco_poly, axis=0)
            expanded_poly = []
            for pt in aruco_poly:
                direction = pt - center
                norm = np.linalg.norm(direction)
                if norm > 0:
                    expanded_pt = pt + (direction / norm) * self.aruco_padding_px
                else:
                    expanded_pt = pt
                expanded_poly.append(expanded_pt)
            expanded_poly = np.array(expanded_poly, dtype=np.int32)
            cv2.fillPoly(mask, [expanded_poly], 0)

        # 2. Preprocessing & Edge Detection
        blurred = cv2.GaussianBlur(gray, config.GAUSSIAN_BLUR_KERNEL, 0)
        edges = cv2.Canny(blurred, self.canny_thresh1, self.canny_thresh2)
        _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        combined = cv2.bitwise_or(edges, cv2.Canny(thresh, 50, 150))
        masked_edges = cv2.bitwise_and(combined, combined, mask=mask)

        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, config.MORPH_KERNEL_SIZE)
        closed = cv2.morphologyEx(masked_edges, cv2.MORPH_CLOSE, kernel, iterations=2)
        closed = cv2.dilate(closed, kernel, iterations=1)

        # 3. Find candidate contours
        contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        if not contours:
            result["warning"] = "No product contours found. Check image contrast and lighting."
            return result

        valid_candidates = []
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area < self.min_area_px:
                continue

            x, y, w, h = cv2.boundingRect(cnt)
            if w > 0.96 * w_img and h > 0.96 * h_img:
                continue

            valid_candidates.append((area, cnt))

        if not valid_candidates:
            result["warning"] = "All detected contours were smaller than minimum product area threshold."
            return result

        # Sort candidates largest to smallest
        valid_candidates.sort(key=lambda item: item[0], reverse=True)
        selected_candidates = valid_candidates[:max_objects]

        measured_objects = []
        obj_idx = 1
        for (area, cnt) in selected_candidates:
            obj_data = self._measure_contour(
                contour=cnt,
                object_id=obj_idx,
                image_shape=(h_img, w_img),
                H_px_to_mm=H_px_to_mm,
                mm_per_pixel_fallback=mm_per_pixel_fallback,
            )
            # Filter out extreme slivers / single line border artifacts
            if obj_data["pixel_width"] < 25 or obj_data["pixel_height"] < 20:
                continue
            if (obj_data["pixel_width"] / max(obj_data["pixel_height"], 1.0)) > 20.0:
                continue

            obj_data["object_id"] = obj_idx
            measured_objects.append(obj_data)
            obj_idx += 1

        if not measured_objects:
            result["warning"] = "No valid product objects detected after geometry filtering."
            return result

        # Primary object is the largest
        primary = measured_objects[0]
        rx1, ry1, rw, rh = primary["roi_rect"]
        product_roi = image[ry1:ry1 + rh, rx1:rx1 + rw].copy()

        result.update({
            "found": True,
            "objects_count": len(measured_objects),
            "objects": measured_objects,
            # Primary product attributes:
            "contour": primary["contour"],
            "box_corners_px": primary["box_corners_px"],
            "pixel_width": primary["pixel_width"],
            "pixel_height": primary["pixel_height"],
            "width_mm": primary["width_mm"],
            "height_mm": primary["height_mm"],
            "area_cm2": primary["area_cm2"],
            "orientation_deg": primary["orientation_deg"],
            "cropped_product_roi": product_roi,
            "roi_rect": primary["roi_rect"],
        })

        return result

    def _order_points(self, pts: np.ndarray) -> np.ndarray:
        """Orders 4 coordinates clockwise: [Top-Left, Top-Right, Bottom-Right, Bottom-Left]."""
        rect = np.zeros((4, 2), dtype=np.float32)
        s = pts.sum(axis=1)
        rect[0] = pts[np.argmin(s)]
        rect[2] = pts[np.argmax(s)]

        diff = np.diff(pts, axis=1)
        rect[1] = pts[np.argmin(diff)]
        rect[3] = pts[np.argmax(diff)]
        return rect
