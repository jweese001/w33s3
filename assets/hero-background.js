import * as THREE from 'three';

// ============================================================================
// NETWORK GRAPH VISUALIZATION - HERO BACKGROUND
// ============================================================================
// Connected nodes with glowing edges - neural network / data network aesthetic
// Nodes pulse, connections light up when data flows
// Auto-rotating background for hero section
// ============================================================================

let scene, camera, renderer;
let nodeGroup, lineSystem;
let nodes = [];
let connections = [];
let nodeMeshes = [];
let clock, time = 0;
let isInitialized = false;
let resizeObserver = null;
let heroObserver = null;

// ============================================================================
// NETWORK PARAMETERS
// ============================================================================

const NODE_COUNT = 80;
const CONNECTION_DISTANCE = 50;
const SPHERE_RADIUS = 70;

// Colors - darker for background use
const NODE_COLOR = new THREE.Color(0x4a9eff);
const CONNECTION_COLOR = new THREE.Color(0xff1493);
const ACTIVE_COLOR = new THREE.Color(0x00ffff);
const BACKGROUND_COLOR = 0x0a0a0a; // Very dark background

// ============================================================================
// NODE CLASS
// ============================================================================

class Node {
    constructor(position) {
        this.position = position.clone();
        this.originalPosition = position.clone();
        this.connections = [];
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.5 + Math.random() * 0.5;
        this.activity = 0;
    }

    update(time) {
        // Gentle floating motion
        const offset = Math.sin(time * 0.0005 + this.pulsePhase) * 0.5;
        this.position.y = this.originalPosition.y + offset;

        // Pulse activity
        const pulse = (Math.sin(time * 0.001 * this.pulseSpeed + this.pulsePhase) + 1) * 0.5;
        this.activity = pulse;
    }
}

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

    if (heroObserver) {
        heroObserver.disconnect();
    }

    // Dispose Three.js resources
    if (renderer) {
        const container = document.getElementById('home-section-background');
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

    // Clear arrays
    nodes = [];
    connections = [];
    nodeMeshes = [];
    nodeGroup = null;
    lineSystem = null;
    camera = null;
    clock = null;
    time = 0;
    isInitialized = false;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
    // Prevent multiple initializations
    if (isInitialized) {
        console.warn('Hero background already initialized, cleaning up first...');
        cleanup();
    }

    const container = document.getElementById('home-section-background');
    if (!container) {
        console.error('Hero background container not found');
        return;
    }

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(BACKGROUND_COLOR);

    // Create camera
    camera = new THREE.PerspectiveCamera(60, w / h, 1, 1000);
    camera.position.set(0, 0, 150);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(BACKGROUND_COLOR, 1);

    // Add canvas to container
    container.appendChild(renderer.domElement);

    // Initialize clock
    clock = new THREE.Clock();

    // Create network
    createNodes();
    createConnections();
    createNodeGeometry();
    createConnectionLines();

    console.log(`Hero Network: ${nodes.length} nodes, ${connections.length} connections`);

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

    // Start animation
    animate();
}

// ============================================================================
// CREATE NODES
// ============================================================================

function createNodes() {
    // Distribute nodes in a sphere
    for (let i = 0; i < NODE_COUNT; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = SPHERE_RADIUS * (0.7 + Math.random() * 0.3);

        const position = new THREE.Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );

        nodes.push(new Node(position));
    }
}

// ============================================================================
// CREATE CONNECTIONS
// ============================================================================

function createConnections() {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const distance = nodes[i].position.distanceTo(nodes[j].position);

            if (distance < CONNECTION_DISTANCE) {
                connections.push({
                    from: nodes[i],
                    to: nodes[j],
                    activity: 0,
                    flowDirection: Math.random() > 0.5 ? 1 : -1,
                    flowSpeed: 0.5 + Math.random() * 1.5
                });
            }
        }
    }
}

// ============================================================================
// CREATE NODE GEOMETRY
// ============================================================================

