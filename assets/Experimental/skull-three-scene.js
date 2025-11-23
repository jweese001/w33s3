// Generated Three.js Scene Code
// Created: 2025-08-31T14:36:45.786Z
// Objects: 1
// Generator: Three.js OBJ Loader & Editor

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

/**
 * Creates and initializes the Three.js scene
 * @param {HTMLElement} container - The container element for the canvas
 * @returns {Object} Scene components (scene, camera, renderer, controls)
 */
export function createThreeScene(container) {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0f0f);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
        75, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
    );
    camera.position.set(65.05382386916237, -14.999999999999995, 65.05382386916237);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);
    
    // Lighting setup
    setupLighting(scene);
    
    // Load and add objects
    loadSceneObjects(scene);
    
    // Handle window resize
    const handleResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    animate();
    
    return {
        scene,
        camera,
        renderer,
        controls,
        cleanup: () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        }
    };
}

/**
 * Sets up scene lighting
 * @param {THREE.Scene} scene - The Three.js scene
 */
function setupLighting(scene) {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(20, 20, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Fill light
    const fillLight = new THREE.DirectionalLight(0x9dd9d9, 0.3);
    fillLight.position.set(-10, -10, -10);
    scene.add(fillLight);
    
    // Accent point lights
    const pointLight1 = new THREE.PointLight(0x9dd9d9, 0.8, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xc77dcd, 0.5, 30);
    pointLight2.position.set(-10, 5, -10);
    scene.add(pointLight2);
}

/**
 * Loads and adds all scene objects
 * @param {THREE.Scene} scene - The Three.js scene
 */
async function loadSceneObjects(scene) {
    const loader = new OBJLoader();
    
    // Object: Skull2_1
    // File: Skull2.obj
    // Stats: 4 meshes, 240048 vertices, 80016 faces
    try {
        const Skull2_1 = await new Promise((resolve, reject) => {
            loader.load(
                'Skull2.obj', // Update this path to your OBJ file location
                (object) => {
                    // Apply material settings
                    const material = new THREE.MeshStandardMaterial({
                        color: new THREE.Color('#9dd9d9'),
                        wireframe: false,
                        transparent: false,
                        opacity: 1,
                        roughness: 0.47,
                        metalness: 1
                    });
                    
                    object.traverse((child) => {
                        if (child.isMesh) {
                            child.material = material;
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    
                    // Apply transform
                    object.position.set(0, 0, 0);
                    object.rotation.set(0, 0, 0);
                    object.scale.set(3, 3, 3);
                    
                    
                    // Store animation data for later use
                    object.userData.animation = {
                        type: 'rotate-y',
                        speed: 0.001
                    };
                    
                    object.name = 'Skull2_1';
                    resolve(object);
                },
                undefined,
                reject
            );
        });
        
        scene.add(Skull2_1);
        console.log('✅ Loaded: Skull2_1');
        
    } catch (error) {
        console.error('❌ Failed to load Skull2_1:', error);
    }
}

// Usage example:
// const container = document.getElementById('threejs-container');
// const sceneComponents = createThreeScene(container);
// 
// To cleanup when done:
// sceneComponents.cleanup();