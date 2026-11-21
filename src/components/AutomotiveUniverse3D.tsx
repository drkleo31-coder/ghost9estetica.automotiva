import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, Pause, Play } from 'lucide-react';
import { computeAutomotiveCameraRig, type CameraPresetId } from '../utils/transform';

type LightingMood = 'crimson' | 'studio' | 'contrast';

const PRESET_OPTIONS: { id: CameraPresetId; label: string }[] = [
  { id: 'hero', label: 'Destaque' },
  { id: 'profile', label: 'Perfil' },
  { id: 'rear', label: 'Traseira' },
  { id: 'aerial', label: 'Aérea' },
];

const MOOD_OPTIONS: { id: LightingMood; label: string }[] = [
  { id: 'crimson', label: 'Carmesim' },
  { id: 'studio', label: 'Estúdio' },
  { id: 'contrast', label: 'Contraste' },
];

// Reusable math scratch objects outside render loop (zero GC)
const _targetPos = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();

function detectSoftwareGl(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function buildSportsCoupeGroup(isSoftwareGl: boolean): {
  carGroup: THREE.Group;
  wheels: THREE.Object3D[];
  bodyPaintMat: THREE.MeshPhysicalMaterial;
  rimMat: THREE.MeshStandardMaterial;
} {
  const carGroup = new THREE.Group();

  // Calibrated obsidian automotive clearcoat paint
  const bodyPaintMat = new THREE.MeshPhysicalMaterial({
    color: 0x0b0c10,
    metalness: 0.65,
    roughness: 0.14,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.65,
  });

  const carbonMat = new THREE.MeshStandardMaterial({
    color: 0x16181f,
    metalness: 0.35,
    roughness: 0.48,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x07090e,
    metalness: 0.1,
    roughness: 0.05,
    clearcoat: 1.0,
    transmission: isSoftwareGl ? 0 : 0.45,
    transparent: true,
    opacity: isSoftwareGl ? 0.88 : 0.96,
    ior: 1.5,
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x111216,
    metalness: 0.05,
    roughness: 0.86,
  });

  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xb8bec9,
    metalness: 0.92,
    roughness: 0.18,
  });

  const caliperMat = new THREE.MeshStandardMaterial({
    color: 0xe11d2e,
    metalness: 0.4,
    roughness: 0.25,
  });

  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xf4f5f7,
    emissiveIntensity: 2.2,
    roughness: 0.1,
  });

  const taillightMat = new THREE.MeshStandardMaterial({
    color: 0xe11d2e,
    emissive: 0xe11d2e,
    emissiveIntensity: 2.8,
    roughness: 0.15,
  });

  // 1. Primary Silhouette: Sculpted Lower Chassis Profile (ExtrudeGeometry)
  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(-2.22, 0.22);
  bodyShape.lineTo(-2.15, 0.48);
  bodyShape.quadraticCurveTo(-1.75, 0.72, -0.95, 0.76);
  bodyShape.lineTo(0.85, 0.82);
  bodyShape.quadraticCurveTo(1.78, 0.86, 2.16, 0.66);
  bodyShape.lineTo(2.22, 0.34);
  bodyShape.lineTo(2.02, 0.22);
  bodyShape.closePath();

  const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
    depth: 1.66,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.09,
    bevelThickness: 0.11,
  });
  bodyGeo.center();
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyPaintMat);
  bodyMesh.position.set(0, 0.52, 0);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  carGroup.add(bodyMesh);

  // 2. Secondary Read: Aerodynamic Greenhouse / Cabin Canopy
  const cabinShape = new THREE.Shape();
  cabinShape.moveTo(-0.98, 0);
  cabinShape.quadraticCurveTo(-0.42, 0.44, 0.15, 0.46);
  cabinShape.quadraticCurveTo(0.92, 0.45, 1.38, 0.04);
  cabinShape.closePath();

  const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, {
    depth: 1.24,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.06,
    bevelThickness: 0.08,
  });
  cabinGeo.center();
  const cabinMesh = new THREE.Mesh(cabinGeo, glassMat);
  cabinMesh.position.set(0.18, 0.98, 0);
  cabinMesh.castShadow = true;
  carGroup.add(cabinMesh);

  // 3. Carbon Roof Spine
  const roofMesh = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.04, 1.06), bodyPaintMat);
  roofMesh.position.set(0.16, 1.2, 0);
  carGroup.add(roofMesh);

  // 4. Front Carbon Aero Splitter & Rear Diffuser
  const splitterMesh = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.05, 1.84), carbonMat);
  splitterMesh.position.set(-2.08, 0.19, 0);
  carGroup.add(splitterMesh);

  const diffuserMesh = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.14, 1.72), carbonMat);
  diffuserMesh.position.set(2.06, 0.24, 0);
  carGroup.add(diffuserMesh);

  // 5. Rear GT Wing Spoiler + Dual Stanchions + Twin Exhaust Tips
  const wingMesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.04, 1.78), carbonMat);
  wingMesh.position.set(2.06, 1.04, 0);
  wingMesh.rotation.z = -0.12;
  carGroup.add(wingMesh);

  [-0.48, 0.48].forEach((zOff) => {
    const stanchion = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 0.04), carbonMat);
    stanchion.position.set(2.02, 0.92, zOff);
    carGroup.add(stanchion);

    const exhaust = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.14, 16),
      rimMat
    );
    exhaust.rotation.z = Math.PI / 2;
    exhaust.position.set(2.26, 0.29, zOff * 0.72);
    carGroup.add(exhaust);
  });

  // 5b. Sculpted Wheel-Arch Flares & Side Intake Blades (aligned cleanly over XY wheel plane)
  [-0.86, 0.86].forEach((zOff) => {
    const frontFlare = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.045, 10, 24, Math.PI),
      bodyPaintMat
    );
    frontFlare.position.set(-1.36, 0.36, zOff);
    carGroup.add(frontFlare);

    const rearFlare = new THREE.Mesh(
      new THREE.TorusGeometry(0.43, 0.05, 10, 24, Math.PI),
      bodyPaintMat
    );
    rearFlare.position.set(1.36, 0.36, zOff);
    carGroup.add(rearFlare);

    const intakeBlade = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.24, 0.06), carbonMat);
    intakeBlade.position.set(0.42, 0.48, zOff * 1.02);
    intakeBlade.rotation.y = zOff > 0 ? 0.08 : -0.08;
    carGroup.add(intakeBlade);
  });

  // 6. Side Skirts
  [-0.9, 0.9].forEach((zOff) => {
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.06, 0.1), carbonMat);
    skirt.position.set(0, 0.2, zOff);
    carGroup.add(skirt);
  });

  // 7. LED Headlights & Full-Width Crimson Taillight Bar
  [-0.64, 0.64].forEach((zOff) => {
    const drl = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.045, 0.34), headlightMat);
    drl.position.set(-2.14, 0.49, zOff);
    drl.rotation.y = zOff > 0 ? -0.22 : 0.22;
    carGroup.add(drl);
  });

  const tailBar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.055, 1.66), taillightMat);
  tailBar.position.set(2.24, 0.66, 0);
  carGroup.add(tailBar);

  // 8. Four Multi-Part Performance Wheels (Tire + Alloy Rim + Spokes + Red Caliper)
  const wheels: THREE.Object3D[] = [];
  const wheelCoords: [number, number][] = [
    [-1.36, -0.88],
    [-1.36, 0.88],
    [1.36, -0.88],
    [1.36, 0.88],
  ];

  const tireGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.26, 28);
  tireGeo.rotateX(Math.PI / 2);
  const rimGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.27, 20);
  rimGeo.rotateX(Math.PI / 2);
  const discGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.08, 16);
  discGeo.rotateX(Math.PI / 2);
  const spokeGeo = new THREE.BoxGeometry(0.46, 0.035, 0.04);
  const caliperGeo = new THREE.BoxGeometry(0.12, 0.18, 0.1);

  wheelCoords.forEach(([x, z]) => {
    const wheelMount = new THREE.Group();
    wheelMount.position.set(x, 0.36, z);

    const spinGroup = new THREE.Group();
    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.castShadow = true;
    spinGroup.add(tire);

    const rim = new THREE.Mesh(rimGeo, carbonMat);
    spinGroup.add(rim);

    const disc = new THREE.Mesh(discGeo, rimMat);
    spinGroup.add(disc);

    for (let s = 0; s < 5; s++) {
      const spoke = new THREE.Mesh(spokeGeo, rimMat);
      spoke.rotation.z = (s / 5) * Math.PI;
      spoke.position.z = z > 0 ? 0.125 : -0.125;
      spinGroup.add(spoke);
    }

    wheelMount.add(spinGroup);
    wheels.push(spinGroup);

    // Non-spinning red brake caliper
    const caliper = new THREE.Mesh(caliperGeo, caliperMat);
    caliper.position.set(0.11, 0.04, z > 0 ? 0.08 : -0.08);
    wheelMount.add(caliper);

    carGroup.add(wheelMount);
  });

  return { carGroup, wheels, bodyPaintMat, rimMat };
}

