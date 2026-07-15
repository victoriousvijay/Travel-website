import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function Cursor() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Motion values for smooth cursor tracking
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring animations for that lag/inertia "3D physical depth" feel
  const springConfig = { damping: 35, stiffness: 280, mass: 0.6 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Hidden on touch screens
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    // Event delegation to detect hover on interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA' ||
          target.closest('.cursor-pointer') ||
          target.closest('button') ||
          target.closest('a'))
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* 3D Main Outer Ring with glowing projection shadow */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-indigo-500/80 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          boxShadow: hovered
            ? '0 0 20px rgba(99, 102, 241, 0.6), inset 0 0 8px rgba(99, 102, 241, 0.4)'
            : '0 0 10px rgba(99, 102, 241, 0.2)',
        }}
        animate={{
          scale: clicked ? 0.8 : hovered ? 1.6 : 1,
          backgroundColor: hovered ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0)',
          borderColor: hovered ? '#ff6b00' : '#6366f1',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />

      {/* 3D Solid Inner dot with glowing core */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-orange-500 rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          boxShadow: '0 0 12px #ff6b00, 0 0 4px #ffedd5',
        }}
        animate={{
          scale: clicked ? 1.4 : hovered ? 0.6 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      />
    </>
  );
}
