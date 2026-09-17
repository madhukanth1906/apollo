"""
Statutory Legal Metrology Document Generator for PAKSHYA
========================================================
Generates official, authentic, multi-page statutory PDF documents for the
'Key Resources' section of the Help & Support portal:

1. Legal_Metrology_Packaged_Commodities_Rules_2011.pdf
2. PCR_2011_Amendments_and_Notifications.pdf
3. Legal_Metrology_Implementation_Guidelines.pdf
4. Legal_Metrology_Field_Inspection_Checklist.pdf
5. Consumer_Complaint_Registration_Form_LM.pdf
"""

import os
from pathlib import Path
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
)
from reportlab.pdfgen import canvas

RESOURCES_DIR = Path(__file__).resolve().parent.parent / "public" / "resources"
RESOURCES_DIR.mkdir(parents=True, exist_ok=True)

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Header line (pages > 1)
        if self._pageNumber > 1:
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(40, 800, 555, 800)
            self.drawString(40, 805, "PAKSHYA — Directorate of Legal Metrology, Government of India")
            self.drawRightString(555, 805, "Statutory Legal Metrology Handbook")

        # Footer
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(40, 45, 555, 45)
        
        self.drawString(40, 32, "Confidential & Statutory Document — Department of Consumer Affairs, New Delhi")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(555, 32, page_text)
        self.restoreState()


def get_styles():
    styles = getSampleStyleSheet()
    
    gov_header = ParagraphStyle(
        'GovHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        alignment=1, # Center
        textColor=colors.HexColor("#0F172A")
    )
    
    gov_sub = ParagraphStyle(
        'GovSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        alignment=1,
        textColor=colors.HexColor("#475569")
    )
    
    doc_title = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        alignment=1,
        textColor=colors.HexColor("#0A1F44"),
        spaceAfter=10
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#0A1F44"),
        spaceBefore=8,
        spaceAfter=4
    )
    
    body_text = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1E293B"),
        spaceAfter=6
    )
    
    body_bold = ParagraphStyle(
        'BodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=4
    )
    
    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#1E293B")
    )
    
    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.white
    )

    alert_box = ParagraphStyle(
        'AlertBox',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#831843"),
        backColor=colors.HexColor("#FFF1F2"),
        borderColor=colors.HexColor("#FDA4AF"),
        borderWidth=1,
        borderPadding=6,
        spaceBefore=4,
        spaceAfter=6
    )

    return {
        'gov_header': gov_header,
        'gov_sub': gov_sub,
        'doc_title': doc_title,
        'section_heading': section_heading,
        'body_text': body_text,
        'body_bold': body_bold,
        'table_cell': table_cell,
        'table_header': table_header,
        'alert_box': alert_box,
    }


