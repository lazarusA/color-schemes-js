<template>
  <div class="catalogue-search-card">
    <div class="search-card-header">
      <div class="search-title-row">
        <span class="search-badge font-mono">🔍 Instant Search</span>
        <span class="search-sub">Explore 1,150+ colormaps by name, category, or domain</span>
      </div>

      <!-- Main Glowing Search Input -->
      <div class="search-input-wrapper">
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          type="text"
          v-model="searchQuery"
          placeholder="Type a scheme name or keyword (e.g. viridis, ocean, blue, cvd)..."
          class="search-input font-mono"
        />
        <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''" aria-label="Clear Search">
          ✕
        </button>
      </div>

      <!-- Quick Search Chips -->
      <div class="search-chips-row">
        <span class="chips-label">Popular:</span>
        <button 
          v-for="chip in popularChips" 
          :key="chip"
          class="chip-btn"
          @click="searchQuery = chip"
        >
          {{ chip }}
        </button>
      </div>
    </div>

    <!-- Live Matches Section -->
    <div v-if="searchQuery.trim()" class="search-results-section">
      <div class="results-header font-mono">
        <span v-if="searchResults.length > 0">
          Showing <strong>{{ visibleMatches.length }}</strong> of <strong>{{ searchResults.length }}</strong> matches for "{{ searchQuery }}"
        </span>
        <span v-else class="no-results">
          No colormaps found for "{{ searchQuery }}". Try searching "ocean", "blue", "viridis", or "cvd".
        </span>
      </div>

      <!-- Results Grid -->
      <div v-if="visibleMatches.length > 0" class="results-grid">
        <div 
          v-for="item in visibleMatches" 
          :key="item.name"
          class="result-card"
          @click="copyName(item.name)"
          :title="`Click to copy '${item.name}'`"
        >
          <div class="card-top font-mono">
            <span class="scheme-title">{{ item.name }}</span>
            <span v-if="copiedName === item.name" class="copied-toast">Copied!</span>
            <span v-else-if="item.scheme.category" class="category-badge">{{ item.scheme.category }}</span>
          </div>

          <div class="gradient-bar-container">
            <div class="gradient-bar" :style="{ background: getGradientCss(item.scheme) }"></div>
          </div>
        </div>
      </div>

      <!-- Show All / Show Less toggle -->
      <div v-if="searchResults.length > PREVIEW_COUNT" class="show-more-row">
        <button class="show-more-btn" @click="showAll = !showAll">
          <span v-if="hasMoreResults">Show all {{ searchResults.length }} results ↓</span>
          <span v-else>Show less ↑</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { colorschemes, get, findColorScheme } from 'color-schemes'

const searchQuery = ref('')
const copiedName = ref('')
const showAll = ref(false)

const PREVIEW_COUNT = 12

const popularChips = ['viridis', 'inferno', 'ocean', 'cmocean', 'cvd', 'tableau', 'dracula']

const searchResults = computed(() => {
  const q = searchQuery.value.trim()
  if (!q) return []
  if (typeof findColorScheme === 'function') {
    return findColorScheme(q)
  }

  // Manual fallback search
  const qLower = q.toLowerCase()
  const results = []
  for (const [name, scheme] of Object.entries(colorschemes || {})) {
    if (
      name.toLowerCase().includes(qLower) ||
      (scheme.category && scheme.category.toLowerCase().includes(qLower)) ||
      (scheme.notes && scheme.notes.toLowerCase().includes(qLower))
    ) {
      results.push({ name, scheme })
    }
  }
  return results
})

const visibleMatches = computed(() => {
  if (showAll.value) return searchResults.value
  return searchResults.value.slice(0, PREVIEW_COUNT)
})

const hasMoreResults = computed(() => searchResults.value.length > PREVIEW_COUNT && !showAll.value)

// Reset showAll whenever the query changes
watch(() => searchQuery.value, () => { showAll.value = false })

function getGradientCss(scheme) {
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
.catalogue-search-card {
  margin: 2rem 0 3rem;
  background: var(--ui-bg-elevated, rgba(15, 23, 42, 0.75));
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 1.25rem;
  backdrop-filter: blur(16px);
  box-shadow: 0 15px 35px -5px rgba(99, 102, 241, 0.15);
  overflow: hidden;
  padding: 1.5rem;
}

.search-card-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.search-badge {
  font-size: 0.825rem;
  font-weight: 800;
  color: #818cf8;
  background: rgba(99, 102, 241, 0.15);
  padding: 0.25rem 0.65rem;
  border-radius: 0.45rem;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.search-sub {
  font-size: 0.875rem;
  color: var(--ui-text-muted, #94a3b8);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  width: 1.25rem;
  height: 1.25rem;
  color: #818cf8;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 1.05rem 3.25rem 1.05rem 3.5rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1.5px solid rgba(99, 102, 241, 0.35);
  border-radius: 0.85rem;
  color: #ffffff;
  font-size: 0.95rem;
  outline: none;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4);
  transition: all 0.25s ease;
}

.search-input:focus {
  border-color: #6366f1;
  background: rgba(0, 0, 0, 0.6);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.25);
}

.clear-btn {
  position: absolute;
  right: 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #94a3b8;
  font-size: 0.85rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.2);
}

.search-chips-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
  font-size: 0.8rem;
}

.chips-label {
  color: var(--ui-text-muted, #94a3b8);
  font-weight: 600;
  margin-right: 0.25rem;
}

.chip-btn {
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
  background: rgba(255, 255, 255, 0.04);
  color: var(--ui-text-highlighted, #f1f5f9);
  font-size: 0.775rem;
  font-family: ui-monospace, monospace;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: #818cf8;
  color: #818cf8;
}

.search-results-section {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--ui-border, rgba(255, 255, 255, 0.08));
}

.results-header {
  font-size: 0.85rem;
  color: var(--ui-text-muted, currentColor);
  margin-bottom: 1rem;
}

.results-header strong {
  color: #818cf8;
}

.no-results {
  color: #f87171;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 0.85rem;
}

@media (min-width: 640px) {
  .results-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .results-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.result-card {
  padding: 0.85rem 1rem;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
  border-radius: 0.75rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.6rem;
  min-width: 0;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.result-card:hover {
  transform: translateY(-2px);
  border-color: #818cf8;
}

.card-top {
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

.category-badge {
  font-size: 0.7rem;
  padding: 0.1rem 0.45rem;
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  border-radius: 0.35rem;
  border: 1px solid rgba(99, 102, 241, 0.25);
  flex-shrink: 0;
  margin-top: 2px;
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
  margin-top: 1.25rem;
  display: flex;
  justify-content: center;
}

.show-more-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  border: 1px solid rgba(99, 102, 241, 0.4);
  background: rgba(99, 102, 241, 0.1);
  color: #818cf8;
  font-size: 0.825rem;
  font-family: ui-monospace, monospace;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.02em;
}

.show-more-btn:hover {
  background: rgba(99, 102, 241, 0.25);
  border-color: #818cf8;
  color: #c7d2fe;
  transform: translateY(-1px);
}
</style>
