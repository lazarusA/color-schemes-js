import { describe, it, expect } from 'vitest';
import {
  Color,
  ColorScheme,
  ColorSchemeCategory,
  ColourScheme,
  ColourSchemeCategory,
  rgb,
  colorschemes,
  colourschemes,
  findColorScheme,
  findcolourscheme,
  loadcolourscheme,
  get,
  getinverse,
  resample,
  viridis,
  turbo,
  nord,
  fastie,
} from '../src/index.js';

// MonaLisa test dataset matching ColorSchemes.jl/test/runtests.jl
const monalisa = new ColorScheme(
  [
    rgb(0.05482025926320272, 0.016508952654741622, 0.019315160361063788),
    rgb(0.07508160782698388, 0.034110215845969745, 0.039708343938094984),
    rgb(0.10884977211887092, 0.033667530751245296, 0.026120424375656533),
    rgb(0.10025110094110237, 0.05342427394738222, 0.04975936729231899),
    rgb(0.11004568002009293, 0.06764950003139521, 0.07202128202310687),
    rgb(0.1520114897984492, 0.06721701384356317, 0.04758612657624729),
    rgb(0.16121466572057147, 0.10737190368841328, 0.07491505937992286),
    rgb(0.2272468746270438, 0.09450818887496519, 0.053122482545649836),
    rgb(0.24275776450376843, 0.14465569383748178, 0.09254885719488251),
    rgb(0.19832488479851235, 0.16827798680930195, 0.08146721610879516),
    rgb(0.29030547394827216, 0.1566704731433784, 0.06955958896758961),
    rgb(0.3486958875330028, 0.14413808439049522, 0.06517845643634491),
    rgb(0.2631529920611145, 0.22896210929698424, 0.1119250237167965),
    rgb(0.35775151767110114, 0.23955578484799914, 0.08566681526152695),
    rgb(0.42895506355552904, 0.19814294026377038, 0.07315576139822164),
    rgb(0.3359280058835734, 0.30177882691623686, 0.14764230985832),
    rgb(0.5168174153887967, 0.2588008525490645, 0.07751817567374263),
    rgb(0.44056726473192726, 0.3387984774995975, 0.10490250831857457),
    rgb(0.4048595970607235, 0.40823989479512734, 0.2096109034699151),
    rgb(0.619694338941659, 0.33787470822764315, 0.0871136546089913),
    rgb(0.5108290351302369, 0.41506713362977327, 0.13590312315603137),
    rgb(0.5272516131642648, 0.4706039514608196, 0.21392546020040532),
    rgb(0.5942622209175139, 0.47822315473126586, 0.14678522310513448),
    rgb(0.735266714513005, 0.4318652289706696, 0.1049661472744881),
    rgb(0.6201870982552801, 0.5227924127640037, 0.2167074150596878),
    rgb(0.6929049533440698, 0.5663098519207086, 0.18551505068207655),
    rgb(0.6814114992549445, 0.5814898147520997, 0.27039081549715527),
    rgb(0.8500397772474145, 0.5401215248181611, 0.1362117676724628),
    rgb(0.7575520588269891, 0.6334254649343621, 0.25145144950124687),
    rgb(0.8164723313500291, 0.6970150665478066, 0.32242062463720045),
    rgb(0.9330273170314637, 0.6651641943114455, 0.19865164906805746),
    rgb(0.9724409077178674, 0.7907008712807734, 0.2851364857083522),
  ],
  'testing',
  "colors from Leonardo da Vinci's Mona Lisa"
);

describe('basic tests (matching runtests.jl)', () => {
  it('length and indexing tests', () => {
    expect(monalisa.length).toBe(32);
    expect(monalisa.colors.length).toBe(32);

    expect(monalisa.get(0.0).equals(monalisa.get(0.5))).toBe(false);
    expect(monalisa.at(-1)?.equals(monalisa.get(1.0))).toBe(true);

    expect(monalisa.at(0)?.equals(monalisa.colors[0])).toBe(true);
    expect(monalisa.at(-1)?.equals(monalisa.colors[31])).toBe(true);
  });
});

