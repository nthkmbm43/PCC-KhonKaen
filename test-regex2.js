const val = '<meta name="google-site-verification" content="jvQKEKmV9sqmQG3mm_UvmWikI8p6tezBWpcPmzi6-ao" />';
const match = val.match(/<meta\s+name=["']google-site-verification["']\s+content=["']([^"']+)["']/i);
console.log(match ? match[1] : 'null');