export function AutomotiveUniverse3D() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [preset, setPreset] = useState<CameraPresetId>('hero');
  const [mood, setMood] = useState<LightingMood>('crimson');
  const [autoSpin, setAutoSpin] = useState(true);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const stateRef = useRef({
    preset: 'hero' as CameraPresetId,
    mood: 'crimson' as LightingMood,
    autoSpin: true,
    scrollProgress: 0.35,
    pointerX: 0,
    pointerY: 0,
    orbitOffset: 0,
    dragging: false,
    lastDragX: 0,
  });

  useEffect(() => {
    stateRef.current.preset = preset;
  }, [preset]);

  useEffect(() => {
    stateRef.current.mood = mood;
  }, [mood]);

  useEffect(() => {
    stateRef.current.autoSpin = autoSpin;
  }, [autoSpin]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSoftwareGl = detectSoftwareGl();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050507);
    scene.fog = new THREE.FogExp2(0x050507, 0.055);

    const width = Math.max(300, container.clientWidth);
    const height = Math.max(360, container.clientHeight);
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 80);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Mandatory RoomEnvironment studio reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    // Three-point studio lighting + crimson automotive accent
    const hemiLight = new THREE.HemisphereLight(0xdce4f2, 0x12080a, 0.7);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ec, 2.2);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -4;
    keyLight.shadow.camera.right = 4;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -4;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const redRimLight = new THREE.SpotLight(0xe11d2e, 4.5, 22, Math.PI / 3.5, 0.65, 1.2);
    redRimLight.position.set(-4.5, 3.2, -4.2);
    scene.add(redRimLight);

    const accentPoint = new THREE.PointLight(0xe11d2e, 2.4, 14, 1.5);
    accentPoint.position.set(3.2, 1.4, 3.6);
    scene.add(accentPoint);

    // Ground studio floor blending seamlessly into fog (strictly offset on Y)
    const floorGeo = new THREE.CircleGeometry(28, 64);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x06070a,
      metalness: 0.78,
      roughness: 0.24,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.02;
    floor.receiveShadow = true;
    scene.add(floor);

    const ringGeo = new THREE.RingGeometry(2.85, 2.91, 72);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xe11d2e,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const floorRing = new THREE.Mesh(ringGeo, ringMat);
    floorRing.position.y = 0.0;
    scene.add(floorRing);

    // Soft radial contact shadow under chassis
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 62);
      grad.addColorStop(0, 'rgba(0,0,0,0.85)');
      grad.addColorStop(0.6, 'rgba(0,0,0,0.45)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(5.2, 2.7),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.8,
      })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.015;
    scene.add(contactShadow);

    // Composite sports coupe
    const { carGroup, wheels } = buildSportsCoupeGroup(isSoftwareGl);
    scene.add(carGroup);

    // Floating orbital 3D precision rings positioned low around turntable (never occluding camera)
    const orbitalGroup = new THREE.Group();
    const orbitRingGeo = new THREE.TorusGeometry(3.25, 0.014, 12, 96);
    const orbitRingMat = new THREE.MeshStandardMaterial({
      color: 0xe11d2e,
      emissive: 0x99111e,
      emissiveIntensity: 0.85,
      metalness: 0.8,
      roughness: 0.2,
    });
    const orbitRingA = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRingA.rotation.x = Math.PI / 2 + 0.06;
    orbitRingA.position.y = 0.14;
    orbitalGroup.add(orbitRingA);

    const orbitRingB = new THREE.Mesh(
      new THREE.TorusGeometry(3.7, 0.01, 10, 96),
      new THREE.MeshStandardMaterial({
        color: 0xd1d5db,
        metalness: 0.9,
        roughness: 0.2,
        transparent: true,
        opacity: 0.4,
      })
    );
    orbitRingB.rotation.x = Math.PI / 2 - 0.07;
    orbitRingB.rotation.y = 0.15;
    orbitRingB.position.y = 0.08;
    orbitalGroup.add(orbitRingB);
    scene.add(orbitalGroup);

    // Orbiting luminous particles (red & white)
    const pCount = isSoftwareGl ? 90 : 180;
    const pPositions = new Float32Array(pCount * 3);
    const pColors = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const angle = (i / pCount) * Math.PI * 2 * 3;
      const radius = 2.8 + (i % 7) * 0.45;
      pPositions[i * 3] = Math.cos(angle) * radius;
      pPositions[i * 3 + 1] = 0.2 + ((i * 0.37) % 2.4);
      pPositions[i * 3 + 2] = Math.sin(angle) * radius;

      const isRed = i % 3 !== 0;
      pColors[i * 3] = isRed ? 0.92 : 0.95;
      pColors[i * 3 + 1] = isRed ? 0.12 : 0.96;
      pColors[i * 3 + 2] = isRed ? 0.18 : 0.98;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const particleCloud = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleCloud);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Smooth camera state
    let curAzimuth = 0.68;
    let curElevation = 0.28;
    let curDistance = 6.4;
    let frameId = 0;
    let isDisposed = false;
    let lastTime = performance.now();

    const updateScrollProgress = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = Math.max(1, window.innerHeight + rect.height);
      const progress = (window.innerHeight - rect.top) / total;
      stateRef.current.scrollProgress = Math.min(1, Math.max(0, progress));
    };

    const onResize = () => {
      if (!container) return;
      const w = Math.max(300, container.clientWidth);
      const h = Math.max(360, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };

    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    updateScrollProgress();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) return;
          const status = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (status === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function tick(now = performance.now()) {
      if (isDisposed) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const s = stateRef.current;

      if (s.autoSpin && !reducedMotion && !s.dragging) {
        s.orbitOffset += dt * 0.24;
      }

      const rig = computeAutomotiveCameraRig(
        s.scrollProgress,
        s.preset,
        s.pointerX,
        s.pointerY
      );

      const targetAzimuth = rig.azimuth + s.orbitOffset;
      curAzimuth = THREE.MathUtils.damp(curAzimuth, targetAzimuth, 5.5, dt);
      curElevation = THREE.MathUtils.damp(curElevation, rig.elevation, 5.5, dt);
      curDistance = THREE.MathUtils.damp(curDistance, rig.distance, 5.5, dt);

      const horiz = Math.cos(curElevation) * curDistance;
      _targetPos.set(
        Math.cos(curAzimuth) * horiz,
        Math.sin(curElevation) * curDistance + 0.35,
        Math.sin(curAzimuth) * horiz
      );
      camera.position.copy(_targetPos);
      _lookTarget.set(0, rig.lookAtY, 0);
      camera.lookAt(_lookTarget);

      // Update studio lighting mood dynamically
      if (s.mood === 'crimson') {
        redRimLight.color.setHex(0xe11d2e);
        redRimLight.intensity = rig.rimIntensity * 1.35;
        keyLight.intensity = 2.0;
        accentPoint.intensity = 2.6;
      } else if (s.mood === 'studio') {
        redRimLight.color.setHex(0xf4f5f7);
        redRimLight.intensity = rig.rimIntensity * 1.1;
        keyLight.intensity = 2.9;
        accentPoint.intensity = 1.4;
      } else {
        redRimLight.color.setHex(0xe11d2e);
        redRimLight.intensity = rig.rimIntensity * 1.7;
        keyLight.intensity = 1.35;
        accentPoint.intensity = 3.2;
      }

      // Subtle motion on wheels, orbital rings, and particles
      if (!reducedMotion) {
        orbitalGroup.rotation.y += dt * 0.18;
        particleCloud.rotation.y -= dt * 0.12;
        if (s.autoSpin) {
          for (const w of wheels) {
            w.rotation.z -= dt * 0.9;
          }
        }
      }

      renderer.render(scene, camera);

      if (reducedMotion) return;
      if (isSoftwareGl) {
        afterDraw(() => tick(performance.now()));
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick(performance.now());

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', onResize);
      envTex.dispose();
      shadowTex.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry.dispose();
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => mat.dispose());
          } else {
            m.material.dispose();
          }
        }
      });
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleViewportPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    stateRef.current.dragging = true;
    stateRef.current.lastDragX = e.clientX;
  };

  const handleViewportPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    stateRef.current.pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    stateRef.current.pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    if (stateRef.current.dragging) {
      const dx = e.clientX - stateRef.current.lastDragX;
      stateRef.current.lastDragX = e.clientX;
      stateRef.current.orbitOffset += dx * 0.008;
    }
  };

  const handleViewportPointerUp = () => {
    stateRef.current.dragging = false;
  };

  return (
    <section
      id="universo"
      ref={sectionRef}
      className="relative z-10 border-t border-white/10 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E11D2E]">
              Universo Automotivo 3D
            </p>
            <h2
              className="font-display-ghost mt-2 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ textWrap: 'balance' }}
            >
              Reflexos, Forma e Movimento Contínuo
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#A1A6B3]">
            Composição 3D em tempo real sensível ao scroll e ao toque. Arraste sobre o palco para inspecionar os ângulos e reflexos da carroceria.
          </p>
        </div>

        {/* Full-Width 3D Viewport with Isolated Mount Container & Bottom Dock */}
        <div className="relative mt-10 h-[500px] w-full overflow-hidden rounded-2xl border border-white/12 bg-[#050507] sm:h-[600px]">
          <div
            ref={mountRef}
            data-testid="automotive-3d-canvas"
            onPointerDown={handleViewportPointerDown}
            onPointerMove={handleViewportPointerMove}
            onPointerUp={handleViewportPointerUp}
            onPointerLeave={handleViewportPointerUp}
            className="h-full w-full cursor-grab active:cursor-grabbing"
          />

          {contextLost && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#050507]/95 p-6 text-center">
              <p className="text-sm text-[#D1D5DB]">
                Contexto gráfico 3D pausado temporariamente pelo navegador.
              </p>
            </div>
          )}

          {/* Minimal Top-Left Viewport Label */}
          <div className="pointer-events-none absolute left-4 top-4 sm:left-6 sm:top-6">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/75">
              Estúdio 3D Interativo · Arraste para girar
            </p>
          </div>

          {/* Collapsible Bottom Dock (solid rgba backing — zero backdrop-blur over WebGL) */}
          <div className="absolute inset-x-3 bottom-3 flex flex-col items-center sm:inset-x-6 sm:bottom-5">
            <button
              type="button"
              onClick={() => setDockCollapsed((prev) => !prev)}
              aria-expanded={!dockCollapsed}
              className="mb-1.5 inline-flex items-center gap-1.5 rounded-t-lg border border-b-0 border-white/15 bg-[#0D0E12]/95 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[#D1D5DB] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E]"
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5 text-[#E11D2E]" />
                  <span>Mostrar Controles</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5 text-[#E11D2E]" />
                  <span>Recolher Controles</span>
                </>
              )}
            </button>

            {!dockCollapsed && (
              <div className="flex w-full max-w-[820px] flex-wrap items-center justify-between gap-3 rounded-xl border border-white/15 bg-[#0D0E12]/95 px-3 py-2.5 sm:px-4">
                {/* Camera Presets */}
                <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Ângulos de câmera">
                  {PRESET_OPTIONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPreset(item.id)}
                      className={`min-h-[36px] rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E] ${
                        preset === item.id
                          ? 'bg-[#E11D2E] text-white'
                          : 'text-[#B8BDC9] hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Lighting Moods */}
                <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Iluminação do estúdio">
                  {MOOD_OPTIONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMood(item.id)}
                      className={`min-h-[36px] rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E] ${
                        mood === item.id
                          ? 'border border-[#E11D2E]/80 bg-[#15171E] text-white'
                          : 'border border-transparent text-[#A1A6B3] hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Auto-Orbit Toggle */}
                <button
                  type="button"
                  onClick={() => setAutoSpin((prev) => !prev)}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md border border-white/15 bg-[#15171E] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:border-[#E11D2E] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D2E]"
                >
                  {autoSpin ? (
                    <>
                      <Pause className="h-3.5 w-3.5 text-[#E11D2E]" />
                      <span>Pausar Giro</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 text-[#E11D2E]" />
                      <span>Girar</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
