# PAKSHYA — Legal Metrology AI Inspection Portal

> **Packaged-commodity AI Knowledge System for Holistic Yield-evidence Analysis**  
> **Problem Statement**: SIH26034 — Software System to check compliance of Packaged Commodities under Legal Metrology (Packaged Commodities) Rules, 2011  
> **Target Ministry**: Department of Consumer Affairs, Ministry of Consumer Affairs, Food & Public Distribution, Government of India  
> **Initiative**: Smart India Hackathon (SIH 2026) Prototype

---

## Overview

**PAKSHYA** is an AI-assisted digital government inspection portal designed for Legal Metrology Officers (LMOs) across India. It automates packaging compliance verification, multi-view consistency checks, shrinkflation auditing, and formal inspection certificate generation.

---

## Core Modules & Features

1. **Official Government Portal UI**:
   - Designed to National Informatics Centre (NIC) and Digital India standards.
   - Ashoka Lion Capital emblem, bilingual ministry titles, Indian national tricolor accent, and *"Safer Markets | Fair Trade | Stronger India"* motto.

2. **Dashboard**:
   - Real-time field compliance metrics (Total Inspections, Compliant, Violations, Requires Review).
   - Core action shortcuts (`Scan Product`, `AI Analysis`, `Rule Validation`, `Compliance Report`).
   - Recent inspection results with circular score gauges (95% Compliant, 42% Non-Compliant).

3. **New Product Inspection Workspace**:
   - Multi-angle image capture and upload (Front PDP, Back Legal Panel, Side USP/Barcode, Macro Close-up).
   - Live AI segmentation, OCR transcription, and Legal Metrology rule matching.
   - Dual-panel workspace with zoomable image viewer, bounding box overlays, and mandatory declarations ledger.

4. **LabelTruth™ (Cross-View Verification)**:
   - Multi-angle conflict detection comparing promotional front stickers against pre-printed back legal panels.
   - Detects Dual MRP violations under Rule 18(2) and Section 36(1) with side-by-side evidence crops.

5. **Active Inspection (Adaptive Evidence Resolver)**:
   - Human-in-the-loop AI detecting low OCR confidence caused by glare or curvature.
   - Guides inspector through macro re-capture and calculates resolved confidence in real time.

6. **Compliance Fingerprint™ (Packaging Evolution Ledger)**:
   - Tracks historical packaging changes across batches to identify stealth shrinkflation (e.g. 400ml → 350ml) and font height reductions.

7. **SpectraShield™ (Multispectral Optical Analysis Prototype)**:
   - Optical inspection across RGB Visible, UV 365nm (Fluorescence), and NIR 850nm (Reflectance) with anomaly heatmaps.

8. **Rules & Guidelines Handbook**:
   - Searchable statutory directory of Legal Metrology (Packaged Commodities) Rules, 2011 clauses and penalties.

9. **Official Inspection Certificate (Form LM-2026/01)**:
   - Print-ready and exportable government inspection certificate with cryptographic token and digital e-Sign mark.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Typography**: Inter & Noto Sans

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/madhukanth1906/apollo.git

# Navigate to project directory
cd apollo

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build

```bash
npm run build
npm run start
```
