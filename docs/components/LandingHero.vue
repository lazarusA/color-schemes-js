<template>
  <section class="hero-container">
    <!-- Glowing background ambient light -->
    <div class="glow-orb glow-1"></div>
    <div class="glow-orb glow-2"></div>

    <div class="hero-grid">
      <!-- Left Column: Hero Content & CTAs -->
      <div class="hero-left">
        <!-- Badge linking to Julia's ColorSchemes.jl -->
        <a 
          href="https://github.com/JuliaGraphics/ColorSchemes.jl" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="badge"
          title="Visit Julia's ColorSchemes.jl repository"
        >
          <span class="badge-icon">⚡</span>
          <span class="badge-text">JS/TS Port of Julia's <strong class="badge-highlight"> ColorSchemes.jl</strong> ↗</span>
        </a>

        <!-- Main Headline -->
        <h1 class="hero-title">
          <span class="nowrap">Perceptually Uniform</span> <span class="gradient-text">Color Schemes</span> <span class="nowrap">for JS & TS</span>
        </h1>

        <!-- Subtitle -->
        <p class="hero-description">
          1,150+ scientifically calibrated colormaps, artistic masterwork palettes, and continuous interpolation algorithms for WebGL, Three.js, and HTML5 Canvas.
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
          <div class="install-pill" @click="copyCommand" title="Click to copy command">
            <span class="prompt">$</span>
            <code class="install-code">npm i color-schemes-js</code>
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
      </div>

      <!-- Right Column: Interactive Live Demo -->
      <div class="hero-right">
        <div class="hero-live-example">
          <div class="live-card-header">
            <div class="card-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <span class="live-card-title">Live Interpolation Sandbox</span>
          </div>

          <div class="live-code-block">
            <div class="live-code-line">
              <span class="kw">import</span> { <span class="fn">get</span>, <span class="obj">colorschemes</span> } <span class="kw">from</span> <span class="str">'color-schemes-js'</span>;
            </div>
            <div class="live-code-line">
              <span class="kw">const</span> color = <span class="fn">get</span>(<span class="obj">colorschemes.viridis</span>, <span class="val">{{ sampleT.toFixed(2) }}</span>);
            </div>
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
  padding: 5.5rem 1.5rem 4.5rem;
  overflow: hidden;
  max-width: 1280px;
  margin: 0 auto;
}

@media (min-width: 992px) {
  .hero-container {
    padding: 6.5rem 1.5rem 5.5rem;
  }
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.22;
  pointer-events: none;
}

.glow-1 {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, #6366f1, #a855f7);
  top: -120px;
  left: 30%;
  transform: translateX(-50%);
}

.glow-2 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, #06b6d4, #3b82f6);
  top: 100px;
  right: 10%;
}

.hero-grid {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: flex-start;
  z-index: 1;
  text-align: center;
}

@media (min-width: 992px) {
  .hero-grid {
    grid-template-columns: 1.2fr 0.95fr;
    text-align: left;
    gap: 3rem;
  }
}

.hero-left {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (min-width: 992px) {
  .hero-left {
    align-items: flex-start;
  }
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1.1rem;
  border-radius: 9999px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.28);
  backdrop-filter: blur(8px);
  margin-bottom: 1.25rem;
  text-decoration: none;
  transition: all 0.25s ease;
}

.badge:hover {
  background: rgba(99, 102, 241, 0.18);
  border-color: rgba(99, 102, 241, 0.5);
  transform: translateY(-1px);
}

.badge-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ui-color-primary-500, #818cf8);
}

.badge-highlight {
  color: var(--ui-text-highlighted, #f8fafc);
  font-weight: 700;
}

/* Main Headline */
.hero-title {
  font-size: clamp(1.9rem, 5.2vw, 3rem);
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.02em;
  margin-bottom: 1.15rem;
  color: var(--ui-text-highlighted, currentColor);
  max-width: 100%;
  overflow-wrap: anywhere;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: clamp(2.35rem, 4vw, 3rem);
  }
}

