<template>
  <div class="cube-demo-card">
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

      <span class="demo-badge">Three.js WebGL Renderer</span>
    </div>

    <!-- Tab 1: Live 3D Interactive Preview -->
    <div v-show="activeTab === 'preview'" class="preview-container">
      <!-- Interactive Controls Toolbar -->
      <div class="controls-toolbar">
        <!-- Mode Switcher: Continuous vs Categorical -->
        <div class="pill-group">
          <button 
            class="pill-btn" 
            :class="{ active: colorMode === 'continuous' }"
            @click="colorMode = 'continuous'"
          >
            Continuous Gradient
          </button>
          <button 
            class="pill-btn" 
            :class="{ active: colorMode === 'categorical' }"
            @click="colorMode = 'categorical'"
          >
            Categorical (6 Faces)
          </button>
        </div>

        <!-- Scheme Dropdown -->
        <div class="scheme-select-group">
          <label for="cube-scheme-select" class="select-label">Scheme:</label>
          <select id="cube-scheme-select" v-model="selectedSchemeName" class="scheme-select">
            <option v-for="name in schemeOptions" :key="name" :value="name">
              {{ name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Three.js Canvas Container -->
      <div 
        ref="canvasContainer"
        class="cube-viewport"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
        @touchstart="startTouch"
        @touchmove="onTouch"
        @touchend="stopDrag"
      >
        <div class="viewport-hint">Drag mouse to rotate 3D WebGL Cube</div>
      </div>

      <!-- Continuous Colormap Gradient Bar & Ticks -->
      <div v-if="colorMode === 'continuous'" class="continuous-legend">
        <div class="gradient-bar-wrapper">
          <div class="gradient-bar-fill" :style="{ background: continuousGradientCss }"></div>
        </div>
        
        <div class="continuous-ticks">
          <div v-for="(tick, idx) in continuousTicks" :key="idx" class="tick-item">
            <span class="tick-pos font-mono">t = {{ tick.t }}</span>
            <span class="tick-hex font-mono">{{ tick.hex }}</span>
            <span class="tick-rgb font-mono">{{ tick.rgb }}</span>
          </div>
        </div>
      </div>

      <!-- Categorical 6-Face HEX & RGB Legend -->
      <div v-if="colorMode === 'categorical'" class="categorical-legend">
        <div 
          v-for="(item, idx) in categoricalColors" 
          :key="idx" 
          class="legend-item"
        >
          <div class="legend-swatch" :style="{ backgroundColor: item.css }"></div>
          <div class="legend-info">
            <span class="legend-face">{{ item.face }}</span>
            <span class="legend-hex font-mono">{{ item.hex }}</span>
            <span class="legend-rgb font-mono">{{ item.rgb }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: Code Snippet -->
    <div v-show="activeTab === 'code'" class="code-container">
      <div class="code-header font-mono">
        <span>threejs-cube-mapping.ts</span>
        <button class="copy-code-btn" @click="copyCode">
          {{ copied ? 'Copied!' : 'Copy Code' }}
        </button>
      </div>

      <pre class="code-block"><code>{{ codeSnippetText }}</code></pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { colorschemes, get, resample, findColorScheme } from 'color-schemes-js'

const activeTab = ref('preview')
const colorMode = ref('continuous') // 'continuous' | 'categorical'
const selectedSchemeName = ref('viridis')
const copied = ref(false)

const canvasContainer = ref(null)

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

// Three.js instances
let renderer = null
let scene = null
let camera = null
let cube = null
let animFrameId = null

// Mouse drag state
const isDragging = ref(false)
let lastMouseX = 0
let lastMouseY = 0

// Active scheme computed with lookup fallback
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

// Continuous Colormap Gradient CSS
const continuousGradientCss = computed(() => {
  const scheme = activeScheme.value
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
})

// Continuous Colormap Ticks (t = 0.0, 0.5, 1.0)
const continuousTicks = computed(() => {
  const scheme = activeScheme.value
  if (!scheme) return []
  return [0.0, 0.5, 1.0].map(t => {
    const color = get(scheme, t)
    const hex = typeof color?.toHex === 'function' ? color.toHex() : ''
    const r = Math.round(color.r * 255)
    const g = Math.round(color.g * 255)
    const b = Math.round(color.b * 255)
    return {
      t: t.toFixed(1),
      hex,
      rgb: `rgb(${r}, ${g}, ${b})`
    }
  })
})

// Computed categorical colors array with face labels, hex, and rgb
const categoricalColors = computed(() => {
  const scheme = activeScheme.value
  if (!scheme) return []
  const res = resample(scheme, 6)
  return res.colors.map((c, idx) => {
    const hex = typeof c?.toHex === 'function' ? c.toHex() : ''
    const css = typeof c?.toCss === 'function' ? c.toCss() : ''
    const r = Math.round(c.r * 255)
    const g = Math.round(c.g * 255)
    const b = Math.round(c.b * 255)
    return {
      face: `Face ${idx + 1}`,
      hex,
      css,
      rgb: `rgb(${r}, ${g}, ${b})`
    }
  })
})

// Directly update Three.js cube materials
function updateCubeMaterials() {
  if (!cube || !activeScheme.value) return

  const scheme = activeScheme.value

  if (colorMode.value === 'categorical') {
    // Create 6 discrete MeshStandardMaterial instances for 6 faces
    const faceColors = resample(scheme, 6).colors
    const materials = faceColors.map(c => new THREE.MeshStandardMaterial({
      color: new THREE.Color(c.r, c.g, c.b),
      roughness: 0.35,
      metalness: 0.1
    }))
    
    // Dispose previous materials/textures to prevent memory leaks
    if (Array.isArray(cube.material)) {
      cube.material.forEach(m => {
        if (m.map) m.map.dispose()
        m.dispose()
      })
    } else if (cube.material) {
      if (cube.material.map) cube.material.map.dispose()
      cube.material.dispose()
    }

    cube.material = materials
  } else {
    // Create 1D continuous gradient texture for Three.js material map
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 1
    const ctx = canvas.getContext('2d')

    for (let i = 0; i < 256; i++) {
      const c = get(scheme, i / 255)
      const r = Math.round(c.r * 255)
      const g = Math.round(c.g * 255)
      const b = Math.round(c.b * 255)
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      ctx.fillRect(i, 0, 1, 1)
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    if (Array.isArray(cube.material)) {
      cube.material.forEach(m => {
        if (m.map) m.map.dispose()
        m.dispose()
      })
    } else if (cube.material) {
      if (cube.material.map) cube.material.map.dispose()
      cube.material.dispose()
    }

    cube.material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.35,
      metalness: 0.1
    })
  }
}

// Watch for colormap or mode changes to update materials directly
watch([selectedSchemeName, colorMode], () => {
  updateCubeMaterials()
})

function initThreeScene() {
  if (!canvasContainer.value) return

  const width = canvasContainer.value.clientWidth || 600
  const height = canvasContainer.value.clientHeight || 320

  // 1. Scene & Camera
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(0, 0, 5)

  // 2. Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
  scene.add(ambientLight)

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9)
  dirLight1.position.set(5, 5, 7)
  scene.add(dirLight1)

  const dirLight2 = new THREE.DirectionalLight(0x818cf8, 0.4)
  dirLight2.position.set(-5, -5, -5)
  scene.add(dirLight2)

  // 3. Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  canvasContainer.value.appendChild(renderer.domElement)

  // 4. Cube Mesh
  const geometry = new THREE.BoxGeometry(2, 2, 2)
  const initialMaterial = new THREE.MeshStandardMaterial({ color: 0x21918c })
  cube = new THREE.Mesh(geometry, initialMaterial)
  cube.rotation.x = -0.4
  cube.rotation.y = 0.6
  scene.add(cube)

  // Update material to selected scheme
  updateCubeMaterials()

  // 5. Render Animation Loop
  function renderLoop() {
    if (!isDragging.value && cube) {
      cube.rotation.y += 0.006
    }
    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }
    animFrameId = requestAnimationFrame(renderLoop)
  }

  renderLoop()
}

