import { createWorker } from 'tesseract.js';
import fs from 'fs';

async function test() {
  console.log("1. Starting Tesseract.js OCR locally...");
  const worker = await createWorker('eng');
  
  // Using the Shaktibhog Atta image from your artifacts
  const imagePath = String.raw`C:\Users\dhara\.gemini\antigravity-ide\brain\ec537a27-3c66-4250-9fc7-371ec54dd4e3\pcr_compliant_front_1788753041891.jpg`;
  const imageBuffer = fs.readFileSync(imagePath);
  
  const ret = await worker.recognize(imageBuffer);
  const text = ret.data.text;
  await worker.terminate();
  
  console.log("✅ OCR Completed. Extracted length:", text.length, "characters");
  console.log("\n--- Sample of Extracted Text ---");
  console.log(text.substring(0, 300) + "...\n");

  console.log("2. Constructing Prompt and sending to local Qwen Model (No Think State)...");
  
  const prompt = `You are an expert Legal Metrology compliance parser.
Extract the following information from the provided OCR text into strict, valid JSON format.
CRITICAL INSTRUCTION: You must run in a "no think" state. Do NOT output <think> tags. Do NOT provide any chain of thought, reasoning, or explanation. Output ONLY the final JSON object.

Required JSON Structure:
{
  "productName": "string or Not Found",
  "brand": "string or Not Found",
  "mrp": "string or Not Found",
  "netQuantity": "string or Not Found",
  "manufacturerAddress": "string or Not Found",
  "customerCare": "string or Not Found",
  "complianceScore": <number between 0 and 100 based on presence of above fields>
}

OCR Text:
${text}`;

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: "qwen3.5-4b-uncensored:latest",
      prompt: prompt,
      stream: false,
      options: { temperature: 0.0 }
    })
  });
  
  const data = await response.json();
  let rawOutput = data.response.trim();
  
  // Stripping think tags just like in our API route
  rawOutput = rawOutput.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  
  if (rawOutput.startsWith('```json')) {
      rawOutput = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
  }
  if (rawOutput.startsWith('```')) {
      rawOutput = rawOutput.replace(/```/g, '').trim();
  }
  
  console.log("✅ AI Analysis Completed!\n");
  console.log("3. Cleaned JSON Output (Ready for UI):");
  console.log("--------------------------------------");
  console.log(rawOutput);
  
  try {
      JSON.parse(rawOutput);
      console.log("\n✅ SUCCESS: The output is perfectly valid JSON!");
  } catch (e) {
      console.log("\n❌ FAILED: The output is not valid JSON.");
  }
}

test().catch(console.error);
