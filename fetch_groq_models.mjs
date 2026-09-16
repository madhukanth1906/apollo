import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const keyLine = env.split('\n').find(line => line.startsWith('GROQ_API_KEY='));
const key = keyLine.split('=')[1].replace(/"/g, '').trim();

async function run() {
  const res = await fetch("https://api.groq.com/openai/v1/models", {
    headers: { 'Authorization': `Bearer ${key}` }
  });
  const data = await res.json();
  if (data.data) {
    console.log(data.data.map(m => m.id).join('\n'));
  } else {
    console.log(data);
  }
}
run();
