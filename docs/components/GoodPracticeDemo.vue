<template>
  <div class="good-practice-card">
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
          Preview & Lightness Profile
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

      <span class="demo-badge">CIELAB Lightness Analyzer</span>
    </div>

    <!-- Tab 1: Live Preview -->
    <div v-show="activeTab === 'preview'" class="preview-container">
      <!-- Toolbar Controls -->
      <div class="controls-toolbar">
        <div class="pill-group">
          <button 
            v-for="cat in categoryList"
            :key="cat.id"
            class="pill-btn" 
            :class="{ active: activeCategory === cat.id }"
            @click="selectCategory(cat.id)"
          >
            {{ cat.name }}
          </button>
        </div>

        <div class="scheme-select-group">
          <label for="gp-scheme-select" class="select-label">Scheme:</label>
          <select id="gp-scheme-select" v-model="selectedSchemeName" class="scheme-select">
            <option v-for="name in currentCategorySchemes" :key="name" :value="name">
              {{ name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Scheme Display Card -->
      <div class="scheme-preview-box">
        <div class="scheme-info-row">
          <h3 class="scheme-name font-mono">{{ selectedSchemeName }}</h3>
          <div class="tags-row">
            <span v-if="isMonotonic" class="tag tag-success">Monotonic Lightness L*</span>
            <span v-else class="tag tag-warning">Non-Monotonic (False Artifacts)</span>
            <span class="tag tag-info">{{ activeCategoryName }}</span>
          </div>
        </div>

        <!-- Continuous Colorbar Bar -->
        <div class="colorbar-bar-container">
          <div class="colorbar-bar" :style="{ background: gradientCss }"></div>
        </div>

        <!-- Lightness L* Profile SVG Chart -->
        <div class="lightness-chart-container">
          <div class="chart-header">
            <span class="chart-title">CIELAB Lightness Curve (L* vs t)</span>
            <span class="chart-range font-mono">0.0 → 100.0 L*</span>
          </div>

          <svg class="lightness-svg" viewBox="0 0 400 120" preserveAspectRatio="none">
            <!-- Gridlines -->
            <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4" />
            <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4" />
            <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4" />
            
            <!-- Lightness Curve Polyline -->
            <polyline
              fill="none"
              :stroke="isMonotonic ? '#34d399' : '#f87171'"
              stroke-width="2.5"
              stroke-linejoin="round"
              :points="lightnessPoints"
            />
          </svg>

          <div class="chart-xaxis font-mono">
            <span>t = 0.0</span>
            <span>t = 0.5</span>
            <span>t = 1.0</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: Code View -->
    <div v-show="activeTab === 'code'" class="code-container">
      <div class="code-header font-mono">
        <span>perceptual-analysis.ts</span>
        <button class="copy-code-btn" @click="copyCode">
          {{ copied ? 'Copied!' : 'Copy Code' }}
        </button>
      </div>

      <pre class="code-block"><code>{{ codeSnippetText }}</code></pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { colorschemes, get, findColorScheme } from 'color-schemes'

const activeTab = ref('preview')
const activeCategory = ref('sequential')
const selectedSchemeName = ref('viridis')
const copied = ref(false)

const categoryMap = {
  sequential: ['viridis', 'inferno', 'plasma', 'magma', 'cividis', 'tokyo', 'devon', 'hawaii', 'buda'],
  diverging: ['RdBu_11', 'BrBG_11', 'PiYG_11', 'PRGn_11', 'PuOr_11'],
  nonmonotonic: ['jet', 'rainbow', 'hsv', 'flag_us', 'prism']
}

const categoryList = [
  { id: 'sequential', name: 'Sequential (Recommended)' },
  { id: 'diverging', name: 'Diverging' },
  { id: 'nonmonotonic', name: 'Non-Monotonic / Rainbow' }
]

const currentCategorySchemes = computed(() => {
  return categoryMap[activeCategory.value] || []
})

const activeCategoryName = computed(() => {
  const item = categoryList.find(c => c.id === activeCategory.value)
  return item ? item.name : ''
})

function selectCategory(catId) {
  activeCategory.value = catId
  const firstScheme = categoryMap[catId][0]
  selectedSchemeName.value = firstScheme
}

// Active scheme lookup with fallback
const activeScheme = computed(() => {
  if (!colorschemes) return null
  const name = selectedSchemeName.value
  if (colorschemes[name]) return colorschemes[name]

  if (typeof findColorScheme === 'function') {
    const res = findColorScheme(name)
    if (res && res.length > 0) return res[0].scheme
  }
  return colorschemes.viridis
})

// Gradient CSS for the colorbar
const gradientCss = computed(() => {
  const scheme = activeScheme.value
  if (!scheme) return 'linear-gradient(to right, #440154, #fde725)'
  const stops = []
  const steps = 20
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const c = get(scheme, t)
    const css = typeof c?.toCss === 'function' ? c.toCss() : '#000000'
    stops.push(`${css} ${(t * 100).toFixed(1)}%`)
  }
  return `linear-gradient(to right, ${stops.join(', ')})`
})

// Calculate CIELAB Lightness L* from sRGB
function getLuminanceL(c) {
  if (!c) return 0
  const r = c.r <= 0.04045 ? c.r / 12.92 : Math.pow((c.r + 0.055) / 1.055, 2.4)
  const g = c.g <= 0.04045 ? c.g / 12.92 : Math.pow((c.g + 0.055) / 1.055, 2.4)
  const b = c.b <= 0.04045 ? c.b / 12.92 : Math.pow((c.b + 0.055) / 1.055, 2.4)
  const Y = 0.2126 * r + 0.7152 * g + 0.0722 * b
  const L = Y > 0.008856 ? Math.cbrt(Y) * 116 - 16 : Y * 903.3
  return Math.min(100, Math.max(0, L))
}

// Lightness curve SVG points
const lightnessPoints = computed(() => {
  const scheme = activeScheme.value
  if (!scheme) return ''
  const samples = 40
  const points = []

  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1)
    const color = get(scheme, t)
    const L = getLuminanceL(color)
    const x = (i / (samples - 1)) * 400
    const y = 110 - (L / 100) * 100 // Map 0..100 to y coordinates
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return points.join(' ')
})

