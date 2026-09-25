import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  speedX: number;
  speedY: number;
  speedZ: number;
  size: number;
  alpha: number;
}

interface WireframeShape {
  vertices: Point3D[];
  edges: [number, number][];
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  size: number;
}

export default function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse coordinates locally
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    // Track resizing
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse move handling for interactive camera drift
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - window.innerWidth / 2) * 0.05;
      targetMouseY = (e.clientY - window.innerHeight / 2) * 0.05;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Color definitions based on the theme
    const isDark = resolvedTheme === "dark";
    // Cohesive premium colors: warm espresso/amber tones for coffee vibe
    const particleColor = isDark ? "rgba(210, 180, 140, " : "rgba(92, 56, 42, ";
    const lineColor = isDark ? "rgba(210, 180, 140, 0.06)" : "rgba(92, 56, 42, 0.05)";
    const wireframeColor = isDark ? "rgba(245, 222, 179, 0.15)" : "rgba(49, 25, 16, 0.1)";

    // 3D camera projection parameters
    const fov = 300;
    let cameraAngleX = 0;
    let cameraAngleY = 0;

    // Generate 3D point cloud
    const particleCount = 45;
    const points: Point3D[] = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = 220;
      // Distribute points in a spherical shell
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = (Math.random() * 2 - 1) * radius;

      points.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        speedZ: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    // Generate 3D floating geometric shapes (wireframes)
    // Create an octahedron (8-faced shape) and a cube
    const shapes: WireframeShape[] = [
      // Shape 1: Octahedron
      {
        vertices: [
          { x: 0, y: -45, z: 0, baseX: 0, baseY: -45, baseZ: 0, speedX: 0, speedY: 0, speedZ: 0, size: 0, alpha: 1 },
          { x: 45, y: 0, z: 0, baseX: 45, baseY: 0, baseZ: 0, speedX: 0, speedY: 0, speedZ: 0, size: 0, alpha: 1 },
          { x: 0, y: 0, z: 45, baseX: 0, baseY: 0, baseZ: 45, speedX: 0, speedY: 0, speedZ: 0, size: 0, alpha: 1 },
          { x: -45, y: 0, z: 0, baseX: -45, baseY: 0, baseZ: 0, speedX: 0, speedY: 0, speedZ: 0, size: 0, alpha: 1 },
          { x: 0, y: 0, z: -45, baseX: 0, baseY: 0, baseZ: -45, speedX: 0, speedY: 0, speedZ: 0, size: 0, alpha: 1 },
          { x: 0, y: 45, z: 0, baseX: 0, baseY: 45, baseZ: 0, speedX: 0, speedY: 0, speedZ: 0, size: 0, alpha: 1 },
        ],
        edges: [
          [0, 1], [0, 2], [0, 3], [0, 4], // Top pyramid
          [1, 2], [2, 3], [3, 4], [4, 1], // Middle square
          [5, 1], [5, 2], [5, 3], [5, 4], // Bottom pyramid
        ],
        x: -width * 0.25,
        y: -height * 0.15,
        z: 80,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        rotSpeedX: 0.003,
        rotSpeedY: 0.005,
        size: 1.2,
      },
      // Shape 2: Cube
      {
        vertices: [
          { x: -25, y: -25, z: -25, baseX: -25, baseY: -25, baseZ: -25, speedX: 0, speedY: 0, speedZ: 0, size: 0, alpha: 1 },
          { x: 25, y: -25, z: -25, baseX: 25, baseY: -25, baseZ: -25, speedX: 0, speedY: 0, speedZ: 0, size: 0, alpha: 1 },
          { x: 25, y: 25, z: -25, baseX: 25, baseY: 25, baseZ: -25, speedX: 0, speedY: 0, speedZ: 0, size: 0, alpha: 1 },
          { x: -25, y: 25, z: -25, baseX: -25, baseY: 25, baseZ: -25, speedX: 0, speedY: 0, speedZ: 0, size: 0, alpha: 1 },
          { x: -25, y: -25, z: 25, baseX: -25, baseY: -25, baseZ: 25, speedX: 0, speedY: 0, speedZ: 0, size: 0, alpha: 1 },
          { x: 25, y: -25, z: 25, baseX: 25, baseY: -25, baseZ: 25, speedX: 0, speedY: 0, speedZ: 0, size: 0, alpha: 1 },
          { x: 25, y: 25, z: 25, baseX: 25, baseY: 25, baseZ: 25, speedX: 0, speedY: 0, speedZ: 0, size: 0, alpha: 1 },
          { x: -25, y: 25, z: 25, baseX: -25, baseY: 25, baseZ: 25, speedX: 0, speedY: 0, speedZ: 0, size: 0, alpha: 1 },
        ],
        edges: [
          [0, 1], [1, 2], [2, 3], [3, 0], // Back face
          [4, 5], [5, 6], [6, 7], [7, 4], // Front face
          [0, 4], [1, 5], [2, 6], [3, 7], // Connecting edges
        ],
        x: width * 0.3,
        y: height * 0.2,
        z: 120,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        rotSpeedX: -0.002,
        rotSpeedY: 0.004,
        size: 1.0,
      },
    ];

    // Main 3D Render loop
    const render = () => {
      // Clear canvas with tiny tail for trail effect
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Update positions of floating shapes relative to screen size dynamically
      shapes[0].x = -width * 0.3;
      shapes[0].y = -height * 0.15;
      shapes[1].x = width * 0.32;
      shapes[1].y = height * 0.22;

      // Interpolate mouse movement smoothly
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Apply camera angles based on mouse
      cameraAngleY = mouseX * 0.005;
      cameraAngleX = -mouseY * 0.005;

      // Slowly rotate background particle space
      const timeFactor = Date.now() * 0.0001;
      const cosCamX = Math.cos(cameraAngleX + Math.sin(timeFactor * 0.5) * 0.1);
      const sinCamX = Math.sin(cameraAngleX + Math.sin(timeFactor * 0.5) * 0.1);
      const cosCamY = Math.cos(cameraAngleY + timeFactor * 0.15);
      const sinCamY = Math.sin(cameraAngleY + timeFactor * 0.15);

      // Render wireframe shapes first (deeper layer)
      shapes.forEach((shape) => {
        shape.rotX += shape.rotSpeedX;
        shape.rotY += shape.rotSpeedY;

        const cosX = Math.cos(shape.rotX);
        const sinX = Math.sin(shape.rotX);
        const cosY = Math.cos(shape.rotY);
        const sinY = Math.sin(shape.rotY);

        // Project and rotate shape vertices
        const projectedVertices = shape.vertices.map((v) => {
          // Local rotation (around shape origin)
          let lx = v.baseX;
          let ly = v.baseY;
          let lz = v.baseZ;

          // Rotate X
          const r1y = ly * cosX - lz * sinX;
          const r1z = ly * sinX + lz * cosX;
          ly = r1y;
          lz = r1z;

          // Rotate Y
          const r2x = lx * cosY + lz * sinY;
          const r2z = -lx * sinY + lz * cosY;
          lx = r2x;
          lz = r2z;

          // Translate to world space
          let wx = lx * shape.size + shape.x;
          let wy = ly * shape.size + shape.y;
          let wz = lz * shape.size + shape.z;

          // Apply Global Camera rotations
          // Y Camera rotation
          const g1x = wx * cosCamY + wz * sinCamY;
          const g1z = -wx * sinCamY + wz * cosCamY;
          wx = g1x;
          wz = g1z;

          // X Camera rotation
          const g2y = wy * cosCamX - wz * sinCamX;
          const g2z = wy * sinCamX + wz * cosCamX;
          wy = g2y;
          wz = g2z;

          // 3D Perspective Projection
          const scale = fov / (fov + wz + 300);
          const sx = wx * scale + centerX;
          const sy = wy * scale + centerY;

          return { sx, sy, wz, visible: wz + 300 > 0 };
        });

        // Draw edges of wireframe
        ctx.strokeStyle = wireframeColor;
        ctx.lineWidth = 1.0;
        shape.edges.forEach(([i, j]) => {
          const v1 = projectedVertices[i];
          const v2 = projectedVertices[j];
          if (v1.visible && v2.visible) {
            ctx.beginPath();
            ctx.moveTo(v1.sx, v1.sy);
            ctx.lineTo(v2.sx, v2.sy);
            ctx.stroke();
          }
        });

        // Draw vertex glowing dots
        projectedVertices.forEach((v) => {
          if (v.visible) {
            ctx.fillStyle = wireframeColor;
            ctx.beginPath();
            ctx.arc(v.sx, v.sy, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });

      // Render and update 3D particle points
      const projectedPoints = points.map((p) => {
        // Apply slow internal drift/movement
        p.x = p.baseX + Math.sin(timeFactor * 2 + p.baseX) * 15;
        p.y = p.baseY + Math.cos(timeFactor * 1.5 + p.baseY) * 15;
        p.z = p.baseZ + Math.sin(timeFactor + p.baseZ) * 15;

        // Apply camera rotation around Y-axis
        let x1 = p.x * cosCamY + p.z * sinCamY;
        let z1 = -p.x * sinCamY + p.z * cosCamY;

        // Apply camera rotation around X-axis
        let y2 = p.y * cosCamX - z1 * sinCamX;
        let z2 = p.y * sinCamX + z1 * cosCamX;

        // Perspective scaling factor
        const scale = fov / (fov + z2 + 300);
        const sx = x1 * scale + centerX;
        const sy = y2 * scale + centerY;

        return {
          sx,
          sy,
          z: z2,
          size: p.size * scale,
          alpha: p.alpha * (1 - (z2 + 220) / 440), // fade in/out based on distance
          visible: z2 + 300 > 0,
        };
      });

      // Render particle dots
      projectedPoints.forEach((p) => {
        if (p.visible && p.alpha > 0) {
          ctx.fillStyle = `${particleColor}${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, Math.max(0.5, p.size), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Render subtle networking connection lines between close particles
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projectedPoints.length; i++) {
        for (let j = i + 1; j < projectedPoints.length; j++) {
          const p1 = projectedPoints[i];
          const p2 = projectedPoints[j];

          if (p1.visible && p2.visible) {
            const dx = p1.sx - p2.sx;
            const dy = p1.sy - p2.sy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
              // Closer particles get stronger connection opacity
              const alphaFactor = (1 - dist / 120) * p1.alpha * p2.alpha * 0.4;
              ctx.strokeStyle = isDark
                ? `rgba(210, 180, 140, ${alphaFactor})`
                : `rgba(92, 56, 42, ${alphaFactor})`;
              ctx.beginPath();
              ctx.moveTo(p1.sx, p1.sy);
              ctx.lineTo(p2.sx, p2.sy);
              ctx.stroke();
            }
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: "normal" }}
    />
  );
}
