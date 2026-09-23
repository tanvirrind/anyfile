import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Camera,
  Grid,
  Box,
  Eye,
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { StlBoundingBox } from '../../lib/3d/stlEngine';

export interface ThreeDViewerProps {
  positions: Float32Array; // 3 floats per vertex (9 floats per triangle)
  normals?: Float32Array;
  boundingBox?: StlBoundingBox;
  title?: string;
  triangleCount?: number;
  height?: number | string;
  className?: string;
}

type RenderMode = 'smooth' | 'flat' | 'wireframe' | 'normals';

export const ThreeDViewer: React.FC<ThreeDViewerProps> = ({
  positions,
  normals,
  boundingBox,
  title,
  triangleCount,
  height = 480,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [renderMode, setRenderMode] = useState<RenderMode>('smooth');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showBoundingBox, setShowBoundingBox] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);

  // References to Three.js internal objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const wireframeMeshRef = useRef<THREE.LineSegments | null>(null);
  const boxHelperRef = useRef<THREE.BoxHelper | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Camera Orbit state
  const isDraggingRef = useRef<boolean>(false);
  const dragModeRef = useRef<'rotate' | 'pan'>('rotate');
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const sphericalRef = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 120,
    theta: Math.PI / 4,
    phi: Math.PI / 3,
  });
  const targetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const initialDistanceRef = useRef<number>(120);

  // Update Camera position from spherical coords
  const updateCamera = useCallback(() => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = sphericalRef.current;
    const target = targetRef.current;

    const x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    const y = target.y + radius * Math.cos(phi);
    const z = target.z + radius * Math.sin(phi) * Math.cos(theta);

    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(target);
  }, []);

  // Reset Camera to standard isometric angle
  const resetCamera = useCallback(() => {
    sphericalRef.current = {
      radius: initialDistanceRef.current,
      theta: Math.PI / 4,
      phi: Math.PI / 3,
    };
    targetRef.current.set(0, 0, 0);
    updateCamera();
  }, [updateCamera]);

  // Take high-res snapshot
  const takeSnapshot = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${(title || '3d-model').replace(/[^a-zA-Z0-9_-]/g, '_')}-preview.png`;
    link.href = dataUrl;
    link.click();
  }, [title]);

  // Initialize Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    try {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a); // dark slate 900
      sceneRef.current = scene;

      const width = container.clientWidth || 600;
      const heightNum = typeof height === 'number' ? height : container.clientHeight || 480;

      const camera = new THREE.PerspectiveCamera(45, width / heightNum, 0.1, 5000);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        preserveDrawingBuffer: true,
      });
      renderer.setSize(width, heightNum);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      rendererRef.current = renderer;

      // Lights: High-grade studio lighting setup
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0x60a5fa, 1.2); // Light blue key
      keyLight.position.set(200, 300, 200);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xf1f5f9, 0.8); // Neutral fill
      fillLight.position.set(-200, 150, -200);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.6); // Cyan rim light
      rimLight.position.set(0, -200, 200);
      scene.add(rimLight);

      // Animation loop
      const animate = () => {
        animFrameIdRef.current = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      // ResizeObserver
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = entry.contentRect.width;
          const h = typeof height === 'number' ? height : entry.contentRect.height || 480;
          if (w > 0 && h > 0) {
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
          }
        }
      });
      resizeObserver.observe(container);

      return () => {
        resizeObserver.disconnect();
        if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
        renderer.dispose();
      };
    } catch {
      setWebGlSupported(false);
    }
  }, [height]);

  // Load and update geometry when `positions` changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !positions || positions.length === 0) return;

    // Clean up previous mesh
    if (meshRef.current) {
      scene.remove(meshRef.current);
      meshRef.current.geometry.dispose();
      if (Array.isArray(meshRef.current.material)) {
        meshRef.current.material.forEach(m => m.dispose());
      } else {
        meshRef.current.material.dispose();
      }
      meshRef.current = null;
    }

    if (wireframeMeshRef.current) {
      scene.remove(wireframeMeshRef.current);
      wireframeMeshRef.current.geometry.dispose();
      wireframeMeshRef.current = null;
    }

    if (boxHelperRef.current) {
      scene.remove(boxHelperRef.current);
      boxHelperRef.current = null;
    }

    if (gridHelperRef.current) {
      scene.remove(gridHelperRef.current);
      gridHelperRef.current = null;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    if (normals && normals.length === positions.length) {
      geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    } else {
      geometry.computeVertexNormals();
    }

    // Center geometry around (0, 0, 0)
    geometry.computeBoundingBox();
    const box = geometry.boundingBox || new THREE.Box3();
    const center = new THREE.Vector3();
    box.getCenter(center);
    geometry.translate(-center.x, -center.y, -center.z);

    // Recompute after translation
    geometry.computeBoundingBox();
    const translatedBox = geometry.boundingBox || new THREE.Box3();
    const size = new THREE.Vector3();
    translatedBox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z, 1);

    // Position mesh bottom on the ground grid (Y = 0)
    geometry.translate(0, size.y / 2, 0);

    // Material setup
    const material = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Electric cyan/teal
      roughness: 0.35,
      metalness: 0.15,
      flatShading: renderMode === 'flat',
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Wireframe overlay
    const wireframeGeom = new THREE.WireframeGeometry(geometry);
    const wireframeMat = new THREE.LineBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.4 });
    const wireframeMesh = new THREE.LineSegments(wireframeGeom, wireframeMat);
    wireframeMesh.visible = renderMode === 'wireframe';
    scene.add(wireframeMesh);
    wireframeMeshRef.current = wireframeMesh;

    // Bounding Box helper
    const boxHelper = new THREE.BoxHelper(mesh, 0xf59e0b); // Amber box
    boxHelper.visible = showBoundingBox;
    scene.add(boxHelper);
    boxHelperRef.current = boxHelper;

    // Build Plate Ground Grid
    const gridSize = Math.max(maxDim * 1.8, 100);
    const gridDivisions = 20;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x38bdf8, 0x334155);
    gridHelper.position.y = 0;
    gridHelper.visible = showGrid;
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    // Set optimal initial camera distance based on model bounding size
    const distance = maxDim * 2.2;
    initialDistanceRef.current = distance;
    sphericalRef.current.radius = distance;
    targetRef.current.set(0, size.y / 2, 0);
    updateCamera();
  }, [positions, normals, updateCamera]);

  // Update render mode
  useEffect(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;

    if (renderMode === 'normals') {
      mesh.material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    } else {
      mesh.material = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.35,
        metalness: 0.15,
        flatShading: renderMode === 'flat',
        side: THREE.DoubleSide,
      });
    }

    if (wireframeMeshRef.current) {
      wireframeMeshRef.current.visible = renderMode === 'wireframe';
    }
  }, [renderMode]);

  // Update visual helpers
  useEffect(() => {
    if (gridHelperRef.current) gridHelperRef.current.visible = showGrid;
  }, [showGrid]);

  useEffect(() => {
    if (boxHelperRef.current) boxHelperRef.current.visible = showBoundingBox;
  }, [showBoundingBox]);

  // Mouse & Touch Orbit Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragModeRef.current = e.button === 2 || e.shiftKey ? 'pan' : 'rotate';
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - mousePosRef.current.x;
    const dy = e.clientY - mousePosRef.current.y;
    mousePosRef.current = { x: e.clientX, y: e.clientY };

    if (dragModeRef.current === 'rotate') {
      // Rotate spherical coordinates
      sphericalRef.current.theta -= dx * 0.008;
      sphericalRef.current.phi = Math.max(0.05, Math.min(Math.PI - 0.05, sphericalRef.current.phi - dy * 0.008));
    } else {
      // Pan camera target in screen space
      if (!cameraRef.current) return;
      const panFactor = sphericalRef.current.radius * 0.0015;
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(cameraRef.current.quaternion);
      const up = new THREE.Vector3(0, 1, 0).applyQuaternion(cameraRef.current.quaternion);

      targetRef.current.addScaledVector(right, -dx * panFactor);
      targetRef.current.addScaledVector(up, dy * panFactor);
    }

    updateCamera();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1 + (e.deltaY > 0 ? 0.08 : -0.08);
    sphericalRef.current.radius = Math.max(2, Math.min(5000, sphericalRef.current.radius * zoomFactor));
    updateCamera();
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  if (!webGlSupported) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3">
        <AlertCircle className="w-12 h-12 text-amber-400" />
        <h4 className="text-white font-bold text-base">WebGL 3D Acceleration Unavailable</h4>
        <p className="text-slate-400 text-xs max-w-sm">
          Your browser does not currently support WebGL rendering. Enable hardware acceleration in browser settings to interact with the 3D model.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl select-none ${className}`}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Top Header Overlay: Model Title & Quick Metrics */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-lg pointer-events-auto space-y-1 max-w-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h4 className="text-xs font-bold text-white truncate">
              {title || '3D Geometry Workspace'}
            </h4>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-300">
            {triangleCount !== undefined && (
              <span className="bg-white/10 px-2 py-0.5 rounded">
                {triangleCount.toLocaleString()} Triangles
              </span>
            )}
            {boundingBox && (
              <span className="bg-white/10 px-2 py-0.5 rounded text-cyan-300">
                {boundingBox.size.x.toFixed(1)} × {boundingBox.size.y.toFixed(1)} × {boundingBox.size.z.toFixed(1)} mm
              </span>
            )}
          </div>
        </div>

        {/* View Preset Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl shadow-lg pointer-events-auto">
          <button
            onClick={resetCamera}
            title="Reset Isometric View"
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Print Bed Grid"
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              showGrid ? 'text-blue-400 bg-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowBoundingBox(!showBoundingBox)}
            title="Toggle Bounding Box"
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              showBoundingBox ? 'text-amber-400 bg-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Box className="w-4 h-4" />
          </button>
          <button
            onClick={takeSnapshot}
            title="Save High-Res Snapshot (PNG)"
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bottom Shading Mode Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-white/10 px-2 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 pointer-events-auto">
        <button
          onClick={() => setRenderMode('smooth')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            renderMode === 'smooth'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smooth</span>
        </button>
        <button
          onClick={() => setRenderMode('flat')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            renderMode === 'flat'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Facets</span>
        </button>
        <button
          onClick={() => setRenderMode('wireframe')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            renderMode === 'wireframe'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Wireframe</span>
        </button>
        <button
          onClick={() => setRenderMode('normals')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            renderMode === 'normals'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Normals</span>
        </button>
      </div>

      {/* Navigation Hint */}
      <div className="absolute bottom-4 right-4 hidden md:block text-[10px] text-slate-500 bg-slate-900/60 px-2.5 py-1 rounded-lg backdrop-blur-xs border border-white/5 pointer-events-none">
        Left Click: Rotate • Right Click / Shift: Pan • Wheel: Zoom
      </div>
    </div>
  );
};
