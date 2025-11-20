export class FluidAurora {
  constructor() {
    this.canvas = document.getElementById('bg-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.orbs = [];
    this.orbCount = 5; // Keep it low for performance
    this.resizeTimeout = null;
    this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    this.init();
  }

  init() {
    this.resize();
    this.createOrbs();
    this.setupObservers();
    this.animate();

    // Handle resize
    window.addEventListener('resize', () => {
      if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.resize();
        this.createOrbs();
      }, 200);
    });
  }

  setupObservers() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
  }

  resize() {
    this.width = window.innerWidth / 2;
    this.height = window.innerHeight / 2;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createOrbs() {
    this.orbs = [];
    for (let i = 0; i < this.orbCount; i++) {
      this.orbs.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * (this.width * 0.25) + (this.width * 0.15),
        baseRadius: Math.random() * (this.width * 0.25) + (this.width * 0.15),
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02
      });
    }
  }

  getThemeColors() {
    if (this.isDark) {
      // Dark mode: Vibrant Deep colors
      return [
        { r: 255, g: 60, b: 20 },   // Bright Orange-Red
        { r: 60, g: 60, b: 180 },   // Electric Blue
        { r: 120, g: 20, b: 120 }   // Deep Magenta
      ];
    } else {
      // Light mode: Stronger, more saturated colors
      return [
        { r: 255, g: 120, b: 80 },  // Stronger Orange/Salmon
        { r: 100, g: 120, b: 255 }, // Stronger Blue
        { r: 200, g: 50, b: 100 }   // Pink/Red accent
      ];
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const colors = this.getThemeColors();
    this.ctx.globalCompositeOperation = this.isDark ? 'screen' : 'multiply';

    this.orbs.forEach((orb, index) => {
      // Move
      orb.x += orb.vx;
      orb.y += orb.vy;

      // Pulse logic
      orb.pulse += orb.pulseSpeed;
      orb.radius = orb.baseRadius + Math.sin(orb.pulse) * 20;

      // Bounce
      if (orb.x < -orb.radius) orb.vx = Math.abs(orb.vx);
      if (orb.x > this.width + orb.radius) orb.vx = -Math.abs(orb.vx);
      if (orb.y < -orb.radius) orb.vy = Math.abs(orb.vy);
      if (orb.y > this.height + orb.radius) orb.vy = -Math.abs(orb.vy);

      // Draw
      const baseColor = colors[index % colors.length];
      const gradient = this.ctx.createRadialGradient(
        orb.x, orb.y, 0,
        orb.x, orb.y, orb.radius
      );

      const alpha = this.isDark ? 0.4 : 0.25;
      gradient.addColorStop(0, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha})`);
      gradient.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0)`);

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }
}

