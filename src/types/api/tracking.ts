/**
 * Tracking event type definitions for PostHog
 * All tracking payloads are defined here for type safety and discoverability
 */

export interface ResumeDownloadedEvent {
  source: string;
}

export interface SocialLinkClickedEvent {
  platform: 'linkedin' | 'github';
  source: string;
}

export interface ProjectClickedEvent {
  project_id: string;
  project_title: string;
  project_url: string;
}

export interface CareerCompanyClickedEvent {
  company: string;
  website: string;
  source: string;
}

export interface BlogPostViewedEvent {
  slug: string;
  title: string;
  lang: string;
  tags?: string[];
  reading_time?: number;
  date?: string;
}

export interface ThemeToggledEvent {
  theme: string;
  previous_theme: string;
}

export interface LanguageChangedEvent {
  language: string;
  previous_language?: string;
}

export interface BlogPostReadEvent {
  slug: string;
  title: string;
  lang: string;
  reading_time?: number;
  time_spent_seconds: number;
  max_scroll_percent: number;
  is_article_read: boolean;
}

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
