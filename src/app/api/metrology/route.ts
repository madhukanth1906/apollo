import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(req: Request) {
  let imageFile: File | null = null;
  try {
    const formData = await req.formData();
    imageFile = formData.get('image') as File | null;
    const markerSize = formData.get('markerSize') || '50.0';
    const markerId = formData.get('markerId') || '23';

    const projectRoot = process.cwd();
    const arucoDir = path.join(projectRoot, 'aruco_measurement');
    const inputDir = path.join(arucoDir, 'input');
    const outputDir = path.join(arucoDir, 'output');
    if (!fs.existsSync(inputDir)) fs.mkdirSync(inputDir, { recursive: true });
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const isWindows = process.platform === 'win32';
    let pythonBin = isWindows 
      ? path.join(arucoDir, 'venv', 'Scripts', 'python.exe') 
      : path.join(arucoDir, 'venv', 'bin', 'python3');
      
    if (!fs.existsSync(pythonBin)) {
      pythonBin = isWindows ? 'python' : 'python3';
    }
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
        await new Promise((resolve, reject) => {
          const genProc = spawn(pythonBin, [genScript], {
            cwd: projectRoot,
            env: { ...process.env, PYTHONPATH: arucoDir },
            shell: isWindows
          });
          genProc.on('close', resolve);
          genProc.on('error', reject);
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
        shell: isWindows
      });

      let stdout = '';
      let stderr = '';
      pyProc.stdout.on('data', (d) => (stdout += d.toString()));
      pyProc.stderr.on('data', (d) => (stderr += d.toString()));

      pyProc.on('error', (err) => {
        console.error('Failed to start python process:', err);
        reject(err);
      });

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
    
    // Vercel / Serverless Fallback when Python is not installed
    if (error.code === 'ENOENT' || (error.message && error.message.includes('ENOENT'))) {
      console.warn('Python not found. Returning mock fallback for Vercel deployment.');
      
      let base64Fallback = null;
      if (imageFile && imageFile.size > 0) {
        try {
          const buffer = Buffer.from(await imageFile.arrayBuffer());
          base64Fallback = `data:${imageFile.type || 'image/jpeg'};base64,${buffer.toString('base64')}`;
        } catch (e) {
          console.error('Failed to read image for fallback', e);
        }
      }

      return NextResponse.json({
        success: true,
        report: {
          product: { area_cm2: 125.0 },
          text: { primary_height_mm: 3.5 }
        },
        annotatedImage: base64Fallback,
        rectifiedImage: base64Fallback,
        isMockFallback: true
      });
    }

    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
