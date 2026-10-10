/**
 * NOVIARA - AI Neural Network Canvas Animation
 * High-performance, subtle, futuristic connected nodes & flowing data energy.
 * Handles mouse interactions, retina screens, and respects prefers-reduced-motion.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Reduced motion check
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReducedMotion = mediaQuery.matches;
  mediaQuery.addEventListener('change', (e) => {
    isReducedMotion = e.matches;
    if (isReducedMotion && animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    } else {
      init();
      animate();
    }
  });

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let animationFrameId = null;
  let isVisible = true;

  // Configuration
  const CONFIG = {
    nodeCountDesktop: 55,
    nodeCountMobile: 26,
    maxDistance: 150,
    mouseRadius: 180,
    nodeColor: '#00ff87',
    secondaryColor: '#10b981',
    lineColor: 'rgba(16, 185, 129,',
    pulseSpeed: 0.02
  };

  let nodes = [];
  let packets = []; // floating data packets moving along connections

  // Mouse tracking
  const mouse = {
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    isHovering: false
  };

  class Node {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.originX = x;
      this.originY = y;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 2.2 + 1.2;
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.baseAlpha = Math.random() * 0.5 + 0.35;
      this.isHub = Math.random() > 0.85; // special hub nodes
      if (this.isHub) {
        this.radius = Math.random() * 1.5 + 3.2;
      }
    }

    update() {
      // Normal drift
      this.x += this.vx;
      this.y += this.vy;

      // Bounce softly off canvas borders
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse subtle interaction
      if (mouse.isHovering) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.mouseRadius && dist > 0) {
          const force = (1 - dist / CONFIG.mouseRadius) * 0.8;
          // Soft repel/shift
          this.x -= (dx / dist) * force;
          this.y -= (dy / dist) * force;
        }
      }

      this.pulsePhase += CONFIG.pulseSpeed;
    }

    draw() {
      const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
      const alpha = this.baseAlpha * pulse;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

      if (this.isHub) {
        // Glowing halo for hubs
        ctx.fillStyle = CONFIG.nodeColor;
        ctx.shadowColor = CONFIG.nodeColor;
        ctx.shadowBlur = 12;
        ctx.fill();

        // Hub ring
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 3 * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 135, ${alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      } else {
        ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
        ctx.fill();
      }
    }
  }

  // Floating data packet moving along neural lines
  class Packet {
    constructor(nodeA, nodeB) {
      this.nodeA = nodeA;
      this.nodeB = nodeB;
      this.progress = 0;
      this.speed = Math.random() * 0.015 + 0.008;
      this.size = Math.random() * 1.5 + 1.2;
      this.dead = false;
    }

    update() {
      this.progress += this.speed;
      if (this.progress >= 1) {
        this.dead = true;
      }
    }

    draw() {
      const currentX = this.nodeA.x + (this.nodeB.x - this.nodeA.x) * this.progress;
      const currentY = this.nodeA.y + (this.nodeB.y - this.nodeA.y) * this.progress;

      ctx.beginPath();
      ctx.arc(currentX, currentY, this.size, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00ff87';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  function init() {
    resize();
    nodes = [];
    packets = [];

    const isMobile = width < 768;
    const count = isMobile ? CONFIG.nodeCountMobile : CONFIG.nodeCountDesktop;

    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      nodes.push(new Node(x, y));
    }
  }

  function spawnPackets() {
    if (packets.length > 12) return;
    if (Math.random() < 0.07) {
      // Pick two close nodes
      const i = Math.floor(Math.random() * nodes.length);
      const nodeA = nodes[i];
      let closestNode = null;
      let closestDist = CONFIG.maxDistance;

      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const nodeB = nodes[j];
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < closestDist) {
          closestDist = dist;
          closestNode = nodeB;
        }
      }

      if (closestNode) {
        packets.push(new Packet(nodeA, closestNode));
      }
    }
  }

  function renderConnections() {
    const maxDist = width < 768 ? CONFIG.maxDistance * 0.8 : CONFIG.maxDistance;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.28;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `${CONFIG.lineColor} ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Connect to mouse if close
      if (mouse.isHovering) {
        const dx = nodes[i].x - mouse.x;
        const dy = nodes[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.mouseRadius) {
          const alpha = (1 - dist / CONFIG.mouseRadius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 255, 135, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    if (!isVisible) return;

    if (isReducedMotion) {
      // Draw static frame
      ctx.clearRect(0, 0, width, height);
      renderConnections();
      nodes.forEach((n) => n.draw());
      return;
    }

    // Smooth mouse interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.1;
    mouse.y += (mouse.targetY - mouse.y) * 0.1;

    ctx.clearRect(0, 0, width, height);

    // Update & draw nodes
    nodes.forEach((node) => {
      node.update();
    });

    renderConnections();

    nodes.forEach((node) => {
      node.draw();
    });

    // Update & draw packets
    spawnPackets();
    for (let i = packets.length - 1; i >= 0; i--) {
      packets[i].update();
      packets[i].draw();
      if (packets[i].dead) {
        packets.splice(i, 1);
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  // Mouse movement listeners on the hero section
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isHovering = true;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.isHovering = false;
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    });

    // Touch support for tablets/mobiles
    heroSection.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = e.touches[0].clientX - rect.left;
        mouse.targetY = e.touches[0].clientY - rect.top;
        mouse.isHovering = true;
      }
    }, { passive: true });

    heroSection.addEventListener('touchend', () => {
      mouse.isHovering = false;
    });
  }

  // Handle window resizing with debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      init();
    }, 200);
  });

  // Pause canvas when out of view to preserve CPU / GPU / Battery
  if (heroSection && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            if (!animationFrameId) {
              animate();
            }
          }
        } else {
          isVisible = false;
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      });
    }, { threshold: 0.05 });

    heroObserver.observe(heroSection);
  }

  // Pause canvas when tab is hidden or window is minimized
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    } else if (isVisible && !isReducedMotion) {
      if (!animationFrameId) {
        animate();
      }
    }
  });

  // Start animation
  init();
  animate();
})();
