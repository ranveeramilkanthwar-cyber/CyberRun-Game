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
camera.position.set(0, 15, 25); camera.lookAt(0, 10, 0);
const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.dampingFactor = 0.1; controls.enablePan = false; controls.maxPolarAngle = Math.PI / 2 - 0.1; controls.minDistance = 10; controls.maxDistance = 60;
const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85); bloom.threshold = 0.2; bloom.strength = 0.3; bloom.radius = 0.1; composer.addPass(bloom);
const glitch = new GlitchPass(); glitch.enabled = false; composer.addPass(glitch);

// --- LIGHTING & ENVIRONMENT ---
const ambientLight = new THREE.AmbientLight(0x222222); scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1); dirLight.position.set(50, 100, 50); dirLight.castShadow = true; scene.add(dirLight);
const slimeGeo = new THREE.PlaneGeometry(2000, 2000); const slimeMat = new THREE.MeshStandardMaterial({ color: 0xff00aa, emissive: 0xff0055, emissiveIntensity: 0.5, transparent: true, opacity: 0.8 });
const slimePlane = new THREE.Mesh(slimeGeo, slimeMat); slimePlane.rotation.x = -Math.PI / 2; slimePlane.position.y = -15; scene.add(slimePlane);
const envGeo = new THREE.InstancedMesh(new THREE.CylinderGeometry(2, 2, 10, 6), new THREE.MeshStandardMaterial({color: 0x111122, metalness: 0.8, roughness: 0.2}), 1000); scene.add(envGeo);
const dummy = new THREE.Object3D(); let envCount = 0; for(let x=-5; x<5; x++) { for(let z=0; z<100; z++) { dummy.position.set(x*4 + (z%2===0?2:0), -15 - Math.random()*20, -z*3.5); dummy.updateMatrix(); envGeo.setMatrixAt(envCount++, dummy.matrix); } } envGeo.instanceMatrix.needsUpdate = true;
const starGeo = new THREE.BufferGeometry(); const starCount = 3000; const starPos = new Float32Array(starCount * 3); for(let i=0; i<starCount; i++) { starPos[i*3] = (Math.random() - 0.5) * 500; starPos[i*3+1] = (Math.random() - 0.5) * 500; starPos[i*3+2] = (Math.random() - 0.5) * 500; } starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3)); const starMat = new THREE.PointsMaterial({color: 0x00ffff, size: 0.8, transparent: true, opacity: 0.6}); scene.add(new THREE.Points(starGeo, starMat));

// --- GAME STATE ---
const state = { level: 1, score: 0, jumps: 0, maxJumps: 1, dashReady: true, grappleBody: null, grappleConstraint: null, checkpoint: new THREE.Vector3(0, 10, 0), lastZ: 10, checkpointCount: 0, recordChk: parseInt(localStorage.getItem('recordChk') || '0'), nextCheckpointDist: 5 };
if(document.getElementById('record-chk')) document.getElementById('record-chk').innerText = state.recordChk;
