# color-schemes-js

[![npm version](https://img.shields.io/npm/v/color-schemes-js.svg)](https://www.npmjs.com/package/color-schemes-js)
[![][docs-latest-img]][docs-latest-url]
[![license](https://img.shields.io/npm/l/color-schemes-js.svg)](./LICENSE.md)

[docs-latest-img]: https://img.shields.io/badge/documentation-%20latest-violet?style=round-square
[docs-latest-url]: https://lazarusa.github.io/color-schemes-js/latest/

Pre-defined color schemes and continuous color evaluation tools for TypeScript and JavaScript, inspired by Julia's [ColorSchemes.jl](https://github.com/JuliaGraphics/ColorSchemes.jl).

## Features

- 🎨 **Hundreds of Palettes**: Scientific colormaps (Matplotlib, ColorCET, cmocean, cmasher), popular UI themes (Catppuccin, Nord, Ghibli, Wes Anderson), Seaborn, ColorBrewer, and more.
- 📐 **Continuous Evaluation**: Sample colors smooth across $[0, 1]$ or map matrix data using `'clamp'`, `'extrema'`, or `'centered'` scaling.
- 🔄 **Resampling & Inversion**: Extract sub-palettes, invert color order, or discretize continuous schemes into discrete steps.
- 📦 **Zero Dependencies**: Lightweight ESM and CommonJS library written in TypeScript with full type safety.

## Installation

```bash
npm install color-schemes-js
```

## Quick Start

### 1. Sampling Colors

```typescript
import { viridis, nord, get } from 'color-schemes-js';

// Sample a color at t = 0.5 (midpoint)
const color = viridis.get(0.5);

console.log(color.toHex()); // "#21918c"
console.log(color.toCss()); // "rgb(33, 145, 140)"
console.log(color.toRgb255()); // { r: 33, g: 145, b: 140, a: 1 }

// Alternative functional syntax
const nordColor = get(nord, 0.25);
```

### 2. Mapping Data Arrays

```typescript
import { viridis } from 'color-schemes-js';

const elevationData = [
  [10, 45, 89],
  [34, 67, 100],
];

// Scale colors across min..max range of data ('extrema')
const colors = viridis.getArray(elevationData, 'extrema');
```

### 3. Finding & Loading Schemes

```typescript
import { findColorScheme, loadColorScheme } from 'color-schemes-js';

// Search catalog by query string
const matches = findColorScheme('catppuccin');

// Load scheme by exact name
const magma = loadColorScheme('magma');
```

### 4. Custom Schemes & Transformations

```typescript
import { ColorScheme, rgb } from 'color-schemes-js';

// Create a custom scheme
const myScheme = new ColorScheme(
  [rgb(1, 0, 0), rgb(0, 1, 0), rgb(0, 0, 1)],
  'custom',
  'Primary RGB Palette'
);

// Invert color scheme
const inverted = myScheme.getInverse();

// Resample continuous scheme into N discrete colors
const palette10 = myScheme.resample(10);
```

## Acknowledgements

This project is a JavaScript/TypeScript port of the original Julia library [ColorSchemes.jl](https://github.com/JuliaGraphics/ColorSchemes.jl). We are deeply grateful to all the authors and contributors who created, curated, and maintained these color schemes over the years.

Special thanks to the contributors of `ColorSchemes.jl`:

[@cormullion](https://github.com/cormullion), [@rafaqz](https://github.com/rafaqz), [@asinghvi17](https://github.com/asinghvi17), [@ViralBShah](https://github.com/ViralBShah), [@gustaphe](https://github.com/gustaphe), [@max-de-rooij](https://github.com/max-de-rooij), [@ValentinKaisermayer](https://github.com/ValentinKaisermayer), [@andrew-saydjari](https://github.com/andrew-saydjari), [@t-bltg](https://github.com/t-bltg), [@daviehh](https://github.com/daviehh), [@stelmo](https://github.com/stelmo), [@lwabeke](https://github.com/lwabeke), [@jarredclloyd](https://github.com/jarredclloyd), [@davibarreira](https://github.com/davibarreira), [@agchesebro](https://github.com/agchesebro), [@tkelman](https://github.com/tkelman), [@tlienart](https://github.com/tlienart), [@tecosaur](https://github.com/tecosaur), [@kellertuer](https://github.com/kellertuer), [@NHDaly](https://github.com/NHDaly), [@maucejo](https://github.com/maucejo), [@adrhill](https://github.com/adrhill), [@guo-yong-zhi](https://github.com/guo-yong-zhi), [@waldyrious](https://github.com/waldyrious), [@timholy](https://github.com/timholy), [@StefanKarpinski](https://github.com/StefanKarpinski), [@sebastiantk](https://github.com/sebastiantk), [@nealmckee](https://github.com/nealmckee), [@musoke](https://github.com/musoke), [@mortenpi](https://github.com/mortenpi), [@Moelf](https://github.com/Moelf), [@mileslucas](https://github.com/mileslucas), [@evetion](https://github.com/evetion), [@hellemo](https://github.com/hellemo), [@kdyrhage](https://github.com/kdyrhage), [@ranocha](https://github.com/ranocha), [@staticfloat](https://github.com/staticfloat), and [@daschw](https://github.com/daschw).

For a complete and up-to-date list, visit the [ColorSchemes.jl Contributors Graph](https://github.com/JuliaGraphics/ColorSchemes.jl/graphs/contributors).

## License

[MIT](./LICENSE.md) — Inspired by [ColorSchemes.jl](https://github.com/JuliaGraphics/ColorSchemes.jl).

