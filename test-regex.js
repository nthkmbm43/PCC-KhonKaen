const code = `<meta name="google-site-verification" content="1MLr6l3EQQFlN8x" />`;
const match = code.match(/<meta\s+name=["']google-site-verification["']\s+content=["']([^"']+)["']/i);
console.log(match ? match[1] : "No match");
