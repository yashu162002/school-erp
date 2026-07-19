import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const DistortionImageReveal = ({ src, alt, className = "" }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const materialRef = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // 1. Initialize Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    // Orthographic camera for flat 2D rendering of the image plane
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    let width = container.clientWidth;
    let height = container.clientHeight;
    renderer.setSize(width, height);

    // 2. Define Custom Shader Shaders (Vertex + Fragment)
    const vertexShader = `
      varying vec2 vUv;
      uniform vec2 uScale;
      void main() {
        // Apply object-cover scale correction
        vUv = (uv - 0.5) * uScale + 0.5;
        vUv.y = 1.0 - vUv.y; // Flip Y back upright because flipY is set to false
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform float uProgress;
      uniform float uHover;
      uniform float uTime;
      varying vec2 vUv;

      // Pseudo-random wave distortion function
      float getWave(vec2 p) {
        float wave = sin(p.x * 8.0 + uTime * 2.0) * cos(p.y * 6.0 + uTime * 1.5);
        wave += sin(p.y * 15.0 - uTime * 3.0) * 0.4;
        return wave * 0.5;
      }

      void main() {
        vec2 uv = vUv;

        // 1. Liquid refraction offset
        // Combined progress ripple + hover distortion
        float distortionStrength = (uHover * 0.04) + (smoothstep(0.0, 0.4, 1.0 - uProgress) * 0.03);
        float wave = getWave(uv * 2.0);
        
        vec2 distortedUv = uv + vec2(wave * distortionStrength, wave * distortionStrength * 0.7);

        // Discard border artifacts
        distortedUv = clamp(distortedUv, 0.0, 1.0);

        vec4 texColor = texture2D(uTexture, distortedUv);

        // 2. Diagonal wipe boundary reveal
        // uv.x + uv.y goes from 0.0 to 2.0
        float diagonal = uv.x + uv.y;
        
        // Add waving distortion to the reveal edge
        float edgeWave = sin(uv.x * 12.0 + uTime * 3.5) * 0.04;
        
        // Map uProgress (0.0 to 1.0) into a threshold range (0.0 to 2.2) to fully cover corners
        float threshold = uProgress * 2.15;
        
        // Generate soft mask using smoothstep
        float mask = smoothstep(diagonal - edgeWave - 0.08, diagonal - edgeWave, threshold);

        gl_FragColor = vec4(texColor.rgb, texColor.a * mask);
      }
    `;

    // 3. Load Texture & Create Mesh
    const textureLoader = new THREE.TextureLoader();
    let mesh;

    textureLoader.load(src, (texture) => {
      // Configure filters
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.flipY = false;
      texture.premultiplyAlpha = false;

      // Create uniforms
      const uniforms = {
        uTexture: { value: texture },
        uProgress: { value: 0 },
        uHover: { value: 0 },
        uTime: { value: 0 },
        uScale: { value: new THREE.Vector2(1, 1) }
      };

      // Set scale uniforms (object-cover logic)
      const updateTextureScale = () => {
        if (!texture.image) return;
        const canvasRatio = width / height;
        const imageRatio = texture.image.width / texture.image.height;
        let scaleX = 1;
        let scaleY = 1;

        if (canvasRatio > imageRatio) {
          scaleY = imageRatio / canvasRatio;
        } else {
          scaleX = canvasRatio / imageRatio;
        }
        uniforms.uScale.value.set(scaleX, scaleY);
      };

      updateTextureScale();

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
        depthTest: false
      });
      materialRef.current = material;

      const geometry = new THREE.PlaneGeometry(2, 2);
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Trigger GSAP ScrollTrigger reveal once mesh is loaded
      tweenRef.current = gsap.to(material.uniforms.uProgress, {
        value: 1.0,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    });

    // 4. Mouse Hover Interaction Handlers
    const handleMouseEnter = () => {
      if (materialRef.current) {
        gsap.to(materialRef.current.uniforms.uHover, {
          value: 1.0,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseLeave = () => {
      if (materialRef.current) {
        gsap.to(materialRef.current.uniforms.uHover, {
          value: 0.0,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 5. Resize observer
    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      renderer.setSize(width, height);
      
      if (materialRef.current && materialRef.current.uniforms.uTexture.value.image) {
        const texture = materialRef.current.uniforms.uTexture.value;
        const canvasRatio = width / height;
        const imageRatio = texture.image.width / texture.image.height;
        let scaleX = 1;
        let scaleY = 1;

        if (canvasRatio > imageRatio) {
          scaleY = imageRatio / canvasRatio;
        } else {
          scaleX = canvasRatio / imageRatio;
        }
        materialRef.current.uniforms.uScale.value.set(scaleX, scaleY);
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 6. Animation Render Loop
    let animationFrameId;
    const startTime = performance.now();
 
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = (performance.now() - startTime) * 0.001;
      }
      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup Resources
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();

      if (tweenRef.current) {
        if (tweenRef.current.scrollTrigger) {
          tweenRef.current.scrollTrigger.kill();
        }
        tweenRef.current.kill();
      }

      scene.clear();
      if (mesh) {
        mesh.geometry.dispose();
        mesh.material.dispose();
      }
      renderer.dispose();
    };
  }, [src]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full overflow-hidden bg-[#10131e]/5 select-none rounded-xl ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      
      {/* Screen Reader Image Fallback */}
      <img src={src} alt={alt} className="sr-only" />
    </div>
  );
};
