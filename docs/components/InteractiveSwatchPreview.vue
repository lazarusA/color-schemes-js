<template>
  <div class="interactive-preview-card">
    <div class="card-header">
      <h2 class="title">Explore & Sample Color Schemes</h2>
      <p class="subtitle">Choose a scheme category, toggle continuous or discrete sampling mode, test reverse ordering and analytical alpha transparency live.</p>
    </div>

    <!-- Category Tabs -->
    <div class="category-tabs">
      <button 
        v-for="cat in Object.keys(categoryMap)" 
        :key="cat"
        class="tab-btn"
        :class="{ active: currentCategory === cat }"
        @click="selectCategory(cat)"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Scheme Selector Pills -->
    <div class="scheme-selector">
      <button 
        v-for="sName in categoryMap[currentCategory]" 
        :key="sName"
        class="scheme-pill"
        :class="{ active: currentSchemeName === sName }"
        @click="currentSchemeName = sName"
      >
        {{ sName }}
      </button>
    </div>

    <!-- Controls Row: Scheme Metadata, Discrete Steps (n), Alpha Opacity & Reverse (rev) -->
    <div v-if="activeScheme" class="meta-controls-row">
      <div class="scheme-meta-info">
        <span class="meta-item">
          <strong>Category:</strong> {{ activeScheme.category || 'General' }}
        </span>
        <span class="meta-item">
          <strong>Original Size:</strong> {{ activeScheme.colors.length }} colors
        </span>
      </div>

      <!-- Mode Selector & Controls Group -->
      <div class="controls-right-group">
        <!-- Alpha Opacity Mode Selector -->
        <div class="alpha-input-group" title="Alpha opacity transparency mode">
          <label for="alpha-mode-select" class="alpha-label">Alpha (α):</label>
          <select id="alpha-mode-select" v-model="alphaMode" class="alpha-select-input">
            <option value="constant">Scalar ({{ alphaValue.toFixed(2) }})</option>
            <option value="abs_centered">Vector: abs(2t - 1)</option>
            <option value="abs_linear">Vector: abs(t)</option>
          </select>
          
          <input 
            v-if="alphaMode === 'constant'"
            id="alpha-range-input"
            type="range" 
            min="0.1" 
            max="1.0" 
            step="0.05" 
            v-model.number="alphaValue" 
            class="alpha-slider-input"
            aria-label="Alpha opacity slider"
          />
        </div>

        <!-- Reverse (rev) Toggle Button -->
        <button 
          class="rev-toggle-btn" 
          :class="{ active: isReversed }"
          @click="isReversed = !isReversed"
          title="Reverse color palette order"
        >
          <svg class="rev-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          Reverse (rev)
        </button>

        <!-- Discrete Steps (n) Input -->
        <div v-if="mode === 'discrete'" class="n-input-group">
          <label for="discrete-n-input" class="n-label">Steps (n):</label>
          <input 
            id="discrete-n-input"
            type="number" 
            min="2" 
            max="50" 
            v-model.number="discreteN" 
            class="n-number-input"
            aria-label="Number of discrete steps"
          />
        </div>

        <!-- Mode Toggle Switch: Continuous vs Discrete -->
        <div class="mode-toggle">
          <button 
            class="mode-btn" 
            :class="{ active: mode === 'continuous' }"
            @click="mode = 'continuous'"
          >
            <svg class="mode-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Continuous
          </button>
          <button 
            class="mode-btn" 
            :class="{ active: mode === 'discrete' }"
            @click="mode = 'discrete'"
          >
            <svg class="mode-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Discrete (n)
          </button>
        </div>
      </div>
    </div>

    <!-- Main Swatch Gradient Display with integrated drag marker slider -->
    <div class="swatch-container">
      <div class="swatch-gradient" :style="{ background: gradientCss }"></div>
      
      <!-- Sampling Pointer marker on the gradient bar -->
      <div 
        class="sampling-indicator" 
        :style="{ left: `${indicatorLeftPosition}%`, backgroundColor: sampledCssColor }"
      >
        <div class="indicator-tooltip">{{ tooltipText }}</div>
      </div>

      <!-- Overlay transparent range slider covering the gradient bar -->
      <input 
        id="t-range-preview"
        type="range" 
        min="0" 
        max="1" 
        step="0.001" 
        v-model.number="tValue"
        class="swatch-overlay-slider"
        aria-label="Sampling position slider"
      />
    </div>

    <!-- Scheme Notes Box below colorbar -->
    <div v-if="activeScheme" class="scheme-notes-bar">
      <p class="notes-text">
        <span class="notes-label">Notes:</span> {{ activeScheme.notes || 'No description notes available for this palette.' }}
        <span v-if="isReversed" class="rev-badge-inline">(Reversed)</span>
        <span v-if="alphaMode === 'constant' && alphaValue < 1.0" class="alpha-badge-inline">(Alpha: {{ alphaValue.toFixed(2) }})</span>
        <span v-if="alphaMode === 'abs_centered'" class="alpha-badge-inline">(Alpha Vector: abs(2t - 1))</span>
        <span v-if="alphaMode === 'abs_linear'" class="alpha-badge-inline">(Alpha Vector: abs(t))</span>
      </p>
    </div>

    <!-- Live Extracted Color Output -->
    <div class="output-panel">
      <div class="color-sample-box" :style="{ backgroundColor: sampledCssColor }"></div>
      
      <div class="color-specs">
        <div class="code-line" v-if="mode === 'continuous'">
          <template v-if="alphaMode === 'abs_centered'">
            <span class="func">resample</span>(<span class="param">colorschemes.{{ currentSchemeName }}</span><span v-if="isReversed">.<span class="func">reverse</span>()</span>, <span class="val">100</span>, <span class="param">(t) =&gt; Math.abs(2*t - 1)</span>)
          </template>
          <template v-else-if="alphaMode === 'abs_linear'">
            <span class="func">resample</span>(<span class="param">colorschemes.{{ currentSchemeName }}</span><span v-if="isReversed">.<span class="func">reverse</span>()</span>, <span class="val">100</span>, <span class="param">(t) =&gt; Math.abs(t)</span>)
          </template>
          <template v-else-if="alphaValue < 1.0">
            <span class="func">resample</span>(<span class="param">colorschemes.{{ currentSchemeName }}</span><span v-if="isReversed">.<span class="func">reverse</span>()</span>, <span class="val">100</span>, <span class="param">() =&gt; {{ alphaValue.toFixed(2) }}</span>)
          </template>
          <template v-else>
            <span class="func">get</span>(<span class="param">colorschemes.{{ currentSchemeName }}</span><span v-if="isReversed">.<span class="func">reverse</span>()</span>, <span class="val">{{ (tValue).toFixed(2) }}</span>)
          </template>
        </div>
        <div class="code-line" v-else>
          <template v-if="alphaMode === 'abs_centered'">
            <span class="func">resample</span>(<span class="param">colorschemes.{{ currentSchemeName }}</span><span v-if="isReversed">.<span class="func">reverse</span>()</span>, <span class="val">{{ validDiscreteN }}</span>, <span class="param">(t) =&gt; Math.abs(2*t - 1)</span>).<span class="prop">colors</span>[<span class="val">{{ discreteIndex }}</span>]
          </template>
          <template v-else-if="alphaMode === 'abs_linear'">
            <span class="func">resample</span>(<span class="param">colorschemes.{{ currentSchemeName }}</span><span v-if="isReversed">.<span class="func">reverse</span>()</span>, <span class="val">{{ validDiscreteN }}</span>, <span class="param">(t) =&gt; Math.abs(t)</span>).<span class="prop">colors</span>[<span class="val">{{ discreteIndex }}</span>]
          </template>
          <template v-else-if="alphaValue < 1.0">
            <span class="func">resample</span>(<span class="param">colorschemes.{{ currentSchemeName }}</span><span v-if="isReversed">.<span class="func">reverse</span>()</span>, <span class="val">{{ validDiscreteN }}</span>, <span class="param">() =&gt; {{ alphaValue.toFixed(2) }}</span>).<span class="prop">colors</span>[<span class="val">{{ discreteIndex }}</span>]
          </template>
          <template v-else>
            <span class="func">resample</span>(<span class="param">colorschemes.{{ currentSchemeName }}</span><span v-if="isReversed">.<span class="func">reverse</span>()</span>, <span class="val">{{ validDiscreteN }}</span>).<span class="prop">colors</span>[<span class="val">{{ discreteIndex }}</span>]
          </template>
        </div>

        <div class="values-row">
          <button class="value-chip" @click="copy(sampledHex)" title="Copy HEX">
            <span class="label">HEX:</span> <code>{{ sampledHex }}</code>
          </button>
          <button class="value-chip" @click="copy(sampledRgbStr)" title="Copy RGBA">
            <span class="label">CSS:</span> <code>{{ sampledRgbStr }}</code>
          </button>
          <span class="mode-badge">{{ mode === 'continuous' ? 'Continuous Mode' : `Step ${discreteIndex + 1} of ${validDiscreteN}` }}</span>
          <span v-if="isReversed" class="rev-badge">rev</span>
          <span v-if="alphaMode === 'abs_centered'" class="alpha-chip">α abs(2t-1)</span>
          <span v-else-if="alphaMode === 'abs_linear'" class="alpha-chip">α abs(t)</span>
          <span v-else-if="alphaValue < 1.0" class="alpha-chip">α {{ alphaValue.toFixed(2) }}</span>
          <span v-if="copiedText" class="copied-badge">Copied!</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { colorschemes, get, resample } from 'color-schemes'

