import React, { useEffect, useRef } from 'react';

/**
 * SpiralFunnel Component
 * Interactive rotating vortex with fine threads of light spiraling through a 3D-projected funnel.
 * Responds fluidly to pointer tracking and mouse interaction.
 */
export default function SpiralFunnel({ 
  className = '', 
  glowColor = '#f59e0b', // Royal amber / gold
  secondaryColor = '#f43f5e', // Crimson rose
  accentColor = '#6366f1', // Deep indigo
  interactive = true,
  strandsCount = 36,
  speed = 0.008
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseRef.current.targetX = Math.max(0, Math.min(1, x));
      mouseRef.current.targetY = Math.max(0, Math.min(1, y));
    };

    window.addEventListener('mousemove', handleMouseMove);

    let angle = 0;

    const render = () => {
      // Smooth interpolation for mouse movement
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const centerX = width * (0.35 + mouseRef.current.x * 0.3);
      const centerY = height * (0.35 + mouseRef.current.y * 0.3);
      const maxRadius = Math.min(width, height) * 0.52;
      const minRadius = 14;

      angle += speed;

      // Draw subtle ambient center glow
      const radialGradient = ctx.createRadialGradient(
        centerX, centerY, minRadius,
        centerX, centerY, maxRadius * 0.9
      );
      radialGradient.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
      radialGradient.addColorStop(0.4, 'rgba(244, 63, 94, 0.09)');
      radialGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.fillStyle = radialGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.fill();

      // Render 3D-projected spiral funnel threads
      const steps = 110;

      for (let s = 0; s < strandsCount; s++) {
        const strandOffset = (s / strandsCount) * Math.PI * 2;
        const strandAngle = angle + strandOffset;

        ctx.beginPath();
        let firstPoint = true;

        for (let i = 0; i < steps; i++) {
          const t = i / steps; // 0 (top/wide) to 1 (center funnel vertex)
          
          // Funnel curve: exponential narrowing towards vertex
          const r = minRadius + (maxRadius - minRadius) * Math.pow(1 - t, 1.8);
          
          // Spiral rotation along the depth
          const theta = strandAngle + t * Math.PI * 4.5;
          
          // Perspective tilt based on cursor Y
          const tiltFactor = 0.55 + (mouseRef.current.y - 0.5) * 0.35;
          const px = centerX + Math.cos(theta) * r;
          const py = centerY + Math.sin(theta) * (r * tiltFactor) + (t * 40 - 20);

          if (firstPoint) {
            ctx.moveTo(px, py);
            firstPoint = false;
          } else {
            ctx.lineTo(px, py);
          }
        }

        // Color variation across spiral arms
        ctx.lineWidth = s % 3 === 0 ? 1.6 : 0.9;
        
        if (s % 3 === 0) {
          ctx.strokeStyle = `rgba(245, 158, 11, ${0.45 + Math.sin(angle * 2 + s) * 0.25})`; // Amber
        } else if (s % 3 === 1) {
          ctx.strokeStyle = `rgba(244, 63, 94, ${0.35 + Math.cos(angle * 2 + s) * 0.2})`; // Rose
        } else {
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.3 + Math.sin(angle + s) * 0.15})`; // Indigo
        }

        ctx.stroke();
      }

      // Center vortex core ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, minRadius * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [glowColor, secondaryColor, accentColor, interactive, strandsCount, speed]);

  return (
    <div className={`relative w-full h-full overflow-hidden pointer-events-none select-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
