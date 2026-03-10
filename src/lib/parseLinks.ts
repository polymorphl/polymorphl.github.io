/**
 * Parses markdown-style links [text](url) in a string and returns React nodes.
 * Used for career highlights and other inline text with links.
 */

import { createElement } from 'react';
import type { ReactNode } from 'react';

const LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;

export function parseTextWithLinks(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reset regex state for global match
  LINK_REGEX.lastIndex = 0;

  while ((match = LINK_REGEX.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    // Add the link
    const [, linkText, url] = match;
    const isExternal = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
    nodes.push(
      createElement(
        'a',
        {
          key: `${match.index}-${linkText}`,
          href: url,
          ...(isExternal && { target: '_blank', rel: 'noopener noreferrer' }),
          className: 'text-[var(--color-accent-on-surface)] hover:underline focus:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-on-surface)] focus-visible:ring-offset-2 rounded',
        },
        linkText
      )
    );
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  // If no links found, return the original text
  if (nodes.length === 0) {
    return [text];
  }

  return nodes;
}