const copiedText = ref(false)
const tValue = ref(0.5)
const mode = ref('continuous') // 'continuous' | 'discrete'
const discreteN = ref(6)
const isReversed = ref(false)
const alphaMode = ref('constant') // 'constant' | 'abs_centered' | 'abs_linear'
const alphaValue = ref(1.0)

// Defined categories mapped to live scheme names in `colorschemes`
const categoryMap = {
  'Scientific': ['viridis', 'inferno', 'plasma', 'magma', 'cividis', 'tokyo', 'devon', 'hawaii', 'buda'],
  'Oceanography': ['cmocean_thermal', 'cmocean_haline', 'cmocean_deep', 'cmocean_algae', 'cmocean_solar', 'cmocean_ice'],
  'ColorBrewer': ['Purples_5', 'Blues_5', 'Greens_5', 'Oranges_5', 'Spectral_5', 'RdYlBu_5', 'BrBG_5'],
  'Masterpieces': ['leonardo', 'vermeer', 'picasso', 'monalisa', 'klimt', 'degas', 'hiroshige'],
  'Seaborn & Modern': ['seaborn_rocket', 'seaborn_mako', 'seaborn_icefire_gradient', 'tableau_10', 'dracula']
}

const currentCategory = ref('Scientific')
const currentSchemeName = ref('viridis')

