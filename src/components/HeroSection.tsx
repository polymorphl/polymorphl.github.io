import * as m from "motion/react-m";
import { Link } from "react-router-dom";
import { useLanguage } from "@hooks/useLanguage";
import { useMotionTransition } from "@hooks/useMotionTransition";
import { containerHero, fadeInUp20, scaleIn, underlineDrawIn } from "@config/motion";
import HeroPhoto from "@components/HeroPhoto";
import TechPill from "@components/TechPill";

export default function HeroSection() {
  const { t } = useLanguage();
  const transition = useMotionTransition(0.6);

  return (
    <m.section
      className="hero-section w-full pt-6 md:pt-10 pb-4"
      variants={containerHero}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px_200px] gap-3">

        {/* ── Cell: Main ── */}
        <m.div
          className="md:row-span-2 flex flex-col justify-between gap-6 rounded-[20px] border border-border p-8 min-h-[200px] md:min-h-[300px]"
          style={{ background: "linear-gradient(145deg, var(--color-surface) 0%, var(--color-background) 100%)" }}
          variants={fadeInUp20}
          transition={transition}
        >
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-accent-on-surface/60 flex items-center gap-2">
              <span className="inline-block w-1 h-1 rounded-full bg-accent-on-surface/60" aria-hidden />
              {t("hero.subtitle")} · {t("hero.experience")}
            </p>
            <h1 className="hero-title text-[2.6rem] sm:text-[3rem] lg:text-[3.4rem] font-extrabold leading-[0.92] tracking-[-0.04em] text-text-primary">
              Luc{" "}
              <span className="relative inline-block">
                TERRACHER
                <m.span
                  className="absolute left-0 right-0 bottom-[-2px] h-[3px] rounded-sm origin-left"
                  style={{ background: "var(--accent-line-gradient)" }}
                  variants={underlineDrawIn}
                  initial="hidden"
                  animate="visible"
                  transition={{ ...transition, delay: 0.15 }}
                  aria-hidden
                />
              </span>
            </h1>
            <p className="text-sm md:text-base text-text-secondary/80 leading-relaxed max-w-md">
              {t("hero.tagline")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex flex-wrap gap-2">
              <TechPill name="React" icon="react" />
              <TechPill name="TypeScript" icon="typescript" />
              <TechPill name="Node.js" icon="nodejs" />
            </div>
            <Link
              to="/career"
              className="cta-primary inline-flex items-center justify-center px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm no-underline shadow-[var(--shadow-button)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-floating)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 shrink-0"
            >
              {t("projects.viewCareerCta")}
              <span aria-hidden className="ml-1">→</span>
            </Link>
          </div>
        </m.div>

        {/* ── Cell: Photo ── */}
        <m.div
          className="md:row-span-2 rounded-[20px] border border-border/50 overflow-hidden relative h-[220px] md:h-auto"
          variants={scaleIn}
          transition={transition}
        >
          <HeroPhoto />
          {/* bottom fade into background */}
          <div
            className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
            style={{ background: "linear-gradient(to top, var(--color-background) 0%, transparent 100%)" }}
            aria-hidden
          />
          {/* subtle left edge blend with main cell */}
          <div
            className="absolute inset-y-0 left-0 w-8 pointer-events-none"
            style={{ background: "linear-gradient(to right, rgba(0,0,0,0.25), transparent)" }}
            aria-hidden
          />
        </m.div>

        {/* ── Cell: Availability ── */}
        <m.div
          className="rounded-[20px] p-5 flex flex-col justify-start gap-2"
          style={{
            background: "linear-gradient(145deg, rgba(14,26,14,0.95), rgba(9,20,9,0.9))",
            border: "1px solid rgba(74,222,128,0.25)",
          }}
          variants={fadeInUp20}
          transition={{ ...transition, delay: 0.1 }}
        >
          <div className="flex items-center gap-2">
            <span className="relative inline-flex w-2.5 h-2.5 shrink-0">
              <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping" aria-hidden />
              <span className="relative inline-block w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] font-bold text-emerald-400 tracking-wide">
              {t("hero.status")}
            </span>
          </div>
          <p className="text-[11px] text-emerald-300/60 leading-relaxed">
            {t("hero.training")}
          </p>
        </m.div>

        {/* ── Cell: Metrics ── */}
        <m.div
          className="rounded-[20px] border border-border bg-surface/60 overflow-hidden grid grid-cols-[3fr_2fr] grid-rows-2"
          variants={fadeInUp20}
          transition={{ ...transition, delay: 0.15 }}
        >
          {/* 10+ — featured stat, spans full left column */}
          <div className="row-span-2 border-r border-border p-5 flex flex-col justify-center gap-1">
            <p className="font-black leading-none tracking-tight text-text-primary" style={{ fontSize: "2.8rem" }}>
              10<span className="text-[1.4rem] text-accent-on-surface">+</span>
            </p>
            <p className="text-[11px] text-text-secondary/60 leading-tight">
              {t("hero.metricYears")}
            </p>
          </div>

          {/* Lead */}
          <div className="p-4 border-b border-border flex flex-col justify-center gap-1">
            <p className="text-[1.3rem] font-black leading-none tracking-tight text-accent-on-surface">
              Lead
            </p>
            <p className="text-[10px] text-text-secondary/60 leading-tight">
              {t("hero.metricRole")}
            </p>
          </div>

          {/* AI */}
          <div className="p-4 flex flex-col justify-center gap-1">
            <p className="text-[1.3rem] font-black leading-none tracking-tight text-accent-on-surface">
              AI
            </p>
            <p className="text-[10px] text-text-secondary/60 leading-tight">
              {t("hero.metricAI")}
            </p>
          </div>
        </m.div>

      </div>
    </m.section>
  );
}
