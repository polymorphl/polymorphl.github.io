import * as m from "motion/react-m";
import { useLanguage } from "@hooks/useLanguage";
import { useMotionTransition } from "@hooks/useMotionTransition";
import { fadeInUp30 } from "@config/motion";
import { CERTIFICATIONS_BASE } from "@config/career";
import SurfaceCard from "@components/SurfaceCard";
import type { Certification, CertificationI18n } from "@domain/career";

export default function Certifications() {
  const { t, tObject } = useLanguage();
  const transition = useMotionTransition(0.5);
  const i18nEntries = (tObject<CertificationI18n[]>("career.certifications") ??
    []) as CertificationI18n[];

  const i18nById = new Map(i18nEntries.map((entry) => [entry.id, entry]));
  const certifications: Certification[] = CERTIFICATIONS_BASE.map((base) => ({
    ...base,
    ...(i18nById.get(base.id) ?? {
      id: base.id,
      name: "",
      issuer: "",
      date: "",
    }),
  }));

  if (!certifications.length) return null;

  return (
    <m.section
      className="md:col-span-2 w-full text-left"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      variants={fadeInUp30}
      transition={transition}
    >
      <h2
        id="certifications"
        className="section-title section-title-underline text-2xl md:text-3xl font-black text-text-primary mb-4 md:mb-6 tracking-[-0.04em] scroll-mt-28"
      >
        {t("career.certificationsTitle")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {certifications.map((cert) => (
          <SurfaceCard
            key={cert.id}
            variant="bento"
            className="bento-card-glow p-4 md:p-5 flex flex-col gap-2 border-accent/25 transition-all duration-300 hover:-translate-y-[2px] hover:[box-shadow:var(--bento-card-hover-shadow)] hover:border-accent/50"
          >
            <span className="inline-flex items-center gap-1 self-start text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
              ✦ Certification
            </span>
            <h3 className="text-sm md:text-base font-bold text-text-primary leading-snug tracking-[-0.02em]">
              {cert.name}
            </h3>
            <p className="text-xs md:text-sm text-text-secondary">
              {cert.issuer}
            </p>
            <span className="text-[11px] font-mono text-accent tabular-nums">
              {cert.date}
            </span>
            {(cert.verifyUrl || cert.pdf) && (
              <div className="mt-1 flex items-center justify-between text-[11px] font-medium">
                {cert.verifyUrl && (
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-on-surface hover:text-accent underline-offset-2 hover:underline"
                  >
                    {t("career.viewCertification")}
                  </a>
                )}
                {cert.pdf && (
                  <a
                    href={cert.pdf}
                    download
                    className="inline-flex items-center gap-1 text-text-secondary/90 hover:text-accent underline-offset-2 hover:underline"
                  >
                    <span
                      aria-hidden
                      className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-border/70 bg-background/60 text-[9px]"
                    >
                      ⤓
                    </span>
                    <span>{t("career.downloadCertification")}</span>
                  </a>
                )}
              </div>
            )}
          </SurfaceCard>
        ))}
      </div>
    </m.section>
  );
}
