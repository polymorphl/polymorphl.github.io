import { usePostHog } from 'posthog-js/react';
import type { BlogPostViewedEvent, BlogPostReadEvent } from '@api/tracking';

export function useTracking() {
  const posthog = usePostHog();

  return {
    trackResumeDownloaded: (source: string) => {
      posthog?.capture('resume_downloaded', { source });
    },

    trackSocialLinkClicked: (platform: 'linkedin' | 'github' | 'email', source: string) => {
      posthog?.capture('social_link_clicked', { platform, source });
    },

    trackProjectClicked: (projectId: string, projectTitle: string, projectUrl: string) => {
      posthog?.capture('project_clicked', {
        project_id: projectId,
        project_title: projectTitle,
        project_url: projectUrl,
      });
    },

    trackCareerCompanyClicked: (company: string, website: string, source: string) => {
      posthog?.capture('career_company_clicked', { company, website, source });
    },

    trackBlogPostViewed: (event: BlogPostViewedEvent) => {
      posthog?.capture('blog_post_viewed', event);
    },

    trackThemeToggled: (theme: string, previousTheme: string) => {
      posthog?.capture('theme_toggled', { theme, previous_theme: previousTheme });
    },

    trackLanguageChanged: (language: string, previousLanguage?: string) => {
      posthog?.capture('language_changed', { language, previous_language: previousLanguage });
    },

    trackBlogPostRead: (event: BlogPostReadEvent) => {
      posthog?.capture('blog_post_read', event);
    },
  };
}
