/**
 * Application routes configuration
 */

export const routes = {
  HOME: '/',
  CAREER: '/career',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,
} as const;

export type Routes = typeof routes;