function createNodeGeometry() {
    const nodeGeometry = new THREE.SphereGeometry(0.5, 8, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({
        color: NODE_COLOR,
        transparent: true,
        opacity: 0.8
    });

    nodeGroup = new THREE.Group();

    nodes.forEach(node => {
        const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
        mesh.position.copy(node.position);
        nodeGroup.add(mesh);
        nodeMeshes.push(mesh);
    });

    scene.add(nodeGroup);
}

// ============================================================================
// CREATE CONNECTION LINES
// ============================================================================

function createConnectionLines() {
    const linePositions = [];
    const lineColors = [];
    const lineAlphas = [];

    connections.forEach(() => {
        // Each connection needs 2 points
        linePositions.push(0, 0, 0, 0, 0, 0);
        lineColors.push(1, 1, 1, 1, 1, 1);
        lineAlphas.push(0.3, 0.3);
    });

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
    lineGeometry.setAttribute('alpha', new THREE.Float32BufferAttribute(lineAlphas, 1));

    const lineMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            attribute float alpha;
            varying vec3 vColor;
            varying float vAlpha;

            void main() {
                vColor = color;
                vAlpha = alpha;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            varying float vAlpha;

            void main() {
                gl_FragColor = vec4(vColor, vAlpha);
            }
        `,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });

    lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSystem);
}

// ============================================================================
// RESIZE HANDLER
// ============================================================================

function handleResize() {
    const container = document.getElementById('home-section-background');
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
heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationId) {
            animate();
        }
    });
}, { threshold: 0.1 });

const heroSection = document.getElementById('hero');
if (heroSection) {
    heroObserver.observe(heroSection);
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

    const delta = clock.getDelta();
    time += delta * 1000;

    // Auto-rotate the entire scene
    nodeGroup.rotation.y += 0.0003;
    nodeGroup.rotation.x = Math.sin(time * 0.0001) * 0.1;

    // Update nodes
    nodes.forEach((node, i) => {
        node.update(time);
        nodeMeshes[i].position.copy(node.position);

        // Scale based on activity
        const scale = 1 + node.activity * 0.3;
        nodeMeshes[i].scale.setScalar(scale);

        // Glow based on activity
        nodeMeshes[i].material.opacity = 0.6 + node.activity * 0.4;
    });

    // Update connections
    const positions = lineSystem.geometry.attributes.position.array;
    const colors = lineSystem.geometry.attributes.color.array;
    const alphas = lineSystem.geometry.attributes.alpha.array;

    connections.forEach((conn, i) => {
        // Update positions
        positions[i * 6] = conn.from.position.x;
        positions[i * 6 + 1] = conn.from.position.y;
        positions[i * 6 + 2] = conn.from.position.z;
        positions[i * 6 + 3] = conn.to.position.x;
        positions[i * 6 + 4] = conn.to.position.y;
        positions[i * 6 + 5] = conn.to.position.z;

        // Flow activity along connections
        conn.activity = (Math.sin(time * 0.001 * conn.flowSpeed) + 1) * 0.5;

        // Color based on activity
        const activity = conn.activity;
        const color = CONNECTION_COLOR.clone().lerp(ACTIVE_COLOR, activity);

        colors[i * 6] = color.r;
        colors[i * 6 + 1] = color.g;
        colors[i * 6 + 2] = color.b;
        colors[i * 6 + 3] = color.r;
        colors[i * 6 + 4] = color.g;
        colors[i * 6 + 5] = color.b;

        // Alpha based on activity
        const baseAlpha = 0.2;
        const alpha = baseAlpha + activity * 0.6;
        alphas[i * 2] = alpha;
        alphas[i * 2 + 1] = alpha;
    });

    lineSystem.geometry.attributes.position.needsUpdate = true;
    lineSystem.geometry.attributes.color.needsUpdate = true;
    lineSystem.geometry.attributes.alpha.needsUpdate = true;

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
        console.log('HMR: Cleaning up hero background...');
        cleanup();
    });
}
