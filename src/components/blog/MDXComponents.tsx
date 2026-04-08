import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';
import LinkPreview from './LinkPreview';
import MarkdownBlock from './MarkdownBlock';
import Callout from './Callout';
import PullQuote from './PullQuote';
import Timeline from './Timeline';
import StepBlock from './StepBlock';
import ArticleImage from './ArticleImage';
import ImageGrid from './ImageGrid';
import FormulaToCode from './FormulaToCode';

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getHeadingText(children: ReactNode): string {
  if (!children) return '';
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(getHeadingText).join('');
  if (typeof children === 'object' && children !== null && 'props' in children) {
    return getHeadingText((children as { props: { children?: ReactNode } }).props.children);
  }
  return String(children);
}

const headingClasses: Record<string, string> = {
  h1: 'text-2xl md:text-3xl font-bold text-text-primary mt-8 mb-4',
  h2: 'text-xl md:text-2xl font-bold text-text-primary mt-10 mb-3',
  h3: 'text-lg font-semibold text-text-primary mt-6 mb-2',
};

const mdxComponents: MDXComponents = {
  h1: (props) => <h1 className={headingClasses.h1} {...props} />,
  h2: (props) => {
    const id = slugify(getHeadingText(props.children)) || undefined;
    return <h2 {...props} id={id} className={`${headingClasses.h2} scroll-mt-28`} />;
  },
  h3: (props) => {
    const id = slugify(getHeadingText(props.children)) || undefined;
    return <h3 {...props} id={id} className={`${headingClasses.h3} scroll-mt-28`} />;
  },
  p: (props) => <p className="text-text-secondary leading-relaxed mb-4" {...props} />,
  a: (props) => <a className="text-[var(--color-accent-on-surface)] hover:underline" {...props} />,
  ul: (props) => <ul className="list-disc list-inside text-text-secondary mb-4 space-y-1" {...props} />,
  ol: (props) => <ol className="list-decimal list-inside text-text-secondary mb-4 space-y-1" {...props} />,
  li: (props) => <li className="ml-2" {...props} />,
  code: (props) => (
    <code
      className="px-1.5 py-0.5 rounded bg-surface border border-border text-text-primary text-sm font-mono"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="p-4 rounded-lg bg-surface border border-border overflow-x-auto text-sm mb-4"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-accent pl-4 italic text-text-secondary my-4"
      {...props}
    />
  ),
  hr: () => <hr className="border-border my-10" />,
  Callout,
  PullQuote,
  Timeline,
  StepBlock,
  ArticleImage,
  ImageGrid,
  LinkPreview,
  MarkdownBlock,
  FormulaToCode,
};

export default mdxComponents;
