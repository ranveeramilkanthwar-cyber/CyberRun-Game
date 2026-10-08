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
