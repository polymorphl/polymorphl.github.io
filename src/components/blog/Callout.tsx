import type { ReactNode } from 'react';

const calloutConfigs = {
  info: { icon: 'ℹ️', wrapClass: 'border-accent/30 bg-accent/5', glow: '0 0 20px rgba(37,99,235,0.10)' },
  warning: { icon: '⚠️', wrapClass: 'border-amber-500/30 bg-amber-500/5', glow: '0 0 20px rgba(245,158,11,0.10)' },
  tip: { icon: '💡', wrapClass: 'border-emerald-500/30 bg-emerald-500/5', glow: '0 0 20px rgba(16,185,129,0.10)' },
  money: { icon: '💰', wrapClass: 'border-green-500/30 bg-green-500/5', glow: '0 0 20px rgba(23,230,105,0.10)' },
} as const;

interface CalloutProps {
  type?: 'info' | 'warning' | 'tip' | 'money';
  children?: ReactNode;
}

export default function Callout({ type = 'info', children }: CalloutProps) {
  const c = calloutConfigs[type] ?? calloutConfigs.info;
  return (
    <div
      className={`rounded-xl border ${c.wrapClass} my-6 flex gap-3 p-4`}
      style={{ boxShadow: c.glow }}
    >
      <span className="text-base shrink-0 mt-0.5">{c.icon}</span>
      <div className="text-text-secondary flex-1 min-w-0 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">{children}</div>
    </div>
  );
}
