import katex from 'katex';
import type { FormulaToCodeProps } from '@ui/components';

export default function FormulaToCode({ latex, code }: FormulaToCodeProps) {
  const html = katex.renderToString(latex, { throwOnError: false, output: 'html' });

  return (
    <div className="rounded-xl border border-border bg-surface my-6 grid md:grid-cols-2 divide-y divide-border md:divide-y-0 md:divide-x overflow-hidden">
      <div
        className="flex items-center justify-center p-5 text-text-primary"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className="flex items-center p-5">
        <code className="font-mono text-sm text-[var(--color-accent-on-surface)] break-all">
          {code}
        </code>
      </div>
    </div>
  );
}
