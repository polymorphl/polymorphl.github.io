import type { TimelineItem } from '@ui/components';

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative my-8 ml-2">
      {items.map((item, index) => (
        <div key={`${item.year}-${item.tool}`} className="flex gap-5 mb-0">
          {/* Left column: dot + line */}
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-accent ring-4 ring-accent/20 mt-1 shrink-0" />
            {index < items.length - 1 && (
              <div className="w-px flex-1 bg-border/60 my-2" style={{ minHeight: '2.5rem' }} />
            )}
          </div>
          {/* Right column: content */}
          <div className="pb-8">
            <span className="text-xs font-mono text-accent/80 tracking-widest uppercase">{item.year}</span>
            <h4 className="font-semibold text-text-primary mt-0.5">{item.tool}</h4>
            <p className="text-sm text-text-secondary mt-1">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
