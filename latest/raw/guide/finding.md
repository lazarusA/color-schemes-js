# Finding Schemes in ColorSchemes

`color-schemes-js` provides the function `getInverse(cscheme, color)`, which is the *inverse* of `get(cscheme, t)`. Given an RGB color value, this function evaluates the scheme and returns a normalized value between `0.0` and `1.0` corresponding to the closest matching position along the scheme's axis.

```typescript
import { getInverse, colorschemes } from 'color-schemes-js';

const targetColor = { r: 120, g: 40, b: 180 };
const normalizedPosition = getInverse(colorschemes.viridis, targetColor);
// => returns position e.g. 0.42
```

## Practical Example: Heatmap Data Extraction

One practical application for `getInverse()` is reconstructing continuous scalar data values (such as temperature, elevation, or concentration) from image pixel data when raw numerical values are unavailable.

```typescript
import { getInverse, colorschemes } from 'color-schemes-js';

// Process array of pixel color data from a canvas or image context
function extractDataFromHeatmap(pixelArray, width, height) {
  const values = new Float64Array(width * height);

  for (let i = 0; i < pixelArray.length; i += 4) {
    const pixel = {
      r: pixelArray[i],
      g: pixelArray[i + 1],
      b: pixelArray[i + 2]
    };
    
    // Map pixel back to continuous value [0.0, 1.0]
    const pixelIndex = i / 4;
    values[pixelIndex] = getInverse(colorschemes.temperaturemap, pixel);
  }

  return values;
}
```

This maps image pixel colors back to continuous scalar values, allowing analytical operations like finding local minimum/maximum anomalies or performing secondary processing.
