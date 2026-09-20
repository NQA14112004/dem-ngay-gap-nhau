/**
 * Lớp hạt rơi vẽ trên canvas: lá thu, tuyết đông, mưa xuân, đốm nắng mùa hạ,
 * cánh mai ngày Tết.
 *
 * Ba nguyên tắc để trang không ngốn pin điện thoại:
 *   1. Máy bật "giảm chuyển động" thì không chạy vòng lặp nào cả.
 *   2. Chuyển sang tab khác thì dừng vẽ.
 *   3. Số hạt tính theo diện tích màn hình, có trần cứng.
 */

import { between, createRandom } from './rng.js?v=f25a9ec3';

/** Trần số hạt, tránh làm nóng máy trên màn hình lớn. */
const MAX_PARTICLES = 90;

/** Mật độ hạt trên mỗi triệu pixel màn hình. */
const DENSITY_PER_MEGAPIXEL = 42;

/** Cấu hình từng kiểu hạt: tốc độ rơi, độ lắc ngang, kích thước. */
const PRESETS = {
  la: { fall: [16, 40], sway: [18, 46], size: [7, 15], spin: [0.4, 1.6], shape: 'la' },
  tuyet: { fall: [14, 34], sway: [10, 30], size: [1.8, 4.2], spin: [0, 0.2], shape: 'tron' },
  mua: { fall: [190, 320], sway: [2, 8], size: [0.9, 1.6], spin: [0, 0], shape: 'mua' },
  nang: { fall: [4, 14], sway: [14, 34], size: [1.6, 3.6], spin: [0, 0.3], shape: 'tron' },
  mai: { fall: [22, 52], sway: [22, 54], size: [6, 13], spin: [0.5, 1.8], shape: 'canh' },
  canh: { fall: [20, 46], sway: [20, 50], size: [5, 11], spin: [0.4, 1.5], shape: 'canh' },
  suong: { fall: [3, 10], sway: [8, 22], size: [18, 46], spin: [0, 0.1], shape: 'suong',
    mau: 'rgba(255, 255, 255, 0.9)' },
};

/** Kiểu hạt mặc định khi bố cục không nói rõ. */
const DEFAULT_PRESET = 'la';

/**
 * Tạo một hạt mới ở vị trí ngẫu nhiên.
 *
 * @param {object} preset Cấu hình kiểu hạt
 * @param {() => number} random Hàm ngẫu nhiên
 * @param {number} width Chiều rộng canvas (px CSS)
 * @param {number} height Chiều cao canvas (px CSS)
 * @param {boolean} [atTop=false] Sinh ngay phía trên màn hình thay vì rải đều
 * @returns {object} Hạt
 */
function createParticle(preset, random, width, height, atTop = false) {
  return {
    x: between(random, -40, width + 40),
    y: atTop ? between(random, -height * 0.4, -10) : between(random, -height, height),
    size: between(random, preset.size[0], preset.size[1]),
    fallSpeed: between(random, preset.fall[0], preset.fall[1]),
    swayAmp: between(random, preset.sway[0], preset.sway[1]),
    swaySpeed: between(random, 0.4, 1.3),
    phase: between(random, 0, Math.PI * 2),
    angle: between(random, 0, Math.PI * 2),
    spin: between(random, preset.spin[0], preset.spin[1]) * (random() > 0.5 ? 1 : -1),
    alpha: between(random, 0.35, 1),
  };
}

/**
 * Dựng sẵn một mảng sương mờ dần ra rìa.
 *
 * Vẽ trước một lần rồi dán lại nhiều lần, thay vì tạo gradient trong từng
 * khung hình. Nếu vẽ bằng ellipse thường thì sương có viền rõ, trông như vết
 * bẩn trên màn hình chứ không ra sương.
 *
 * @returns {HTMLCanvasElement | null}
 */
