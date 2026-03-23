import type { StepBlockProps } from '@ui/components';

export default function StepBlock({ step, children }: StepBlockProps) {
  return (
    <div className="flex gap-4 md:gap-6 my-8 first:mt-6 last:mb-4">
      <div className="shrink-0">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold text-sm ring-2 ring-accent/30">
          {step}
        </span>
      </div>
      <div className="flex-1 min-w-0 pt-0.5 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">{children}</div>
    </div>
  );
}
