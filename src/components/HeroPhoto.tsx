export default function HeroPhoto() {
  return (
    <picture className="block relative z-10 size-full leading-[0] text-[0]">
      <source srcSet="/profile.webp" type="image/webp" />
      <img
        src="/profile.png"
        alt="Luc TERRACHER"
        fetchPriority="high"
        className="hero-photo block size-full object-cover object-[center_5%]"
        width={288}
        height={260}
      />
    </picture>
  );
}

