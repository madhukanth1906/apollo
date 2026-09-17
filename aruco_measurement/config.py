"""
ArUco Measurement System Configuration
======================================
Central configuration file containing all tunable parameters for marker detection,
camera calibration, product segmentation, text measurement, and visual styling.
"""

import os
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).resolve().parent
CALIBRATION_DIR = BASE_DIR / "calibration"
CALIBRATION_FILE_PATH = str(CALIBRATION_DIR / "camera_calibration.npz")
INPUT_DIR = BASE_DIR / "input"
OUTPUT_DIR = BASE_DIR / "output"

# Ensure runtime directories exist
CALIBRATION_DIR.mkdir(parents=True, exist_ok=True)
INPUT_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ==============================================================================
# 1. ARUCO MARKER CONFIGURATION
# ==============================================================================
# Physical printed marker size in MILLIMETERS.
# IMPORTANT: Adjust this value to match your actual printed marker dimensions!
MARKER_SIZE_MM = 40.0

# Target ArUco marker ID.
# If set to an integer (e.g. 0), the detector will specifically seek this ID.
# Set to None if you want the system to detect and use any valid ArUco marker.
MARKER_ID = 0

# OpenCV ArUco Dictionary Name
# Options: DICT_4X4_50, DICT_4X4_100, DICT_5X5_100, DICT_6X6_250, etc.
ARUCO_DICT_NAME = "DICT_4X4_50"

# ==============================================================================
# 2. HARDWARE & CAMERA CONFIGURATION
# ==============================================================================
# Default camera device index (0 for built-in webcam, 1 for external USB camera)
CAMERA_ID = 0

# Target capture resolution for live camera feed (width, height)
CAMERA_FRAME_WIDTH = 1280
CAMERA_FRAME_HEIGHT = 720

# Checkerboard calibration pattern geometry (inner corners per row and column)
CHESSBOARD_SIZE = (9, 6)
CHESSBOARD_SQUARE_SIZE_MM = 25.0

# ==============================================================================
# 3. PRODUCT DETECTION PARAMETERS
# ==============================================================================
# Minimum pixel area for a contour to be considered a product candidate
PRODUCT_MIN_AREA_PX = 1500

# Gaussian blur kernel size for noise reduction
GAUSSIAN_BLUR_KERNEL = (5, 5)

# Canny edge detector thresholds
CANNY_THRESH1 = 40
CANNY_THRESH2 = 120

# Morphological kernel size for closing gaps in edges
MORPH_KERNEL_SIZE = (7, 7)

# Extra pixel padding to mask around the ArUco marker so the marker itself
# is never detected as the product contour
ARUCO_MASK_PADDING_PX = 25

# ==============================================================================
# 4. SMALL PRINTED TEXT MEASUREMENT PARAMETERS
# ==============================================================================
# Minimum bounding box pixel height for text to be deemed reliably measurable.
# If text height in pixels is below this limit, it is reported as unreliable.
TEXT_MIN_HEIGHT_PX = 7

# Maximum ratio of text region height compared to total product height
TEXT_MAX_HEIGHT_RATIO = 0.50

# Aspect ratio filter for text lines / word bounding boxes (width / height)
TEXT_MIN_ASPECT_RATIO = 0.3
TEXT_MAX_ASPECT_RATIO = 25.0

# Adaptive threshold parameters for text segmentation
TEXT_ADAPTIVE_BLOCK_SIZE = 15
TEXT_ADAPTIVE_C = 8

# Morphological rectangular dilation kernel to group nearby characters into words/lines
TEXT_MORPH_KERNEL_H = 9
TEXT_MORPH_KERNEL_V = 3

# ==============================================================================
# 5. VISUAL RENDERING & HUD STYLING (BGR Colors)
# ==============================================================================
COLOR_ARUCO = (0, 230, 75)        # Vibrant Green for ArUco Marker
COLOR_PRODUCT = (255, 140, 0)     # Neon Sky/Cyan for Product (BGR: Cyan-ish Orange)
COLOR_TEXT = (30, 200, 255)       # Amber-Yellow for Text Regions
COLOR_ARROW = (255, 255, 255)     # Crisp White for Dimension Lines/Arrows
COLOR_HUD_BG = (15, 23, 42)       # Dark Navy Slate for HUD overlay
COLOR_HUD_TEXT = (248, 250, 252)  # High-contrast White for HUD text
COLOR_ALERT = (0, 0, 238)         # Vivid Red for warnings/errors

FONT_FACE = 0                     # cv2.FONT_HERSHEY_SIMPLEX
FONT_SCALE_HUD = 0.55
FONT_SCALE_LABEL = 0.50
LINE_THICKNESS = 2
