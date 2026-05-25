import { usePostHogCapture } from '@/context/PostHogContext';
import type { BlogPostViewedEvent, BlogPostReadEvent } from '@api/tracking';

export function useTracking() {
  const capture = usePostHogCapture();

  return {
    trackResumeDownloaded: (source: string) => {
      capture?.('resume_downloaded', { source });
    },

    trackSocialLinkClicked: (platform: 'linkedin' | 'github' | 'email', source: string) => {
      capture?.('social_link_clicked', { platform, source });
    },

    trackProjectClicked: (projectId: string, projectTitle: string, projectUrl: string) => {
      capture?.('project_clicked', {
        project_id: projectId,
        project_title: projectTitle,
        project_url: projectUrl,
      });
    },

    trackCareerCompanyClicked: (company: string, website: string, source: string) => {
      capture?.('career_company_clicked', { company, website, source });
    },

    trackBlogPostViewed: (event: BlogPostViewedEvent) => {
      capture?.('blog_post_viewed', event as Record<string, unknown>);
    },

    trackThemeToggled: (theme: string, previousTheme: string) => {
      capture?.('theme_toggled', { theme, previous_theme: previousTheme });
    },

    trackLanguageChanged: (language: string, previousLanguage?: string) => {
      capture?.('language_changed', { language, previous_language: previousLanguage });
    },

    trackBlogPostRead: (event: BlogPostReadEvent) => {
      capture?.('blog_post_read', event as Record<string, unknown>);
    },
  };
}
