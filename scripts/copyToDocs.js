const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const docs = path.join(root, 'docs');

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const f of fs.readdirSync(src)) copy(path.join(src, f), path.join(dest, f));
  } else {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// Copy public folder
copy(path.join(root, 'public'), path.join(docs));

// Copy root HTML pages and assets
const files = ['index.html','about.html','apps.html','team.html','careers.html','contact.html'];
for (const f of files) {
  const s = path.join(root, f);
  if (fs.existsSync(s)) copy(s, path.join(docs, f));
}

// Copy app_pages
if (fs.existsSync(path.join(root, 'app_pages'))) copy(path.join(root, 'app_pages'), path.join(docs, 'app_pages'));

console.log('Copied site to docs/');