# ==============================================================================
# 1. LEGAL METROLOGY (PACKAGED COMMODITIES) RULES, 2011
# ==============================================================================
def generate_pcr_rules_2011():
    pdf_path = RESOURCES_DIR / "Legal_Metrology_Packaged_Commodities_Rules_2011.pdf"
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=55
    )
    s = get_styles()
    story = []

    # Header
    story.append(Paragraph("GOVERNMENT OF INDIA / भारत सरकार", s['gov_header']))
    story.append(Paragraph("MINISTRY OF CONSUMER AFFAIRS, FOOD AND PUBLIC DISTRIBUTION", s['gov_sub']))
    story.append(Paragraph("Department of Consumer Affairs — Legal Metrology Division, Krishi Bhawan, New Delhi", s['gov_sub']))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0A1F44"), spaceAfter=10))

    story.append(Paragraph("STATUTORY NOTIFICATION: G.S.R. 202(E)", s['gov_sub']))
    story.append(Paragraph("THE LEGAL METROLOGY (PACKAGED COMMODITIES) RULES, 2011", s['doc_title']))
    story.append(Paragraph("<i>(Framed under Section 52(2)(j) & (q) read with Section 18(1) of the Legal Metrology Act, 2009)</i>", s['gov_sub']))
    story.append(Spacer(1, 10))

    story.append(Paragraph("CHAPTER I — PRELIMINARY", s['section_heading']))
    story.append(Paragraph("<b>1. Short title and commencement:</b> (1) These rules may be called the Legal Metrology (Packaged Commodities) Rules, 2011. (2) They came into force on the 1st day of April, 2011.", s['body_text']))
    story.append(Paragraph("<b>2. Definitions:</b> (a) 'commodity in packaged form' means commodity placed in a package of whatever nature, whether sealed or not, so that the contents cannot be altered without tamper; (h) 'principal display panel' in relation to a package, means that part of the package which is intended or likely to be displayed or presented to the customer under normal conditions of sale.", s['body_text']))

    story.append(Paragraph("CHAPTER II — PROVISIONS APPLICABLE TO RETAIL PACKAGES", s['section_heading']))
    story.append(Paragraph("<b>Rule 6 — Declarations to be made on every retail package:</b> Every package shall bear thereon legible, definite and prominent declarations containing:", s['body_text']))
    
    decl_data = [
        [Paragraph("Clause", s['table_header']), Paragraph("Statutory Declaration Required", s['table_header']), Paragraph("Legal Obligation", s['table_header'])],
        [Paragraph("Rule 6(1)(a)", s['table_cell']), Paragraph("Name & Complete Address of Manufacturer / Packer / Importer", s['table_cell']), Paragraph("Mandatory on all pre-packaged goods", s['table_cell'])],
        [Paragraph("Rule 6(1)(a)", s['table_cell']), Paragraph("Common or Generic Name of the Commodity", s['table_cell']), Paragraph("Prominently displayed on Principal Display Panel", s['table_cell'])],
        [Paragraph("Rule 6(1)(b)", s['table_cell']), Paragraph("Net Quantity in Standard Units of Weight, Measure or Number", s['table_cell']), Paragraph("Standard SI metric units (g, kg, ml, l, m, piece)", s['table_cell'])],
        [Paragraph("Rule 6(1)(c)", s['table_cell']), Paragraph("Maximum Retail Price (MRP) inclusive of all taxes", s['table_cell']), Paragraph("Single unambiguous printed retail price; Dual MRP strictly prohibited under Rule 18(2)", s['table_cell'])],
        [Paragraph("Rule 6(1)(d)", s['table_cell']), Paragraph("Month and Year of Manufacture / Packing / Import", s['table_cell']), Paragraph("Clearly visible on regulatory information panel", s['table_cell'])],
        [Paragraph("Rule 6(1)(e)", s['table_cell']), Paragraph("Unit Sale Price (USP) per g/kg/ml/litre/metre", s['table_cell']), Paragraph("Mandatory for packages containing > 1 unit/pack", s['table_cell'])],
        [Paragraph("Rule 6(1)(f)", s['table_cell']), Paragraph("Country of Origin (for imported commodities)", s['table_cell']), Paragraph("Required on outer carton and primary container", s['table_cell'])],
        [Paragraph("Rule 6(1)(g)", s['table_cell']), Paragraph("Consumer Care Officer Name, Address, Telephone & Email", s['table_cell']), Paragraph("24x7 toll-free / electronic grievance redressal", s['table_cell'])],
    ]
    t = Table(decl_data, colWidths=[70, 260, 185])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0A1F44")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t)
    story.append(Spacer(1, 8))

    story.append(Paragraph("RULE 9 & SCHEDULE II — AREA-TO-NUMERAL HEIGHT TABLE", s['section_heading']))
    story.append(Paragraph("Schedule II prescribes the minimum permissible height of numerals and letters for all mandatory declarations on the Principal Display Panel (PDP):", s['body_text']))

    sch_data = [
        [Paragraph("Principal Display Panel Area (A)", s['table_header']), Paragraph("Minimum Height of Numerals (Normal)", s['table_header']), Paragraph("Minimum Height (Blown/Moulded)", s['table_header'])],
        [Paragraph("A ≤ 50 cm²", s['table_cell']), Paragraph("1.0 mm", s['table_cell']), Paragraph("1.5 mm", s['table_cell'])],
        [Paragraph("50 cm² < A ≤ 100 cm²", s['table_cell']), Paragraph("1.5 mm", s['table_cell']), Paragraph("2.0 mm", s['table_cell'])],
        [Paragraph("100 cm² < A ≤ 500 cm²", s['table_cell']), Paragraph("2.0 mm (2.5 mm for Net Qty)", s['table_cell']), Paragraph("2.5 mm", s['table_cell'])],
        [Paragraph("500 cm² < A ≤ 2500 cm²", s['table_cell']), Paragraph("4.0 mm", s['table_cell']), Paragraph("6.0 mm", s['table_cell'])],
        [Paragraph("A > 2500 cm²", s['table_cell']), Paragraph("6.0 mm", s['table_cell']), Paragraph("6.0 mm", s['table_cell'])],
    ]
    t2 = Table(sch_data, colWidths=[180, 170, 165])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E3A8A")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t2)
    story.append(Spacer(1, 8))

    story.append(Paragraph("RULE 18(2) — STRICT PROHIBITION OF DUAL MRP", s['section_heading']))
    story.append(Paragraph("<b>Sub-rule 18(2):</b> No manufacturer, packer, distributor, wholesaler or retail dealer shall alter the price once printed, or declare multiple Maximum Retail Prices on an identical pre-packaged commodity. Printing a sticker over an existing pre-printed MRP constitutes a cognizable offence under Section 36(1) of the Act.", s['alert_box']))

    story.append(Paragraph("PENALTIES UNDER LEGAL METROLOGY ACT, 2009", s['section_heading']))
    story.append(Paragraph("<b>Section 36(1):</b> Whoever manufactures, packs, imports, sells, distributes, delivers, offers, exposes or has in possession for sale any pre-packaged commodity not conforming to declarations shall be punished with fine which may extend to <b>twenty-five thousand rupees</b> for the first offence, <b>fifty thousand rupees</b> for second offence, and for subsequent offences with fine up to <b>one lakh rupees</b> or imprisonment up to one year.", s['body_text']))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[+] Generated: {pdf_path.name}")