function startDrag(e) {
  isDragging.value = true
  lastMouseX = e.clientX
  lastMouseY = e.clientY
}

function onDrag(e) {
  if (!isDragging.value || !cube) return
  const deltaX = e.clientX - lastMouseX
  const deltaY = e.clientY - lastMouseY
  cube.rotation.y += deltaX * 0.01
  cube.rotation.x += deltaY * 0.01
  lastMouseX = e.clientX
  lastMouseY = e.clientY
}

function stopDrag() {
  isDragging.value = false
}

function startTouch(e) {
  if (e.touches.length === 1) {
    isDragging.value = true
    lastMouseX = e.touches[0].clientX
    lastMouseY = e.touches[0].clientY
  }
}

function onTouch(e) {
  if (!isDragging.value || !cube || e.touches.length !== 1) return
  const deltaX = e.touches[0].clientX - lastMouseX
  const deltaY = e.touches[0].clientY - lastMouseY
  cube.rotation.y += deltaX * 0.01
  cube.rotation.x += deltaY * 0.01
  lastMouseX = e.touches[0].clientX
  lastMouseY = e.touches[0].clientY
}

onMounted(() => {
  initThreeScene()
})

onUnmounted(() => {
  if (animFrameId) cancelAnimationFrame(animFrameId)
  if (renderer && renderer.domElement) {
    renderer.domElement.remove()
    renderer.dispose()
  }
})

