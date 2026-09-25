import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface Point3D {
  x: number;
  y: number;
  z: number;
  color?: string;
  size?: number;
}

export default function Hero3DObject() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  
  // Track mouse coordinates relative to the container via Ref to avoid re-renders
  const mouseRef = useRef({ x: 0, y: 0, hover: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = 400);
    let height = (canvas.height = 400);

    // Track resizing of canvas safely using requestAnimationFrame to prevent feedback loop errors
    const resizeObserver = new ResizeObserver((entries) => {
      requestAnimationFrame(() => {
        if (!canvas) return;
        for (let entry of entries) {
          const { width: w, height: h } = entry.contentRect;
          const size = Math.min(w, h, 400) || 400;
          if (canvas.width !== size || canvas.height !== size) {
            width = canvas.width = size;
            height = canvas.height = size;
          }
        }
      });
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const isDark = resolvedTheme === "dark";
    
    // Aesthetic premium colors
    const coreAccent = isDark ? "#e6c280" : "#5c382a";
    const ringAccent1 = isDark ? "rgba(210, 180, 140, 0.45)" : "rgba(92, 56, 42, 0.45)";
    const ringAccent2 = isDark ? "rgba(245, 222, 179, 0.25)" : "rgba(110, 68, 53, 0.25)";
    const particleColor = isDark ? "rgba(230, 194, 128, 0.6)" : "rgba(49, 25, 16, 0.6)";

    // Camera settings
    const fov = 350;
    let rotationX = 0.4; // starting angle
    let rotationY = 0.6;
    let rotationZ = 0;

    // Generate orbiting particles
    const particleCount = 120;
    const particles: Point3D[] = [];
    for (let i = 0; i < particleCount; i++) {
      // Create particle orbits at different radii (torus/sphere-like hybrid shell)
      const radius = 90 + Math.random() * 35;
      const angle = Math.random() * Math.PI * 2;
      const heightOffset = (Math.random() - 0.5) * 40;

      particles.push({
        x: radius * Math.cos(angle),
        y: heightOffset,
        z: radius * Math.sin(angle),
        size: Math.random() * 2 + 0.8,
      });
    }

    // Dynamic rotation parameters
    let targetRotX = 0.4;
    let targetRotY = 0.6;
    let interactiveScale = 1.0;

    const render = () => {
      const mouseVal = mouseRef.current;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Smoothly interpolate towards target rotations influenced by mouse position
      if (mouseVal.hover) {
        targetRotY = 0.6 + mouseVal.x * 0.8;
        targetRotX = 0.4 + mouseVal.y * 0.8;
        interactiveScale = interactiveScale + (1.12 - interactiveScale) * 0.1;
      } else {
        targetRotY += 0.006; // Slow auto-spin on idle
        targetRotX = 0.4 + Math.sin(Date.now() * 0.001) * 0.1;
        interactiveScale = interactiveScale + (1.0 - interactiveScale) * 0.1;
      }

      rotationX += (targetRotX - rotationX) * 0.1;
      rotationY += (targetRotY - rotationY) * 0.1;
      rotationZ += 0.002;

      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosZ = Math.cos(rotationZ);
      const sinZ = Math.sin(rotationZ);

      // Utility to project and rotate a 3D coordinate
      const projectPoint = (x: number, y: number, z: number) => {
        // Apply scaling
        x *= interactiveScale;
        y *= interactiveScale;
        z *= interactiveScale;

        // 3D rotations
        // Rotate Y
        let rx1 = x * cosY - z * sinY;
        let rz1 = x * sinY + z * cosY;

        // Rotate X
        let ry2 = y * cosX - rz1 * sinX;
        let rz2 = y * sinX + rz1 * cosX;

        // Rotate Z
        let rx3 = rx1 * cosZ - ry2 * sinZ;
        let ry3 = rx1 * sinZ + ry2 * cosZ;

        // Projection
        const scale = fov / (fov + rz2);
        const sx = rx3 * scale + centerX;
        const sy = ry3 * scale + centerY;

        return { sx, sy, depth: rz2, visible: rz2 + fov > 0, scale };
      };

      // 1. Draw Holographic Concentric Rings
      const ringSteps = 60;
      const drawRing = (radius: number, color: string, rotationOffset = 0, strokeWidth = 1.5) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
        ctx.beginPath();

        let first = true;
        for (let j = 0; j <= ringSteps; j++) {
          const angle = (j / ringSteps) * Math.PI * 2;
          
          // Generate ring points in local coordinates
          // Vary coordinate planes to give multi-dimensional rings
          let rx = radius * Math.cos(angle);
          let ry = radius * Math.sin(angle) * Math.sin(rotationOffset);
          let rz = radius * Math.sin(angle) * Math.cos(rotationOffset);

          const { sx, sy, visible } = projectPoint(rx, ry, rz);

          if (visible) {
            if (first) {
              ctx.moveTo(sx, sy);
              first = false;
            } else {
              ctx.lineTo(sx, sy);
            }
          }
        }
        ctx.stroke();
      };

      // Draw three concentric outer orbits running in cross-planes
      drawRing(110, ringAccent2, 0.4, 1.0);
      drawRing(110, ringAccent1, -0.4, 1.2);
      drawRing(85, ringAccent1, 1.2, 1.5);
      drawRing(60, ringAccent2, -1.0, 1.0);

      // 2. Draw verification link lines between active orbit nodes
      const nodeCount = 8;
      const nodePoints: { sx: number; sy: number; depth: number }[] = [];
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2 + Date.now() * 0.0005;
        const rx = 85 * Math.cos(angle);
        const ry = 25 * Math.sin(angle * 2);
        const rz = 85 * Math.sin(angle);
        const pt = projectPoint(rx, ry, rz);
        if (pt.visible) {
          nodePoints.push({ sx: pt.sx, sy: pt.sy, depth: pt.depth });
        }
      }

      // Draw interconnecting web lines inside the core
      ctx.strokeStyle = isDark ? "rgba(230, 194, 128, 0.12)" : "rgba(92, 56, 42, 0.1)";
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodePoints.length; i++) {
        for (let j = i + 1; j < nodePoints.length; j++) {
          const dist = Math.hypot(nodePoints[i].sx - nodePoints[j].sx, nodePoints[i].sy - nodePoints[j].sy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(nodePoints[i].sx, nodePoints[i].sy);
            ctx.lineTo(nodePoints[j].sx, nodePoints[j].sy);
            ctx.stroke();
          }
        }
      }

      // Draw key nodes with outer circular halos
      nodePoints.forEach((pt) => {
        ctx.fillStyle = coreAccent;
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = ringAccent1;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, 9, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 3. Update & Draw Orbiting Particle Constellation
      particles.forEach((p, index) => {
        // Orbit dynamics: spin around Y-axis
        const orbitSpeed = 0.004 + (index % 5) * 0.001;
        const currentAngle = Math.atan2(p.z, p.x) + (mouseVal.hover ? orbitSpeed * 1.8 : orbitSpeed);
        const r = Math.hypot(p.x, p.z);
        p.x = r * Math.cos(currentAngle);
        p.z = r * Math.sin(currentAngle);

        const pt = projectPoint(p.x, p.y, p.z);
        if (pt.visible) {
          // Fade according to distance/depth
          const opacity = Math.max(0.15, Math.min(1.0, 1 - (pt.depth + 100) / 200));
          ctx.fillStyle = isDark 
            ? `rgba(230, 194, 128, ${opacity * 0.75})` 
            : `rgba(92, 56, 42, ${opacity * 0.75})`;
          ctx.beginPath();
          ctx.arc(pt.sx, pt.sy, p.size * pt.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 4. Draw Centerpiece Glowing Sphere & Vector Icon (Admission Portal Core)
      const centerPt = projectPoint(0, 0, 0);
      if (centerPt.visible) {
        // Glowing radial light for the 3D core
        const grad = ctx.createRadialGradient(
          centerPt.sx, centerPt.sy, 2,
          centerPt.sx, centerPt.sy, 32 * interactiveScale
        );
        grad.addColorStop(0, coreAccent);
        grad.addColorStop(0.3, isDark ? "rgba(230, 194, 128, 0.4)" : "rgba(92, 56, 42, 0.4)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(centerPt.sx, centerPt.sy, 32 * interactiveScale, 0, Math.PI * 2);
        ctx.fill();

        // Draw a minimalist futuristic "Verification Lock / Graduation Cap" glyph inside the core
        ctx.strokeStyle = isDark ? "#ffffff" : "#fdfbf7";
        ctx.lineWidth = 2.5 * interactiveScale;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();
        // Inner cap diamond
        const size = 12 * interactiveScale;
        ctx.moveTo(centerPt.sx, centerPt.sy - size * 0.7);
        ctx.lineTo(centerPt.sx + size, centerPt.sy);
        ctx.lineTo(centerPt.sx, centerPt.sy + size * 0.7);
        ctx.lineTo(centerPt.sx - size, centerPt.sy);
        ctx.closePath();
        // Cap neck/tassel line
        ctx.moveTo(centerPt.sx - size * 0.5, centerPt.sy + size * 0.35);
        ctx.lineTo(centerPt.sx - size * 0.5, centerPt.sy + size * 1.1);
        ctx.lineTo(centerPt.sx - size * 0.1, centerPt.sy + size * 0.9);
        ctx.stroke();
      }

      // Directly update transform styles inside requestAnimationFrame to prevent component re-renders
      if (canvas) {
        canvas.style.transform = mouseVal.hover
          ? `translateZ(20px) rotateY(${mouseVal.x * 12}deg) rotateX(${-mouseVal.y * 12}deg)`
          : "translateZ(0px) rotateY(0deg) rotateX(0deg)";
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      cancelAnimationFrame(animationId);
    };
  }, [resolvedTheme]);

  // Handle local track coordinates inside container without triggering state re-renders
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseRef.current = { x, y, hover: true };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: 0, y: 0, hover: false };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[320px] md:max-w-[400px] aspect-square mx-auto flex items-center justify-center cursor-grab active:cursor-grabbing group"
      style={{ perspective: 1000 }}
    >
      {/* Interactive holographic neon floor ring reflection shadow */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-[12px] bg-amber-500/10 dark:bg-amber-400/5 rounded-full blur-md group-hover:scale-110 transition-transform duration-500 ease-out" />
      
      {/* Glowing atmospheric background portal */}
      <div className="absolute inset-0 rounded-full border border-amber-500/10 dark:border-amber-400/5 bg-gradient-to-tr from-amber-500/3 to-transparent dark:from-amber-500/1 dark:to-transparent scale-90 blur-xl opacity-75 group-hover:scale-100 transition-transform duration-500" />
      
      <canvas
        ref={canvasRef}
        className="relative z-10 transition-transform duration-300 ease-out"
      />
    </div>
  );
}
