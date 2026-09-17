import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Whitelist of valid downloadable statutory resources
const ALLOWED_RESOURCES: Record<string, { filename: string; displayName: string }> = {
  'pcr-rules-2011': {
    filename: 'Legal_Metrology_Packaged_Commodities_Rules_2011.pdf',
    displayName: 'Legal_Metrology_Packaged_Commodities_Rules_2011.pdf',
  },
  'pcr-amendments': {
    filename: 'PCR_2011_Amendments_and_Notifications.pdf',
    displayName: 'PCR_2011_Amendments_and_Notifications.pdf',
  },
  'pcr-guidelines': {
    filename: 'Legal_Metrology_Implementation_Guidelines.pdf',
    displayName: 'Legal_Metrology_Implementation_Guidelines.pdf',
  },
  'pcr-checklist': {
    filename: 'Legal_Metrology_Field_Inspection_Checklist.pdf',
    displayName: 'Legal_Metrology_Field_Inspection_Checklist.pdf',
  },
  'pcr-complaint-form': {
    filename: 'Consumer_Complaint_Registration_Form_LM.pdf',
    displayName: 'Consumer_Complaint_Registration_Form_LM.pdf',
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileParam = searchParams.get('file');

    if (!fileParam) {
      return NextResponse.json(
        { error: 'Missing file parameter' },
        { status: 400 }
      );
    }

    // Sanitize input to prevent directory traversal
    const sanitizedName = path.basename(fileParam);

    // Check if filename matches one of our allowed resources or aliases
    let resolvedFilename = sanitizedName;
    if (ALLOWED_RESOURCES[fileParam]) {
      resolvedFilename = ALLOWED_RESOURCES[fileParam].filename;
    }

    const resourcesDir = path.join(process.cwd(), 'public', 'resources');
    const filePath = path.join(resourcesDir, resolvedFilename);

    // Verify file exists on disk
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Requested statutory document not found', filename: resolvedFilename },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);
    const stat = fs.statSync(filePath);

    // Serve with attachment header to force real browser download with exact filename
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resolvedFilename}"`,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('Download API error:', error);
    return NextResponse.json(
      { error: 'Internal server error while serving document' },
      { status: 500 }
    );
  }
}
