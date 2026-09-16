import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const keyLine = env.split('\n').find(line => line.startsWith('GROQ_API_KEY='));
const key = keyLine.split('=')[1].replace(/"/g, '').trim();

async function run() {
  console.log("Loading test image...");
  const imagePath = String.raw`C:\Users\dhara\.gemini\antigravity-ide\brain\ec537a27-3c66-4250-9fc7-371ec54dd4e3\pcr_compliant_front_1788753041891.jpg`;
  const imageBuffer = fs.readFileSync(imagePath);
  const base64 = imageBuffer.toString('base64');
  
  const payload = {
    model: "llama-3.2-90b-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Extract any text you see in this image. Please format it nicely." },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64}` } }
        ]
      }
    ],
    temperature: 0.0
  };

  console.log("Sending request to Groq API...");
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
      console.error("Groq API returned an error:", res.status);
      const text = await res.text();
      console.error(text);
    } else {
      const data = await res.json();
      console.log("\n✅ Success! Groq successfully analyzed the image.");
      console.log("\nResponse:\n", data.choices[0].message.content);
    }
  } catch(e) {
    console.error("Fetch failed:", e);
  }
}

run();
