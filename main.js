import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// --- PHYSICS (ADVANCED CONSTRAINTS) ---
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -30, 0) });
const solver = new CANNON.GSSolver(); solver.iterations = 15; world.solver = solver;
const physMat = new CANNON.Material(); world.addContactMaterial(new CANNON.ContactMaterial(physMat, physMat, { friction: 0.0, restitution: 0.1 }));
const hazardMat = new CANNON.Material(); world.addContactMaterial(new CANNON.ContactMaterial(physMat, hazardMat, { friction: 0.2, restitution: 1.5 }));

// --- SCENE & RENDERER ---
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x050510); scene.fog = new THREE.FogExp2(0x050510, 0.015);
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 2000);
const cameraOffset = new THREE.Vector3(0, 8, 15);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; document.body.appendChild(renderer.domElement);
