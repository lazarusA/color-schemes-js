/**
 * The ColorSchemes module provides simple access to color schemes (arrays of colors).
 *
 * Use `get(cscheme, n)` with n varying from 0 to 1 to find a color at that point
 * in the color scheme `cscheme`, where 0 is the leftmost color, and 1 the rightmost.
 *
 * Access the scheme's colors directly using `cscheme.colors`.
 *
 * See also `getinverse()`.
 */

export interface RGBObject {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export type ColorLike = Color | RGBObject | string;

/**
 * Color representation storing normalized floats (r, g, b, a) in [0.0, 1.0].
 */
export class Color {
  public readonly r: number;
  public readonly g: number;
  public readonly b: number;
  public readonly a: number;

  constructor(r: number, g: number, b: number, a: number = 1.0) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  /**
   * Helper factory to create a Color from 0..1 normalized floats.
   */
  static rgb(r: number, g: number, b: number, a: number = 1.0): Color {
    return new Color(r, g, b, a);
  }

  /**
   * Helper factory to create a Color from 0..255 integer values.
   */
  static fromRgb255(r: number, g: number, b: number, a: number = 1.0): Color {
    return new Color(r / 255, g / 255, b / 255, a);
  }

  /**
   * Parse hex string into a Color object.
   */
  static fromHex(hex: string): Color {
    let cleanHex = hex.trim().replace(/^#/, '');
    if (cleanHex.length === 3 || cleanHex.length === 4) {
      cleanHex = cleanHex
        .split('')
        .map((char) => char + char)
        .join('');
    }

    if (cleanHex.length === 6) {
      const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
      const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
      const b = parseInt(cleanHex.slice(4, 6), 16) / 255;
      return new Color(r, g, b, 1.0);
    }

    if (cleanHex.length === 8) {
      const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
      const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
      const b = parseInt(cleanHex.slice(4, 6), 16) / 255;
      const a = parseInt(cleanHex.slice(6, 8), 16) / 255;
      return new Color(r, g, b, a);
    }

    throw new Error(`Invalid hex color string: "${hex}"`);
  }

  /**
   * Convert flexible color input into a Color instance.
   */
  static from(colorInput: ColorLike): Color {
    if (colorInput instanceof Color) {
      return colorInput;
    }
    if (typeof colorInput === 'string') {
      return Color.fromHex(colorInput);
    }
    if (
      typeof colorInput === 'object' &&
      colorInput !== null &&
      'r' in colorInput &&
      'g' in colorInput &&
      'b' in colorInput
    ) {
      return new Color(
        colorInput.r,
        colorInput.g,
        colorInput.b,
        colorInput.a ?? 1.0
      );
    }
    throw new Error(`Cannot parse color from input: ${JSON.stringify(colorInput)}`);
  }

  /**
   * Returns a new Color with a modified alpha opacity channel.
   */
  withAlpha(a: number): Color {
    return new Color(this.r, this.g, this.b, a);
  }

  /**
   * Convert normalized Color to 0..255 byte representations.
   */
  toRgb255(): { r: number; g: number; b: number; a: number } {
    return {
      r: Math.round(Math.min(1, Math.max(0, this.r)) * 255),
      g: Math.round(Math.min(1, Math.max(0, this.g)) * 255),
      b: Math.round(Math.min(1, Math.max(0, this.b)) * 255),
      a: this.a,
    };
  }

  /**
   * Output hex representation (e.g., #ff0000 or #ff0000ff).
   */
  toHex(includeAlpha: boolean = false): string {
    const { r, g, b, a } = this.toRgb255();
    const toHex2 = (val: number) => val.toString(16).padStart(2, '0');
    let hex = `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;
    if (includeAlpha || this.a < 1.0) {
      const alphaByte = Math.round(Math.min(1, Math.max(0, a)) * 255);
      hex += toHex2(alphaByte);
    }
    return hex;
  }

  /**
   * Output CSS color format (`rgb(...)` or `rgba(...)`).
   */
  toCss(): string {
    const { r, g, b } = this.toRgb255();
    if (this.a >= 1.0) {
      return `rgb(${r}, ${g}, ${b})`;
    }
    return `rgba(${r}, ${g}, ${b}, ${Number(this.a.toFixed(3))})`;
  }

  toArray(includeAlpha: boolean = false): number[] {
    return includeAlpha ? [this.r, this.g, this.b, this.a] : [this.r, this.g, this.b];
  }

  equals(other: ColorLike, tol: number = 1e-4): boolean {
    const c = Color.from(other);
    return (
      Math.abs(this.r - c.r) <= tol &&
      Math.abs(this.g - c.g) <= tol &&
      Math.abs(this.b - c.b) <= tol &&
      Math.abs(this.a - c.a) <= tol
    );
  }

  /**
   * Weighted color mean (linear interpolation between two colors).
   * w is the weight of c1 (from 0 to 1). (1-w) is weight of c2.
   */
  static weightedColorMean(w: number, c1: Color, c2: Color): Color {
    const wClamp = Math.min(1, Math.max(0, w));
    const invW = 1 - wClamp;
    return new Color(
      wClamp * c1.r + invW * c2.r,
      wClamp * c1.g + invW * c2.g,
      wClamp * c1.b + invW * c2.b,
      wClamp * c1.a + invW * c2.a
    );
  }

  /**
   * Compute Euclidean distance / difference between two colors in RGB space.
   */
  static colorDiff(c1: Color, c2: Color): number {
    const dr = c1.r - c2.r;
    const dg = c1.g - c2.g;
    const db = c1.b - c2.b;
    const da = c1.a - c2.a;
    return Math.sqrt(dr * dr + dg * dg + db * db + da * da);
  }
}

export function rgb(r: number, g: number, b: number, a: number = 1.0): Color {
  return Color.rgb(r, g, b, a);
}
