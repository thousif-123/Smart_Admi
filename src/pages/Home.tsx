import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { GraduationCap, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import Hero3DObject from '../components/Hero3DObject';
import Interactive3DCard from '../components/Interactive3DCard';

// Custom 3D Coffee Bean SVG component
function CoffeeBean({ size = 60, className = "", zDepth = 1.0 }: { size?: number; className?: string; zDepth?: number }) {
  const gradId = React.useId();
  // Apply a blur for depth-of-field simulation based on Z-depth
  const blurValue = zDepth < 0.5 ? "blur-[2px]" : zDepth > 1.2 ? "blur-[1px]" : "blur-0";

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`select-none pointer-events-none drop-shadow-2xl transition-shadow ${blurValue} ${className}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id={`bean-grad-${gradId}`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#8E604F" /> {/* Warm roasted highlights */}
          <stop offset="30%" stopColor="#5C382A" /> {/* Espresso body */}
          <stop offset="75%" stopColor="#311910" /> {/* Dark chocolate base */}
          <stop offset="100%" stopColor="#150804" /> {/* Shadow ring */}
        </radialGradient>
        <linearGradient id={`crease-grad-${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B0402" />
          <stop offset="50%" stopColor="#6E4435" />
          <stop offset="100%" stopColor="#0B0402" />
        </linearGradient>
        <filter id={`shadow-${gradId}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="3" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity={zDepth > 1 ? "0.6" : "0.35"} />
        </filter>
      </defs>
      
      {/* 3D Bean body */}
      <g filter={`url(#shadow-${gradId})`}>
        <ellipse cx="50" cy="50" rx="28" ry="42" fill={`url(#bean-grad-${gradId})`} transform="rotate(-15 50 50)" />
        {/* Center crease/seam with organic wave */}
        <path 
          d="M 50 12 Q 44 32 51 50 Q 58 68 50 88 Q 47 68 45 50 Q 40 32 50 12 Z" 
          fill={`url(#crease-grad-${gradId})`} 
          transform="rotate(-15 50 50)" 
        />
        {/* Specular reflection highlights */}
        <path 
          d="M 32 30 Q 36 20 44 24" 
          fill="none" 
          stroke="#AC7E6A" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          opacity="0.45" 
          transform="rotate(-15 50 50)" 
        />
      </g>
    </svg>
  );
}

// 3D Scrolling & Drift Coffee Beans Background Manager
const BEANS_DATA = [
  { id: 1, left: 8, top: 10, size: 55, zDepth: 0.5, baseRotation: 35, rotationSpeed: 0.15, driftX: 25, driftSpeed: 0.0008 },
  { id: 2, left: 88, top: 15, size: 85, zDepth: 1.4, baseRotation: -25, rotationSpeed: -0.2, driftX: 45, driftSpeed: 0.0006 },
  { id: 3, left: 78, top: 30, size: 40, zDepth: 0.3, baseRotation: 110, rotationSpeed: 0.08, driftX: 15, driftSpeed: 0.001 },
  { id: 4, left: 6, top: 40, size: 65, zDepth: 0.9, baseRotation: 85, rotationSpeed: 0.18, driftX: 30, driftSpeed: 0.0007 },
  { id: 5, left: 84, top: 52, size: 48, zDepth: 0.6, baseRotation: -55, rotationSpeed: -0.25, driftX: 20, driftSpeed: 0.0012 },
  { id: 6, left: 22, top: 65, size: 95, zDepth: 1.5, baseRotation: 20, rotationSpeed: 0.1, driftX: 55, driftSpeed: 0.0005 },
  { id: 7, left: 72, top: 75, size: 35, zDepth: 0.4, baseRotation: 195, rotationSpeed: 0.05, driftX: 12, driftSpeed: 0.0015 },
  { id: 8, left: 12, top: 85, size: 58, zDepth: 0.8, baseRotation: 270, rotationSpeed: -0.12, driftX: 28, driftSpeed: 0.0009 },
  { id: 9, left: 45, top: 22, size: 42, zDepth: 0.45, baseRotation: 65, rotationSpeed: 0.12, driftX: 18, driftSpeed: 0.0011 },
  { id: 10, left: 35, top: 58, size: 50, zDepth: 0.75, baseRotation: 215, rotationSpeed: -0.15, driftX: 22, driftSpeed: 0.0009 },
  { id: 11, left: 92, top: 82, size: 75, zDepth: 1.1, baseRotation: 45, rotationSpeed: 0.18, driftX: 38, driftSpeed: 0.0007 }
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Background animation loop for coffee beans drifting
    let animationFrameId: number;
    const updateDrift = () => {
      setTime(prev => prev + 16.67); // roughly 1 frame at 60fps in ms
      animationFrameId = requestAnimationFrame(updateDrift);
    };
    animationFrameId = requestAnimationFrame(updateDrift);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-gradient-to-b from-[#fdfbf7] via-[#f5ebdb] to-[#e6d5bd] dark:from-[#110906] dark:via-[#19100d] dark:to-[#090302]">
      
      {/* 3D Scrolling Coffee Beans Layer */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {BEANS_DATA.map((bean) => {
          // Dynamic scroll factor: depth controls how fast the bean moves relative to scrolling
          // Closer beans (zDepth > 1) move faster, deeper beans (zDepth < 1) move slower
          const scrollOffset = scrollY * (bean.zDepth - 0.75) * 0.4;
          
          // Gently drift beans using sinus functions over time
          const driftOffset = Math.sin(time * bean.driftSpeed + bean.id) * bean.driftX;
          const currentRotation = bean.baseRotation + (time * bean.rotationSpeed * 0.02) + (scrollY * 0.05);

          return (
            <div
              key={bean.id}
              className="absolute transition-transform duration-75 ease-out"
              style={{
                left: `${bean.left}%`,
                top: `${bean.top}%`,
                transform: `translate3d(${driftOffset}px, ${scrollOffset}px, 0) rotate(${currentRotation}deg) scale(${bean.zDepth})`,
                opacity: Math.min(0.85, 0.2 + bean.zDepth * 0.5)
              }}
            >
              <CoffeeBean size={bean.size} zDepth={bean.zDepth} />
            </div>
          );
        })}
      </div>

      {/* Hero Section */}
      <main className="flex-1 relative z-10">
        <section className="relative py-20 px-6 lg:py-32 overflow-hidden">
          <div className="container mx-auto relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Text Column */}
              <motion.div
                className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Premium Glow Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-semibold tracking-wider uppercase mb-8 shadow-sm backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Next-Gen Admission Verification
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-8 leading-tight">
                  The Future of{" "}
                  <span className="bg-gradient-to-r from-[#6f4e37] via-[#a0522d] to-[#3c2211] dark:from-[#d2b48c] dark:via-[#e6c280] dark:to-[#f5deb3] bg-clip-text text-transparent drop-shadow-sm font-extrabold">
                    Admissions
                  </span>{" "}
                  is Here
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground mb-12 font-medium leading-relaxed drop-shadow-sm max-w-2xl">
                  Automated document verification, AI-powered fraud detection, and smart course recommendations. 
                  Experience a seamless admission journey percolated with smart decisions.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
                  <Link to="/signup" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg font-bold gap-2 bg-[#5c382a] hover:bg-[#4a2c20] text-[#fdfbf7] dark:bg-[#d2b48c] dark:hover:bg-[#c5a375] dark:text-[#110906] shadow-lg shadow-amber-900/15 transition-all duration-300">
                      Apply Now <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-lg font-semibold border-amber-900/20 dark:border-amber-100/20 hover:bg-amber-500/5 backdrop-blur-sm transition-all duration-300">
                      Admin Portal
                    </Button>
                  </Link>
                </div>

                {/* PDF documentation link */}
                <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-sm">
                  <span className="text-muted-foreground">Looking for system architecture or setup guides?</span>
                  <a 
                    href="/api/project-doc-pdf" 
                    download="SmartAdmi_Project_Documentation.pdf" 
                    className="font-bold text-[#5c382a] dark:text-[#d2b48c] hover:underline flex items-center gap-1"
                  >
                    Download Project Handbook (PDF) &rarr;
                  </a>
                </div>
              </motion.div>

              {/* 3D Visual Column */}
              <motion.div 
                className="lg:col-span-5 flex items-center justify-center relative"
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
              >
                <Hero3DObject />
              </motion.div>
            </div>
          </div>
          
          {/* Enhanced Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500 rounded-full blur-[120px] dark:bg-amber-900/40" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-700 rounded-full blur-[120px] dark:bg-yellow-900/20" />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/30 dark:bg-black/10 px-6 relative z-10 backdrop-blur-sm border-y border-amber-900/5 dark:border-white/5">
          <div className="container mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-[#311910] dark:text-[#fdfbf7]">
                Smart Features for Smart Students
              </h2>
              <div className="w-24 h-1.5 bg-[#5c382a] dark:bg-[#d2b48c] mx-auto rounded-full mb-6" />
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Everything you need to secure your academic future, roasted to perfection.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
              {[
                {
                  icon: <Zap className="h-12 w-12 text-amber-500 dark:text-amber-400" />,
                  title: "AI OCR Verification",
                  description: "Instantly extract data from your certificates and marksheets with extremely high precision."
                },
                {
                  icon: <ShieldCheck className="h-12 w-12 text-[#5c382a] dark:text-[#e6c280]" />,
                  title: "Fraud Detection",
                  description: "Our machine learning models spot document alterations, text anomalies, and edits instantly."
                },
                {
                  icon: <CheckCircle2 className="h-12 w-12 text-amber-700 dark:text-amber-500" />,
                  title: "Instant Decisions",
                  description: "Get immediate feedback and smart, context-driven admission suggestions based on your grades."
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                >
                  <Interactive3DCard className="bg-white/75 dark:bg-[#1c120e]/80 border border-amber-900/10 dark:border-white/10 p-8 h-full rounded-2xl flex flex-col justify-between group">
                    <div>
                      <div className="mb-6 p-3 bg-amber-500/10 dark:bg-amber-500/5 w-fit rounded-xl border border-amber-500/20 shadow-inner transition-all duration-500 ease-out group-hover/card:scale-110 group-hover/card:-translate-y-1 group-hover/card:shadow-[0_8px_20px_rgba(245,158,11,0.15)]">
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-[#311910] dark:text-[#fdfbf7]">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{feature.description}</p>
                    </div>
                  </Interactive3DCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-900/10 dark:border-white/10 py-16 px-6 bg-white/50 dark:bg-[#0c0503]/80 relative z-10 backdrop-blur-md overflow-hidden">
        {/* Subtle Cybernetic Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(210,180,140,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(210,180,140,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(210,180,140,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(210,180,140,0.015)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] -z-10" />
        
        {/* Subtle drifting visual glow halos */}
        <div className="absolute -bottom-10 left-10 w-24 h-24 bg-amber-500/8 dark:bg-amber-400/3 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-1/4 right-20 w-16 h-16 bg-[#5c382a]/5 dark:bg-[#d2b48c]/3 rounded-full blur-xl animate-pulse [animation-duration:8s]" />

        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-[#5c382a] dark:text-[#d2b48c]" />
            <span className="text-2xl font-black text-[#311910] dark:text-[#fdfbf7] tracking-tight">SmartAdmi</span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            © 2026 SmartAdmi Admission System. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm font-semibold text-muted-foreground">
            <Link to="/privacy" className="hover:text-[#5c382a] dark:hover:text-[#d2b48c] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#5c382a] dark:hover:text-[#d2b48c] transition-colors">Terms of Service</Link>
            <a href="mailto:skthousif474@gmail.com" className="hover:text-[#5c382a] dark:hover:text-[#d2b48c] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
