<template>
  <div class="canvas-demo-card">
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

      <span class="demo-badge">HTML5 Canvas 2D Engine</span>
    </div>

    <!-- Tab 1: Live Preview -->
    <div v-show="activeTab === 'preview'" class="preview-container">
      <!-- Toolbar Controls -->
      <div class="controls-toolbar">
        <div class="pill-group">
          <button 
            class="pill-btn" 
            :class="{ active: demoType === 'heatmap' }"
            @click="demoType = 'heatmap'"
          >
            2D Heatmap Surface
          </button>
          <button 
            class="pill-btn" 
            :class="{ active: demoType === 'barchart' }"
            @click="demoType = 'barchart'"
          >
            Categorical Bar Chart
          </button>
        </div>

        <div class="scheme-select-group">
          <label for="canvas-scheme-select" class="select-label">Scheme:</label>
          <select id="canvas-scheme-select" v-model="selectedSchemeName" class="scheme-select">
            <option v-for="name in schemeOptions" :key="name" :value="name">
              {{ name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Live Canvas Render Box -->
      <div class="canvas-viewport">
        <canvas ref="mainCanvas" class="demo-canvas" width="700" height="280"></canvas>
      </div>
    </div>

    <!-- Tab 2: Code View -->
    <div v-show="activeTab === 'code'" class="code-container">
      <div class="code-header font-mono">
        <span>canvas-2d-rendering.ts</span>
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
import { colorschemes, get, resample, findColorScheme } from 'color-schemes-js'

const activeTab = ref('preview')
const demoType = ref('heatmap') // 'heatmap' | 'barchart'
const selectedSchemeName = ref('viridis')
const copied = ref(false)

const mainCanvas = ref(null)

const schemeOptions = [
  'viridis',
  'inferno',
  'plasma',
  'magma',
  'thermal',
  'haline',
  'tableau_10',
  'leonardo',
  'dracula',
  'Purples_5',
  'Spectral_5'
]

// Active scheme computed
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
  return colorschemes.viridis
})

function renderCanvas() {
  if (!mainCanvas.value || !activeScheme.value) return
  const canvas = mainCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height
  const scheme = activeScheme.value

  ctx.clearRect(0, 0, width, height)

  if (demoType.value === 'heatmap') {
    // 1. Render 2D Wave Heatmap Surface
    const imgData = ctx.createImageData(width, height)
    const data = imgData.data

    for (let y = 0; y < height; y++) {
      const ny = (y / height) * 4 - 2
      for (let x = 0; x < width; x++) {
        const nx = (x / width) * 6 - 3
        // Mathematical wave function: sin(nx*2) * cos(ny*2) + sin(nx+ny)
        const val = (Math.sin(nx * 2.2) * Math.cos(ny * 2.2) + Math.sin(nx + ny) + 2) / 4
        const normT = Math.max(0, Math.min(1, val))
        
        const color = get(scheme, normT)
        const idx = (y * width + x) * 4

        data[idx]     = Math.round(color.r * 255)
        data[idx + 1] = Math.round(color.g * 255)
        data[idx + 2] = Math.round(color.b * 255)
        data[idx + 3] = 255
      }
    }
    ctx.putImageData(imgData, 0, 0)
  } else {
    // 2. Render Categorical Bar Chart
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, width, height)

    const catScheme = resample(scheme, 8)
    const barCount = 8
    const barGap = 16
    const barWidth = (width - 60 - (barCount - 1) * barGap) / barCount
    const heights = [0.65, 0.85, 0.45, 0.95, 0.70, 0.55, 0.80, 0.40]

    heights.forEach((hFactor, i) => {
      const x = 30 + i * (barWidth + barGap)
      const bHeight = (height - 80) * hFactor
      const y = height - 40 - bHeight

      const color = catScheme.colors[i]
      const cssColor = typeof color?.toCss === 'function' ? color.toCss() : '#818cf8'

      // Draw shadow + bar
      ctx.fillStyle = cssColor
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, bHeight, 6)
      ctx.fill()

      // Draw value badge text
      ctx.fillStyle = '#94a3b8'
      ctx.font = '600 12px ui-monospace, monospace'
      ctx.textAlign = 'center'
      ctx.fillText(`${Math.round(hFactor * 100)}%`, x + barWidth / 2, y - 10)

      // Draw bar label
      ctx.fillStyle = '#f8fafc'
      ctx.fillText(`Cat ${i + 1}`, x + barWidth / 2, height - 18)
    })
  }
}

watch([selectedSchemeName, demoType], () => {
  renderCanvas()
})

onMounted(() => {
  renderCanvas()
})

const codeSnippetText = computed(() => {
  if (demoType.value === 'heatmap') {
    return `import { colorschemes, get } from 'color-schemes-js';

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const scheme = colorschemes.${selectedSchemeName.value};

const imgData = ctx.createImageData(canvas.width, canvas.height);
const data = imgData.data;

for (let y = 0; y < canvas.height; y++) {
  for (let x = 0; x < canvas.width; x++) {
    // 1. Calculate normalized value t ∈ [0.0, 1.0]
    const t = calculateNormalizedValue(x, y);
    
    // 2. Sample color continuously
    const color = get(scheme, t);
    const idx = (y * canvas.width + x) * 4;

    data[idx]     = Math.round(color.r * 255);
    data[idx + 1] = Math.round(color.g * 255);
    data[idx + 2] = Math.round(color.b * 255);
    data[idx + 3] = 255;
  }
}

ctx.putImageData(imgData, 0, 0);`
  }

  return `import { colorschemes, resample } from 'color-schemes-js';

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// 1. Resample scheme for 8 categorical data series
const scheme = colorschemes.${selectedSchemeName.value};
const catScheme = resample(scheme, 8);

// 2. Render chart bars with discrete palette colors
dataSeries.forEach((value, index) => {
  const color = catScheme.colors[index];
  ctx.fillStyle = color.toCss();
  ctx.fillRect(xPosition, yPosition, barWidth, barHeight);
});`
})

function copyCode() {
  navigator.clipboard.writeText(codeSnippetText.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<style scoped>
.canvas-demo-card {
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
  background: var(--ui-bg-accented);
  border-bottom: 1px solid var(--ui-border);
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
  color: var(--ui-text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-toggle-btn:hover {
  color: var(--ui-text-highlighted);
}

.tab-toggle-btn.active {
  background: var(--ui-primary);
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
  font-family: 'JetBrains Mono', monospace;
  color: var(--ui-color-primary-500);
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
  margin-bottom: 1.5rem;
}

.pill-group {
  display: inline-flex;
  gap: 0.3rem;
  padding: 0.25rem;
  background: var(--ui-bg-accented);
  border: 1px solid var(--ui-border);
  border-radius: 0.65rem;
}

.pill-btn {
  padding: 0.35rem 0.75rem;
  border: none;
  background: transparent;
  color: var(--ui-text-muted);
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 0.45rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pill-btn.active {
  background: var(--ui-primary);
  color: #ffffff;
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
  color: var(--ui-text-muted);
}

.scheme-select {
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-border);
  border-radius: 0.45rem;
  color: var(--ui-text-highlighted);
  font-family: 'JetBrains Mono', monospace;
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
