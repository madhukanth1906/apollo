// Native node fetch and FormData

async function testVercelAPI() {
  const vercelDomain = 'https://apollo-seven-sage.vercel.app';
  console.log(`Testing connection to: ${vercelDomain}`);

  try {
    console.log('\n--- Testing /api/analyze ---');
    const formData = new FormData();
    // We send an empty form data just to verify the backend is responsive
    const analyzeResponse = await fetch(`${vercelDomain}/api/analyze`, {
      method: 'POST',
      body: formData,
    });
    
    console.log(`Status: ${analyzeResponse.status} ${analyzeResponse.statusText}`);
    const analyzeText = await analyzeResponse.text();
    console.log(`Response: ${analyzeText}`);

    console.log('\n--- Testing /api/metrology ---');
    const metrologyData = new FormData();
    const metrologyResponse = await fetch(`${vercelDomain}/api/metrology`, {
      method: 'POST',
      body: metrologyData,
    });
    
    console.log(`Status: ${metrologyResponse.status} ${metrologyResponse.statusText}`);
    const metrologyText = await metrologyResponse.text();
    console.log(`Response: ${metrologyText}`);

  } catch (err) {
    console.error('Error connecting to Vercel API:', err.message);
  }
}

testVercelAPI();
