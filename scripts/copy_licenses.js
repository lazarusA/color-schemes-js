import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('./ColorSchemes.jl/ColorSchemes/data');
const OUT_DIR = path.resolve('./src/data');

const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.txt'));

console.log(`Found ${files.length} license text file(s) to copy.`);

for (const file of files) {
  const srcPath = path.join(DATA_DIR, file);
  const destPath = path.join(OUT_DIR, file);
  fs.copyFileSync(srcPath, destPath);
  console.log(`Copied ${file} -> src/data/${file}`);
}