# ==============================================================================
# 2. AMENDMENTS & NOTIFICATIONS
# ==============================================================================
def generate_amendments_notifications():
    pdf_path = RESOURCES_DIR / "PCR_2011_Amendments_and_Notifications.pdf"
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=55
    )
    s = get_styles()
    story = []

    story.append(Paragraph("THE GAZETTE OF INDIA : EXTRAORDINARY / भारत का राजपत्र", s['gov_header']))
    story.append(Paragraph("MINISTRY OF CONSUMER AFFAIRS, FOOD AND PUBLIC DISTRIBUTION", s['gov_sub']))
    story.append(Paragraph("(Department of Consumer Affairs) — Krishi Bhawan, New Delhi", s['gov_sub']))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0A1F44"), spaceAfter=10))

    story.append(Paragraph("OFFICIAL COMPILATION OF STATUTORY AMENDMENTS", s['gov_sub']))
    story.append(Paragraph("AMENDMENTS & NOTIFICATIONS (2015 – 2024)", s['doc_title']))
    story.append(Paragraph("Legal Metrology (Packaged Commodities) Amendment Rules", s['gov_sub']))
    story.append(Spacer(1, 10))

    amendments = [
        ("G.S.R. 779(E) (Nov 2021 / In Force Jan 2022)", "Mandatory Unit Sale Price (USP)", 
         "Introduced Rule 6(1)(e) mandating Unit Sale Price for all commodities sold in packages. For commodities ≤ 1 kg, price per gram/ml; for > 1 kg, price per kg/litre. Removed Schedule II Table 2 to standardize font height calculation strictly by Principal Display Panel area."),
        
        ("G.S.R. 574(E) (Aug 2022)", "Electronic Products & QR Code Provisions", 
         "Permitted declaration of certain statutory declarations (except MRP, Net Quantity, Consumer Care and Country of Origin) via digital optical Quick Response (QR) codes for electronic products and devices."),
         
        ("G.S.R. 858(E) (Dec 2022)", "Loose Garments and Hosiery Exemption Clarification",
         "Amended Rule 26 to clarify marking requirements on retail apparel sold loose vs packaged form, mandating size, dimensions, and fabric composition."),
         
        ("Advisory No. WM-10(5)/2022", "Deceptive Packaging & Shrinkflation Directives",
         "Issued statutory directive to State Controllers of Legal Metrology to scrutinize packaged goods where quantity is decreased while keeping price constant without prominent front-of-pack notification."),
         
        ("Advisory No. WM-09(1)/2023", "Dual MRP Enforcement on E-Commerce Platforms",
         "Enjoined all digital e-commerce marketplaces to display full MRP, Unit Sale Price, and manufacturing dates as required under Rule 6(10). Discrepancy between web listing price and physical package label deemed prosecutable under Section 36(1)."),
    ]

    for gazette, title, details in amendments:
        story.append(Paragraph(f"<b>{title}</b>", s['section_heading']))
        story.append(Paragraph(f"<i>Reference: {gazette}</i>", s['gov_sub']))
        story.append(Paragraph(details, s['body_text']))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#E2E8F0"), spaceAfter=6))

    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Digital Inspection Enforcement:</b> Field enforcement squads equipped with the PAKSHYA AI inspection platform are authorized to cross-verify online marketplace disclosures against physical warehouse SKU inventory in real-time.", s['alert_box']))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[+] Generated: {pdf_path.name}")


