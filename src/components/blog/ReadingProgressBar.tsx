import { useEffect, useState } from 'react';

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  const isCompleted = progress >= 99;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="hidden md:flex fixed z-[500] items-center justify-center transition-transform duration-500"
      style={{
        bottom: '2rem',
        right: '2rem',
        width: '64px',
        height: '64px',
        transform: isCompleted ? 'scale(1.2)' : 'scale(1)',
      }}
    >
      {/* SVG circle — minimal, no glow */}
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        className="relative"
      >
        {/* Background circle — very subtle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-colors duration-300 ${
            isCompleted ? 'text-accent' : 'text-border/20'
          }`}
        />

        {/* Progress circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${
            isCompleted ? 'text-accent/80 animate-pulse' : 'text-accent'
          }`}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '32px 32px',
          }}
        />

        {/* Checkmark SVG overlay when completed */}
        {isCompleted && (
          <g className="animate-fade-in-up">
            <path
              d="M 20 32 L 28 40 L 44 24"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