describe('conversion tests (matching runtests.jl)', () => {
  it('convert an Array to an RGB image', () => {
    const data = [
      [0.1, 0.5],
      [0.2, 0.8],
    ];
    const img = monalisa.getArray(data);
    expect(img.length).toBe(2);
    expect(img[0].length).toBe(2);
  });

  it('test conversion with default clamp', () => {
    const x = [
      [0.0, 1.0],
      [-1.0, 2.0],
    ];
    const y = monalisa.getArray(x);
    expect(y[0][0].equals(y[1][0])).toBe(true);
    expect(y[0][1].equals(y[1][1])).toBe(true);
  });

  it('test conversion with symbol clamp', () => {
    const x = [
      [0.0, 1.0],
      [-1.0, 2.0],
    ];
    const y = monalisa.getArray(x);
    const y2 = monalisa.getArray(x, 'clamp');
    expect(y2[0][0].equals(y[0][0])).toBe(true);
    expect(y2[0][1].equals(y[0][1])).toBe(true);
    expect(y2[1][1].equals(y[1][1])).toBe(true);
  });

  it('test conversion with symbol extrema', () => {
    const x = [
      [0.0, 1.0],
      [-1.0, 2.0],
    ];
    const y2 = monalisa.getArray(x, 'extrema');
    expect(y2[1][0].equals(y2[0][0])).toBe(false);
    expect(y2[1][0].equals(monalisa.colors[0])).toBe(true);
    expect(y2[1][1].equals(monalisa.colors[31])).toBe(true);
  });

  it('test conversion with manually supplied range', () => {
    const x = [
      [0.0, 1.0],
      [-1.0, 2.0],
    ];
    const y2 = monalisa.getArray(x, 'extrema');
    const y3 = monalisa.getArray(x, [-1.0, 2.0]);
    expect(y3[0][0].equals(y2[0][0])).toBe(true);
    expect(y3[0][1].equals(y2[0][1])).toBe(true);
    expect(y3[1][1].equals(y2[1][1])).toBe(true);
  });

  it('test empty range (#43)', () => {
    const y4 = monalisa.get(0.4, [0.0, 0.0]);
    expect(y4.r).toBeGreaterThan(0.3);
    expect(y4.r).toBeLessThan(0.4);
    expect(y4.g).toBeGreaterThan(0.2);
    expect(y4.g).toBeLessThan(0.25);
    expect(y4.b).toBeGreaterThan(0.1);
    expect(y4.b).toBeLessThan(0.15);
  });

  it('test boolean evaluation', () => {
    expect(monalisa.get(0.0).equals(monalisa.get(false))).toBe(true);
    expect(monalisa.get(1.0).equals(monalisa.get(true))).toBe(true);
  });
});

describe('misc tests (matching runtests.jl)', () => {
  it('test with array of numbers and single value', () => {
    const val = 0.2;
    const y = monalisa.getArray([val]);
    const y2 = monalisa.get(val);
    expect(y[0].equals(y2)).toBe(true);
  });

  it('test reversed color output', () => {
    const col = monalisa.reverse().get(0.0);
    expect(col.r).toBeGreaterThan(0.9);
    expect(col.g).toBeGreaterThan(0.7);
    expect(col.b).toBeGreaterThan(0.2);
  });

  it('test iteration of a colorscheme', () => {
    let counter = 0;
    for (const c of monalisa) {
      expect(c).toBeDefined();
      counter++;
    }
    expect(counter).toBe(32);
  });

  it('test findcolorscheme()', () => {
    const rainbowResults = findColorScheme('rainbow');
    expect(rainbowResults.length).toBeGreaterThan(0);
  });

  it('test resample', () => {
    const csa = turbo.resample(20);
    expect(csa.length).toBe(20);

    const csaAlpha = turbo.resample(20, (a) => 0.5);
    expect(csaAlpha.at(0)?.a).toBe(0.5);
  });
});

describe('tests with 255-based scheme (matching runtests.jl)', () => {
  const monalisa1 = new ColorScheme(
    monalisa.colors.map((c) => Color.fromRgb255(c.r * 255, c.g * 255, c.b * 255)),
    monalisa.category,
    monalisa.notes
  );

  it('matches length and color range', () => {
    expect(monalisa1.length).toBe(32);
    expect(monalisa1.colors[0].r * 255).toBeGreaterThan(12);
    expect(monalisa1.colors[0].r * 255).toBeLessThan(14);
  });

  it('test conversion with symbol centered', () => {
    const x = [
      [0.0, 1.0],
      [-1.0, 2.0],
    ];
    const y2 = monalisa1.getArray(x, 'centered');
    expect(y2[1][1].equals(monalisa1.get(1.0))).toBe(true);
    expect(y2[0][0].equals(monalisa1.get(0.5))).toBe(true);
    expect(y2[0][1].equals(monalisa1.get(0.75))).toBe(true);
    expect(y2[1][0].equals(monalisa1.get(0.25))).toBe(true);
  });

  it('test error on unknown rangescale', () => {
    expect(() => monalisa1.get(0.5, 'foo' as any)).toThrow();
  });

  it('tests concatenation', () => {
    const l1 = monalisa.length;
    const l2 = monalisa.concat(monalisa).length;
    expect(l2).toBe(2 * l1);
  });
});

describe('Standalone function exports and Oxford spelling aliases', () => {
  it('supports standalone get(), getinverse(), and resample()', () => {
    const c1 = get(monalisa, 0.5);
    expect(c1.equals(monalisa.get(0.5))).toBe(true);

    const inv = getinverse(monalisa, monalisa.colors[0]);
    expect(inv).toBeCloseTo(0.0, 2);

    const res = resample(turbo, 10);
    expect(res.length).toBe(10);
  });

  it('supports Oxford spelling aliases (ColourScheme, colourschemes, etc.)', () => {
    expect(ColourScheme).toBe(ColorScheme);
    expect(colourschemes).toBe(colorschemes);
    expect(findcolourscheme).toBe(findColorScheme);
    expect(loadcolourscheme).toBeDefined();

    const category = new ColourSchemeCategory('test');
    expect(category.name).toBe('test');
    expect(category instanceof ColorSchemeCategory).toBe(true);
  });
});

describe('Full parity dataset checks', () => {
  it('registers schemes in global catalog', () => {
    expect(colorschemes['nord']).toBe(nord);
    expect(colorschemes['viridis']).toBeDefined();
    expect(colorschemes['fastie']).toBe(fastie);
    expect(Object.keys(colorschemes).length).toBeGreaterThan(1500);
  });

  it('verifies full parity length of fastie palette (256 colors)', () => {
    expect(fastie.length).toBe(256);
  });
});
