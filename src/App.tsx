import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaAnchor, FaInstagram } from 'react-icons/fa';
import { WiStars } from 'react-icons/wi';
import BlurText from './BlurText';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/* --- COMPONENTS --- */

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const mouse = { x: -1000, y: -1000, radius: 150 };

    const initParticles = () => {
      particles = [];
      const particleCount = window.innerWidth < 768 ? 15 : 40; 
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          p.x -= (dx / distance) * force * 2;
          p.y -= (dy / distance) * force * 2;
        }

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(20, 184, 166, ${p.opacity})`;
        ctx.fill();

        if (window.innerWidth > 768) {
          for (let j = i + 1; j < particles.length; j++) {
            const other = particles[j];
            const dx = p.x - other.x;
            const dy = p.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 100) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(20, 184, 166, ${0.1 * (1 - dist / 100)})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// --- FIXED LOADING SCREEN (Seamless, No Line) ---
const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topPanelRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const handleTextComplete = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (containerRef.current) containerRef.current.style.display = 'none';
        onComplete();
      }
    });

    // 1. Text zooms in slightly and fades out
    tl.to(textContainerRef.current, {
      scale: 1.2,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 0.8,
      ease: 'power2.in'
    })
    // 2. The Gates Open
    .to(topPanelRef.current, {
      yPercent: -100,
      duration: 1.5,
      ease: 'power4.inOut'
    }, '-=0.4')
    .to(bottomPanelRef.current, {
      yPercent: 100,
      duration: 1.5,
      ease: 'power4.inOut'
    }, '<');
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] flex items-center justify-center">
      
      {/* Top Gate - Height increased to 50.5vh to overlap and hide gap line */}
      <div 
        ref={topPanelRef} 
        className="absolute top-0 left-0 w-full h-[50.5vh] bg-slate-950 z-10"
      ></div>

      {/* Bottom Gate - Height increased to 50.5vh to overlap */}
      <div 
        ref={bottomPanelRef} 
        className="absolute bottom-0 left-0 w-full h-[50.5vh] bg-slate-950 z-10"
      ></div>

      {/* Text Content */}
      <div ref={textContainerRef} className="relative z-20 text-center w-full max-w-lg px-4">
        <p className="text-teal-500/60 text-[10px] md:text-xs tracking-[0.3em] font-bold mb-4 animate-pulse">
          LOADING EXPERIENCE
        </p>
        <BlurText
          text="AUM SAI COLLEGE OF NURSING"
          delay={200}
          wordDelay={0.1}
          className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-100 font-cinzel tracking-wide leading-tight"
          onAnimationComplete={handleTextComplete}
        />
      </div>
    </div>
  );
};

// --- NAVBAR ---
const Navbar: React.FC = () => (
  <nav className="fixed top-0 left-0 right-0 p-4 md:p-8 flex justify-between items-start z-50 mix-blend-difference text-white w-full">
    
    <div className="flex flex-col group cursor-pointer">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-teal-400 rounded-full animate-pulse shadow-[0_0_10px_#2dd4bf]"></div>
        <span className="font-cinzel font-extrabold text-lg md:text-3xl tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-teal-100 to-teal-500 drop-shadow-[0_2px_10px_rgba(20,184,166,0.3)]">
          AUM SAI
        </span>
      </div>
      <span className="text-[8px] md:text-[10px] tracking-[0.3em] text-teal-500/70 font-sans ml-3 md:ml-4 group-hover:text-teal-400 transition-colors">
        INSTITUTION
      </span>
    </div>

    <div className="flex flex-col items-end">
       <span className="font-cinzel text-base md:text-xl font-bold text-white/90">2026</span>
       <span className="text-[8px] md:text-[10px] tracking-widest text-teal-400 uppercase text-right">Freshers</span>
    </div>
  </nav>
);

const MagneticButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    gsap.to(btnRef.current, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
  };

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative px-6 py-3 md:px-8 md:py-4 border border-teal-500/50 text-teal-400 uppercase tracking-widest text-[10px] md:text-sm font-semibold rounded-sm overflow-hidden group hover:text-teal-200 transition-colors font-sans active:scale-95 duration-100"
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-teal-500/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
    </button>
  );
};

/* --- MAIN APP --- */

function App() {
  const [loading, setLoading] = useState(true);
  const mainRef = useRef<HTMLElement>(null);
  const stage1Ref = useRef<HTMLElement>(null);
  const stage2Ref = useRef<HTMLElement>(null);
  const stage3Ref = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      
      const isMobile = window.innerWidth < 768;

      // Stage 1
      if (stage1Ref.current) {
        const tl1 = gsap.timeline({
          scrollTrigger: {
            trigger: stage1Ref.current,
            start: 'top top',
            end: '+=100%',
            pin: true,
            scrub: 1,
          }
        });
        tl1.to('.stage-1-content', { opacity: 0, y: -30, scale: 0.95 })
           .to('.seed-visual', { scale: isMobile ? 3 : 5, opacity: 0 }, '<');
      }

      // Stage 2
      if (stage2Ref.current) {
        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: stage2Ref.current,
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: 1,
          }
        });
        tl2.from('.stage-2-content', { opacity: 0, y: 50, duration: 2 })
           .from('.anchor-visual', { scale: 0, rotation: -90, opacity: 0, duration: 2 }, '<')
           .to('.anchor-ring-1', { rotation: 360, duration: 10, ease: 'none' }, 0)
           .to('.anchor-ring-2', { rotation: -360, duration: 10, ease: 'none' }, 0);
      }

      // Stage 3
      if (stage3Ref.current) {
        const tl3 = gsap.timeline({
          scrollTrigger: {
            trigger: stage3Ref.current,
            start: 'top center',
            end: 'bottom bottom',
            scrub: 1,
          }
        });
        tl3.from('.stage-3-sun', { y: 100, opacity: 0 })
           .from('.stage-3-text', { y: 30, opacity: 0 }, '<0.2')
           .fromTo(cardRef.current, 
              { y: 100, opacity: 0, rotateX: 20 }, 
              { y: 0, opacity: 1, rotateX: 0, duration: 1.5, ease: 'power3.out' }, 
           '<0.4');
      }

    }, mainRef);

    return () => ctx.revert();
  }, [loading]);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-teal-500/30 selection:text-teal-200 overflow-x-hidden">
      
      <LoadingScreen onComplete={() => setLoading(false)} />
      <Navbar />
      <ParticleBackground />
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-teal-900/20 blur-[60px] md:blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-amber-500/10 blur-[60px] md:blur-[100px] rounded-full animate-pulse" />
      </div>

      <main ref={mainRef} className="relative z-10">
        
        {/* STAGE 1 */}
        <section ref={stage1Ref} className="h-screen flex items-center justify-center relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center w-full">
            <div className="seed-visual relative w-24 h-24 md:w-40 md:h-40 mb-6 md:mb-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl animate-pulse" />
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border border-teal-500/30 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center relative z-10">
                <WiStars className="text-4xl md:text-6xl text-teal-400 animate-spin-slow" />
              </div>
            </div>
            <div className="stage-1-content max-w-2xl px-4 w-full">
              <p className="text-teal-500/80 tracking-[0.4em] text-[10px] md:text-xs font-bold mb-3 md:mb-4 uppercase font-sans">Stage 1</p>
              <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-teal-100 to-teal-500 mb-4 md:mb-6 drop-shadow-[0_0_30px_rgba(20,184,166,0.3)] font-cinzel leading-tight">
                THE SEED
              </h1>
              <p className="text-slate-400 text-sm md:text-xl font-light mb-8 md:mb-10 leading-relaxed font-sans max-w-xs mx-auto md:max-w-none">
                The tide has brought you here. <br/> Your journey into healing begins now.
              </p>
              <MagneticButton onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                Enter The Garden
              </MagneticButton>
            </div>
          </div>
        </section>

        {/* STAGE 2 */}
        <section ref={stage2Ref} className="h-screen flex items-center justify-center relative">
          <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12 w-full">
            <div className="stage-2-content md:w-1/2 text-center md:text-left">
              <p className="text-teal-500/80 tracking-[0.4em] text-[10px] md:text-xs font-bold mb-3 uppercase font-sans">Stage 2</p>
              <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold text-slate-100 mb-4 md:mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] font-cinzel">
                THE ANCHOR
              </h2>
              <p className="text-slate-400 text-sm md:text-lg mb-6 md:mb-8 leading-relaxed font-sans">
                Roots in the sand. Connect with your seniors.<br className="hidden md:block"/> 
                They are your anchor in the deep.
              </p>
              <div className="flex flex-wrap gap-2 md:gap-4 justify-center md:justify-start font-sans">
                 {['Mentorship', 'Guidance', 'Family'].map((item) => (
                   <div key={item} className="px-4 py-2 md:px-6 md:py-3 rounded-full border border-slate-700 bg-slate-800/50 backdrop-blur-md text-xs md:text-sm text-teal-300">
                     {item}
                   </div>
                 ))}
              </div>
            </div>
            <div className="anchor-visual md:w-1/2 flex justify-center relative scale-75 md:scale-100">
              <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                <div className="anchor-ring-1 absolute inset-0 border border-teal-500/20 rounded-full border-dashed" />
                <div className="anchor-ring-2 absolute inset-4 border border-amber-500/20 rounded-full" />
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-tr from-teal-900/50 to-slate-900/50 backdrop-blur-xl rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(20,184,166,0.2)]">
                  <FaAnchor className="text-5xl md:text-6xl text-teal-200" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STAGE 3 */}
        <section ref={stage3Ref} className="h-screen flex flex-col items-center justify-center relative">
          <div className="container mx-auto px-4 md:px-6 text-center w-full flex-grow flex flex-col justify-center">
            <div className="stage-3-sun w-24 h-24 md:w-32 md:h-32 mx-auto mb-8 md:mb-12 rounded-full bg-gradient-to-tr from-amber-300 to-amber-600 shadow-[0_0_60px_rgba(245,158,11,0.6)] md:shadow-[0_0_100px_rgba(245,158,11,0.6)] animate-pulse" />
            <div className="stage-3-text w-full">
              <p className="text-amber-500 tracking-[0.4em] text-[10px] md:text-xs font-bold mb-3 uppercase font-sans">Stage 3</p>
              <h2 className="text-3xl sm:text-4xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-amber-200 to-amber-600 mb-6 font-cinzel leading-tight">
                THE HORIZON
              </h2>
              <p className="text-slate-300 text-sm md:text-2xl font-light mb-12 md:mb-16 font-sans max-w-xs mx-auto md:max-w-none">
                Go heal the world. Your ocean awaits.
              </p>
              
              <div className="perspective-1000 inline-block w-full max-w-2xl px-4">
                <div 
                  ref={cardRef}
                  className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-[1px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform-gpu transition-transform hover:scale-[1.02] duration-500"
                >
                  <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 px-6 py-8 md:px-12 md:py-10 rounded-2xl w-full">
                    <p className="text-teal-400 text-[10px] md:text-xs tracking-widest font-bold mb-3 font-sans opacity-80">WELCOME TO</p>
                    <p className="text-xl sm:text-2xl md:text-5xl font-bold text-white font-cinzel tracking-wide leading-tight drop-shadow-lg">
                      Aum Sai College of Nursing
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <footer className="w-full py-8 text-center text-slate-500 text-[10px] md:text-xs bg-slate-950/50 backdrop-blur-sm relative z-20 font-sans border-t border-slate-800/50">
            <div className="flex flex-col gap-2 items-center justify-center">
              <p className="tracking-widest uppercase opacity-70">
                Designed & Developed by <span className="text-teal-400 font-bold">PJ</span>
              </p>
              <p className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <span>Concept by Priyanshu Panigrahi</span>
                <a 
                  href="https://www.instagram.com/priyanshu__panigrahi_?igsh=NDQ1dTh1aW5rYmJq" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-400 transition-colors"
                >
                  <FaInstagram size={14} />
                </a>
              </p>
              <p className="mt-2 text-[9px] opacity-40">&copy; 2026 Freshers Committee</p>
            </div>
          </footer>
        </section>

      </main>
    </div>
  );
}

export default App;