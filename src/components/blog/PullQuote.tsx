import type { ReactNode } from 'react';

interface PullQuoteProps {
  children?: ReactNode;
}

export default function PullQuote({ children }: PullQuoteProps) {
  return (
    <figure className="my-10 px-2">
      <blockquote className="relative border-l-4 border-accent pl-6 py-2">
        <p className="text-xl md:text-2xl font-semibold leading-snug text-text-primary italic before:content-['«'] after:content-['»']">
          {children}
        </p>
      </blockquote>
    </figure>
  );
}
