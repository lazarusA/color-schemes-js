<template>
  <div class="image-demo-card">
    <!-- Top Tab Bar: Preview vs Code -->
    <div class="card-tab-header">
      <div class="tab-buttons">
        <button 
          class="tab-toggle-btn" 
          :class="{ active: activeTab === 'preview' }"
          @click="activeTab = 'preview'"
        >
          <svg class="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </button>
        <button 
          class="tab-toggle-btn" 
          :class="{ active: activeTab === 'code' }"
          @click="activeTab = 'code'"
        >
          <svg class="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Code
        </button>
      </div>

      <span class="demo-badge">Pixel Data Processing Engine</span>
    </div>

    <!-- Tab 1: Live Preview -->
    <div v-show="activeTab === 'preview'" class="preview-container">
      <!-- Toolbar Controls -->
      <div class="controls-toolbar">
        <div class="pill-group">
          <button 
            class="pill-btn" 
            :class="{ active: demoMode === 'fractal' }"
            @click="demoMode = 'fractal'"
          >
            Julia Set Fractal
          </button>
          <button 
            class="pill-btn" 
            :class="{ active: demoMode === 'elevation' }"
            @click="demoMode = 'elevation'"
          >
            False-Color Elevation Map
          </button>
        </div>

        <div class="scheme-select-group">
          <label for="img-scheme-select" class="select-label">Scheme:</label>
          <select id="img-scheme-select" v-model="selectedSchemeName" class="scheme-select">
            <option v-for="name in schemeOptions" :key="name" :value="name">
              {{ name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Live Canvas Viewport -->
      <div class="canvas-viewport">
        <canvas ref="imageCanvas" class="demo-canvas" width="680" height="300"></canvas>
      </div>

      <!-- Parameter Sliders -->
      <div class="params-bar">
        <div v-if="demoMode === 'fractal'" class="param-slider-group">
          <label class="slider-label">Julia Parameter (cRe): {{ cRe.toFixed(2) }}</label>
          <input type="range" min="-1" max="1" step="0.01" v-model.number="cRe" class="param-slider" />
        </div>
        <div v-if="demoMode === 'fractal'" class="param-slider-group">
          <label class="slider-label">Julia Parameter (cIm): {{ cIm.toFixed(2) }}</label>
          <input type="range" min="-1" max="1" step="0.01" v-model.number="cIm" class="param-slider" />
        </div>
        <div v-if="demoMode === 'elevation'" class="param-slider-group full-width">
          <label class="slider-label">Contour Sharpness: {{ sharpness }}</label>
          <input type="range" min="1" max="10" step="1" v-model.number="sharpness" class="param-slider" />
        </div>
      </div>
    </div>

    <!-- Tab 2: Code View -->
    <div v-show="activeTab === 'code'" class="code-container">
      <div class="code-header font-mono">
        <span>image-processing.ts</span>
        <button class="copy-code-btn" @click="copyCode">
          {{ copied ? 'Copied!' : 'Copy Code' }}
        </button>
      </div>

      <pre class="code-block"><code>{{ codeSnippetText }}</code></pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { colorschemes, get, findColorScheme } from 'color-schemes-js'

const activeTab = ref('preview')
const demoMode = ref('fractal') // 'fractal' | 'elevation'
const selectedSchemeName = ref('vermeer')
const copied = ref(false)

const cRe = ref(-0.4)
const cIm = ref(0.6)
const sharpness = ref(4)

const imageCanvas = ref(null)

const schemeOptions = [
  'vermeer',
  'viridis',
  'inferno',
  'plasma',
  'magma',
  'thermal',
  'haline',
  'leonardo',
  'dracula',
  'tableau_10'
]

// Active scheme lookup with fallback
const activeScheme = computed(() => {
  if (!colorschemes) return null
  const name = selectedSchemeName.value
  if (colorschemes[name]) return colorschemes[name]
  
  if (typeof findColorScheme === 'function') {
    const searchResults = findColorScheme(name)
    if (searchResults && searchResults.length > 0) {
      return searchResults[0].scheme
    }
  }
  return colorschemes.vermeer || colorschemes.viridis
})

function renderImage() {
  if (!imageCanvas.value || !activeScheme.value) return
  const canvas = imageCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height
  const scheme = activeScheme.value

  const imgData = ctx.createImageData(width, height)
  const data = imgData.data

  if (demoMode.value === 'fractal') {
    // 1. Render Procedural Julia Set Fractal
    const maxIter = 80
    const cre = cRe.value
    const cim = cIm.value

    for (let y = 0; y < height; y++) {
      const zy0 = (y / height) * 2.4 - 1.2
      for (let x = 0; x < width; x++) {
        const zx0 = (x / width) * 3.6 - 1.8

        let zx = zx0
        let zy = zy0
        let iter = 0

        while (zx * zx + zy * zy < 4 && iter < maxIter) {
          const tmp = zx * zx - zy * zy + cre
          zy = 2 * zx * zy + cim
          zx = tmp
          iter++
        }

        const t = iter === maxIter ? 0 : iter / maxIter
        const color = get(scheme, t)

        const idx = (y * width + x) * 4
        data[idx]     = Math.round(color.r * 255)
        data[idx + 1] = Math.round(color.g * 255)
        data[idx + 2] = Math.round(color.b * 255)
        data[idx + 3] = 255
      }
    }
  } else {
    // 2. Render False-Color Elevation Map
    const k = sharpness.value
    for (let y = 0; y < height; y++) {
      const ny = y / height
      for (let x = 0; x < width; x++) {
        const nx = x / width
        
        // Multi-frequency Perlin-like elevation heightfield
        let elevation = (Math.sin(nx * 8) * Math.cos(ny * 8) + 
                         Math.sin(nx * 18 + ny * 14) * 0.5 + 1.5) / 3.0

        // Apply sharpness contour quantization option
        if (k > 1) {
          elevation = Math.floor(elevation * k) / k
        }

        const t = Math.max(0, Math.min(1, elevation))
        const color = get(scheme, t)

        const idx = (y * width + x) * 4
        data[idx]     = Math.round(color.r * 255)
        data[idx + 1] = Math.round(color.g * 255)
        data[idx + 2] = Math.round(color.b * 255)
        data[idx + 3] = 255
      }
    }
  }

  ctx.putImageData(imgData, 0, 0)
}

watch([selectedSchemeName, demoMode, cRe, cIm, sharpness], () => {
  renderImage()
})

onMounted(() => {
  renderImage()
})

const codeSnippetText = computed(() => {
  if (demoMode.value === 'fractal') {
    return `import { colorschemes, get } from 'color-schemes-js';

function drawJuliaFractal(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;
  const scheme = colorschemes.${selectedSchemeName.value};

  const cRe = ${cRe.value};
  const cIm = ${cIm.value};
  const maxIter = 80;

  for (let y = 0; y < height; y++) {
    const zy0 = (y / height) * 2.4 - 1.2;
    for (let x = 0; x < width; x++) {
      const zx0 = (x / width) * 3.6 - 1.8;

      let zx = zx0, zy = zy0, iter = 0;
      while (zx * zx + zy * zy < 4 && iter < maxIter) {
        const tmp = zx * zx - zy * zy + cRe;
        zy = 2 * zx * zy + cIm;
        zx = tmp;
        iter++;
      }

      // Continuous colormap index t ∈ [0.0, 1.0]
      const t = iter / maxIter;
      const color = get(scheme, t);

      const idx = (y * width + x) * 4;
      data[idx]     = Math.round(color.r * 255);
      data[idx + 1] = Math.round(color.g * 255);
      data[idx + 2] = Math.round(color.b * 255);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}`
  }

  return `import { colorschemes, get } from 'color-schemes-js';

// False-color map elevation matrix with colormap
function generateFalseColorElevation(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;
  const scheme = colorschemes.${selectedSchemeName.value};

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const elevation = getElevationValue(x, y); // Normalized t ∈ [0.0, 1.0]
      const color = get(scheme, elevation);

      const idx = (y * width + x) * 4;
      data[idx]     = Math.round(color.r * 255);
      data[idx + 1] = Math.round(color.g * 255);
      data[idx + 2] = Math.round(color.b * 255);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}`
})

function copyCode() {
  navigator.clipboard.writeText(codeSnippetText.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<style scoped>
.image-demo-card {
  max-width: 820px;
  margin: 2rem auto;
  background: var(--ui-bg-elevated, rgba(15, 23, 42, 0.75));
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
  border-radius: 1.25rem;
  backdrop-filter: blur(16px);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.card-tab-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid var(--ui-border, rgba(255, 255, 255, 0.08));
}

.tab-buttons {
  display: flex;
  gap: 0.4rem;
}

.tab-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.85rem;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  background: transparent;
  color: var(--ui-text-muted, currentColor);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-toggle-btn:hover {
  color: var(--ui-text-highlighted, currentColor);
}

.tab-toggle-btn.active {
  background: #6366f1;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
}

.tab-icon {
  width: 0.95rem;
  height: 0.95rem;
}

.demo-badge {
  font-size: 0.75rem;
  font-weight: 700;
  font-family: ui-monospace, monospace;
  color: var(--ui-color-primary-500, #38bdf8);
}

.preview-container {
  padding: 1.5rem;
}

.controls-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.pill-group {
  display: inline-flex;
  gap: 0.3rem;
  padding: 0.25rem;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.1));
  border-radius: 0.65rem;
}

.pill-btn {
  padding: 0.35rem 0.75rem;
  border: none;
  background: transparent;
  color: var(--ui-text-muted, currentColor);
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 0.45rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pill-btn.active {
  background: rgba(129, 140, 248, 0.2);
  color: #818cf8;
  border: 1px solid rgba(129, 140, 248, 0.3);
  font-weight: 700;
}

.scheme-select-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.select-label {
  font-size: 0.825rem;
  font-weight: 600;
  color: var(--ui-text-muted, currentColor);
}

.scheme-select {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.2));
  border-radius: 0.45rem;
  color: var(--ui-text-highlighted, currentColor);
  font-family: ui-monospace, monospace;
  font-size: 0.825rem;
  padding: 0.3rem 0.6rem;
  outline: none;
  cursor: pointer;
}

.canvas-viewport {
  width: 100%;
  border-radius: 1rem;
  border: 1px solid var(--ui-border);
  overflow: hidden;
  background: var(--ui-bg-code);
}

.demo-canvas {
  width: 100%;
  height: auto;
  display: block;
}

.params-bar {
  margin-top: 1.25rem;
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.param-slider-group {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.6rem 0.85rem;
  background: var(--ui-bg-accented);
  border: 1px solid var(--ui-border);
  border-radius: 0.65rem;
}

.param-slider-group.full-width {
  flex: 100%;
}

.slider-label {
  font-size: 0.775rem;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  color: var(--ui-text-highlighted);
}

.param-slider {
  accent-color: var(--ui-primary);
  cursor: pointer;
}

.code-container {
  padding: 1.25rem;
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.825rem;
  color: var(--ui-text-muted);
  margin-bottom: 0.75rem;
}

.copy-code-btn {
  background: var(--ui-bg-accented);
  border: 1px solid var(--ui-border);
  color: var(--ui-text-highlighted);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-code-btn:hover {
  border-color: var(--ui-primary);
  color: var(--ui-primary);
}

.code-block {
  margin: 0;
  padding: 1.25rem;
  background: var(--ui-bg-code);
  border: 1px solid var(--ui-border);
  border-radius: 0.75rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  line-height: 1.55;
  color: var(--ui-text-code);
  overflow-x: auto;
}
</style>
