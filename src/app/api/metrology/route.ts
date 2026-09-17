import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;
    const markerSize = formData.get('markerSize') || '50.0';
    const markerId = formData.get('markerId') || '23';

    const projectRoot = process.cwd();
    const arucoDir = path.join(projectRoot, 'aruco_measurement');
    const inputDir = path.join(arucoDir, 'input');
    const outputDir = path.join(arucoDir, 'output');
    const pythonBin = path.join(arucoDir, 'venv', 'bin', 'python3');

    // Determine target image path
    let targetImagePath = path.join(inputDir, 'sample_product.jpg');

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadPath = path.join(inputDir, 'web_upload.jpg');
      fs.writeFileSync(uploadPath, buffer);
      targetImagePath = uploadPath;
    }

    // Ensure sample exists if fallback needed
    if (!fs.existsSync(targetImagePath)) {
      // Fallback: check if sample_product.jpg exists, else run generator
      const genScript = path.join(arucoDir, 'generate_test_sample.py');
      if (fs.existsSync(genScript)) {
        await new Promise((resolve) => {
          const genProc = spawn(pythonBin, [genScript], {
            cwd: projectRoot,
            env: { ...process.env, PYTHONPATH: arucoDir },
          });
          genProc.on('close', resolve);
        });
      }
    }

    // Run measurement pipeline via Python CLI
    const mainScript = path.join(arucoDir, 'main.py');
    const pythonArgs = [
      mainScript,
      '--image',
      targetImagePath,
      '--marker-size',
      String(markerSize),
      '--marker-id',
      String(markerId),
      '--save-rectified',
    ];

    await new Promise<void>((resolve, reject) => {
      const pyProc = spawn(pythonBin, pythonArgs, {
        cwd: projectRoot,
        env: { ...process.env, PYTHONPATH: arucoDir },
      });

      let stdout = '';
      let stderr = '';
      pyProc.stdout.on('data', (d) => (stdout += d.toString()));
      pyProc.stderr.on('data', (d) => (stderr += d.toString()));

      pyProc.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          console.error('Python Error:', stderr);
          resolve(); // Still attempt reading output if generated
        }
      });
    });

    // Read generated JSON report
    const stem = path.parse(targetImagePath).name;
    const jsonPath = path.join(outputDir, `measurement_${stem}.json`);
    const imgPath = path.join(outputDir, `measured_${stem}.jpg`);
    const rectPath = path.join(outputDir, 'rectified_product.jpg');

    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json({
        error: 'Measurement failed or no output generated',
        details: 'Check if ArUco marker is visible in image.',
      }, { status: 422 });
    }

    const reportData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    // Convert output images to base64 data URLs for seamless instant frontend preview
    let annotatedBase64 = null;
    if (fs.existsSync(imgPath)) {
      const imgBuffer = fs.readFileSync(imgPath);
      annotatedBase64 = `data:image/jpeg;base64,${imgBuffer.toString('base64')}`;
    }

    let rectifiedBase64 = null;
    if (fs.existsSync(rectPath)) {
      const rectBuffer = fs.readFileSync(rectPath);
      rectifiedBase64 = `data:image/jpeg;base64,${rectBuffer.toString('base64')}`;
    }

    return NextResponse.json({
      success: true,
      report: reportData,
      annotatedImage: annotatedBase64,
      rectifiedImage: rectifiedBase64,
    });
  } catch (error: any) {
    console.error('Metrology API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
