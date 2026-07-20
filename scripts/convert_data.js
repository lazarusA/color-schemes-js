import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('./ColorSchemes.jl/ColorSchemes/data');
const OUT_DIR = path.resolve('./src/data');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const jlFiles = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.jl'));

console.log(`Found ${jlFiles.length} Julia data files.`);

function cleanString(str) {
  if (!str) return '';
  let trimmed = str.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    trimmed = trimmed.slice(1, -1);
  }
  return trimmed
    .replace(/\\"/g, '"')
    .replace(/\r?\n/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

function parseJlFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Match loadcolorscheme(...) calls allowing trailing commas and multiline parameters
  const schemeRegex = /loadcolorscheme\s*\(\s*:([A-Za-z0-9_]+)\s*,\s*\[([\s\S]*?)\]\s*(?:,\s*("(?:[^"\\]|\\.|[\r\n])*"))?\s*(?:,\s*("(?:[^"\\]|\\.|[\r\n])*"))?\s*,?\s*\)/g;

  const schemes = [];
  let match;

  while ((match = schemeRegex.exec(content)) !== null) {
    const symbol = match[1];
    const rawColors = match[2];
    const category = cleanString(match[3]);
    const notes = cleanString(match[4]);

    const colorLines = rawColors.split('\n');
    const colors = [];

    for (const line of colorLines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const colorantMatch = /colorant"([^"]+)"/.exec(trimmed);
      if (colorantMatch) {
        const hex = colorantMatch[1];
        colors.push({ type: 'hex', hex });
        continue;
      }

      const rgbaMatch = /(?:RGBA|RGB|ColorTypes\.RGB|ColorTypes\.RGBA|RGB\{[^}]+\}|RGBA\{[^}]+\})\s*\(\s*([^)]+)\s*\)/.exec(trimmed);
      if (rgbaMatch) {
        const argsStr = rgbaMatch[1];
        const args = argsStr.split(',').map((a) => a.trim());
        if (args.length === 1) {
          const g = parseNum(args[0]);
          if (!isNaN(g)) {
            colors.push({ type: 'rgba', r: g, g: g, b: g, a: 1.0 });
          }
        } else if (args.length === 3) {
          const r = parseNum(args[0]);
          const g = parseNum(args[1]);
          const b = parseNum(args[2]);
          if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
            colors.push({ type: 'rgba', r, g, b, a: 1.0 });
          }
        } else if (args.length === 4) {
          const r = parseNum(args[0]);
          const g = parseNum(args[1]);
          const b = parseNum(args[2]);
          const a = parseNum(args[3]);
          if (!isNaN(r) && !isNaN(g) && !isNaN(b) && !isNaN(a)) {
            colors.push({ type: 'rgba', r, g, b, a });
          }
        }
      }
    }

    if (colors.length > 0) {
      schemes.push({ symbol, colors, category, notes });
    }
  }

  return schemes;
}

function parseNum(valStr) {
  if (!valStr) return NaN;
  let s = valStr.trim();
  s = s.replace(/f[0-9]+$/i, '');
  if (s.startsWith('0x')) {
    return parseInt(s, 16) / 255;
  }
  return parseFloat(s);
}

const allModuleExports = [];

for (const file of jlFiles) {
  const filePath = path.join(DATA_DIR, file);
  const schemes = parseJlFile(filePath);

  if (schemes.length === 0) {
    console.log(`Skipped ${file} (no schemes parsed)`);
    continue;
  }

  const basename = path.basename(file, '.jl');
  const tsFileName = `${basename}.ts`;
  const tsFilePath = path.join(OUT_DIR, tsFileName);

  let tsContent = `import { loadColorScheme } from '../catalog.js';\nimport { Color } from '../color.js';\n\n`;

  for (const s of schemes) {
    let symName = s.symbol;
    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(symName)) {
      symName = `scheme_${symName}`;
    }

    const colorTokens = s.colors
      .map((c) => {
        if (c.type === 'hex') {
          return `Color.fromHex('${c.hex}')`;
        }
        return `Color.rgb(${c.r}, ${c.g}, ${c.b}${c.a !== 1.0 ? `, ${c.a}` : ''})`;
      })
      .join(',\n    ');

    tsContent += `export const ${symName} = loadColorScheme(\n  '${s.symbol}',\n  [\n    ${colorTokens}\n  ],\n  '${s.category}',\n  '${s.notes}'\n);\n\n`;
  }

  fs.writeFileSync(tsFilePath, tsContent, 'utf8');
  console.log(`Generated ${tsFileName} with ${schemes.length} scheme(s).`);
  allModuleExports.push(basename);
}

let indexContent = allModuleExports
  .map((mod) => `import './${mod}.js';`)
  .join('\n');

indexContent += '\n\n';
indexContent += allModuleExports
  .map((mod) => `export * from './${mod}.js';`)
  .join('\n');

fs.writeFileSync(path.join(OUT_DIR, 'index.ts'), indexContent, 'utf8');
console.log('Updated src/data/index.ts with all converted modules.');
