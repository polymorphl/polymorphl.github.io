/**
 * API response types
 */

import type { ComponentType } from 'react';

export interface MDXModule {
  default: ComponentType;
  frontmatter?: {
    title?: string;
    slug?: string;
    date?: string;
    excerpt?: string;
    summary?: string;
    tags?: string[];
    cover?: string;
    readingTime?: number;
    draft?: boolean;
  };
}
