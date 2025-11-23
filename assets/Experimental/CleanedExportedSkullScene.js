/**
 * 🎯 CLEANED VERSION - TESTING EXPORT STATEMENT FIX
 * Original file was corrupted with massive template duplication
 * This is a minimal clean version to test CodeAdapter export handling
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

const SCENE_CONFIG = {
    backgroundColor: 0x0f0f0f,
    camera: {
        fov: 75,
        position: [12.031972769069213, 1.1491629483686152, 3.682671176922021],
        near: 0.1,
        far: 1000
    },
    renderer: {
        antialias: true,
        shadowMap: true,
        pixelRatio: Math.min(window.devicePixelRatio, 2)
    }
};

const MATERIAL_1 = {
    type: 'standard',
    color: '#ffffff',
    wireframe: false,
    opacity: 1,
    transparent: false,
    roughness: 0.5,
    metalness: 0,
    emissive: '#000000',
    emissiveIntensity: 1
};

const SKULL3_1_CONFIG = {
    type: 'obj',
    fileName: 'Skull3.obj',
    material: MATERIAL_1,
    transform: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
    }
};

export async function createEditableScene(container) {
    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(SCENE_CONFIG.backgroundColor);
    
    // Camera Setup
    const camera = new THREE.PerspectiveCamera(
        SCENE_CONFIG.camera.fov,
        container.clientWidth / container.clientHeight,
        SCENE_CONFIG.camera.near,
        SCENE_CONFIG.camera.far
    );
    camera.position.set(...SCENE_CONFIG.camera.position);
    
    // Renderer Setup
    const renderer = new THREE.WebGLRenderer(SCENE_CONFIG.renderer);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(SCENE_CONFIG.renderer.pixelRatio);
    renderer.shadowMap.enabled = SCENE_CONFIG.renderer.shadowMap;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    // Controls Setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Lighting Setup
    setupLighting(scene);
    
    // Load Objects
    await loadSceneObjects(scene);
    
    // Resize Handler
    const handleResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        
        // Object Animations
        if (window.Skull3_1) {
            window.Skull3_1.rotation.y += 0.0060;
        }
        
        renderer.render(scene, camera);
    };
    animate();
    
    // Return scene components for external access
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

function setupLighting(scene) {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(20, 20, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
}

async function loadSceneObjects(scene) {
    const loader = new OBJLoader();
    
    try {
        console.log(`🔄 Loading: ${SKULL3_1_CONFIG.fileName}`);
        
        const object = await loadOBJObject(loader, SKULL3_1_CONFIG);
        scene.add(object);
        
        // Store reference for animation
        window.Skull3_1 = object;
        
        console.log(`✅ Loaded: ${SKULL3_1_CONFIG.fileName}`);
        
    } catch (error) {
        console.error(`❌ Failed to load ${SKULL3_1_CONFIG.fileName}:`, error);
    }
}

function loadOBJObject(loader, config) {
    return new Promise((resolve, reject) => {
        loader.load(
            config.fileName,
            (object) => {
                // Apply material
                const material = createMaterialFromConfig(config.material);
                
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                
                // Apply transform
                object.position.set(...config.transform.position);
                object.rotation.set(...config.transform.rotation);
                object.scale.set(...config.transform.scale);
                
                resolve(object);
            },
            undefined,
            reject
        );
    });
}

function createMaterialFromConfig(materialConfig) {
    return new THREE.MeshStandardMaterial({
        color: materialConfig.color,
        wireframe: materialConfig.wireframe,
        opacity: materialConfig.opacity,
        transparent: materialConfig.transparent,
        roughness: materialConfig.roughness,
        metalness: materialConfig.metalness,
        emissive: materialConfig.emissive,
        emissiveIntensity: materialConfig.emissiveIntensity
    });
}