import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  wordDelay?: number;
  onAnimationComplete?: () => void;
}

const BlurText: React.FC<BlurTextProps> = ({ 
  text, 
  className = '', 
  delay = 0,
  wordDelay = 0.05,
  onAnimationComplete 
}) => {
  const words = text.split(' ');
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordsRef.current,
        {
          opacity: 0,
          filter: 'blur(10px)',
          y: 20,
        },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 0.8,
          stagger: wordDelay,
          ease: 'power3.out',
          delay: delay / 1000,
          onComplete: onAnimationComplete,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [delay, wordDelay, onAnimationComplete]);

  return (
    <div ref={containerRef} className={`flex flex-wrap justify-center gap-[0.3em] ${className}`}>
      {words.map((word, index) => (
        <span
          key={index}
          ref={(el) => { wordsRef.current[index] = el; }} 
          className="inline-block will-change-[transform,filter,opacity]"
        >
          {word}
          {index === words.length - 1 ? '' : '\u00A0'}
        </span>
      ))}
    </div>
  );
};

export default BlurText;