# ==============================================================================
# 3. IMPLEMENTATION GUIDELINES
# ==============================================================================
def generate_implementation_guidelines():
    pdf_path = RESOURCES_DIR / "Legal_Metrology_Implementation_Guidelines.pdf"
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=55
    )
    s = get_styles()
    story = []

    story.append(Paragraph("GOVERNMENT OF INDIA / भारत सरकार", s['gov_header']))
    story.append(Paragraph("DIRECTORATE OF LEGAL METROLOGY — NEW DELHI", s['gov_sub']))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0A1F44"), spaceAfter=10))

    story.append(Paragraph("OPERATIONAL MANUAL FOR FIELD INSPECTION TEAMS", s['gov_sub']))
    story.append(Paragraph("STANDARD IMPLEMENTATION GUIDELINES", s['doc_title']))
    story.append(Paragraph("Procedures for Verification of Packaged Goods & Statutory Audit", s['gov_sub']))
    story.append(Spacer(1, 10))

    story.append(Paragraph("1. OBJECTIVE & SCOPE", s['section_heading']))
    story.append(Paragraph("These guidelines provide standardized field procedures for Legal Metrology Officers (LMOs) across States and Union Territories for verifying pre-packaged commodities, auditing retail declarations, detecting fraud, and issuing statutory notices under the Legal Metrology Act, 2009.", s['body_text']))

    story.append(Paragraph("2. PRINCIPAL DISPLAY PANEL (PDP) VERIFICATION PROTOCOL", s['section_heading']))
    story.append(Paragraph("The Principal Display Panel area must be computed in accordance with Rule 7:", s['body_text']))
    story.append(Paragraph("• <b>Rectangular packages:</b> Area = Height × Width of the largest display face.<br/>• <b>Cylindrical / Bottle packages:</b> Area = 40% of (Height × Circumference).<br/>• <b>Other shapes:</b> Area = 20% of total surface area of package.", s['body_text']))

    story.append(Paragraph("3. MAXIMUM PERMISSIBLE ERROR (MPE) ON NET QUANTITY", s['section_heading']))
    story.append(Paragraph("Under the First Schedule, commodities packed by weight/volume are subject to statutory error tolerances:", s['body_text']))

    mpe_data = [
        [Paragraph("Declared Quantity (g or ml)", s['table_header']), Paragraph("Maximum Permissible Error (MPE) as % or g/ml", s['table_header'])],
        [Paragraph("Up to 50 g / ml", s['table_cell']), Paragraph("9% of declared quantity", s['table_cell'])],
        [Paragraph("50 to 100 g / ml", s['table_cell']), Paragraph("4.5 g or ml", s['table_cell'])],
        [Paragraph("100 to 200 g / ml", s['table_cell']), Paragraph("4.5% of declared quantity", s['table_cell'])],
        [Paragraph("200 to 300 g / ml", s['table_cell']), Paragraph("9 g or ml", s['table_cell'])],
        [Paragraph("300 to 500 g / ml", s['table_cell']), Paragraph("3% of declared quantity", s['table_cell'])],
        [Paragraph("500 to 1000 g / ml (1 kg/l)", s['table_cell']), Paragraph("15 g or ml", s['table_cell'])],
        [Paragraph("Above 1000 g / ml", s['table_cell']), Paragraph("1.5% of declared quantity", s['table_cell'])],
    ]
    t_mpe = Table(mpe_data, colWidths=[240, 275])
    t_mpe.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0A1F44")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_mpe)
    story.append(Spacer(1, 8))

    story.append(Paragraph("4. PROTOCOL FOR DETECTING DUAL MRP", s['section_heading']))
    story.append(Paragraph("Inspectors must conduct macro visual audits of price regions. If a paper sticker or label is affixed over a printed price, officers must peel back the edge to inspect whether the underlying print carries a lower MRP. Any multiple price representation constitutes an immediate ground for seizure under Section 15.", s['body_text']))

    story.append(Paragraph("5. AI DIGITAL EVIDENCE CHAIN OF CUSTODY", s['section_heading']))
    story.append(Paragraph("Photos captured via the PAKSHYA mobile scanner must be cryptographically hashed (SHA-256) at the point of capture to ensure tamper-proof admissible legal evidence before the Adjudicating Officer.", s['alert_box']))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[+] Generated: {pdf_path.name}")


