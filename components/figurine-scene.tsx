"use client";

import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementRef,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  ContactShadows,
  PerspectiveCamera,
  OrbitControls,
} from "@react-three/drei";
import { Box3, Spherical, Vector3, type Group } from "three";

const MODEL_MAX_DIMENSION = 1;
const AUTO_ROTATE_MAX_ANGLE = (50 * Math.PI) / 180;
const AUTO_ROTATE_SPEED = 0.18;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function Figurine() {
  const { scene } = useGLTF("/alex-figurine.glb");
  const ref = useRef<Group>(null!);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.position.set(0, 0, 0);
    ref.current.scale.setScalar(1);
    ref.current.updateWorldMatrix(true, true);

    const box = new Box3().setFromObject(ref.current);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = MODEL_MAX_DIMENSION / maxDim;
    ref.current.scale.setScalar(s);
    ref.current.position.set(
      -center.x * s,
      -center.y * s,
      -center.z * s,
    );
    setReady(true);
  }, [scene]);

  return (
    <group ref={ref} rotation-y={-Math.PI / 2 + Math.PI / 10} visible={ready}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/alex-figurine.glb");

interface FigurineControlsProps {
  isAutoPaused: boolean;
}

function FigurineControls({ isAutoPaused }: FigurineControlsProps) {
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);
  const isAutoPausedRef = useRef(isAutoPaused);
  const autoDirectionRef = useRef(-1);
  const offsetRef = useRef(new Vector3());
  const sphericalRef = useRef(new Spherical());

  useEffect(() => {
    isAutoPausedRef.current = isAutoPaused;
  }, [isAutoPaused]);

  useFrame(({ camera }, delta) => {
    const controls = controlsRef.current;

    if (
      !controls ||
      isAutoPausedRef.current ||
      controls.domElement?.matches(":hover")
    ) {
      return;
    }

    const offset = offsetRef.current.copy(camera.position).sub(controls.target);
    const spherical = sphericalRef.current.setFromVector3(offset);
    let nextAzimuth =
      controls.getAzimuthalAngle() +
      autoDirectionRef.current * AUTO_ROTATE_SPEED * delta;

    if (nextAzimuth <= -AUTO_ROTATE_MAX_ANGLE) {
      nextAzimuth = -AUTO_ROTATE_MAX_ANGLE;
      autoDirectionRef.current = 1;
    } else if (nextAzimuth >= AUTO_ROTATE_MAX_ANGLE) {
      nextAzimuth = AUTO_ROTATE_MAX_ANGLE;
      autoDirectionRef.current = -1;
    }

    spherical.theta = clamp(
      nextAzimuth,
      -AUTO_ROTATE_MAX_ANGLE,
      AUTO_ROTATE_MAX_ANGLE,
    );
    spherical.phi = Math.PI / 2;
    offset.setFromSpherical(spherical);
    camera.position.copy(controls.target).add(offset);
    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableZoom={false}
      enableDamping={false}
      autoRotate={false}
      minPolarAngle={Math.PI / 2}
      maxPolarAngle={Math.PI / 2}
      minAzimuthAngle={-AUTO_ROTATE_MAX_ANGLE}
      maxAzimuthAngle={AUTO_ROTATE_MAX_ANGLE}
    />
  );
}

export function FigurineScene() {
  const [isPointerOver, setIsPointerOver] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const isAutoPaused = isPointerOver || isPointerDown;

  useEffect(() => {
    if (!isPointerDown) return;

    const releasePointer = () => setIsPointerDown(false);

    window.addEventListener("mouseup", releasePointer);
    window.addEventListener("pointerup", releasePointer);
    window.addEventListener("pointercancel", releasePointer);
    window.addEventListener("touchend", releasePointer);
    window.addEventListener("touchcancel", releasePointer);

    return () => {
      window.removeEventListener("mouseup", releasePointer);
      window.removeEventListener("pointerup", releasePointer);
      window.removeEventListener("pointercancel", releasePointer);
      window.removeEventListener("touchend", releasePointer);
      window.removeEventListener("touchcancel", releasePointer);
    };
  }, [isPointerDown]);

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setIsPointerOver(true)}
      onMouseLeave={() => setIsPointerOver(false)}
      onMouseDown={() => setIsPointerDown(true)}
      onMouseUp={() => setIsPointerDown(false)}
      onTouchStart={() => setIsPointerDown(true)}
      onTouchEnd={() => setIsPointerDown(false)}
      onTouchCancel={() => setIsPointerDown(false)}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setIsPointerOver(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setIsPointerOver(false);
      }}
      onPointerDown={() => setIsPointerDown(true)}
      onPointerUp={() => setIsPointerDown(false)}
      onPointerCancel={() => setIsPointerDown(false)}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        className="!absolute inset-0"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={35} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 3]} intensity={1.2} castShadow />
        <directionalLight
          position={[-3, 2, -2]}
          intensity={0.45}
          color="#b79bff"
        />

        <Suspense fallback={null}>
          <Figurine />
          <ContactShadows
            position={[0, -1, 0]}
            opacity={0.35}
            scale={6}
            blur={2.5}
            far={1.5}
          />
          <Environment preset="city" />
        </Suspense>

        <FigurineControls isAutoPaused={isAutoPaused} />
      </Canvas>
    </div>
  );
}
