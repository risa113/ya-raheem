import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [trailingPosition, setTrailingPosition] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [foodPosition, setFoodPosition] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [foodIcon, setFoodIcon] = useState<string>('🍗');

  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if device supports touch to avoid interfering with mobile touch UX
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if mouse is hovering over an interactive element or food category
      const target = e.target as HTMLElement | null;
      if (target) {
        try {
          const isInteractive = Boolean(
            target.closest('button, a, input, select, textarea, [role="button"], .glass-card, .cursor-pointer')
          );
          setIsHovered(isInteractive);

          // Detect food category context from inner text or title
          const textContent = target.innerText?.toLowerCase() || '';
          if (textContent.includes('biryani')) setFoodIcon('🍲');
          else if (textContent.includes('mandi')) setFoodIcon('🍗');
          else if (textContent.includes('shawarma') || textContent.includes('roll')) setFoodIcon('🌯');
          else if (textContent.includes('burger')) setFoodIcon('🍔');
          else if (textContent.includes('pizza')) setFoodIcon('🍕');
          else if (textContent.includes('parotta') || textContent.includes('gravy')) setFoodIcon('🥞');
          else if (textContent.includes('noodle') || textContent.includes('rice')) setFoodIcon('🍜');
          else if (textContent.includes('sandwich')) setFoodIcon('🥪');
          else if (textContent.includes('combo') || textContent.includes('bucket')) setFoodIcon('🍱');
          else if (textContent.includes('drink') || textContent.includes('mojito') || textContent.includes('dessert')) setFoodIcon('🥤');
          else if (isInteractive) setFoodIcon('🔥');
          else setFoodIcon('🍗');
        } catch (err) {
          // Fallback if target element check fails
          setIsHovered(false);
        }
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  // Smooth lerp trailing animation for the 24K Gold aura ring & food floating icon
  useEffect(() => {
    if (isTouchDevice) return;

    const animateTrailing = () => {
      setTrailingPosition(prev => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.22,
          y: prev.y + dy * 0.22,
        };
      });

      setFoodPosition(prev => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.12,
          y: prev.y + dy * 0.12,
        };
      });

      requestRef.current = requestAnimationFrame(animateTrailing);
    };

    requestRef.current = requestAnimationFrame(animateTrailing);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [position, isTouchDevice]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Central 24K Gold Core Dot */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-transform duration-75 ${
          isClicked ? 'scale-75 bg-amber-300' : isHovered ? 'scale-150 bg-amber-300 shadow-[0_0_15px_#FFD700]' : 'bg-amber-400 shadow-[0_0_10px_#FFD700]'
        }`}
        style={{
          width: '10px',
          height: '10px',
          transform: `translate3d(${position.x - 5}px, ${position.y - 5}px, 0) ${
            isHovered ? 'scale(1.6)' : isClicked ? 'scale(0.7)' : 'scale(1)'
          }`,
        }}
      />

      {/* Outer 24K Gold Interactive Aura Ring */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border-2 transition-all duration-300 ease-out ${
          isHovered
            ? 'w-14 h-14 border-amber-400 bg-amber-400/20 shadow-[0_0_30px_rgba(255,215,0,0.65)] scale-110'
            : isClicked
            ? 'w-8 h-8 border-yellow-300 bg-yellow-400/30 scale-90'
            : 'w-10 h-10 border-amber-400/75 bg-amber-400/5 shadow-[0_0_20px_rgba(255,215,0,0.4)]'
        }`}
        style={{
          transform: `translate3d(${trailingPosition.x - (isHovered ? 28 : 20)}px, ${
            trailingPosition.y - (isHovered ? 28 : 20)
          }px, 0)`,
        }}
      />

      {/* Floating Gourmet Food Avatar Icon next to Cursor */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-[10000] text-xl select-none transition-transform duration-200 filter drop-shadow-[0_4px_10px_rgba(255,215,0,0.8)] ${
          isHovered ? 'scale-125' : 'scale-100'
        }`}
        style={{
          transform: `translate3d(${foodPosition.x + 18}px, ${foodPosition.y + 14}px, 0) ${
            isHovered ? 'scale(1.35)' : 'scale(1)'
          }`,
        }}
      >
        {foodIcon}
      </div>
    </>
  );
};

