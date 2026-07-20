<template>
  <section class="marquee-section">
    <div class="marquee-header">
      <h2 class="section-title">Built for Modern Visualization</h2>
      <p class="section-subtitle">Precision, performance, and color accuracy engineered for data visualization and 3D graphics.</p>
    </div>

    <!-- Full-width outer wrapper with ambient edge diffusion overlays -->
    <div class="marquee-outer-wrapper">
      <div class="diffusion-edge edge-left"></div>
      <div class="diffusion-edge edge-right"></div>

      <!-- Bidirectional circular scrollable container -->
      <div 
        ref="scrollContainer" 
        class="marquee-scroll-container"
        @scroll="handleScroll"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <div class="marquee-track">
          <NuxtLink 
            v-for="(feature, idx) in triplicatedFeatures" 
            :key="idx" 
            :to="feature.link"
            class="feature-card"
          >
            <div class="card-header-row">
              <h3 class="card-title">{{ feature.title }}</h3>
              <div class="icon-wrapper" :title="feature.title">
                <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="feature.iconSvg"></svg>
              </div>
            </div>
            <p class="card-desc">{{ feature.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const scrollContainer = ref(null)
const isHovered = ref(false)
let animFrameId = null

const features = [
  {
    title: '1,150+ Curated Palettes',
    description: 'Explore scientific, cartographic, statistical, and masterwork artistic colormaps.',
    link: '/guide/catalogue',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />'
  },
  {
    title: 'Perceptually Uniform',
    description: 'Monotonic Lab lightness gradients prevent data distortion and false visual artifacts.',
    link: '/guide/goodpractice',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />'
  },
  {
    title: 'Continuous Interpolation',
    description: 'Sample any scheme continuously or resample into discrete n-step color arrays with alpha.',
    link: '/guide/basics',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />'
  },
  {
    title: 'WebGL & 3D Shaders',
    description: 'Directly generate 1D DataTextures and lookup tables for Three.js and WebGL shaders.',
    link: '/examples/plotting',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />'
  },
  {
    title: 'Colorblind Accessible',
    description: 'CVD-tested safe palettes (Paul Tol, Okabe & Ito) optimized for visual accessibility.',
    link: '/guide/finding',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />'
  },
  {
    title: 'TypeScript Native',
    description: 'Strict TS declarations, zero runtime dependencies, light footprint, and tree-shaking.',
    link: '/reference/functionindex',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />'
  }
]

// Triplicate list for infinite 360 circular scroll in both left and right directions
const triplicatedFeatures = computed(() => [...features, ...features, ...features])

// Bidirectional infinite circular wrap-around scroll listener
function handleScroll() {
  if (!scrollContainer.value) return
  const el = scrollContainer.value
  const singleSetWidth = el.scrollWidth / 3

  // Infinite wrap-around in both directions
  if (el.scrollLeft <= 10) {
    el.scrollLeft += singleSetWidth
  } else if (el.scrollLeft >= 2 * singleSetWidth - 10) {
    el.scrollLeft -= singleSetWidth
  }
}

// Frame-by-frame auto-scroll loop
function autoScrollLoop() {
  if (scrollContainer.value && !isHovered.value) {
    scrollContainer.value.scrollLeft += 0.6
    handleScroll()
  }
  animFrameId = requestAnimationFrame(autoScrollLoop)
}

onMounted(() => {
  if (scrollContainer.value) {
    // Start initial scroll position in middle set
    const singleSetWidth = scrollContainer.value.scrollWidth / 3
    scrollContainer.value.scrollLeft = singleSetWidth
  }
  animFrameId = requestAnimationFrame(autoScrollLoop)
})

onUnmounted(() => {
  if (animFrameId) cancelAnimationFrame(animFrameId)
})
</script>

<style scoped>
.marquee-section {
  width: 100%;
  margin: 4rem 0 5rem;
  overflow: hidden;
}

.marquee-header {
  text-align: center;
  margin-bottom: 2.25rem;
  padding: 0 1.5rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--ui-text-highlighted, currentColor);
  letter-spacing: -0.02em;
  margin-bottom: 0.4rem;
}

.section-subtitle {
  font-size: 0.975rem;
  color: var(--ui-text-muted, currentColor);
  max-width: 600px;
  margin: 0 auto;
}

.marquee-outer-wrapper {
  position: relative;
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  overflow: hidden;
}

.diffusion-edge {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 160px;
  z-index: 10;
  pointer-events: none;
}

.edge-left {
  left: 0;
  background: linear-gradient(to right, var(--ui-bg) 0%, transparent 100%);
}

.edge-right {
  right: 0;
  background: linear-gradient(to left, var(--ui-bg) 0%, transparent 100%);
}

.marquee-scroll-container {
  position: relative;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 1.25rem 0;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
  cursor: grab;
}

.marquee-scroll-container:active {
  cursor: grabbing;
}

.marquee-scroll-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.marquee-track {
  display: flex;
  gap: 1.25rem;
  width: max-content;
}

.feature-card {
  width: 300px;
  height: 140px;
  flex-shrink: 0;
  padding: 1.35rem;
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-border);
  border-radius: 1.15rem;
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 25px -6px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-decoration: none;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: var(--ui-primary);
  box-shadow: 0 20px 35px -8px rgba(99, 102, 241, 0.25);
}

.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--ui-text-highlighted);
  margin: 0;
  line-height: 1.3;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: var(--ui-primary);
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.feature-card:hover .icon-wrapper {
  background: var(--ui-primary);
  color: #ffffff;
  border-color: var(--ui-primary);
  transform: scale(1.08);
}

.feature-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.card-desc {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--ui-text-muted);
  margin: 0;
}
</style>