function selectCategory(cat) {
  currentCategory.value = cat
  currentSchemeName.value = categoryMap[cat][0]
}

const rawScheme = computed(() => {
  if (!colorschemes) return null
  return colorschemes[currentSchemeName.value] || colorschemes.viridis
})

// Current alpha function based on mode
const currentAlphaFn = computed(() => {
  if (alphaMode.value === 'abs_centered') {
    return (t) => Math.abs(2 * t - 1)
  }
  if (alphaMode.value === 'abs_linear') {
    return (t) => Math.abs(t)
  }
  return () => alphaValue.value
})

// Processed active scheme with reverse and alpha function applied
const activeScheme = computed(() => {
  if (!rawScheme.value) return null
  let scheme = isReversed.value ? rawScheme.value.reverse() : rawScheme.value
  const stepsCount = mode.value === 'continuous' ? 64 : scheme.colors.length
  return resample(scheme, stepsCount, currentAlphaFn.value)
})

// Ensure discreteN is bounded between 2 and 50
const validDiscreteN = computed(() => {
  const n = Number(discreteN.value)
  if (isNaN(n) || n < 2) return 2
  if (n > 50) return 50
  return Math.round(n)
})

// Update discreteN when changing active scheme
watch(currentSchemeName, () => {
  if (rawScheme.value) {
    const len = rawScheme.value.colors.length
    discreteN.value = len <= 20 ? len : 8
  }
}, { immediate: true })

// Active resampled discrete scheme for discrete mode
const activeDiscreteScheme = computed(() => {
  if (!rawScheme.value) return null
  try {
    let scheme = isReversed.value ? rawScheme.value.reverse() : rawScheme.value
    return resample(scheme, validDiscreteN.value, currentAlphaFn.value)
  } catch (e) {
    return rawScheme.value
  }
})

// Active colors: continuous uses activeScheme colors; discrete uses resampled colors
const activeColors = computed(() => {
  const scheme = mode.value === 'continuous' ? activeScheme.value : activeDiscreteScheme.value
  if (!scheme) return []
  return scheme.colors.map(c => typeof c?.toCss === 'function' ? c.toCss() : c)
})

// Calculate discrete step index based on tValue and validDiscreteN
const discreteIndex = computed(() => {
  const n = validDiscreteN.value
  if (n <= 1) return 0
  const idx = Math.floor(tValue.value * n)
  return Math.min(n - 1, Math.max(0, idx))
})

// Indicator position: continuous follows tValue directly; discrete snaps to cell center
const indicatorLeftPosition = computed(() => {
  if (mode.value === 'continuous') {
    return tValue.value * 100
  }
  const n = validDiscreteN.value
  if (n <= 1) return 50
  const stepWidth = 100 / n
  return (discreteIndex.value + 0.5) * stepWidth
})

