import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [trailingPosition, setTrailingPosition] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

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

      // Check if mouse is hovering over an interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('button, a, input, select, textarea, [role="button"], .glass-card, .cursor-pointer, [onClick]')
        );
        setIsHovered(isInteractive);
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

  // Smooth lerp trailing animation for the 24K Gold aura ring
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
            ? 'w-14 h-14 border-amber-300 bg-amber-400/15 shadow-[0_0_30px_rgba(255,215,0,0.65)] scale-110'
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
    </>
  );
};
