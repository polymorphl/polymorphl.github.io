export default function HeroPhoto() {
  return (
    <picture className="profile-photo-picture block relative z-10 size-full">
      <source srcSet="/profile.webp" type="image/webp" />
      <img
        src="/profile.png"
        alt="Luc TERRACHER"
        fetchPriority="high"
        className="hero-photo block size-full object-cover object-center rounded-full"
        width={288}
        height={260}
      />
    </picture>
  );
}

