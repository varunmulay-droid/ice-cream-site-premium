import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF, useVideoTexture } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { bus } from "@/lib/gelato/bus";
import { flavors } from "@/lib/gelato/catalog";

const POSES = [
  { x: 1.22, y: -0.02, s: 1.14 },
  { x: -1.28, y: 0.04, s: 1.24 },
  { x: 1.16, y: 0.02, s: 1.06 },
  { x: 1.32, y: 0.08, s: 0.9 },
  { x: 1.12, y: -0.02, s: 1.02 },
];

const cream = new THREE.Color("#FFF5E1");
const glow = new THREE.Color("#B5EAD7");
const dummy = new THREE.Object3D();

function prepareModel(source: THREE.Object3D) {
  const clone = source.clone(true);
  clone.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      const src = material as THREE.MeshStandardMaterial;
      src.envMapIntensity = 1.05;
      if ("roughness" in src && typeof src.roughness === "number") {
        src.roughness = Math.min(Math.max(src.roughness, 0.18), 0.55);
      }
      if ("metalness" in src && typeof src.metalness === "number") {
        src.metalness = Math.min(src.metalness, 0.08);
      }
    }
  });
  clone.position.set(0, 0, 0);
  clone.rotation.set(0, 0, 0);
  clone.scale.set(1, 1, 1);
  clone.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(clone);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = 1.8 / Math.max(size.y, size.z, size.x, 0.0001);
  return { clone, center, scale };
}

function GelatoModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const fitted = useMemo(() => prepareModel(scene), [scene]);
  return (
    <group scale={fitted.scale}>
      <primitive
        object={fitted.clone}
        position={[-fitted.center.x, -fitted.center.y, -fitted.center.z]}
        dispose={null}
      />
    </group>
  );
}

const SPRINKLES = Array.from({ length: 34 }, (_, i) => ({
  r: 0.85 + (i % 6) * 0.14,
  a: (i / 34) * Math.PI * 2,
  y: ((i * 47) % 100) / 100 * 2.1 - 1.05,
  s: 0.03 + (i % 5) * 0.008,
  sp: 0.25 + (i % 5) * 0.12,
  color: ["#FF3366", "#B5EAD7", "#E5A93C", "#FFB7B2", "#FFF5E1", "#D4A373"][i % 6]!,
}));

function Sprinkles() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => new THREE.SphereGeometry(1, 10, 10), []);
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        roughness: 0.22,
        clearcoat: 0.85,
        clearcoatRoughness: 0.15,
        sheen: 0.4,
        sheenColor: new THREE.Color("#fff5e1"),
      }),
    [],
  );

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    SPRINKLES.forEach((seed, index) => mesh.setColorAt(index, new THREE.Color(seed.color)));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = bus.reduced ? 0 : clock.elapsedTime;
    SPRINKLES.forEach((seed, index) => {
      const angle = seed.a + t * seed.sp * 0.32;
      const field = Math.sin(seed.y * 2.4 + t * 0.7 + index) * 0.1;
      dummy.position.set(
        Math.cos(angle) * (seed.r + field),
        seed.y + Math.sin(t * seed.sp + index) * 0.1,
        Math.sin(angle * 0.85) * seed.r * 0.48,
      );
      dummy.scale.setScalar(seed.s);
      dummy.rotation.set(t * 0.2, angle, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geo, mat, SPRINKLES.length]} />;
}

function Rig() {
  const group = useRef<THREE.Group>(null);
  const scoop = useRef<THREE.Group>(null);
  const bar = useRef<THREE.Group>(null);
  const pose = useRef({ x: POSES[0]!.x, y: POSES[0]!.y, s: POSES[0]!.s, ry: 0.35 });

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const wide = state.size.width >= 860;
    const index = Math.max(0, Math.min(POSES.length - 1, bus.section));
    const target = wide ? POSES[index]! : { x: 0, y: 0.42, s: 0.78 };
    const k = 1 - Math.exp(-2.8 * dt);
    pose.current.x += (target.x - pose.current.x) * k;
    pose.current.y += (target.y - pose.current.y) * k;
    pose.current.s += (target.s - pose.current.s) * k;
    const spin = bus.progress * Math.PI * 2 + bus.pointerX * 0.26;
    pose.current.ry += (spin - pose.current.ry) * k;
    const node = group.current;
    if (!node) return;
    const bob = bus.reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.85) * 0.055;
    node.position.set(
      pose.current.x + bus.pointerX * 0.16,
      pose.current.y + bob + bus.pointerY * 0.08,
      0,
    );
    node.rotation.set(bus.pointerY * 0.2, pose.current.ry, bus.pointerX * -0.06);
    node.scale.setScalar(pose.current.s);

    const t = state.clock.elapsedTime;
    if (scoop.current) {
      scoop.current.position.set(0.95, 0.62 + Math.sin(t * 0.7) * 0.05, -0.45);
      scoop.current.rotation.y = t * 0.35;
    }
    if (bar.current) {
      bar.current.position.set(-0.78, -0.58 + Math.cos(t * 0.55) * 0.04, 0.28);
      bar.current.rotation.z = 0.55 + Math.sin(t * 0.4) * 0.06;
    }
  });

  return (
    <group ref={group}>
      <GelatoModel url="/models/swirl-cone.glb" />
      <group ref={scoop} scale={0.36}>
        <GelatoModel url="/models/scoop.glb" />
      </group>
      <group ref={bar} scale={0.42}>
        <GelatoModel url="/models/bar.glb" />
      </group>
      <Sprinkles />
      <ContactShadows
        position={[0, -1.12, 0]}
        opacity={0.28}
        scale={7}
        blur={2.6}
        far={3}
        color="#2B1B17"
        resolution={256}
      />
    </group>
  );
}

