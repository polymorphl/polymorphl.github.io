/**
 * Application routes configuration
 */

export const routes = {
  HOME: '/',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,
} as const;

export type Routes = typeof routes;