.gradient-text {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
}

.nowrap {
  white-space: nowrap;
}

@media (max-width: 767px) {
  .hero-title {
    font-size: clamp(1.8rem, 7vw, 2.4rem);
  }

  .gradient-text,
  .nowrap {
    white-space: normal;
  }
}

.hero-description {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--ui-text-muted, currentColor);
  max-width: 100%;
  margin: 0 0 2rem;
}

/* CTAs */
.cta-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  width: 100%;
}

@media (min-width: 992px) {
  .cta-group {
    justify-content: flex-start;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.35rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.95rem;
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
  width: 1.15rem;
  height: 1.15rem;
}

.install-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 1.15rem;
  background: var(--ui-bg-elevated, rgba(15, 23, 42, 0.8));
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
  border-radius: 0.75rem;
  cursor: pointer;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
  color: var(--ui-color-primary-500, #38bdf8);
  transition: all 0.2s ease;
  max-width: 100%;
  flex-wrap: wrap;
}

.install-pill code {
  overflow-wrap: anywhere;
}

.install-code {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
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

/* Right Column: Live Demo Card */
.hero-right {
  width: 100%;
  min-width: 0;
  display: flex;
  justify-content: center;
  align-self: flex-start;
}

@media (min-width: 992px) {
  .hero-right {
    justify-content: flex-end;
    margin-top: 0.25rem;
  }
}

.hero-live-example {
  width: min(100%, 530px);
  max-width: 100%;
  padding: 1.25rem 1.35rem;
  background: var(--ui-bg-elevated, rgba(15, 23, 42, 0.85));
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
  border-radius: 1.1rem;
  backdrop-filter: blur(16px);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.35);
  text-align: left;
}

@media (max-width: 767px) {
  .hero-live-example {
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: none;
    backdrop-filter: none;
  }

  .live-card-header {
    display: none;
  }

  .live-code-block {
    padding: 0.75rem 0;
    margin-bottom: 0.85rem;
    background: transparent;
    border: none;
  }

  .live-code-line {
    white-space: pre-wrap;
    overflow-x: visible;
    overflow-wrap: anywhere;
    margin-left: 0.5rem;
    text-indent: -0.5rem;
  }

  .live-sample-row {
    padding: 0;
  }
}

.live-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.85rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.card-dots {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.red { background-color: #ff5f56; }
.dot.yellow { background-color: #ffbd2e; }
.dot.green { background-color: #27c93f; }

.live-card-title {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--ui-text-dimmed, #94a3b8);
}

.live-code-block {
  background: var(--ui-bg-code);
  padding: 0.85rem 1.1rem;
  border-radius: 0.65rem;
  margin-bottom: 1.1rem;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.815rem;
  line-height: 1.6;
  border: 1px solid var(--ui-border);
}

.live-code-line {
  color: var(--ui-text-highlighted, currentColor);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  min-width: 0;
  margin-left: 0.35rem;
  text-indent: -0.35rem;
}

.kw { color: #f472b6; font-weight: 600; }
.fn { color: #38bdf8; }
.obj { color: #818cf8; }
.str {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}
.val { color: #fbbf24; font-weight: 700; }

.live-sample-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.35rem 0.25rem 0.1rem;
  flex-wrap: wrap;
}

.live-color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  flex-shrink: 0;
  transition: background-color 0.1s ease;
}

.live-hex-badge {
  font-family: ui-monospace, monospace;
  font-size: 0.825rem;
  font-weight: 700;
  color: var(--ui-text-highlighted, currentColor);
  min-width: 64px;
  flex-shrink: 0;
}

.live-slider {
  flex: 1;
  min-width: 0;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(15, 23, 42, 0.2);
  outline: none;
  cursor: pointer;
}

.live-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #f8fafc;
  border: 2px solid rgba(15, 23, 42, 0.75);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.15s ease;
}

.live-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

