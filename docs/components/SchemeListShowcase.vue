<template>
  <div class="scheme-showcase-container">
    <!-- Search / Count header if category -->
    <div v-if="category" class="category-meta-bar font-mono">
      <span class="meta-count">Found {{ allCategorySchemes.length }} colormaps in <strong>{{ category }}</strong></span>
    </div>

    <!-- Scheme Cards Grid -->
    <div class="scheme-list-grid">
      <div 
        v-for="name in visibleSchemes" 
        :key="name"
        class="scheme-card"
        @click="copyName(name)"
        :title="`Click to copy '${name}'`"
      >
        <div class="card-header font-mono">
          <span class="scheme-title">{{ name }}</span>
          <span v-if="copiedName === name" class="copied-toast">Copied!</span>
          <svg v-else class="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>

        <!-- Live Gradient Bar -->
        <div class="gradient-bar-container">
          <div class="gradient-bar" :style="{ background: getGradientCss(name) }"></div>
        </div>
      </div>
    </div>

    <!-- Load More / Expand Button -->
    <div v-if="hasMore" class="show-more-row">
      <button class="show-more-btn" @click="isExpanded = !isExpanded">
        {{ isExpanded ? 'Show Less' : `Show All ${allCategorySchemes.length} Colormaps ↓` }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { colorschemes, get, findColorScheme } from 'color-schemes-js'

const props = defineProps({
  schemes: {
    type: [Array, String],
    default: () => []
  },
  category: {
    type: String,
    default: ''
  },
  limit: {
    type: Number,
    default: 12
  }
})

const copiedName = ref('')
const isExpanded = ref(false)

const allCategorySchemes = computed(() => {
  // Programmatically find all schemes in category
  if (props.category && colorschemes) {
    const q = props.category.toLowerCase().trim()
    const matched = []

    for (const [name, scheme] of Object.entries(colorschemes)) {
      const cat = (scheme.category || '').toLowerCase()
      const notes = (scheme.notes || '').toLowerCase()
      const nLower = name.toLowerCase()

      if (
        cat === q ||
        cat.includes(q) ||
        nLower.startsWith(q) ||
        (q === 'cvd' && (cat.includes('cvd') || notes.includes('cvd') || nLower.startsWith('tol_') || nLower.startsWith('okabe'))) ||
        (q === 'tableau' && (cat.includes('tableau') || nLower.startsWith('tableau'))) ||
        (q === 'matplotlib' && (cat.includes('matplotlib') || ['viridis', 'inferno', 'plasma', 'magma', 'cividis', 'twilight'].includes(name))) ||
        (q === 'artistic' && (cat.includes('artistic') || cat.includes('metbrewer') || cat.includes('ghibli') || cat.includes('wes') || cat.includes('sanzo') || nLower.startsWith('vermeer') || nLower.startsWith('klimt') || nLower.startsWith('hiroshige') || nLower.startsWith('monalisa'))) ||
        (q === 'themes' && (cat.includes('theme') || cat.includes('nord') || cat.includes('catppuccin') || nLower.includes('catppuccin') || nLower.includes('nord') || nLower.includes('dracula'))) ||
        (q === 'flags' && (cat.includes('flag') || nLower.startsWith('flag_')))
      ) {
        matched.push(name)
      }
    }
    if (matched.length > 0) return matched
  }

  // Fallback to explicit schemes prop
  let list = []
  if (Array.isArray(props.schemes)) {
    list = props.schemes
  } else if (typeof props.schemes === 'string') {
    const cleanStr = props.schemes.replace(/[\[\]'"]/g, '')
    list = cleanStr.split(',').map(s => s.trim()).filter(Boolean)
  }
  return list.map(s => String(s).replace(/[\[\]'"]/g, '').trim()).filter(Boolean)
})

const visibleSchemes = computed(() => {
  if (isExpanded.value || !props.limit || allCategorySchemes.value.length <= props.limit) {
    return allCategorySchemes.value
  }
  return allCategorySchemes.value.slice(0, props.limit)
})

const hasMore = computed(() => {
  return allCategorySchemes.value.length > props.limit
})

function getScheme(name) {
  if (!colorschemes || !name) return null
  const cleanName = String(name).replace(/[\[\]'"]/g, '').trim()
  if (colorschemes[cleanName]) return colorschemes[cleanName]
  
  try {
    if (typeof findColorScheme === 'function') {
      const escaped = cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const res = findColorScheme(escaped)
      if (res && res.length > 0) return res[0].scheme
    }
  } catch (e) {
    // Fallback
  }
  return colorschemes.viridis
}

function getGradientCss(name) {
  const scheme = getScheme(name)
  if (!scheme) return 'linear-gradient(to right, #440154, #fde725)'
  const stops = []
  const steps = 16
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const c = get(scheme, t)
    const css = typeof c?.toCss === 'function' ? c.toCss() : '#000000'
    stops.push(`${css} ${(t * 100).toFixed(1)}%`)
  }
  return `linear-gradient(to right, ${stops.join(', ')})`
}

function copyName(name) {
  navigator.clipboard.writeText(name)
  copiedName.value = name
  setTimeout(() => {
    copiedName.value = ''
  }, 2000)
}
</script>

<style scoped>
.scheme-showcase-container {
  margin: 1.25rem 0 2.5rem;
}

.category-meta-bar {
  font-size: 0.8rem;
  color: var(--ui-text-muted, currentColor);
  margin-bottom: 0.75rem;
}

.meta-count strong {
  color: #818cf8;
}

.scheme-list-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 0.85rem;
}

@media (min-width: 640px) {
  .scheme-list-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .scheme-list-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.scheme-card {
  padding: 0.85rem 1rem;
  background: var(--ui-bg-elevated, rgba(15, 23, 42, 0.75));
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.1));
  border-radius: 0.75rem;
  backdrop-filter: blur(12px);
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.6rem;
  min-width: 0;
}

.scheme-card:hover {
  transform: translateY(-2px);
  border-color: #818cf8;
  box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.2);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.825rem;
  font-weight: 700;
  color: var(--ui-text-highlighted, currentColor);
  min-width: 0;
}

.scheme-title {
  word-break: break-word;
  overflow-wrap: anywhere;
  line-height: 1.35;
  flex: 1;
  min-width: 0;
}

.copy-icon {
  width: 0.85rem;
  height: 0.85rem;
  color: var(--ui-text-muted, currentColor);
  opacity: 0.6;
  flex-shrink: 0;
  margin-top: 2px;
  transition: opacity 0.2s ease;
}

.scheme-card:hover .copy-icon {
  opacity: 1;
  color: #818cf8;
}

.copied-toast {
  font-size: 0.75rem;
  color: #34d399;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 2px;
}

.gradient-bar-container {
  height: 1.25rem;
  border-radius: 0.375rem;
  padding: 1.5px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.08));
}

.gradient-bar {
  width: 100%;
  height: 100%;
  border-radius: 0.25rem;
}

.show-more-row {
  margin-top: 1rem;
  text-align: center;
}

.show-more-btn {
  padding: 0.45rem 1.25rem;
  border-radius: 9999px;
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.15));
  background: rgba(99, 102, 241, 0.1);
  color: #818cf8;
  font-size: 0.825rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.show-more-btn:hover {
  background: #6366f1;
  color: #ffffff;
  border-color: #6366f1;
}
</style>
