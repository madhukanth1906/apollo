import { NextResponse } from 'next/server';

const METROLOGY_INSPECTION_PROMPT = `You are an expert Legal Metrology Inspector analyzing a packaged commodity.
You will be provided with one or more images of the product packaging (e.g., Front, Back, Side views).
Carefully scan ALL provided images and extract the mandatory statutory declarations exactly as they appear.

CRITICAL INSTRUCTIONS:
1. Do not use markdown formatting or code blocks (no \`\`\`json).
2. Do not include any reasoning or explanations.
3. If a field is completely missing across all images, output "Not Found".
4. DUAL MRP DETECTION: You must scan all images for MULTIPLE price tags. If you see more than one MRP (e.g., a printed MRP and a sticker MRP), list BOTH of them separated by a pipe (|) and set "dualMrpDetected" to true.
5. Output STRICTLY as a valid JSON object matching the exact structure below.

REQUIRED JSON STRUCTURE:
{
  "productName": "extract the generic name of the commodity",
  "brand": "extract the brand name",
  "mrp": "extract the Maximum Retail Price (MRP). If multiple different MRPs exist across the images, separate them with | (e.g., '₹50 | ₹60')",
  "dualMrpDetected": false,
  "netQuantity": "extract the net weight/volume (e.g., 5 kg, 500 ml)",
  "manufacturerAddress": "extract the full name and address of the manufacturer/packer",
  "customerCare": "scan carefully for tiny text containing customer care email, toll-free number, and address",
  "dateOfManufacture": "extract the manufacturing or packaging date (Month/Year)",
  "complianceScore": 85
}`;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const images = formData.getAll('images') as File[];

    if (!images || images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    const parts: any[] = [{ text: METROLOGY_INSPECTION_PROMPT }];
    const base64Images: string[] = [];
    const mimeTypes: string[] = [];
    
    for (const image of images) {
      const arrayBuffer = await image.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const mime = image.type || "image/jpeg";
      
      base64Images.push(base64);
      mimeTypes.push(mime);
      
      parts.push({
        inline_data: {
          mime_type: mime,
          data: base64
        }
      });
    }

    const geminiPayload = {
      contents: [{ parts }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.0
      }
    };

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    let attempt = 0;
    let geminiSuccess = false;
    let outputText = "";

    // 1. Attempt Gemini up to 2 times
    while (attempt < 2 && !geminiSuccess) {
      attempt++;
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(geminiPayload)
        });

        if (response.ok) {
          const result = await response.json();
          outputText = result.candidates[0].content.parts[0].text;
          geminiSuccess = true;
        } else {
          const errorText = await response.text();
          console.warn(`Gemini Attempt ${attempt} Failed: ${response.status}`, errorText);
          if (attempt < 2) await delay(1500); // Wait 1.5s before retry
        }
      } catch (err) {
        console.warn(`Gemini Attempt ${attempt} Network Error:`, err);
        if (attempt < 2) await delay(1500);
      }
    }

    // 2. Return Gemini Result
    if (!geminiSuccess) {
      console.error("Gemini failed after 2 attempts due to High Demand/Network Errors.");
      return NextResponse.json({ error: 'Primary AI API failed due to high demand. Please try again later.' }, { status: 503 });
    }
    
    return NextResponse.json({ status: "success", data: outputText });

  } catch (error) {
    console.error('Error in analyze API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
