import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// ============================================================================
// DUST PARTICLE VISUALIZATION - CURRICULUM BACKGROUND
// ============================================================================
// Interactive dust particles with bloom post-processing
// Press spacebar to trigger dust disturbance effect
// ============================================================================

let camera, scene, renderer, composer;
let dustEffect;
let isInitialized = false;
let resizeObserver = null;
let curriculumObserver = null;

// Perturbation variables
let perturbation = 0;
const PERTURBATION_DECAY = 0.95; // How quickly the effect fades

// ============================================================================
// CLEANUP
// ============================================================================

function cleanup() {
    // Cancel animation
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    // Disconnect observers
    if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }

    if (curriculumObserver) {
        curriculumObserver.disconnect();
        curriculumObserver = null;
    }

    // Remove event listeners
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('resize', handleResize);

    // Dispose Three.js resources
    if (composer) {
        composer = null;
    }

    if (renderer) {
        const container = document.getElementById('curriculum-section-background');
        if (container && renderer.domElement && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
        }
        renderer.dispose();
        renderer = null;
    }

    if (scene) {
        scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => {
                        if (material.map) material.map.dispose();
                        material.dispose();
                    });
                } else {
                    if (object.material.map) object.material.map.dispose();
                    object.material.dispose();
                }
            }
        });
        scene = null;
    }

    // Clear references
    dustEffect = null;
    camera = null;
    perturbation = 0;
    isInitialized = false;
}

// ============================================================================
// DUST EFFECT FUNCTIONS
// ============================================================================

// This function simulates the door slam
function slamDoor() {
    perturbation = 1.5; // Set the initial strength of the disturbance
}

// Event Listener triggers the particle "disturbance"
function handleKeydown(event) {
    if (event.code === 'Space') {
        console.log('Spacebar pressed, triggering dust animation!');
        slamDoor();
    }
}

function createDust({
    numParticles = 5000,
    size = 0.01, // Increased size slightly for texture
    boxSize = 30
} = {}) {
    const vertices = [];
    for (let i = 0; i < numParticles; i++) {
        const x = (Math.random() - 0.5) * boxSize;
        const y = Math.random() * boxSize;
        const z = (Math.random() - 0.5) * boxSize;
        vertices.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/images/whiteDot64.png');

    const material = new THREE.PointsMaterial({
        size: size,
        map: texture,
        color: 'white',
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const dust = new THREE.Points(geometry, material);
    scene.add(dust);

    // Return the dust object
    return dust;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
    // Prevent multiple initializations
    if (isInitialized) {
        console.warn('Curriculum background already initialized, cleaning up first...');
        cleanup();
    }

    const container = document.getElementById('curriculum-section-background');
    if (!container) {
        console.error('Curriculum background container not found');
        return;
    }

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Create the WebGL renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    // Set up the camera
    const fov = 60;
    const aspect = w / h;
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 15, 15);

    // Create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212); // Dark background

    // Add a simple light so we can see potential objects
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    // Create the dust effect
    dustEffect = createDust();

    // --- Post-processing --- //
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 1.2; // Intensity of the glow
    bloomPass.radius = 0.5;
    composer.addPass(bloomPass);

    // Add event listener for spacebar
    window.addEventListener('keydown', handleKeydown);

    // Handle resize using ResizeObserver
    resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target === container) {
                handleResize();
            }
        }
    });
    resizeObserver.observe(container);

    // Mark as initialized
    isInitialized = true;

    // This will trigger the effect after 2 seconds for demonstration
    setTimeout(slamDoor, 2000);

    console.log('Curriculum dust effect initialized');

    animate();
}

// ============================================================================
// RESIZE HANDLER
// ============================================================================

function handleResize() {
    const container = document.getElementById('curriculum-section-background');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    if (camera && renderer && composer) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        composer.setSize(w, h); // Also resize the composer
    }
}

// ============================================================================
// VISIBILITY OPTIMIZATION
// ============================================================================

let isVisible = true;
let animationId = null;

// Pause when section is not visible
curriculumObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationId) {
            animate();
        }
    });
}, { threshold: 0.1 });

const curriculumSection = document.getElementById('curriculum');
if (curriculumSection) {
    curriculumObserver.observe(curriculumSection);
}

// ============================================================================
// ANIMATION
// ============================================================================

function animate() {
    if (!isVisible) {
        animationId = null;
        return;
    }

    animationId = requestAnimationFrame(animate);

    // Check if there's any perturbation to apply
    if (perturbation > 0.001 && dustEffect) {
        // Get the position attribute from our dust geometry
        const positions = dustEffect.geometry.attributes.position.array;

        // Loop through every vertex (each vertex has x, y, z components)
        for (let i = 0; i < positions.length; i += 3) {
            // Add a small random value to each component, scaled by the perturbation strength
            const px = (Math.random() - 0.5) * perturbation;
            const py = (Math.random() - 0.5) * perturbation;
            const pz = (Math.random() - 0.5) * perturbation;

            positions[i] += px;
            positions[i + 1] += py;
            positions[i + 2] += pz;
        }

        // IMPORTANT: Tell Three.js that the positions have been updated
        dustEffect.geometry.attributes.position.needsUpdate = true;

        // Decay the perturbation effect over time
        perturbation *= PERTURBATION_DECAY;
    }

    // We can keep the gentle rotation for ambient movement
    if (dustEffect) {
        dustEffect.rotation.y += 0.0002;
    }

    if (composer) {
        composer.render();
    }
}

// ============================================================================
// START THE VISUALIZATION
// ============================================================================

init();

// ============================================================================
// HOT MODULE REPLACEMENT CLEANUP
// ============================================================================
// Handle Vite HMR - cleanup when module is replaced during development

if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        console.log('HMR: Cleaning up curriculum background...');
        cleanup();
    });
}
