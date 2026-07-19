import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const WebGLHeroBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    if (!parent) return;

    // 1. Initialize Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    
    // Add atmospheric fog for depth
    scene.background = new THREE.Color('#10131e');
    scene.fog = new THREE.FogExp2('#10131e', 0.0025);

    const camera = new THREE.PerspectiveCamera(
      60,
      parent.clientWidth / parent.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 120;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: false
    });
    renderer.setSize(parent.clientWidth, parent.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Helper: Dynamic particle texture
    const createCircleTexture = () => {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 32;
      pCanvas.height = 32;
      const ctx = pCanvas.getContext('2d');
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(251, 191, 36, 0.25)'); // Golden outer glow tint
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(pCanvas);
    };

    const particleTexture = createCircleTexture();
    particleTexture.flipY = false;

    // 2. Create Particle System
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const randomScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Random coordinates in space
      positions[i] = (Math.random() - 0.5) * 400;
      positions[i + 1] = (Math.random() - 0.5) * 400;
      positions[i + 2] = (Math.random() - 0.5) * 400;
      randomScales[i / 3] = 0.5 + Math.random() * 1.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 1.8,
      map: particleTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Create Floating Light Rays (Drifting Volumetric Planes)
    const raysGroup = new THREE.Group();
    const rayCount = 5;
    const rayGeometries = [];
    const rayMaterials = [];

    const colors = [
      new THREE.Color('#C98A00'), // Gold
      new THREE.Color('#24316B'), // Primary Blue
      new THREE.Color('#C98A00'), // Gold
      new THREE.Color('#1B2554'), // Dark Slate Blue
      new THREE.Color('#C98A00'), // Gold
    ];

    for (let i = 0; i < rayCount; i++) {
      const width = 12 + Math.random() * 20;
      const height = 150 + Math.random() * 100;
      const rayGeo = new THREE.PlaneGeometry(width, height);
      rayGeometries.push(rayGeo);

      const rayMat = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.04 + Math.random() * 0.05,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      rayMaterials.push(rayMat);

      const rayMesh = new THREE.Mesh(rayGeo, rayMat);
      
      // Position rays in coordinates
      rayMesh.position.set(
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 100
      );
      
      // Rotate diagonally to create shaft projection
      rayMesh.rotation.z = -0.5 - Math.random() * 0.4;
      rayMesh.rotation.x = Math.random() * 0.2;
      rayMesh.rotation.y = Math.random() * 0.2;
      
      // Dynamic parameters for update loop
      rayMesh.userData = {
        driftSpeedX: (Math.random() - 0.5) * 0.02,
        driftSpeedY: (Math.random() - 0.5) * 0.02,
        pulseSpeed: 0.005 + Math.random() * 0.015,
        pulseOffset: Math.random() * 100,
        baseOpacity: rayMat.opacity
      };

      raysGroup.add(rayMesh);
    }
    scene.add(raysGroup);

    // 4. Mouse Move Event Handler
    const handleMouseMove = (e) => {
      // Normalize values to range -1 to 1
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current.targetX = (x / rect.width) * 2 - 1;
      mouseRef.current.targetY = -(y / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. Window Resize Event Handler
    const handleResize = () => {
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    // ResizeObserver ensures correctness if parent element sizes dynamically
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(parent);

    // 6. Animation Render Loop
    let animationFrameId;
    const startTime = performance.now();
 
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
 
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Slow particle rotation
      particles.rotation.y = elapsedTime * 0.015;
      particles.rotation.x = elapsedTime * 0.005;

      // Drifting and Pulsing Light Rays
      raysGroup.children.forEach((ray, i) => {
        // Drift position
        ray.position.x += ray.userData.driftSpeedX;
        ray.position.y += ray.userData.driftSpeedY;

        // Boundaries check (wrap around space)
        if (Math.abs(ray.position.x) > 120) ray.userData.driftSpeedX *= -1;
        if (Math.abs(ray.position.y) > 80) ray.userData.driftSpeedY *= -1;

        // Pulse opacity & scale
        const offsetTime = elapsedTime + ray.userData.pulseOffset;
        ray.material.opacity = ray.userData.baseOpacity + Math.sin(offsetTime * ray.userData.pulseSpeed * 100) * 0.02;
        ray.scale.x = 1.0 + Math.sin(offsetTime * ray.userData.pulseSpeed * 40) * 0.05;
      });

      // Smooth Lerp Camera position from Mouse Interactive movements
      const mouse = mouseRef.current;
      // Interpolate target inputs
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Parallax shifts on Camera
      camera.position.x = mouse.x * 25;
      camera.position.y = mouse.y * 15;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup Resources on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();

      // Dispose geometries
      geometry.dispose();
      rayGeometries.forEach((g) => g.dispose());

      // Dispose materials
      material.dispose();
      rayMaterials.forEach((m) => m.dispose());

      // Dispose textures
      particleTexture.dispose();

      // Clean renderer
      renderer.dispose();
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
    />
  );
};
