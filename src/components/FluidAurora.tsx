import { useEffect, useRef } from 'react';

export default function FluidAurora() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let orbs: Array<{
      x: number;
      y: number;
      radius: number;
      baseRadius: number;
      vx: number;
      vy: number;
      pulse: number;
      pulseSpeed: number;
    }> = [];
    let orbCount = 5;
    let width = window.innerWidth / 2;
    let height = window.innerHeight / 2;
    let isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    const resize = () => {
      width = window.innerWidth / 2;
      height = window.innerHeight / 2;
      canvas.width = width;
      canvas.height = height;
      createOrbs();
    };

    const createOrbs = () => {
      orbs = [];
      for (let i = 0; i < orbCount; i++) {
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * (width * 0.25) + (width * 0.15),
          baseRadius: Math.random() * (width * 0.25) + (width * 0.15),
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.01 + Math.random() * 0.02
        });
      }
    };

    const getThemeColors = () => {
      if (isDark) {
        return [
          { r: 255, g: 60, b: 20 },
          { r: 60, g: 60, b: 180 },
          { r: 120, g: 20, b: 120 }
        ];
      }
      return [
        { r: 255, g: 120, b: 80 },
        { r: 100, g: 120, b: 255 },
        { r: 200, g: 50, b: 100 }
      ];
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = isDark ? 'screen' : 'multiply';

      const colors = getThemeColors();

      orbs.forEach((orb, index) => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        orb.pulse += orb.pulseSpeed;
        orb.radius = orb.baseRadius + Math.sin(orb.pulse) * 20;

        if (orb.x < -orb.radius) orb.vx = Math.abs(orb.vx);
        if (orb.x > width + orb.radius) orb.vx = -Math.abs(orb.vx);
        if (orb.y < -orb.radius) orb.vy = Math.abs(orb.vy);
        if (orb.y > height + orb.radius) orb.vy = -Math.abs(orb.vy);

        const baseColor = colors[index % colors.length];
        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius
        );
        const alpha = isDark ? 0.4 : 0.25;
        gradient.addColorStop(0, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha})`);
        gradient.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    animate();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 200);
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} id="bg-canvas" className="background-pattern" />;
}