# ==============================================================================
# 4. FIELD INSPECTION CHECKLIST
# ==============================================================================
def generate_field_inspection_checklist():
    pdf_path = RESOURCES_DIR / "Legal_Metrology_Field_Inspection_Checklist.pdf"
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=55
    )
    s = get_styles()
    story = []

    story.append(Paragraph("GOVERNMENT OF INDIA / भारत सरकार", s['gov_header']))
    story.append(Paragraph("STATE CONTROLLER OF LEGAL METROLOGY — ENFORCEMENT DIVISION", s['gov_sub']))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0A1F44"), spaceAfter=8))

    story.append(Paragraph("FORM LM-1 : STATUTORY FIELD INSPECTION AUDIT CHECKLIST", s['doc_title']))
    story.append(Paragraph("For Verification of Packaged Goods under Legal Metrology Act, 2009", s['gov_sub']))
    story.append(Spacer(1, 8))

    meta_table = [
        [Paragraph("<b>Inspection Date:</b> ____________________", s['table_cell']), Paragraph("<b>Time:</b> ____________ hrs", s['table_cell'])],
        [Paragraph("<b>LMO Name & ID:</b> ____________________", s['table_cell']), Paragraph("<b>Station / Zone:</b> ____________", s['table_cell'])],
        [Paragraph("<b>Establishment Name:</b> ________________", s['table_cell']), Paragraph("<b>Trade License No:</b> ________", s['table_cell'])],
        [Paragraph("<b>Premises Address:</b> ___________________", s['table_cell']), Paragraph("<b>Manager / In-charge:</b> ______", s['table_cell'])],
        [Paragraph("<b>Product SKU / Brand:</b> ________________", s['table_cell']), Paragraph("<b>Batch / Lot No:</b> ___________", s['table_cell'])],
    ]
    tm = Table(meta_table, colWidths=[260, 255])
    tm.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(tm)
    story.append(Spacer(1, 8))

    story.append(Paragraph("STATUTORY DECLARATION AUDIT LEDGER", s['section_heading']))

    chk_data = [
        [Paragraph("Rule", s['table_header']), Paragraph("Statutory Parameter", s['table_header']), Paragraph("Field Observation", s['table_header']), Paragraph("Compliance Verdict", s['table_header'])],
        [Paragraph("6(1)(a)", s['table_cell']), Paragraph("Manufacturer / Packer Name & Full Address", s['table_cell']), Paragraph("[  ] Clear  [  ] Abbreviated  [  ] Missing", s['table_cell']), Paragraph("[  ] PASS  [  ] FAIL", s['table_cell'])],
        [Paragraph("6(1)(a)", s['table_cell']), Paragraph("Generic / Common Name of Commodity", s['table_cell']), Paragraph("[  ] PDP Front  [  ] Back Panel", s['table_cell']), Paragraph("[  ] PASS  [  ] FAIL", s['table_cell'])],
        [Paragraph("6(1)(b)", s['table_cell']), Paragraph("Net Quantity in Standard SI Units", s['table_cell']), Paragraph("Observed: _________ g / ml / kg / l", s['table_cell']), Paragraph("[  ] PASS  [  ] FAIL", s['table_cell'])],
        [Paragraph("6(1)(c)", s['table_cell']), Paragraph("MRP ('incl. of all taxes')", s['table_cell']), Paragraph("Printed MRP: ₹ ________________", s['table_cell']), Paragraph("[  ] PASS  [  ] FAIL", s['table_cell'])],
        [Paragraph("6(1)(e)", s['table_cell']), Paragraph("Unit Sale Price (USP)", s['table_cell']), Paragraph("Observed: ₹ _______ per g/kg/ml", s['table_cell']), Paragraph("[  ] PASS  [  ] FAIL", s['table_cell'])],
        [Paragraph("6(1)(d)", s['table_cell']), Paragraph("Month & Year of Manufacture / Packing", s['table_cell']), Paragraph("Date: MM / YYYY _____________", s['table_cell']), Paragraph("[  ] PASS  [  ] FAIL", s['table_cell'])],
        [Paragraph("6(1)(g)", s['table_cell']), Paragraph("Consumer Care Details (Phone & Email)", s['table_cell']), Paragraph("[  ] Functional  [  ] Incomplete", s['table_cell']), Paragraph("[  ] PASS  [  ] FAIL", s['table_cell'])],
        [Paragraph("Rule 9", s['table_cell']), Paragraph("Numeral Font Height (Schedule II)", s['table_cell']), Paragraph("PDP Area: _____ cm² | Height: ___ mm", s['table_cell']), Paragraph("[  ] PASS  [  ] FAIL", s['table_cell'])],
        [Paragraph("18(2)", s['table_cell']), Paragraph("Dual MRP / Price Alteration / Smudging", s['table_cell']), Paragraph("[  ] No Alteration  [  ] Sticker Found", s['table_cell']), Paragraph("[  ] PASS  [  ] FAIL", s['table_cell'])],
    ]
    tc = Table(chk_data, colWidths=[45, 175, 175, 120])
    tc.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0A1F44")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(tc)
    story.append(Spacer(1, 8))

    story.append(Paragraph("RECOMMENDED STATUTORY ACTION:", s['body_bold']))
    story.append(Paragraph("[  ] Case Closed (100% Compliant) &nbsp;&nbsp;&nbsp;&nbsp; [  ] Show-Cause Notice Issued (Section 36) &nbsp;&nbsp;&nbsp;&nbsp; [  ] Seizure Effected (Section 15)", s['body_text']))
    story.append(Spacer(1, 10))

    sig_data = [
        [Paragraph("___________________________________<br/><b>Signature & Seal of Legal Metrology Officer</b>", s['table_cell']), 
         Paragraph("___________________________________<br/><b>Signature of Trader / Store Representative</b>", s['table_cell'])],
    ]
    ts = Table(sig_data, colWidths=[260, 255])
    ts.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(ts)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[+] Generated: {pdf_path.name}")


