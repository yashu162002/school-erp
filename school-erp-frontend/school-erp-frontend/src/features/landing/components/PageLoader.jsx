import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { GearsLoader } from '@/components/ui/GearsLoader';

export const PageLoader = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const mainWrapperRef = useRef(null);

  useEffect(() => {
    // 1. Animate percentage counter from 0 to 100
    const progressObj = { val: 0 };
    const counterTween = gsap.to(progressObj, {
      val: 100,
      duration: 2.8,
      ease: 'power2.out',
      onUpdate: () => {
        setPercent(Math.floor(progressObj.val));
      },
      onComplete: () => {
        // Exit animation
        const exitTl = gsap.timeline({
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });
        
        exitTl.to(mainWrapperRef.current, {
          yPercent: -100,
          duration: 1.0,
          ease: 'power4.inOut'
        });
      }
    });

    return () => {
      counterTween.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={mainWrapperRef}
      className="fixed inset-0 z-50 bg-[#10131e] flex items-center justify-center overflow-hidden"
    >
      <div ref={containerRef} className="relative flex flex-col items-center justify-center z-10">
        
        {/* Morphing Organic Blob Background Aura */}
        <div className="absolute w-72 h-72 bg-gradient-to-tr from-[#C98A00]/25 via-[#24316B]/30 to-[#C98A00]/5 rounded-full blur-3xl opacity-80 animate-morph pointer-events-none -z-10"></div>
        
        {/* Animated Interlocking Gears Loader */}
        <div className="relative mb-6 flex items-center justify-center">
          <GearsLoader className="w-28 h-28 drop-shadow-[0_0_20px_rgba(59,130,246,0.15)]" />
        </div>

        {/* Counter UI */}
        <div className="flex flex-col items-center">
          <div ref={counterRef} className="text-4xl font-extrabold tracking-widest text-white mb-2 flex items-baseline">
            <span className="font-mono">{percent}</span>
            <span className="text-[#C98A00] text-lg ml-1">%</span>
          </div>
          <span className="text-[9px] font-bold text-gray-400 tracking-[0.3em] uppercase">
            Loading Academy Portals
          </span>
        </div>

      </div>

      {/* Embedded CSS animations for high-performance shape morphing */}
      <style>{`
        @keyframes morph {
          0% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; transform: rotate(0deg) scale(1); }
          33% { border-radius: 70% 30% 52% 48% / 60% 40% 60% 40%; transform: rotate(120deg) scale(1.1); }
          66% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; transform: rotate(240deg) scale(0.9); }
          100% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; transform: rotate(360deg) scale(1); }
        }
        .animate-morph {
          animation: morph 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