function Lights() {
  const rim = useRef<THREE.PointLight>(null);
  useFrame((_, delta) => {
    const flavor = flavors[bus.flavorIndex] ?? flavors[0]!;
    glow.set(flavor.glow);
    rim.current?.color.lerp(glow, 1 - Math.exp(-2.4 * delta));
  });
  return (
    <>
      <ambientLight intensity={0.92} color="#FFF6EA" />
      <directionalLight position={[4.2, 5.4, 3.6]} intensity={1.45} color="#FFE1CC" />
      <directionalLight position={[-3.2, 1.4, -2]} intensity={0.38} color="#FFB7B2" />
      <pointLight ref={rim} position={[-3.6, -1.2, 2.4]} intensity={12} distance={14} color="#B5EAD7" />
      <Environment resolution={128} frames={1} environmentIntensity={0.85}>
        <Lightformer form="rect" intensity={3.2} color="#fff5e1" position={[0, 2.2, 3]} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={2} color="#ffd2cb" position={[4, 1, 1]} scale={[3, 3, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#b5ead7" position={[-4, -0.4, 2]} scale={[3, 5, 1]} />
      </Environment>
    </>
  );
}

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHasMap;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    uv.y += sin(uv.x * 10.0 + uTime * 0.55) * 0.012 + (uMouse.y - 0.5) * 0.018;
    uv.x += sin(uv.y * 14.0 - uTime * 0.4) * 0.01 + (uMouse.x - 0.5) * 0.02;
    vec3 creamCol = vec3(1.0, 0.961, 0.882);
    vec3 berry = vec3(1.0, 0.718, 0.698);
    vec3 mint = vec3(0.71, 0.918, 0.843);
    float swirl = sin(uv.x * 6.0 + uv.y * 3.5 + uTime * 0.32);
    vec3 wash = mix(creamCol, mix(berry, mint, uv.x), 0.16 + swirl * 0.04);
    vec3 col = wash;
    if (uHasMap > 0.5) {
      vec3 tex = texture2D(uMap, uv).rgb;
      col = mix(wash, tex, 0.5);
    }
    float vign = smoothstep(0.0, 0.22, vUv.x) * smoothstep(1.0, 0.78, vUv.x);
    vign *= smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
    col = mix(creamCol, col, 0.35 + vign * 0.65);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function CreamPlane({ map }: { map: THREE.Texture | null }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const fallback = useMemo(() => {
    const tex = new THREE.DataTexture(new Uint8Array([255, 245, 225, 255]), 1, 1);
    tex.needsUpdate = true;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  const uniforms = useMemo(
    () => ({
      uMap: { value: map ?? fallback },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHasMap: { value: map ? 1 : 0 },
    }),
    [map, fallback],
  );

  useFrame(({ camera, size, clock }) => {
    const cam = camera as THREE.PerspectiveCamera;
    const planeZ = -3.4;
    const dist = Math.abs(cam.position.z - planeZ);
    const height = 2 * Math.tan((cam.fov * Math.PI) / 180 / 2) * dist;
    const width = height * (size.width / Math.max(size.height, 1));
    if (mesh.current) {
      mesh.current.position.set(0, 0.05, planeZ);
      mesh.current.scale.set(width, height, 1);
    }
    if (!mat.current) return;
    mat.current.uniforms.uTime!.value = clock.elapsedTime;
    mat.current.uniforms.uMouse!.value.set(bus.pointerX * 0.5 + 0.5, bus.pointerY * 0.5 + 0.5);
    mat.current.uniforms.uHasMap!.value = map ? 1 : 0;
    mat.current.uniforms.uMap!.value = map ?? fallback;
  });

  return (
    <mesh ref={mesh} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        transparent={false}
        depthWrite={false}
        toneMapped={false}
        uniforms={uniforms}
        vertexShader={vert}
        fragmentShader={frag}
      />
    </mesh>
  );
}

function LiveFilm({ url }: { url: string }) {
  const map = useVideoTexture(url, {
    muted: true,
    loop: true,
    playsInline: true,
    crossOrigin: "anonymous",
    start: true,
  });
  map.colorSpace = THREE.SRGBColorSpace;
  return <CreamPlane map={map} />;
}

function Scene({ filmUrl }: { filmUrl: string }) {
  return (
    <>
      <color attach="background" args={[cream]} />
      <Suspense fallback={<CreamPlane map={null} />}>
        <LiveFilm url={filmUrl} />
      </Suspense>
      <Suspense fallback={null}>
        <Lights />
        <Rig />
      </Suspense>
      <EffectComposer enableNormalPass={false} multisampling={0}>
        <Bloom intensity={0.22} luminanceThreshold={0.96} luminanceSmoothing={0.18} mipmapBlur />
        <Vignette eskil={false} offset={0.35} darkness={0.28} />
      </EffectComposer>
    </>
  );
}

export function CanvasScene({ filmUrl }: { filmUrl: string }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.12, 6.5], fov: 32, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(cream, 1);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <Scene filmUrl={filmUrl} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/swirl-cone.glb");
useGLTF.preload("/models/scoop.glb");
useGLTF.preload("/models/bar.glb");