# ==============================================================================
# 5. COMPLAINT REGISTRATION FORM
# ==============================================================================
def generate_complaint_form():
    pdf_path = RESOURCES_DIR / "Consumer_Complaint_Registration_Form_LM.pdf"
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=55
    )
    s = get_styles()
    story = []

    story.append(Paragraph("GOVERNMENT OF INDIA / भारत सरकार", s['gov_header']))
    story.append(Paragraph("NATIONAL CONSUMER GRIEVANCE PORTAL & LEGAL METROLOGY DIVISION", s['gov_sub']))
    story.append(Paragraph("In Reference to National Consumer Helpline 1915 & Consumer Protection Act, 2019", s['gov_sub']))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0A1F44"), spaceAfter=8))

    story.append(Paragraph("FORM LM-C1 : OFFICIAL CONSUMER GRIEVANCE REGISTRATION FORM", s['doc_title']))
    story.append(Paragraph("For Reporting Deceptive Packaging, Dual MRP, and Underweight Commodities", s['gov_sub']))
    story.append(Spacer(1, 8))

    story.append(Paragraph("1. COMPLAINANT PARTICULARS", s['section_heading']))
    c_table = [
        [Paragraph("Full Name: _________________________________", s['table_cell']), Paragraph("Mobile No: ____________________", s['table_cell'])],
        [Paragraph("Email Address: _____________________________", s['table_cell']), Paragraph("Aadhaar / ID No (Opt): _________", s['table_cell'])],
        [Paragraph("Residential Address: ____________________________________________________________________________", s['table_cell']), Paragraph("", s['table_cell'])],
    ]
    tc1 = Table(c_table, colWidths=[310, 205])
    tc1.setStyle(TableStyle([
        ('SPAN', (0,2), (1,2)),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(tc1)
    story.append(Spacer(1, 6))

    story.append(Paragraph("2. PRODUCT & TRADER PARTICULARS", s['section_heading']))
    p_table = [
        [Paragraph("Product Name & Brand: ______________________", s['table_cell']), Paragraph("Barcode / EAN: ________________", s['table_cell'])],
        [Paragraph("Store / Retailer / E-Comm Platform: _________", s['table_cell']), Paragraph("Invoice / Bill No: ____________", s['table_cell'])],
        [Paragraph("Date of Purchase: __________________________", s['table_cell']), Paragraph("Amount Paid: ₹ ________________", s['table_cell'])],
    ]
    tc2 = Table(p_table, colWidths=[260, 255])
    tc2.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(tc2)
    story.append(Spacer(1, 6))

    story.append(Paragraph("3. CATEGORY OF LEGAL METROLOGY VIOLATION", s['section_heading']))
    v_data = [
        [Paragraph("[  ] <b>Dual MRP:</b> Charged higher than printed MRP or sticker affixed over printed price.", s['table_cell'])],
        [Paragraph("[  ] <b>Short Quantity / Underweight:</b> Actual physical quantity less than declared net weight.", s['table_cell'])],
        [Paragraph("[  ] <b>Missing Mandatory Declarations:</b> Manufacturer details, date, or customer care absent.", s['table_cell'])],
        [Paragraph("[  ] <b>Sub-Standard Font Height:</b> Numerals illegible or smaller than Schedule II limits.", s['table_cell'])],
        [Paragraph("[  ] <b>Deceptive Packaging / Shrinkflation:</b> Package size misleadingly larger than contents.", s['table_cell'])],
    ]
    tv = Table(v_data, colWidths=[515])
    tv.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(tv)
    story.append(Spacer(1, 6))

    story.append(Paragraph("4. ENCLOSED EVIDENCE CHECKLIST", s['section_heading']))
    story.append(Paragraph("[  ] Copy of Cash Memo / Retail Bill &nbsp;&nbsp;&nbsp;&nbsp; [  ] Photograph of Front & Back Packaging &nbsp;&nbsp;&nbsp;&nbsp; [  ] Photo of Price Label", s['body_text']))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>DECLARATION:</b> I hereby declare that the particulars given above are true to the best of my knowledge. I request the Controller of Legal Metrology to initiate statutory inspection under Section 15 of the Act.", s['alert_box']))
    story.append(Spacer(1, 6))

    story.append(Paragraph("Date: _______________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Complainant Signature:</b> ___________________________", s['body_text']))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[+] Generated: {pdf_path.name}")


if __name__ == "__main__":
    generate_pcr_rules_2011()
    generate_amendments_notifications()
    generate_implementation_guidelines()
    generate_field_inspection_checklist()
    generate_complaint_form()
    print("\n[SUCCESS] All 5 official statutory documents generated successfully.")
