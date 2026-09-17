"""
Synthetic Ground-Truth Test Sample Generator
============================================
Generates a realistic test scene containing:
1. Ground-truth ArUco marker (DICT_4X4_50, ID 23) rendered at known metric scale.
2. Ground-truth product package (140.0 mm x 90.0 mm).
3. Ground-truth printed text declarations (character height ~5.0 mm).
4. Realistic tabletop background and perspective projection.

Saves to: input/sample_product.jpg
"""

import sys
from pathlib import Path
import cv2
import numpy as np

import config


def generate_sample_scene(
    output_path: str = str(config.INPUT_DIR / "sample_product.jpg"),
    marker_id: int = 0,
    marker_size_mm: float = 40.0,
    product_width_mm: float = 140.0,
    product_height_mm: float = 90.0,
    pixels_per_mm: float = 4.0,  # 1 mm = 4 pixels (high-res canvas)
):
    """Generates an accurate metric test scene."""
    # Compute pixel sizes on planar canvas
    m_px = int(marker_size_mm * pixels_per_mm)      # 200 px
    p_w_px = int(product_width_mm * pixels_per_mm)  # 560 px
    p_h_px = int(product_height_mm * pixels_per_mm) # 360 px

    canvas_w = 1200
    canvas_h = 800

    # 1. Create clean tabletop canvas (subtle slate/light gray gradient)
    canvas = np.ones((canvas_h, canvas_w, 3), dtype=np.uint8) * 235
    for y in range(canvas_h):
        shade = int(235 - (y / canvas_h) * 15)
        canvas[y, :] = (shade, shade, shade + 3)

    # 2. Generate Ground-Truth ArUco Marker
    dict_id = getattr(cv2.aruco, config.ARUCO_DICT_NAME, cv2.aruco.DICT_4X4_50)
    if hasattr(cv2.aruco, "getPredefinedDictionary"):
        aruco_dict = cv2.aruco.getPredefinedDictionary(dict_id)
    else:
        aruco_dict = cv2.aruco.Dictionary_get(dict_id)

    if hasattr(cv2.aruco, "generateImageMarker"):
        marker_img = cv2.aruco.generateImageMarker(aruco_dict, marker_id, m_px)
    else:
        marker_img = cv2.aruco.drawMarker(aruco_dict, marker_id, m_px)

    marker_bgr = cv2.cvtColor(marker_img, cv2.COLOR_GRAY2BGR)

    # Position marker on left side of tabletop
    m_x = 100
    m_y = 280
    # Add thin white border to marker as per official ArUco specifications
    border_pad = 12
    cv2.rectangle(
        canvas,
        (m_x - border_pad, m_y - border_pad),
        (m_x + m_px + border_pad, m_y + m_px + border_pad),
        (255, 255, 255),
        -1
    )
    cv2.rectangle(
        canvas,
        (m_x - border_pad, m_y - border_pad),
        (m_x + m_px + border_pad, m_y + m_px + border_pad),
        (190, 190, 190),
        1
    )
    canvas[m_y:m_y + m_px, m_x:m_x + m_px] = marker_bgr

    # 3. Render Product Package (Simulating a real retail box)
    p_x = 420
    p_y = 200

    # Package drop shadow
    shadow_offset = 10
    cv2.rectangle(
        canvas,
        (p_x + shadow_offset, p_y + shadow_offset),
        (p_x + p_w_px + shadow_offset, p_y + p_h_px + shadow_offset),
        (170, 170, 175),
        -1
    )
    # Box body (Deep navy with crisp contrast)
    cv2.rectangle(canvas, (p_x, p_y), (p_x + p_w_px, p_y + p_h_px), (45, 30, 20), -1)
    cv2.rectangle(canvas, (p_x, p_y), (p_x + p_w_px, p_y + p_h_px), (15, 10, 5), 2)

    # Header branding stripe
    cv2.rectangle(canvas, (p_x + 10, p_y + 10), (p_x + p_w_px - 10, p_y + 80), (220, 120, 30), -1)
    cv2.putText(
        canvas,
        "PREMIUM TEA EXPORTS",
        (p_x + 30, p_y + 55),
        config.FONT_FACE,
        0.95,
        (255, 255, 255),
        2,
        cv2.LINE_AA
    )

    # Regulatory Information Panel (White background on package)
    info_x = p_x + 30
    info_y = p_y + 110
    info_w = p_w_px - 60
    info_h = p_h_px - 130
    cv2.rectangle(canvas, (info_x, info_y), (info_x + info_w, info_y + info_h), (250, 250, 250), -1)
    cv2.rectangle(canvas, (info_x, info_y), (info_x + info_w, info_y + info_h), (80, 80, 80), 1)

    # Printed Declarations Text Lines
    # Each text line character height will be approximately 5.0 mm = 20 pixels
    declarations = [
        ("NET QUANTITY: 500 g", info_y + 40, (20, 20, 20), 0.65, 2),
        ("MAXIMUM RETAIL PRICE: Rs. 240.00", info_y + 80, (20, 20, 20), 0.65, 2),
        ("UNIT SALE PRICE: Rs. 0.48 / g", info_y + 120, (30, 30, 30), 0.58, 2),
        ("MFG DATE: 08/2026 | BATCH: IN-892A", info_y + 160, (50, 50, 50), 0.52, 1),
        ("CONSUMER CARE: care@indiapack.gov.in", info_y + 195, (70, 70, 70), 0.48, 1),
    ]

    for text_str, text_y, color, scale, thick in declarations:
        cv2.putText(
            canvas,
            text_str,
            (info_x + 20, text_y),
            config.FONT_FACE,
            scale,
            color,
            thick,
            cv2.LINE_AA
        )

    # 4. Render Second Object (e.g. Companion Bottle/Tin: 60 mm x 45 mm)
    obj2_w_px = int(60.0 * pixels_per_mm)   # 240 px
    obj2_h_px = int(45.0 * pixels_per_mm)   # 180 px
    obj2_x = 100
    obj2_y = 520
    # Shadow
    cv2.rectangle(canvas, (obj2_x + 6, obj2_y + 6), (obj2_x + obj2_w_px + 6, obj2_y + obj2_h_px + 6), (170, 170, 175), -1)
    # Body
    cv2.rectangle(canvas, (obj2_x, obj2_y), (obj2_x + obj2_w_px, obj2_y + obj2_h_px), (40, 100, 160), -1)
    cv2.rectangle(canvas, (obj2_x, obj2_y), (obj2_x + obj2_w_px, obj2_y + obj2_h_px), (20, 50, 90), 2)
    cv2.putText(canvas, "SAMPLE #2", (obj2_x + 20, obj2_y + 60), config.FONT_FACE, 0.7, (255, 255, 255), 2, cv2.LINE_AA)
    cv2.putText(canvas, "60x45 mm", (obj2_x + 20, obj2_y + 110), config.FONT_FACE, 0.6, (220, 240, 255), 1, cv2.LINE_AA)

    # 5. Optional slight realistic perspective transformation (3 degrees tilt)
    # to test planar homography rectification
    pts1 = np.float32([[0, 0], [canvas_w, 0], [canvas_w, canvas_h], [0, canvas_h]])
    pts2 = np.float32([[20, 15], [canvas_w - 30, 5], [canvas_w - 5, canvas_h - 10], [10, canvas_h - 5]])
    M_persp = cv2.getPerspectiveTransform(pts1, pts2)
    warped_scene = cv2.warpPerspective(canvas, M_persp, (canvas_w, canvas_h), borderValue=(240, 240, 240))

    # Save output
    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(out), warped_scene)
    print(f"[SUCCESS] Synthetic ground-truth sample generated at: {out}")
    print(f"          Ground-Truth Marker:  {marker_size_mm} mm x {marker_size_mm} mm (ID {marker_id})")
    print(f"          Ground-Truth Product: {product_width_mm} mm x {product_height_mm} mm")
    print(f"          Ground-Truth Text:    ~5.0 mm character height")
    return str(out)


if __name__ == "__main__":
    generate_sample_scene()
