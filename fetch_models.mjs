import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const keyLine = env.split('\n').find(line => line.startsWith('GEMINI_API_KEY='));
const key = keyLine.split('=')[1].replace(/"/g, '').trim();

async function run() {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + key);
  const data = await res.json();
  if (data.models) {
    console.log(data.models.map(m => m.name).join('\n'));
  } else {
    console.log(data);
  }
}
run();