const tooltipText = computed(() => {
  if (mode.value === 'continuous') {
    return `t = ${tValue.value.toFixed(2)}`
  }
  return `Step ${discreteIndex.value + 1} / ${validDiscreteN.value}`
})

// Gradient CSS: smooth linear gradient for continuous, sharp stepped gradient for discrete
const gradientCss = computed(() => {
  const colors = activeColors.value
  if (!colors.length) return '#1e293b'

  if (mode.value === 'continuous') {
    return `linear-gradient(to right, ${colors.join(', ')})`
  }

  // Stepped discrete gradient for n steps
  const n = colors.length
  const stops = []
  const stepPct = 100 / n
  for (let i = 0; i < n; i++) {
    const start = (i * stepPct).toFixed(2)
    const end = ((i + 1) * stepPct).toFixed(2)
    stops.push(`${colors[i]} ${start}%, ${colors[i]} ${end}%`)
  }
  return `linear-gradient(to right, ${stops.join(', ')})`
})

const sampledColorObj = computed(() => {
  if (!rawScheme.value) return null
  try {
    let baseScheme = isReversed.value ? rawScheme.value.reverse() : rawScheme.value
    let col = null
    if (mode.value === 'continuous') {
      col = get(baseScheme, tValue.value)
      const currentT = tValue.value
      const alphaVal = currentAlphaFn.value(currentT)
      if (typeof col.withAlpha === 'function') {
        col = col.withAlpha(alphaVal)
      }
    } else {
      col = activeDiscreteScheme.value ? activeDiscreteScheme.value.colors[discreteIndex.value] : null
    }
    return col
  } catch (e) {
    return null
  }
})

const sampledHex = computed(() => {
  if (!sampledColorObj.value) return '#21918c'
  return typeof sampledColorObj.value.toHex === 'function' 
    ? sampledColorObj.value.toHex(true) 
    : '#21918c'
})

const sampledRgbStr = computed(() => {
  if (!sampledColorObj.value) return 'rgb(33, 145, 140)'
  return typeof sampledColorObj.value.toCss === 'function' 
    ? sampledColorObj.value.toCss() 
    : 'rgb(33, 145, 140)'
})

const sampledCssColor = computed(() => sampledRgbStr.value)

function copy(text) {
  navigator.clipboard.writeText(text)
  copiedText.value = true
  setTimeout(() => { copiedText.value = false }, 2000)
}
</script>

<style scoped>
.interactive-preview-card {
  max-width: 860px;
  margin: 2rem auto 4rem;
  padding: 2.25rem;
  background: var(--ui-bg-elevated, rgba(15, 23, 42, 0.75));
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
  border-radius: 1.25rem;
  backdrop-filter: blur(16px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--ui-text-highlighted, currentColor);
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 0.95rem;
  color: var(--ui-text-muted, currentColor);
  margin: 0;
}

.category-tabs {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.tab-btn {
  padding: 0.4rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.1));
  background: var(--ui-bg, rgba(255, 255, 255, 0.03));
  color: var(--ui-text-muted, currentColor);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: var(--ui-bg-accented, rgba(255, 255, 255, 0.08));
  color: var(--ui-text-highlighted, currentColor);
}

.tab-btn.active {
  background: #6366f1;
  border-color: #6366f1;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.scheme-selector {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.5rem;
}

.scheme-pill {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.08));
  background: rgba(0, 0, 0, 0.2);
  color: var(--ui-text-muted, currentColor);
  font-size: 0.8rem;
  font-family: ui-monospace, monospace;
  cursor: pointer;
  transition: all 0.2s ease;
}

.scheme-pill:hover {
  border-color: #818cf8;
  color: var(--ui-text-highlighted, currentColor);
}

.scheme-pill.active {
  background: rgba(129, 140, 248, 0.2);
  border-color: #818cf8;
  color: #818cf8;
  font-weight: 700;
}

.meta-controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0.25rem;
}

.scheme-meta-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.825rem;
  color: var(--ui-text-muted, currentColor);
}

.controls-right-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.alpha-input-group {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.6rem;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
  border-radius: 0.65rem;
}

.alpha-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ui-text-highlighted, currentColor);
}

.alpha-select-input {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.2));
  border-radius: 0.375rem;
  color: #38bdf8;
  font-family: ui-monospace, monospace;
  font-size: 0.775rem;
  font-weight: 600;
  padding: 0.15rem 0.4rem;
  outline: none;
  cursor: pointer;
}

