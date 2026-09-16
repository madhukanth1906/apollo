import fs from 'fs';

async function testLocalApi() {
  const imagePath = String.raw`C:\Users\dhara\.gemini\antigravity-ide\brain\ec537a27-3c66-4250-9fc7-371ec54dd4e3\pcr_compliant_front_1788753041891.jpg`;
  const imageBuffer = fs.readFileSync(imagePath);
  const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
  
  const formData = new FormData();
  formData.append('images', blob, 'test.jpg');

  console.log("Sending POST request to http://localhost:3000/api/analyze...");
  
  try {
    const response = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: formData
    });
    
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response JSON:", data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

testLocalApi();
