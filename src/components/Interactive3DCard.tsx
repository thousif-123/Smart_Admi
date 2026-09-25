import React, { useRef, useState } from "react";

interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum tilt angle in degrees (default 10)
  perspective?: number; // Perspective value in pixels (default 1000)
}

export default function Interactive3DCard({
  children,
  className = "",
  maxTilt = 8,
  perspective = 1000,
}: Interactive3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [sheenPosition, setSheenPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element

    const xc = rect.width / 2;
    const yc = rect.height / 2;

    // Calculate rotation angles based on mouse position relative to center
    // Math.min/max guards to prevent boundary overflows
    const rotateX = Math.max(-maxTilt, Math.min(maxTilt, (yc - y) / (yc / maxTilt)));
    const rotateY = Math.max(-maxTilt, Math.min(maxTilt, (x - xc) / (xc / maxTilt)));

    // Sheen position as percentage
    const sheenX = (x / rect.width) * 100;
    const sheenY = (y / rect.height) * 100;

    setRotate({ x: rotateX, y: rotateY });
    setSheenPosition({ x: sheenX, y: sheenY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setSheenPosition({ x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-all duration-300 ease-out select-none ${className}`}
      style={{
        transform: isHovered
          ? `perspective(${perspective}px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.025, 1.025, 1.025)`
          : `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        transformStyle: "preserve-3d",
        boxShadow: isHovered
          ? "0 35px 60px -15px rgba(0, 0, 0, 0.25), 0 0 50px -10px rgba(139, 92, 26, 0.12)"
          : "0 10px 30px -15px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* 3D Glass Gloss / Sheen overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30"
        style={{
          opacity: isHovered ? 0.45 : 0,
          background: `radial-gradient(circle at ${sheenPosition.x}% ${sheenPosition.y}%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 65%)`,
        }}
      />

      {/* Dark theme sheen overlay (subtle gold flare) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 dark:block hidden"
        style={{
          opacity: isHovered ? 0.2 : 0,
          background: `radial-gradient(circle at ${sheenPosition.x}% ${sheenPosition.y}%, rgba(230, 194, 128, 0.1) 0%, rgba(0, 0, 0, 0) 55%)`,
        }}
      />

      {/* Content wrapper with perspective translation (translateZ pop-out) */}
      <div
        style={{
          transform: isHovered ? "translateZ(30px)" : "translateZ(0px)",
          transition: "transform 0.3s ease-out",
          transformStyle: "preserve-3d",
        }}
        className="h-full w-full"
      >
        {children}
      </div>
    </div>
  );
}
