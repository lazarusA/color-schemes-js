# color-schemes-js

[![npm version](https://img.shields.io/npm/v/color-schemes-js.svg)](https://www.npmjs.com/package/color-schemes-js)
[![license](https://img.shields.io/npm/l/color-schemes-js.svg)](./LICENSE.md)

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

## License

[MIT](./LICENSE.md) — Inspired by [ColorSchemes.jl](https://github.com/JuliaGraphics/ColorSchemes.jl).