function createFogSprite() {
  const size = 128;
  const sprite = document.createElement('canvas');
  sprite.width = size;
  sprite.height = size;

  const ctx = sprite.getContext('2d');
  if (!ctx) {
    return null;
  }

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
  gradient.addColorStop(0.55, 'rgba(255, 255, 255, 0.16)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return sprite;
}

/**
 * Vẽ một hạt theo hình dạng của kiểu hạt.
 *
 * @param {CanvasRenderingContext2D} ctx Ngữ cảnh vẽ
 * @param {object} p Hạt
 * @param {string} shape Tên hình dạng
 * @param {string} color Màu
 * @param {HTMLCanvasElement | null} fogSprite Ảnh sương dựng sẵn
 */
function drawParticle(ctx, p, shape, color, fogSprite) {
  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);

  if (shape === 'mua') {
    ctx.lineWidth = p.size;
    ctx.globalAlpha = p.alpha * 0.55;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, p.size * 14);
    ctx.stroke();
  } else if (shape === 'la') {
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = p.alpha * 0.5;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.lineTo(0, p.size);
    ctx.stroke();
  } else if (shape === 'canh') {
    // Cánh hoa mai: một hình giọt nước bo tròn
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.quadraticCurveTo(p.size * 0.72, 0, 0, p.size);
    ctx.quadraticCurveTo(-p.size * 0.72, 0, 0, -p.size);
    ctx.fill();
  } else if (shape === 'suong') {
    ctx.globalAlpha = p.alpha * 0.3;
    if (fogSprite) {
      ctx.drawImage(fogSprite, -p.size * 1.6, -p.size * 0.7, p.size * 3.2, p.size * 1.4);
    }
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Khởi động lớp hạt rơi trên một thẻ canvas.
 *
 * @param {HTMLCanvasElement} canvas Thẻ canvas nền
 * @param {object} options Tuỳ chọn
 * @param {string} options.hat Kiểu hạt do bố cục của tuần chỉ định
 * @param {boolean} options.isTet Có đang trong chế độ Tết không
 * @param {number} options.seed Hạt giống ngẫu nhiên
 * @returns {{ stop: () => void }} Đối tượng để dừng hiệu ứng
 */
export function startParticles(canvas, { hat, isTet, seed }) {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    return { stop() {} };
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { stop() {} };
  }

  // Sát Tết thì lá, tuyết, mưa đều nhường chỗ cho cánh mai vàng bay.
  const presetName = isTet ? 'mai' : (PRESETS[hat] ? hat : DEFAULT_PRESET);
  const preset = PRESETS[presetName];
  const random = createRandom(seed);
  const fogSprite = preset.shape === 'suong' ? createFogSprite() : null;

  let width = 0;
  let height = 0;
  let particles = [];
  let color = 'rgba(255,255,255,0.85)';
  let rafId = null;
  let lastTime = 0;

  function readColor() {
    // Sương luôn trắng đục, không lấy màu của mùa - lấy màu lá mùa thu thì
    // sương hoá thành mấy vệt nâu trông như vết bẩn trên màn hình.
    if (preset.mau) {
      color = preset.mau;
      return;
    }
    const value = getComputedStyle(document.body).getPropertyValue('--particle').trim();
    color = value || color;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const megapixels = (width * height) / 1_000_000;
    const target = Math.min(MAX_PARTICLES, Math.round(DENSITY_PER_MEGAPIXEL * megapixels) + 18);

    while (particles.length < target) {
      particles.push(createParticle(preset, random, width, height));
    }
    particles.length = target;
  }

  function frame(time) {
    const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0.016;
    lastTime = time;

    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.y += p.fallSpeed * dt;
      p.phase += p.swaySpeed * dt;
      p.x += Math.sin(p.phase) * p.swayAmp * dt;
      p.angle += p.spin * dt;

      // Rơi khỏi màn hình thì thả lại từ phía trên
      if (p.y - p.size > height) {
        Object.assign(p, createParticle(preset, random, width, height, true));
      }
      if (p.x < -60) {
        p.x = width + 50;
      } else if (p.x > width + 60) {
        p.x = -50;
      }

      drawParticle(ctx, p, preset.shape, color, fogSprite);
    }

    rafId = requestAnimationFrame(frame);
  }

  function play() {
    if (rafId === null) {
      lastTime = 0;
      rafId = requestAnimationFrame(frame);
    }
  }

  function pause() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function onVisibilityChange() {
    if (document.hidden) {
      pause();
    } else {
      play();
    }
  }

  readColor();
  resize();
  play();

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibilityChange);

  return {
    stop() {
      pause();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      ctx.clearRect(0, 0, width, height);
    },
  };
}
