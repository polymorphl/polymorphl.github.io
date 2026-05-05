import { useLanguage } from '@hooks/useLanguage';
import { useTracking } from '@hooks/useTracking';

export default function ActionBar() {
  const { t } = useLanguage();
  const { trackResumeDownloaded, trackSocialLinkClicked } = useTracking();

  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-surface/70 px-6 py-4 shadow-[var(--shadow-soft)]">
      <a
        href={t("resume.file")}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium no-underline text-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-floating)] hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        download
        onClick={() => trackResumeDownloaded("home-action-bar")}
      >
        {t("resume.text")}
      </a>
      <div className="flex gap-2">
        <a
          href="https://www.linkedin.com/in/lucterracher/"
          className="social-link flex items-center justify-center w-9 h-9 bg-surface border border-border rounded-full transition-all duration-200 text-text-primary hover:-translate-y-0.5 hover:shadow-[var(--shadow-button)] hover:border-accent no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile"
          onClick={() => trackSocialLinkClicked("linkedin", "home-action-bar")}
        >
          <svg
            className="w-4 h-4 text-text-primary [fill:currentColor]"
            width="16"
            height="16"
            viewBox="0 0 24 24"
          >
            <use href="/assets/icons/sprite.svg#linkedin" />
          </svg>
        </a>
        <a
          href="https://github.com/polymorphl"
          className="social-link flex items-center justify-center w-9 h-9 bg-surface border border-border rounded-full transition-all duration-200 text-text-primary hover:-translate-y-0.5 hover:shadow-[var(--shadow-button)] hover:border-accent no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
          onClick={() => trackSocialLinkClicked("github", "home-action-bar")}
        >
          <svg
            className="w-4 h-4 text-text-primary [fill:currentColor]"
            width="16"
            height="16"
            viewBox="0 0 24 24"
          >
            <use href="/assets/icons/sprite.svg#github" />
          </svg>
        </a>
      </div>
    </div>
  );
}