.alpha-slider-input {
  appearance: none;
  width: 60px;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  cursor: pointer;
}

.alpha-slider-input::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #38bdf8;
  border: 1.5px solid #ffffff;
  cursor: pointer;
}

.rev-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
  border-radius: 0.65rem;
  color: var(--ui-text-muted, currentColor);
  font-size: 0.775rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rev-toggle-btn:hover {
  color: var(--ui-text-highlighted, currentColor);
  border-color: #f43f5e;
}

.rev-toggle-btn.active {
  background: rgba(244, 63, 94, 0.15);
  border-color: #f43f5e;
  color: #fb7185;
}

.rev-icon {
  width: 0.85rem;
  height: 0.85rem;
}

.n-input-group {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.6rem;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
  border-radius: 0.65rem;
}

.n-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ui-text-highlighted, currentColor);
}

.n-number-input {
  width: 52px;
  padding: 0.15rem 0.35rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.2));
  border-radius: 0.375rem;
  color: #fbbf24;
  font-family: ui-monospace, monospace;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: center;
  outline: none;
}

.n-number-input:focus {
  border-color: #818cf8;
  box-shadow: 0 0 6px rgba(129, 140, 248, 0.4);
}

.mode-toggle {
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.25rem;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.1));
  border-radius: 0.65rem;
}

.mode-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border: none;
  background: transparent;
  color: var(--ui-text-muted, currentColor);
  font-size: 0.775rem;
  font-weight: 600;
  border-radius: 0.45rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-btn:hover {
  color: var(--ui-text-highlighted, currentColor);
}

.mode-btn.active {
  background: #6366f1;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
}

.mode-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.swatch-container {
  position: relative;
  height: 48px;
  border-radius: 0.75rem;
  overflow: visible;
  margin-bottom: 1.5rem;
  background-image: 
    linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%), 
    linear-gradient(-45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.15) 75%), 
    linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.15) 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
}

.swatch-gradient {
  width: 100%;
  height: 100%;
  border-radius: 0.75rem;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
  transition: background 0.2s ease;
}

.sampling-indicator {
  position: absolute;
  top: -6px;
  width: 18px;
  height: 60px;
  border-radius: 8px;
  border: 2.5px solid #ffffff;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.6);
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 4;
  transition: left 0.05s ease-out;
}

.indicator-tooltip {
  position: absolute;
  top: -26px;
  left: 50%;
  transform: translateX(-50%);
  background: #0f172a;
  border: 1px solid rgba(255,255,255,0.25);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.swatch-overlay-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 5;
  margin: 0;
}

.scheme-notes-bar {
  margin-bottom: 1.75rem;
  padding: 0.65rem 1rem;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.08));
  border-radius: 0.65rem;
}

.notes-text {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.45;
  color: var(--ui-text-muted, currentColor);
}

.notes-label {
  font-weight: 700;
  color: var(--ui-text-highlighted, currentColor);
  margin-right: 0.25rem;
}

.rev-badge-inline {
  margin-left: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fb7185;
}

.alpha-badge-inline {
  margin-left: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #38bdf8;
}

.output-panel {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.08));
  border-radius: 0.875rem;
}

.color-sample-box {
  width: 54px;
  height: 54px;
  border-radius: 0.65rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: background-color 0.1s ease;
  background-image: 
    linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%), 
    linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.2) 75%), 
    linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.2) 75%);
  background-size: 12px 12px;
  background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
}

.color-specs {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.code-line {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.875rem;
  color: var(--ui-text-highlighted, currentColor);
  line-height: 1.4;
  overflow-x: auto;
}

.func { color: #f472b6; font-weight: 600; }
.param { color: #38bdf8; }
.prop { color: #c084fc; font-weight: 600; }
.val { color: #fbbf24; font-weight: 700; }

.values-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  flex-wrap: wrap;
}

.value-chip {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.1));
  color: var(--ui-text-muted, currentColor);
  padding: 0.25rem 0.65rem;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.value-chip:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--ui-text-highlighted, currentColor);
  border-color: #818cf8;
}

.value-chip .label {
  font-weight: 700;
  margin-right: 0.25rem;
  color: var(--ui-text-highlighted, currentColor);
}

.mode-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: #818cf8;
  background: rgba(129, 140, 248, 0.12);
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(129, 140, 248, 0.25);
}

.rev-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #fb7185;
  background: rgba(244, 63, 94, 0.12);
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(244, 63, 94, 0.25);
}

.alpha-chip {
  font-size: 0.75rem;
  font-weight: 700;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(56, 189, 248, 0.25);
}

.copied-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #4ade80;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