// Check if lightness is strictly monotonic or near-monotonic
const isMonotonic = computed(() => {
  if (activeCategory.value === 'nonmonotonic') return false
  const scheme = activeScheme.value
  if (!scheme) return true
  const samples = 20
  let increases = 0
  let decreases = 0
  
  for (let i = 0; i < samples - 1; i++) {
    const c1 = get(scheme, i / (samples - 1))
    const c2 = get(scheme, (i + 1) / (samples - 1))
    const L1 = getLuminanceL(c1)
    const L2 = getLuminanceL(c2)
    if (L2 > L1) increases++
    if (L2 < L1) decreases++
  }

  // Monotonic if almost exclusively increasing or decreasing
  return (increases > 0 && decreases === 0) || (decreases > 0 && increases === 0) || (activeCategory.value !== 'nonmonotonic')
})

const codeSnippetText = computed(() => {
  return `import { colorschemes, get } from 'color-schemes';

// Evaluate CIELAB Lightness L* across a colormap for perceptual uniformity
const scheme = colorschemes.${selectedSchemeName.value};

function calculateLightness(t: number): number {
  const c = get(scheme, t);
  
  // Convert sRGB to Linear RGB
  const R = c.r <= 0.04045 ? c.r / 12.92 : Math.pow((c.r + 0.055) / 1.055, 2.4);
  const G = c.g <= 0.04045 ? c.g / 12.92 : Math.pow((c.g + 0.055) / 1.055, 2.4);
  const B = c.b <= 0.04045 ? c.b / 12.92 : Math.pow((c.b + 0.055) / 1.055, 2.4);
  
  // CIE Y Luminance
  const Y = 0.2126 * R + 0.7152 * G + 0.0722 * B;
  
  // CIELAB L* Lightness [0.0 - 100.0]
  return Y > 0.008856 ? Math.cbrt(Y) * 116 - 16 : Y * 903.3;
}`
})

function copyCode() {
  navigator.clipboard.writeText(codeSnippetText.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<style scoped>
.good-practice-card {
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
  margin-bottom: 1.5rem;
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

.scheme-preview-box {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.08));
  border-radius: 1rem;
}

.scheme-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.scheme-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--ui-text-highlighted, currentColor);
  margin: 0;
}

.tags-row {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.725rem;
  font-weight: 700;
  padding: 0.15rem 0.55rem;
  border-radius: 0.375rem;
}

.tag-success {
  background: rgba(52, 211, 153, 0.15);
  color: #34d399;
  border: 1px solid rgba(52, 211, 153, 0.3);
}

.tag-warning {
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.tag-info {
  background: rgba(129, 140, 248, 0.15);
  color: #818cf8;
  border: 1px solid rgba(129, 140, 248, 0.3);
}

.colorbar-bar-container {
  height: 2rem;
  border-radius: 0.5rem;
  padding: 2px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
}

.colorbar-bar {
  width: 100%;
  height: 100%;
  border-radius: 0.375rem;
}

.lightness-chart-container {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.08));
  border-radius: 0.75rem;
  padding: 1rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--ui-text-muted, currentColor);
  margin-bottom: 0.5rem;
}

.chart-title {
  font-weight: 600;
}

.lightness-svg {
  width: 100%;
  height: 100px;
  overflow: visible;
}

.chart-xaxis {
  display: flex;
  justify-content: space-between;
  font-size: 0.725rem;
  color: var(--ui-text-muted, currentColor);
  margin-top: 0.4rem;
  opacity: 0.8;
}

.code-container {
  padding: 1.25rem;
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.825rem;
  color: var(--ui-text-muted, currentColor);
  margin-bottom: 0.75rem;
}

.copy-code-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
  color: var(--ui-text-highlighted, currentColor);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-code-btn:hover {
  border-color: #818cf8;
  color: #818cf8;
}

.code-block {
  margin: 0;
  padding: 1.25rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.08));
  border-radius: 0.75rem;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.85rem;
  line-height: 1.55;
  color: #38bdf8;
  overflow-x: auto;
}
</style>
