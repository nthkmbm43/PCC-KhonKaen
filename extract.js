const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\user\\.gemini\\antigravity\\brain\\aa6a8de2-0c33-42ad-91f3-e43fcc82d4ab\\.system_generated\\steps\\2424\\content.md', 'utf8');

const titleRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi;
let match;
console.log('--- HEADINGS ---');
while ((match = titleRegex.exec(html)) !== null) {
  // strip internal tags
  const text = match[1].replace(/<[^>]+>/g, '').trim();
  if (text.length > 2) console.log(text);
}

const imgRegex = /<img[^>]+src="([^">]+)"/gi;
console.log('\n--- IMAGES ---');
let imgMatch;
let count = 0;
while ((imgMatch = imgRegex.exec(html)) !== null && count < 20) {
  console.log(imgMatch[1]);
  count++;
}
