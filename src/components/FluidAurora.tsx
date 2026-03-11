import { useRef } from 'react';
import { useAuroraCanvas } from '@hooks/useAuroraCanvas';

export default function FluidAurora() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useAuroraCanvas(canvasRef);
  return (
    <canvas
      ref={canvasRef}
      id="bg-canvas"
      className="fixed inset-0 w-full h-full -z-[1] pointer-events-none blur-[30px] contrast-[110%] opacity-90 scale-110"
    />
  );
}