const codeSnippetText = computed(() => {
  if (colorMode.value === 'categorical') {
    return `import * as THREE from 'three';
import { colorschemes, resample } from 'color-schemes-js';

// 1. Resample scheme into 6 discrete categorical face colors
const scheme = colorschemes.${selectedSchemeName.value};
const faceColors = resample(scheme, 6).colors;

// 2. Create 6 distinct THREE.MeshStandardMaterial instances
const materials = faceColors.map(c => 
  new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(c.r, c.g, c.b),
    roughness: 0.35,
    metalness: 0.1
  })
);

// 3. Assign directly to Three.js BoxGeometry Mesh
const geometry = new THREE.BoxGeometry(2, 2, 2);
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);`
  }

  return `import * as THREE from 'three';
import { colorschemes, get } from 'color-schemes-js';

// 1. Create a 1D CanvasTexture from the continuous colormap
const scheme = colorschemes.${selectedSchemeName.value};

const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 1;
const ctx = canvas.getContext('2d');

for (let i = 0; i < 256; i++) {
  const c = get(scheme, i / 255);
  ctx.fillStyle = \`rgb(\${Math.round(c.r * 255)}, \${Math.round(c.g * 255)}, \${Math.round(c.b * 255)})\`;
  ctx.fillRect(i, 0, 1, 1);
}

const texture = new THREE.CanvasTexture(canvas);
texture.needsUpdate = true;

// 2. Directly update material map
const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.35 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);`
})

function copyCode() {
  navigator.clipboard.writeText(codeSnippetText.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<style scoped>
.cube-demo-card {
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

.cube-viewport {
  position: relative;
  height: 320px;
  background: radial-gradient(circle at center, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.9) 100%);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.08));
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
  cursor: grab;
}

.cube-viewport:active {
  cursor: grabbing;
}

.viewport-hint {
  position: absolute;
  top: 12px;
  left: 14px;
  font-size: 0.75rem;
  color: var(--ui-text-muted, currentColor);
  opacity: 0.7;
  font-family: ui-monospace, monospace;
  pointer-events: none;
}

.continuous-legend {
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gradient-bar-wrapper {
  height: 1.5rem;
  border-radius: 0.5rem;
  padding: 2px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
  overflow: hidden;
}

.gradient-bar-fill {
  width: 100%;
  height: 100%;
  border-radius: 0.375rem;
}

.continuous-ticks {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.tick-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.45rem 0.75rem;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.08));
  border-radius: 0.5rem;
}

.tick-pos {
  font-size: 0.725rem;
  font-weight: 700;
  color: #818cf8;
}

.tick-hex {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ui-text-highlighted, currentColor);
}

.tick-rgb {
  font-size: 0.7rem;
  color: var(--ui-text-muted, currentColor);
  opacity: 0.85;
}

.categorical-legend {
  margin-top: 1.25rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .categorical-legend {
    grid-template-columns: repeat(3, 1fr);
  }
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.85rem;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.08));
  border-radius: 0.65rem;
}

.legend-swatch {
  width: 2rem;
  height: 2rem;
  border-radius: 0.45rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.legend-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  overflow: hidden;
}

.legend-face {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #818cf8;
  letter-spacing: 0.05em;
}

.legend-hex {
  font-size: 0.825rem;
  font-weight: 600;
  color: var(--ui-text-highlighted, currentColor);
}

.legend-rgb {
  font-size: 0.725rem;
  color: var(--ui-text-muted, currentColor);
  opacity: 0.85;
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
