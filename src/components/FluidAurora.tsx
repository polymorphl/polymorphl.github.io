import { useRef } from 'react';
import { useAuroraCanvas } from '@hooks/useAuroraCanvas';

export default function FluidAurora() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useAuroraCanvas(canvasRef);
  return <canvas ref={canvasRef} id="bg-canvas" className="background-pattern" />;
}
