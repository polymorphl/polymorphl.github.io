/**
 * API response types
 */

import type { ComponentType } from 'react';
import type { BlogPostMeta } from '@domain/blog';

export type MDXModule = {
  default: ComponentType;
  frontmatter?: Partial<Omit<BlogPostMeta, 'lang'>>;
};
