const https = require('https');
https.get('https://pcc-khon-kaen.vercel.app', (res) => {
  console.log("Status Code:", res.statusCode);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("Includes google meta:", data.includes('google-site-verification'));
  });
});
