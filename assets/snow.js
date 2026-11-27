function createWeatherOverlay(container, mode = "snow") {
  // コンテナ基準で重ねられるようにする（既に relative / absolute なら邪魔にならないよう確認）
  if (getComputedStyle(container).position === "static") {
    container.style.position = "relative";
  }

  const canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  // Live2Dモデル（app.view）の前面に出したい場合は zIndex を大きめに設定
  canvas.style.zIndex = "10";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  // ★ ここを変えるだけで雪↔雨や雰囲気を調整できる
  const PRESETS = {
    snow: {
      count: 4,
      minSize: 1.5,
      maxSize: 5.0,
      minSpeedY: 0.4,
      maxSpeedY: 1.4,
      windX: 0.25,
      swayAmp: 0.6,
      swaySpeed: 0.02,
      minAlpha: 0.35,
      maxAlpha: 0.85,
      length: 0 // 0 なら丸（雪）、0より大きいと線（雨）
    },
    rain: {
      count: 70,
      minSize: 1.0,
      maxSize: 1.8,
      minSpeedY: 7.0,
      maxSpeedY: 12.0,
      windX: -1.5,
      swayAmp: 0,
      swaySpeed: 0,
      minAlpha: 0.2,
      maxAlpha: 0.55,
      length: 14
    }
  };

  const cfg = PRESETS[mode] || PRESETS.snow;
  let width = 0;
  let height = 0;
  let particles = [];
  let animId = null;

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function createParticle(randomY = true) {
    return {
      x: rand(0, width || 300),
      y: randomY ? rand(0, height || 300) : -10,
      size: rand(cfg.minSize, cfg.maxSize),
      speedY: rand(cfg.minSpeedY, cfg.maxSpeedY),
      alpha: rand(cfg.minAlpha, cfg.maxAlpha),
      phase: rand(0, Math.PI * 2)
    };
  }

  function resize() {
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  particles = Array.from({ length: cfg.count }, () => createParticle(true));

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  function tick() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.phase += cfg.swaySpeed;
      const swayX = Math.sin(p.phase) * cfg.swayAmp;

      p.x += cfg.windX + swayX;
      p.y += p.speedY;

      // 画面外に出たら上側へ戻す
      if (p.y > height + 20) {
        p.y = -15;
        p.x = rand(-20, width + 20);
      }
      if (p.x > width + 20) p.x = -20;
      if (p.x < -20) p.x = width + 20;

      ctx.save();
      ctx.globalAlpha = p.alpha;

      if (cfg.length > 0) {
        // 雨（斜めの線）
        ctx.strokeStyle = "#cfe8ff";
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + cfg.windX * 2, p.y + cfg.length);
        ctx.stroke();
      } else {
        // 雪（丸い粒）
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    animId = requestAnimationFrame(tick);
  }

  tick();

  // 後片付け用（不要になったら止める）
  return function destroy() {
    cancelAnimationFrame(animId);
    resizeObserver.disconnect();
    canvas.remove();
  };
}