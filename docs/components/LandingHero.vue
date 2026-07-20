<template>
  <section class="hero-container">
    <!-- Glowing background ambient light -->
    <div class="glow-orb glow-1"></div>
    <div class="glow-orb glow-2"></div>

    <div class="hero-content">
      <!-- Badge -->
      <div class="badge">
        <span class="badge-icon">✨</span>
        <span class="badge-text">1,150+ Curated Palettes • Zero Dependencies</span>
      </div>

      <!-- Main Headline -->
      <h1 class="hero-title">
        Perceptually Uniform <br />
        <span class="gradient-text">Color Schemes</span> for JS & TS
      </h1>

      <!-- Subtitle -->
      <p class="hero-description">
        Scientifically calibrated colormaps, artistic masterwork palettes, and continuous interpolation algorithms designed for data visualization, WebGL shaders, Three.js, and canvas applications.
      </p>

      <!-- Action CTAs -->
      <div class="cta-group">
        <NuxtLink to="/guide/basics" class="btn btn-primary">
          <span>Get Started</span>
          <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>

        <NuxtLink to="/guide/catalogue" class="btn btn-secondary">
          Explore Catalogue
        </NuxtLink>

        <!-- Command Pill -->
        <div class="install-pill" @click="copyCommand">
          <span class="prompt">$</span>
          <code>npm install color-schemes-js</code>
          <button class="copy-btn" aria-label="Copy Command">
            <svg v-if="!copied" class="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg v-else class="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <span v-if="copied" class="toast-tooltip">Copied!</span>
        </div>
      </div>

      <!-- Simple Live Package Example -->
      <div class="hero-live-example">
        <div class="live-code-line">
          <span class="kw">import</span> { <span class="fn">get</span>, <span class="obj">colorschemes</span> } <span class="kw">from</span> <span class="str">'color-schemes-js'</span>;
          <br />
          <span class="fn">get</span>(<span class="obj">colorschemes.viridis</span>, <span class="val">{{ sampleT.toFixed(2) }}</span>)
        </div>
        <div class="live-sample-row">
          <div class="live-color-swatch" :style="{ backgroundColor: sampledColor }"></div>
          <span class="live-hex-badge">{{ sampledHex }}</span>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            v-model.number="sampleT" 
            class="live-slider"
            aria-label="Interpolation position"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { colorschemes, get } from 'color-schemes-js'

const copied = ref(false)
const sampleT = ref(0.5)

const sampledColor = computed(() => {
  try {
    const scheme = colorschemes?.viridis
    if (!scheme) return '#21918c'
    const color = get(scheme, sampleT.value)
    return typeof color?.toCss === 'function' ? color.toCss() : '#21918c'
  } catch (e) {
    return '#21918c'
  }
})

const sampledHex = computed(() => {
  try {
    const scheme = colorschemes?.viridis
    if (!scheme) return '#21918c'
    const color = get(scheme, sampleT.value)
    return typeof color?.toHex === 'function' ? color.toHex() : '#21918c'
  } catch (e) {
    return '#21918c'
  }
})

function copyCommand() {
  navigator.clipboard.writeText('npm install color-schemes-js')
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<style scoped>
.hero-container {
  position: relative;
  padding: 5rem 1.5rem 4rem;
  overflow: hidden;
  text-align: center;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.25;
  pointer-events: none;
}

.glow-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #6366f1, #a855f7);
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
}

.glow-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #06b6d4, #3b82f6);
  top: 150px;
  left: 20%;
}

.hero-content {
  position: relative;
  max-width: 960px;
  margin: 0 auto;
  z-index: 1;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.25);
  backdrop-filter: blur(8px);
  margin-bottom: 1.5rem;
}

.badge-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ui-color-primary-500, #818cf8);
}

.hero-title {
  font-size: 3.25rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 1.25rem;
  color: var(--ui-text-highlighted, currentColor);
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 4rem;
  }
}

.gradient-text {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-description {
  font-size: 1.15rem;
  line-height: 1.6;
  color: var(--ui-text-muted, currentColor);
  max-width: 720px;
  margin: 0 auto 2.5rem;
}

.cta-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #ffffff;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(99, 102, 241, 0.5);
}

.btn-secondary {
  background: var(--ui-bg-elevated, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.15));
  color: var(--ui-text-highlighted, currentColor);
}

.btn-secondary:hover {
  background: var(--ui-bg-accented, rgba(255, 255, 255, 0.1));
  border-color: var(--ui-border-accented, rgba(255, 255, 255, 0.3));
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.install-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1.25rem;
  background: var(--ui-bg-elevated, rgba(15, 23, 42, 0.8));
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
  border-radius: 0.75rem;
  cursor: pointer;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.9rem;
  color: var(--ui-color-primary-500, #38bdf8);
  transition: all 0.2s ease;
}

.install-pill:hover {
  border-color: var(--ui-color-primary-500, #38bdf8);
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
}

.prompt {
  color: var(--ui-text-dimmed, #64748b);
  user-select: none;
}

.copy-btn {
  background: none;
  border: none;
  color: var(--ui-text-muted, #94a3b8);
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
}

.copy-icon, .check-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.check-icon {
  color: #4ade80;
}

.toast-tooltip {
  position: absolute;
  top: -2.25rem;
  right: 0.5rem;
  background: #22c55e;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  animation: fadeIn 0.2s ease;
}



.hero-live-example {
  max-width: 520px;
  margin: 0 auto 2.5rem;
  padding: 1rem 1.25rem;
  background: var(--ui-bg-elevated, rgba(15, 23, 42, 0.75));
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
  border-radius: 0.875rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.live-code-line {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
  color: var(--ui-text-highlighted, currentColor);
  line-height: 1.5;
}

.kw { color: #f472b6; font-weight: 600; }
.fn { color: #38bdf8; }
.obj { color: #818cf8; }
.str { color: #4ade80; }
.val { color: #fbbf24; font-weight: 700; }

.live-sample-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.live-color-swatch {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.1s ease;
}

.live-hex-badge {
  font-family: ui-monospace, monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--ui-text-highlighted, currentColor);
  min-width: 64px;
}

.live-slider {
  flex: 1;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.15);
  outline: none;
  cursor: pointer;
}

.live-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #6366f1;
  border: 2px solid #ffffff;
  cursor: pointer;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
