import * as THREE from 'three';

// ============================================================================
// PARTICLE NETWORK DATA VISUALIZATION - ARCHITECTURE SECTION
// ============================================================================
// Particle network effect integrated as background for the architecture section
// ============================================================================

// ============================================================================
// CONFIGURATION PARAMETERS
// ============================================================================

// Particle Settings
const PARTICLE_COUNT = 100;           // Number of nodes in the network (reduced for performance)
const PARTICLE_SIZE = 4;              // Size of each particle (pixels)
const PARTICLE_COLOR = 'hotpink';     // Color for particles
const PARTICLE_OPACITY = 0.5;         // Transparency of particles (0-1)

// Connection Settings
const CONNECTION_DISTANCE = 120;      // Max distance to draw lines between nodes
const LINE_COLOR = 0x60a5fa;          // Lighter blue for connection lines
const LINE_OPACITY = 0.3;             // Transparency of lines (0-1)
const LINE_WIDTH = 1;                 // Thickness of connection lines

// Animation Settings
const DRIFT_SPEED = 0.3;              // Speed of particle drift (higher = faster)
const DRIFT_RANGE = 200;              // How far particles can drift from origin

// Scene Settings
const BACKGROUND_COLOR = 0x1a1a1a;    // Dark background matching section-dark
const CAMERA_Z = 400;                 // Camera distance (higher = zoomed out)
const FOV = 60;                       // Field of view (degrees)

// ============================================================================
// GLOBAL VARIABLES
// ============================================================================

let camera, scene, renderer;
let particles = [];
let particlesMesh;
let linesMesh;
let isInitialized = false;
let resizeObserver = null;
let archObserver = null;

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

    if (archObserver) {
        archObserver.disconnect();
        archObserver = null;
    }

    // Dispose Three.js resources
    if (renderer) {
        const container = document.getElementById('architecture-section-background');
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
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        scene = null;
    }

    // Clear variables
    particles = [];
    particlesMesh = null;
    linesMesh = null;
    camera = null;
    isInitialized = false;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
    // Prevent multiple initializations
    if (isInitialized) {
        console.warn('Architecture background already initialized, cleaning up first...');
        cleanup();
    }

    const container = document.getElementById('architecture-section-background');
    if (!container) {
        console.error('Architecture background container not found');
        return;
    }

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(BACKGROUND_COLOR);

    // Create camera
    camera = new THREE.PerspectiveCamera(FOV, w / h, 1, 2000);
    camera.position.z = CAMERA_Z;

    // Create renderer with transparency for blending with section background
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true  // Transparent background
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(BACKGROUND_COLOR, 1);

    // Add canvas to container (not body)
    container.appendChild(renderer.domElement);

    // Generate particles
    createParticles();

    // Create line mesh
    createLines();

    // Handle resize using ResizeObserver for container
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

    // Start animation loop
    animate();
}

// ============================================================================
// PARTICLE CREATION
// ============================================================================

function createParticles() {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const color = new THREE.Color(PARTICLE_COLOR);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = (Math.random() - 0.5) * 600;
        const y = (Math.random() - 0.5) * 400;
        const z = (Math.random() - 0.5) * 400;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        particles.push({
            position: new THREE.Vector3(x, y, z),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * DRIFT_SPEED,
                (Math.random() - 0.5) * DRIFT_SPEED,
                (Math.random() - 0.5) * DRIFT_SPEED
            ),
            originalPosition: new THREE.Vector3(x, y, z)
        });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: PARTICLE_SIZE,
        vertexColors: true,
        transparent: true,
        opacity: PARTICLE_OPACITY,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);
}

// ============================================================================
// LINE CREATION
// ============================================================================

function createLines() {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({
        color: LINE_COLOR,
        transparent: true,
        opacity: LINE_OPACITY,
        linewidth: LINE_WIDTH,
        blending: THREE.AdditiveBlending
    });

    linesMesh = new THREE.LineSegments(geometry, material);
    scene.add(linesMesh);
}

// ============================================================================
// UPDATE CONNECTION LINES
// ============================================================================

function updateLines() {
    const positions = [];
    const maxDistanceSq = CONNECTION_DISTANCE * CONNECTION_DISTANCE;

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const distanceSq = particles[i].position.distanceToSquared(particles[j].position);

            if (distanceSq < maxDistanceSq) {
                positions.push(
                    particles[i].position.x,
                    particles[i].position.y,
                    particles[i].position.z
                );
                positions.push(
                    particles[j].position.x,
                    particles[j].position.y,
                    particles[j].position.z
                );
            }
        }
    }

    linesMesh.geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
    );
    linesMesh.geometry.attributes.position.needsUpdate = true;
}

// ============================================================================
// PARTICLE ANIMATION
// ============================================================================

function updateParticles() {
    const positions = particlesMesh.geometry.attributes.position.array;

    for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        particle.position.add(particle.velocity);

        const distanceFromOrigin = particle.position.distanceTo(particle.originalPosition);
        if (distanceFromOrigin > DRIFT_RANGE) {
            particle.velocity.multiplyScalar(-1);
        }

        particle.velocity.x += (Math.random() - 0.5) * 0.02;
        particle.velocity.y += (Math.random() - 0.5) * 0.02;
        particle.velocity.z += (Math.random() - 0.5) * 0.02;
        particle.velocity.clampLength(0, DRIFT_SPEED);

        positions[i * 3] = particle.position.x;
        positions[i * 3 + 1] = particle.position.y;
        positions[i * 3 + 2] = particle.position.z;
    }

    particlesMesh.geometry.attributes.position.needsUpdate = true;
}

// ============================================================================
// RESIZE HANDLER
// ============================================================================

function handleResize() {
    const container = document.getElementById('architecture-section-background');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    if (camera && renderer) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
}

// ============================================================================
// VISIBILITY OPTIMIZATION
// ============================================================================

let isVisible = true;
let animationId = null;

// Pause when section is not visible
archObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationId) {
            animate();
        }
    });
}, { threshold: 0.1 });

const archSection = document.getElementById('architecture');
if (archSection) {
    archObserver.observe(archSection);
}

// ============================================================================
// ANIMATION LOOP
// ============================================================================

function animate() {
    if (!isVisible) {
        animationId = null;
        return;
    }

    animationId = requestAnimationFrame(animate);
    updateParticles();
    updateLines();
    renderer.render(scene, camera);
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
        console.log('HMR: Cleaning up architecture background...');
        cleanup();
    });
}
