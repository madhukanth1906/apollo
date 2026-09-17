# ArUco-Based Real-World Size Measurement System
**Precision Computer Vision Metric Metrology Pipeline**

---

## 1. Executive Summary

This computer vision application uses a printed **ArUco marker** as a known real-world physical reference to measure the dimensions of objects/packages and small printed text from camera video feeds or static photographs.

Rather than relying on a naive global pixel ratio ($1 \text{ px} = X \text{ mm}$) which degrades significantly when the camera views an object at an angle, the system employs **OpenCV Camera Calibration (Lens Undistortion)** and **Planar Homography ($H$)** to project image plane pixels into rectified metric coordinates ($\text{mm}$).

```
CAMERA CAPTURE / IMAGE INPUT
             ↓
LENS UNDISTORTION (cv2.undistort via K & D matrices)
             ↓
ARUCO MARKER DETECTION & CORNER EXTRACTION
             ↓
KNOWN PHYSICAL REFERENCE (MARKER_SIZE_MM)
             ↓
PLANAR HOMOGRAPHY MATRIX ESTIMATION (H: Image px → Metric mm)
             ↓
PRODUCT / PACKAGE CONTOUR SEGMENTATION (ArUco Masked Out)
             ↓
ORIENTED BOUNDING BOX & PHYSICAL SIZING (Width, Height, PDP Area in mm/cm²)
             ↓
PRINTED TEXT & NUMERAL DETECTION (Connected Component Character Grouping)
             ↓
TEXT BOUNDING BOX & CHARACTER HEIGHT MEASUREMENT (mm)
             ↓
VISUAL HUD ANNOTATIONS & STRUCTURED REPORT (measured_product.jpg, measurement_result.json)
```

---

## 2. Project Directory Structure

```
aruco_measurement/
│
├── config.py                 # Central configuration (MARKER_SIZE_MM, MARKER_ID, thresholds)
├── calibrate_camera.py       # Chessboard camera calibration tool (Live & Batch modes)
├── aruco_detector.py         # ArUco detection & Planar Homography estimator (Dual OpenCV support)
├── product_detector.py       # Package segmentation & metric dimension calculator
├── text_detector.py          # Printed text line & character height estimator with resolution check
├── measurement.py            # End-to-end pipeline orchestrator & visual HUD renderer
├── main.py                   # Unified CLI entry point for Image & Live Camera modes
├── generate_test_sample.py   # Ground-truth synthetic test scene generator
├── requirements.txt          # Python dependencies (opencv-contrib-python, numpy)
│
├── calibration/
│   └── camera_calibration.npz # Saved camera matrix, distortion coefficients & reprojection error
│
├── input/
│   └── sample_product.jpg    # Generated ground-truth test image
│
├── output/
│   ├── measured_sample_product.jpg   # Annotated measurement image
│   ├── measurement_sample_product.json # Comprehensive structured JSON report
│   └── rectified_product.jpg         # Top-down perspective rectified plane view
│
└── README.md                 # Complete documentation and user guide
```

---

## 3. Mathematical Foundations

### 3.1 Camera Calibration & Lens Undistortion
Real camera lenses suffer from radial and tangential distortion. A standard chessboard grid of known size $S_{sq}$ is observed from multiple angles:
$$\begin{bmatrix} u \\ v \\ 1 \end{bmatrix} = K \begin{bmatrix} R & T \end{bmatrix} \begin{bmatrix} X_w \\ Y_w \\ Z_w \\ 1 \end{bmatrix}$$
where $K$ is the intrinsic camera matrix:
$$K = \begin{bmatrix} f_x & 0 & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix}, \quad D = [k_1, k_2, p_1, p_2, k_3]$$
The system undistorts input frames prior to measurement, ensuring straight geometric lines remain straight.

### 3.2 Planar Homography Transformation
When the camera is angled, perspective foreshortening occurs. Since the ArUco marker and the product surface share the same physical plane, a projective transformation (Homography $H$) maps pixel coordinates $(u, v)$ to real-world millimeters $(X_{mm}, Y_{mm})$:
$$\begin{bmatrix} X_{mm} \\ Y_{mm} \\ 1 \end{bmatrix} \sim H_{px \to mm} \begin{bmatrix} u \\ v \\ 1 \end{bmatrix}$$
The 4 detected ArUco corners map to known ground-truth square coordinates:
- Corner 0 (Top-Left): $(0, 0)$ mm
- Corner 1 (Top-Right): $(S, 0)$ mm
- Corner 2 (Bottom-Right): $(S, S)$ mm
- Corner 3 (Bottom-Left): $(0, S)$ mm
where $S = \text{MARKER\_SIZE\_MM}$.

By transforming the 4 vertices of the product's oriented bounding box through $H_{px \to mm}$, metric distances are preserved independent of viewpoint angle.

### 3.3 Reconstruction Error & Quality Metric
The detected pixel corners of the ArUco marker are back-projected into metric space and compared against $S$:
$$\text{Reconstruction Error (mm)} = |S_{\text{measured}} - S_{\text{known}}|$$
$$\text{Percentage Error (\%)} = \frac{|S_{\text{measured}} - S_{\text{known}}|}{S_{\text{known}}} \times 100\%$$
- **< 1.0%**: EXCELLENT (Metrology grade)
- **1.0% - 3.0%**: GOOD
- **> 3.0%**: FAIR / POOR (Significant camera tilt or optical blur)

---

## 4. Installation & Setup

### Prerequisites
- Python 3.9+ installed
- Webcam (for live mode) or sample images

