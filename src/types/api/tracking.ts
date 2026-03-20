/**
 * Tracking event type definitions for PostHog
 * All tracking payloads are defined here for type safety and discoverability
 */

export type ResumeDownloadedEvent = {
  source: string;
};

export type SocialLinkClickedEvent = {
  platform: 'linkedin' | 'github';
  source: string;
};

export type ProjectClickedEvent = {
  project_id: string;
  project_title: string;
  project_url: string;
};

export type CareerCompanyClickedEvent = {
  company: string;
  website: string;
  source: string;
};

export type BlogPostViewedEvent = {
  slug: string;
  title: string;
  lang: string;
  tags?: string[];
  reading_time?: number;
  date?: string;
};

export type ThemeToggledEvent = {
  theme: string;
  previous_theme: string;
};

export type LanguageChangedEvent = {
  language: string;
  previous_language?: string;
};

export type BlogPostReadEvent = {
  slug: string;
  title: string;
  lang: string;
  reading_time?: number;
  time_spent_seconds: number;
  max_scroll_percent: number;
  is_article_read: boolean;
};

export type TrackingEvent =
  | ResumeDownloadedEvent
  | SocialLinkClickedEvent
  | ProjectClickedEvent
  | CareerCompanyClickedEvent
  | BlogPostViewedEvent
  | ThemeToggledEvent
  | LanguageChangedEvent
  | BlogPostReadEvent;

export type TrackingEventName =
  | 'resume_downloaded'
  | 'social_link_clicked'
  | 'project_clicked'
  | 'career_company_clicked'
  | 'blog_post_viewed'
  | 'theme_toggled'
  | 'language_changed'
  | 'blog_post_read';

export type ArticleTrackingOptions = {
  slug: string;
  title: string;
  lang: string;
  readingTime?: number;
  tags?: string[];
  date?: string;
};
