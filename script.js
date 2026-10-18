/* Gildia generative visual system. No images, canvas libraries, or tracking. */
(() => {
  'use strict';

  const TAU = Math.PI * 2;
  const ACCENT = '#f4764c';
  const prefersLessMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hash = (n) => {
    const s = Math.sin(n * 127.1 + 74.7) * 43758.5453123;
    return s - Math.floor(s);
  };
  const ease = (x) => x * x * (3 - 2 * x);
  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
  const rgba = (r, g, b, a) => 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';

  function drawRing(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    const s = Math.min(w, h);
    const cx = w * 0.52;
    const cy = h * 0.495;
    const radius = s * 0.326;
    const thickness = s * 0.108;
    const clock = t % 13;
    // The half-chaotic ring slowly becomes more organized, then reforms.
    const transition = clock < 4 ? ease(clock / 4) * .75
      : clock < 7 ? .75
      : clock < 11 ? .75 * (1 - ease((clock - 7) / 4))
      : 0;

    // Soft visual structure, not a blob: independent fine radial threads.
    for (let i = 0; i < 228; i++) {
      const a = (i / 228) * TAU - Math.PI / 2;
      const side = (1 + Math.cos(a)) * .5;
      const chaos = Math.pow(1 - side, 1.65) * (1 - transition);
      const glowSide = Math.cos(a) > .18 && Math.sin(a) < .46;
      const r0 = radius - thickness * .52;
      const r1 = radius + thickness * .51;
      ctx.beginPath();
      for (let k = 0; k <= 7; k++) {
        const q = k / 7;
        const rr = r0 + (r1 - r0) * q;
        const seed = hash(i * 18 + k * 3);
        const ripple = (seed - .5) * thickness * .72 * chaos;
        const angleVariation = (hash(i * 5 + k * 13) - .5) * .115 * chaos;
        const phase = a + angleVariation + .018 * Math.sin(t * .38 + i * .41) * chaos;
        const x = cx + Math.cos(phase) * (rr + ripple);
        const y = cy + Math.sin(phase) * (rr + ripple);
        if (!k) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = glowSide ? rgba(237, 109, 66, .20 + side * .27)
                                : rgba(41, 40, 38, .12 + (1 - chaos) * .16);
      ctx.lineWidth = .65 + side * .28;
      ctx.stroke();
    }

    // Ordered dotted arcs on the right; a little dispersed on the left.
    for (let band = 0; band < 5; band++) {
      const rb = radius - thickness * .43 + band * thickness * .215;
      for (let i = 0; i < 175; i++) {
        const a = (i / 175) * TAU - Math.PI / 2;
        const side = (1 + Math.cos(a)) * .5;
        const chaos = Math.pow(1 - side, 1.55) * (1 - transition);
        const j = (hash(i * 89 + band * 37) - .5) * thickness * .54 * chaos;
        const da = (hash(i * 23 + band * 139) - .5) * .075 * chaos;
        const x = cx + Math.cos(a + da) * (rb + j);
        const y = cy + Math.sin(a + da) * (rb + j);
        const isOrange = Math.cos(a) > .05 && Math.sin(a) < .38 && band >= 2;
        ctx.beginPath();
        ctx.arc(x, y, (isOrange ? .9 : .72) + .24 * hash(i * 12 + band), 0, TAU);
        ctx.fillStyle = isOrange ? rgba(243, 111, 70, .45 + side * .48)
                                 : rgba(29, 29, 29, .29 + side * .35);
        ctx.fill();
      }
    }

    // The crisp part is a precise form that everything converges toward.
    ctx.beginPath();
    ctx.arc(cx, cy, radius - thickness * .64, -.92, 1.2);
    ctx.strokeStyle = rgba(244, 118, 76, .085);
    ctx.lineWidth = 1;
    ctx.stroke();
    const ax = cx + Math.cos(.14) * (radius + thickness * .45);
    const ay = cy + Math.sin(.14) * (radius + thickness * .45);
    ctx.beginPath();
    ctx.arc(ax, ay, 3.5, 0, TAU);
    ctx.fillStyle = ACCENT;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ax, ay, 9, 0, TAU);
    ctx.strokeStyle = rgba(244, 118, 76, .19);
    ctx.stroke();
  }

  function drawFlow(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    const destX = w * .79;
    const destY = h * .49;
    const originX = w * .09;
    const lineEndX = destX - 18;
    const count = 28;

    ctx.lineWidth = 1;
    ctx.setLineDash([2, 5]);
    for (const x of [w * .37, w * .68]) {
      ctx.beginPath();
      ctx.moveTo(x, h * .115);
      ctx.lineTo(x, h * .79);
      ctx.strokeStyle = rgba(90, 86, 79, .17);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    for (let i = 0; i < count; i++) {
      const y = h * (.17 + i * .021);
      const randomX = (hash(i * 11) - .5) * w * .13;
      const randomY = (hash(i * 13) - .5) * h * .14;
      const wiggle = Math.sin(t * .64 + i * .79) * 3;
      const sx = originX + randomX + wiggle;
      const sy = y + randomY;
      const isHighlight = [4, 11, 19, 25].includes(i);
      const cp1x = w * (.25 + (hash(i * 71) - .5) * .055);
      const cp1y = sy + (hash(i * 53) - .5) * h * .43;
      const cp2x = w * .49;
      const cp2y = destY + (i - count / 2) * 2.1;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, lineEndX, destY);
      ctx.strokeStyle = isHighlight ? rgba(244, 118, 76, .55)
                                  : rgba(58, 57, 54, .12 + .13 * hash(i * 17));
      ctx.lineWidth = isHighlight ? 1.15 : .9;
      ctx.stroke();

      // Small moving dot on a few paths, like work progressing.
      if (i % 6 === 0) {
        const u = (t * .105 + i / count) % 1;
        const iu = 1 - u;
        const px = iu * iu * iu * sx + 3 * iu * iu * u * cp1x + 3 * iu * u * u * cp2x + u * u * u * lineEndX;
        const py = iu * iu * iu * sy + 3 * iu * iu * u * cp1y + 3 * iu * u * u * cp2y + u * u * u * destY;
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, TAU);
        ctx.fillStyle = ACCENT;
        ctx.fill();
      }
    }

    for (let i = 0; i < 180; i++) {
      const x = w * (.065 + hash(i * 91) * .23);
      const y = h * (.17 + hash(i * 43) * .57);
      ctx.beginPath();
      ctx.arc(x, y, .7 + hash(i * 18) * .75, 0, TAU);
      ctx.fillStyle = rgba(48, 47, 44, .18 + hash(i * 33) * .41);
      ctx.fill();
    }
    for (let j = 4; j >= 1; j--) {
      ctx.beginPath();
      ctx.arc(destX, destY, j * 16, 0, TAU);
      ctx.strokeStyle = rgba(244, 118, 76, .065 + (5 - j) * .015);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    const halo = ctx.createRadialGradient(destX, destY, 0, destX, destY, 45);
    halo.addColorStop(0, rgba(244,118,76,.20));
    halo.addColorStop(1, rgba(244,118,76,0));
    ctx.fillStyle = halo;
    ctx.fillRect(destX - 45, destY - 45, 90, 90);
    ctx.beginPath();
    ctx.arc(destX, destY, 5, 0, TAU);
    ctx.fillStyle = ACCENT;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,.9)';
    ctx.stroke();
  }

  function drawStructure(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    const cy = h * .50;
    const endX = w * .92;
    const startX = w * .40;
    const fading = ctx.createRadialGradient(w * .87, cy, 2, w * .87, cy, w * .48);
    fading.addColorStop(0, rgba(244,118,76,.17));
    fading.addColorStop(1, rgba(244,118,76,0));
    ctx.fillStyle = fading;
    ctx.fillRect(0, 0, w, h);

    // A restrained engineering structure: fine translucent rectangular planes,
    // each one smaller and more ordered than the last.
    for (let i = 0; i < 8; i++) {
      const x = startX + i * w * .064;
      const halfH = h * (.34 - i * .031);
      const halfW = w * (.025 - i * .0015);
      ctx.beginPath();
      ctx.moveTo(x - halfW, cy - halfH);
      ctx.lineTo(x + halfW, cy - halfH - 7);
      ctx.lineTo(x + halfW, cy + halfH - 7);
      ctx.lineTo(x - halfW, cy + halfH);
      ctx.closePath();
      const grad = ctx.createLinearGradient(x - halfW, 0, x + halfW, 0);
      grad.addColorStop(0, rgba(228, 220, 203, .015));
      grad.addColorStop(.68, rgba(219, 210, 198, .055 + i * .002));
      grad.addColorStop(1, rgba(247, 211, 183, .08));
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.lineWidth = .85;
      ctx.strokeStyle = rgba(214, 209, 200, .23 + (i / 8) * .1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - halfW, cy - halfH);
      ctx.lineTo(x - halfW, cy + halfH);
      ctx.strokeStyle = rgba(255, 255, 255, .22 + i * .025);
      ctx.stroke();
    }
    for (let i = 0; i < 245; i++) {
      const hx = hash(i * 21);
      const x = w * (.055 + hx * .51);
      const attenuation = 1 - clamp((x / w - .23) / .46, 0, 1);
      const spread = h * (.29 * attenuation + .016);
      const y = cy + (hash(i * 19) - .5) * spread * 2 + 3 * Math.sin(t * .4 + i) * attenuation;
      const alpha = (.17 + .58 * hash(i * 17)) * (1 - clamp((x / w - .48) * 2, 0, 1));
      ctx.beginPath();
      ctx.arc(x, y, .55 + hash(i * 7) * 1.05, 0, TAU);
      ctx.fillStyle = hash(i * 13) > .91 ? rgba(244,118,76,alpha) : rgba(236,229,220,alpha);
      ctx.fill();
    }
    // The many signals become one stable operating line.
    for (let i = 0; i < 12; i++) {
      const y = cy + (i - 5.5) * h * .026;
      ctx.beginPath();
      ctx.moveTo(w * .21, y);
      ctx.bezierCurveTo(w * .52, y, w * .67, cy + (i - 5.5) * 1.4, endX, cy);
      ctx.strokeStyle = i === 5 || i === 6 ? rgba(244,118,76,.33) : rgba(208,204,198,.12);
      ctx.lineWidth = .8;
      ctx.stroke();
    }
    const shine = ctx.createLinearGradient(w * .46, cy, endX, cy);
    shine.addColorStop(0, rgba(244,118,76,0));
    shine.addColorStop(.6, rgba(244,118,76,.8));
    shine.addColorStop(1, rgba(255,166,119,.95));
    ctx.beginPath();
    ctx.moveTo(w * .46, cy);
    ctx.lineTo(endX, cy);
    ctx.lineWidth = 1.55;
    ctx.strokeStyle = shine;
    ctx.shadowColor = ACCENT;
    ctx.shadowBlur = 9;
    ctx.stroke();
    ctx.shadowBlur = 0;
    const pulse = 8 + Math.sin(t * 1.7) * 1.6;
    const orb = ctx.createRadialGradient(endX, cy, 0, endX, cy, 28);
    orb.addColorStop(0, rgba(244,118,76,.9));
    orb.addColorStop(.3, rgba(244,118,76,.23));
    orb.addColorStop(1, rgba(244,118,76,0));
    ctx.fillStyle = orb;
    ctx.fillRect(endX - 28, cy - 28, 56, 56);
    ctx.beginPath();
    ctx.arc(endX, cy, pulse * .58, 0, TAU);
    ctx.fillStyle = ACCENT;
    ctx.fill();
    ctx.strokeStyle = rgba(255,255,255,.8);
    ctx.lineWidth = 1.3;
    ctx.stroke();
  }

  const visualMap = [
    ['circle-canvas', drawRing],
    ['flow-canvas', drawFlow],
    ['structure-canvas', drawStructure]
  ];
  const drawings = visualMap.map(([id, draw]) => {
    const canvas = document.getElementById(id);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return null;
    return { canvas, ctx, draw, width: 0, height: 0, visible: true };
  }).filter(Boolean);

  function resizeDrawing(item) {
    const rect = item.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    item.width = rect.width;
    item.height = rect.height;
    item.canvas.width = Math.round(rect.width * dpr);
    item.canvas.height = Math.round(rect.height * dpr);
    item.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    item.draw(item.ctx, item.width, item.height, 0);
  }
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const item = drawings.find((d) => d.canvas === entry.target);
        if (item) resizeDrawing(item);
      }
    });
    drawings.forEach((d) => ro.observe(d.canvas));
  } else {
    window.addEventListener('resize', () => drawings.forEach(resizeDrawing), { passive: true });
  }
  if ('IntersectionObserver' in window) {
    const sceneObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const item = drawings.find((d) => d.canvas === e.target);
        if (item) item.visible = e.isIntersecting;
      });
    }, { rootMargin: '100px' });
    drawings.forEach((d) => sceneObserver.observe(d.canvas));
  }
  drawings.forEach(resizeDrawing);
  const start = performance.now();
  let animationFrame;
  function animate(now) {
    const t = (now - start) / 1000;
    if (!document.hidden && !prefersLessMotion.matches) {
      for (const item of drawings) {
        if (item.visible && item.width) item.draw(item.ctx, item.width, item.height, t);
      }
    }
    animationFrame = requestAnimationFrame(animate);
  }
  if (drawings.length) animationFrame = requestAnimationFrame(animate);
  prefersLessMotion.addEventListener?.('change', () => drawings.forEach(resizeDrawing));

  // Mobile navigation.
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-nav');
  function closeMenu() {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    mobileMenu.hidden = true;
  }
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const opening = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(opening));
      menuButton.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
      mobileMenu.hidden = !opening;
    });
    mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  // Low-key page reveals. Content remains visible without IntersectionObserver.
  if ('IntersectionObserver' in window && !prefersLessMotion.matches) {
    const revealElements = document.querySelectorAll('.offer-card, .work-card, .process-steps article, .team-copy');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: '0px 0px -20px 0px' });
    revealElements.forEach((element) => { element.classList.add('reveal'); observer.observe(element); });
  }

  // Genuine contact details must be provided before launch. Never fake a sent message.
  // Optional setup: window.GILDIA_CONFIG = { contactEmail: '...', bookingUrl: '...' };
  const config = window.GILDIA_CONFIG || {};
  const email = typeof config.contactEmail === 'string' ? config.contactEmail.trim() : '';
  const booking = typeof config.bookingUrl === 'string' ? config.bookingUrl.trim() : '';
  // Only explicit http(s) booking URLs may redirect. Without one, CTAs lead to the inquiry.
  if (/^https?:\/\/[^ ]+/i.test(booking)) {
    document.querySelectorAll('a[href="#contact"]').forEach((link) => {
      link.href = booking;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
  }
  const form = document.querySelector('#inquiry-form');
  const copyButton = document.querySelector('#copy-enquiry');
  const result = document.querySelector('#inquiry-result');
  const resultText = document.querySelector('#inquiry-result-text');
  let preparedMessage = '';
  if (form && result && resultText) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const fields = new FormData(form);
      preparedMessage = 'Gildia — workflow enquiry\n\n'
        + 'Name: ' + String(fields.get('name') || '').trim() + '\n'
        + 'Work email: ' + String(fields.get('email') || '').trim() + '\n'
        + 'Company: ' + String(fields.get('company') || 'Not specified').trim() + '\n\n'
        + 'Workflow to improve:\n' + String(fields.get('workflow') || '').trim();
      result.hidden = false;
      if (email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        resultText.textContent = 'Your email app will open with the prepared enquiry. Please send it from there.';
        const subject = encodeURIComponent('Gildia — workflow enquiry');
        const body = encodeURIComponent(preparedMessage);
        window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
      } else {
        resultText.textContent = 'Your enquiry is ready. Copy it to share with the Gildia team. A direct contact channel has not been configured yet.';
      }
      result.scrollIntoView({ behavior: prefersLessMotion.matches ? 'auto' : 'smooth', block: 'nearest' });
    });
    if (copyButton) {
      copyButton.addEventListener('click', async () => {
        if (!preparedMessage) return;
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(preparedMessage);
          } else {
            const helper = document.createElement('textarea');
            helper.value = preparedMessage;
            helper.style.position = 'fixed';
            helper.style.opacity = '0';
            document.body.appendChild(helper);
            helper.select();
            const copied = document.execCommand('copy');
            helper.remove();
            if (!copied) throw new Error('Copy unavailable');
          }
          copyButton.textContent = 'Copied ✓';
          setTimeout(() => { copyButton.textContent = 'Copy message ↗'; }, 2300);
        } catch (err) {
          resultText.textContent = preparedMessage;
          resultText.style.whiteSpace = 'pre-wrap';
          copyButton.textContent = 'Select the text above to copy';
        }
      });
    }
  }
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();