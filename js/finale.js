/**
 * Màn hình ngày về: bức thư ngỏ và pháo hoa.
 *
 * Chỉ chạy khi con số đếm ngược chạm 0, và ở lại suốt thời gian ân hạn
 * (xem GRACE_DAYS trong target-date.js) chứ không biến mất ngay hôm sau.
 */

import { between, createRandom } from './rng.js?v=f25a9ec3';

/** Bảng màu pháo hoa: đỏ, vàng, hồng, trắng ngà - tông ngày Tết. */
const COLORS = ['#ffd45e', '#ff6b6b', '#ffa64d', '#ffe9c4', '#ff8fb1'];

/** Số mảnh sáng trong một lần nổ. */
const SPARKS_PER_BURST = 46;

/** Khoảng cách giữa hai lần nổ, tính bằng mili-giây. */
const BURST_INTERVAL_MS = 900;

/**
 * Đổ nội dung bức thư ra màn hình.
 *
 * @param {object} params Tham số
 * @param {HTMLElement} params.letterNode Khối chứa thư
 * @param {HTMLElement} params.signNode Dòng ký tên
 * @param {object} params.config Cấu hình người dùng
 */
function renderLetter({ letterNode, signNode, config }) {
  letterNode.replaceChildren();

  config.thuNgo.forEach((doan, index) => {
    const p = document.createElement('p');
    p.textContent = doan;
    // Từng đoạn hiện ra lần lượt cho giống đang đọc thư.
    p.style.animationDelay = `${0.9 + index * 0.45}s`;
    letterNode.append(p);
  });

  signNode.textContent = `— ${config.tenAnh}`;
}

/**
 * Chạy pháo hoa trên canvas.
 *
 * @param {HTMLCanvasElement} canvas Thẻ canvas
 * @returns {() => void} Hàm dừng
 */
function startFireworks(canvas) {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');

  if (reduceMotion || !ctx) {
    return () => {};
  }

  const random = createRandom(Date.now() % 100000);
  let sparks = [];
  let width = 0;
  let height = 0;
  let rafId = null;
  let burstTimer = null;
  let lastTime = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function burst() {
    const x = between(random, width * 0.12, width * 0.88);
    const y = between(random, height * 0.1, height * 0.82);
    const color = COLORS[Math.floor(random() * COLORS.length)];
    const speed = between(random, 90, 210);

    for (let i = 0; i < SPARKS_PER_BURST; i += 1) {
      const goc = (i / SPARKS_PER_BURST) * Math.PI * 2 + between(random, -0.1, 0.1);
      const v = speed * between(random, 0.55, 1.15);

      sparks.push({
        x, y, color,
        vx: Math.cos(goc) * v,
        vy: Math.sin(goc) * v,
        life: between(random, 1.1, 2.0),
        age: 0,
        size: between(random, 1.4, 3.2),
      });
    }
  }

  function frame(time) {
    const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0.016;
    lastTime = time;

    // Xoá mờ dần để mảnh sáng kéo đuôi. Dùng destination-out chứ không phủ một
    // lớp màu tối, nếu không canvas sẽ che mất nền đỏ vàng phía dưới.
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';

    sparks = sparks.filter((s) => {
      s.age += dt;
      if (s.age >= s.life) {
        return false;
      }

      s.vy += 62 * dt; // trọng lực
      s.vx *= 0.985;
      s.vy *= 0.985;
      s.x += s.vx * dt;
      s.y += s.vy * dt;

      ctx.globalAlpha = Math.max(0, 1 - s.age / s.life);
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();

      return true;
    });

    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize);

  burst();
  burstTimer = window.setInterval(burst, BURST_INTERVAL_MS);
  rafId = requestAnimationFrame(frame);

  return () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    if (burstTimer !== null) window.clearInterval(burstTimer);
    window.removeEventListener('resize', resize);
  };
}

/**
 * Hiện màn hình ngày về.
 *
 * @param {object} params Tham số
 * @param {HTMLElement} params.root Khối .finale
 * @param {HTMLCanvasElement} params.canvas Canvas pháo hoa
 * @param {HTMLElement} params.letterNode Khối chứa thư
 * @param {HTMLElement} params.signNode Dòng ký tên
 * @param {object} params.config Cấu hình người dùng
 * @returns {{ stop: () => void }}
 */
export function showFinale({ root, canvas, letterNode, signNode, config }) {
  renderLetter({ letterNode, signNode, config });
  root.hidden = false;

  const stopFireworks = startFireworks(canvas);
  return { stop: stopFireworks };
}