### Step 1: Create Virtual Environment
```bash
cd aruco_measurement
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

### Step 2: Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 5. How to Run

### Mode A: Test on Ground-Truth Synthetic Sample
Generate a calibrated test scene containing an ArUco marker (50mm), package (140mm x 90mm), and printed text declarations (character height ~5mm):

```bash
# 1. Generate test image
python generate_test_sample.py

# 2. Run measurement
python main.py --image input/sample_product.jpg --save-rectified
```

**Output:**
- Console prints measurement table (Width: 147.3 mm, Height: 95.8 mm, PDP Area: 141.1 cm², Text character height: ~3.6 mm).
- `output/measured_sample_product.jpg`: Visual image with dimension arrows, ArUco polygon, text boxes, and HUD.
- `output/measurement_sample_product.json`: Structured measurement data.
- `output/rectified_product.jpg`: Front-facing top-down warped view.

---

### Mode B: Measure Any User Image
```bash
python main.py --image /path/to/your/image.jpg --marker-size 50.0 --marker-id 23
```

**CLI Options:**
- `--image <path>`: Path to image file.
- `--marker-size <mm>`: Physical printed marker size in millimeters (default: 50.0).
- `--marker-id <id>`: Specific marker ID to track (default: 23).
- `--calibration <path>`: Path to custom `.npz` calibration file.
- `--output-dir <path>`: Directory to save results (default: `output/`).
- `--save-rectified`: Exports top-down perspective-rectified image.

---

### Mode C: Live Webcam Mode
```bash
python main.py --camera 0 --marker-size 50.0
```

**Interactive Keyboard Controls:**
- `S`: Save current measurement frame (`live_capture_N.jpg`) and report (`live_capture_N.json`).
- `R`: Toggle top-down rectified perspective preview window.
- `Q` or `ESC`: Quit application.

---

### Mode D: Camera Calibration Procedure
For highest accuracy, calibrate your camera using a standard 9x6 checkerboard pattern (printed on rigid board):

```bash
# Live camera interactive capture:
python calibrate_camera.py --camera 0

# Controls in calibration window:
# [SPACE] : Capture frame when chessboard corners are detected (capture 10-15 angles)
# [C]     : Compute calibration and save to calibration/camera_calibration.npz
# [Q]     : Quit without saving

# Inspect existing calibration parameters:
python calibrate_camera.py --inspect
```

---

## 6. Small Printed Text Measurement & Resolution Check

The system locates printed text lines and characters using **Adaptive Thresholding** and **Connected Component Stroke Grouping**.

### Optical Resolution Threshold
Measuring printed text is physically bounded by the Nyquist sampling limit. If detected character height in pixels is below `TEXT_MIN_HEIGHT_PX` (default: 7 pixels), the system reports:
> `"Text measurement unreliable due to image resolution."`

This ensures the system **never invents or fabricates measurements** on illegible or blurry text.

---

## 7. Configuration (`config.py`)

All key parameters are centralized in `config.py` and can be adjusted without modifying detector logic:

| Parameter | Default | Description |
|---|---|---|
| `MARKER_SIZE_MM` | `50.0` | Physical printed marker size in millimeters |
| `MARKER_ID` | `23` | Target ArUco marker ID (or `None` for any marker) |
| `ARUCO_DICT_NAME` | `"DICT_4X4_50"` | Predefined OpenCV ArUco dictionary |
| `CAMERA_ID` | `0` | Default video capture device index |
| `PRODUCT_MIN_AREA_PX` | `1500` | Minimum contour area for product package candidate |
| `TEXT_MIN_HEIGHT_PX` | `7` | Minimum pixel height for reliable text measurement |
| `ARUCO_MASK_PADDING_PX` | `25` | Padding around marker to prevent false product detection |

---

## 8. Assumptions & Operational Limitations

To achieve reliable physical measurements, ensure:
1. **Coplanar Alignment**: The ArUco marker and the product face being measured must rest on the **same physical plane** (e.g. flat on the table or attached to the package face).
2. **Accurate Marker Scale**: The marker must be measured with a physical caliper or printed at exact 100% scale without printer scaling distortion.
3. **Reasonably Flat Surface**: Package surfaces must be planar; spherical bottles or highly curved pouches cause non-planar perspective warping.
4. **Adequate Illumination**: Avoid direct glare/specular hotspots across the ArUco marker or text lines.
5. **Image Resolution**: High-resolution sensors (e.g. 1080p+) are recommended when measuring small numeral fonts (< 3 mm).

---

## 9. Integration with PAKSHYA (Legal Metrology Portal)

This measurement system is directly integrated into the **PAKSHYA** Legal Metrology Inspection Portal:
- Accessible via the **"Metrology Station (Rule 9)"** tab in the main sidebar.
- Automatically calculates Principal Display Panel (PDP) area:
  $$A_{\text{cm}^2} = \frac{W_{\text{mm}} \times H_{\text{mm}}}{100}$$
- Compares measured text numeral heights against **PCR 2011 Schedule II Table**:
  - $A \le 50 \text{ cm}^2 \implies \ge 1.0 \text{ mm}$
  - $50 < A \le 100 \text{ cm}^2 \implies \ge 1.5 \text{ mm}$
  - $100 < A \le 500 \text{ cm}^2 \implies \ge 2.0 \text{ mm}$
  - $500 < A \le 2500 \text{ cm}^2 \implies \ge 4.0 \text{ mm}$
  - $A > 2500 \text{ cm}^2 \implies \ge 6.0 \text{ mm}$
- Issues automated **Statutory Compliance Badges (PASS / VIOLATION DETECTED)** and Form LM-1 audit evidence attachments.
