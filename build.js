const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const output = path.join(root, 'dist');
const files = ['index.html', 'style.css', 'script.js', 'Quellen.txt'];
const directories = ['audios', 'bilder'];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const file of files) {
  const source = path.join(root, file);
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, path.join(output, file));
  }
}

for (const directory of directories) {
  const source = path.join(root, directory);
  if (fs.existsSync(source)) {
    fs.cpSync(source, path.join(output, directory), { recursive: true });
  }
}

console.log('Cloudflare Pages static files created in dist/.');
