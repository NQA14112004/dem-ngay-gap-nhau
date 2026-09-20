/**
 * Chọn và dựng cảnh nền.
 *
 * Cảnh được quyết định bởi ba thứ, tách bạch nhau:
 *   - MÙA  : theo tháng dương lịch, quyết định tông màu chung
 *   - TUẦN : quyết định bố cục - vẽ đồi, phố, ruộng, đầm sen hay rừng thông
 *   - BUỔI : theo giờ máy người xem, quyết định ánh sáng sáng/trưa/chiều/tối
 *
 * Nhờ tách như vậy, trong cùng một tuần thì khung cảnh quen thuộc nhưng sáng
 * mở ra khác, tối mở ra khác; sang tuần mới lại là một khung cảnh khác hẳn.
 */

import { getDaypart } from './daypart.js?v=015067cd';
import { celestial, clouds, stars } from './scene-art.js?v=015067cd';
import { blossomBranch, lanterns } from './scene-art.js?v=015067cd';
import { ART_HEIGHT } from './scene-art.js?v=015067cd';
import { DAYS_PER_WEEK, pickLayout } from './scene-layouts.js?v=015067cd';
import { createRandom } from './rng.js?v=015067cd';

/** Còn từ ngần này ngày trở xuống thì bật chế độ Tết. */
export const TET_THRESHOLD = 30;

/** Giới hạn tỉ lệ khung hình, tránh tranh bị kéo quá dẹt hoặc quá cao. */
const ASPECT_RANGE = { min: 0.42, max: 2.6 };

/** Mùa theo tháng dương lịch ở Việt Nam. */
const SEASON_BY_MONTH = {
  1: 'dong', 2: 'xuan', 3: 'xuan', 4: 'xuan',
  5: 'ha', 6: 'ha', 7: 'ha',
  8: 'thu', 9: 'thu', 10: 'thu',
  11: 'dong', 12: 'dong',
};

/** Tên hiển thị của từng mùa. */
export const SEASON_LABELS = {
  xuan: 'mùa xuân',
  ha: 'mùa hạ',
  thu: 'mùa thu',
  dong: 'mùa đông',
};

/**
 * Quyết định hôm nay hiện cảnh nào.
 *
 * @param {object} params Tham số
 * @param {number} params.month Tháng dương lịch (1-12)
 * @param {number} params.dayNumber Julian Day Number của hôm nay
 * @param {number} params.daysRemaining Số ngày còn lại
 * @param {string} [params.daypart] Buổi trong ngày, mặc định lấy theo giờ máy
 * @returns {{ season: string, daypart: string, weekIndex: number, layout: object, isTet: boolean }}
 */
export function pickScene({ month, dayNumber, daysRemaining, daypart }) {
  const season = SEASON_BY_MONTH[month] ?? 'thu';
  const weekIndex = Math.floor(dayNumber / DAYS_PER_WEEK);

  return {
    season,
    daypart: daypart ?? getDaypart(),
    weekIndex,
    layout: pickLayout(season, weekIndex),
    isTet: daysRemaining <= TET_THRESHOLD,
  };
}

/**
 * Tính khung toạ độ của tranh theo tỉ lệ màn hình.
 *
 * Chiều cao luôn là 600, chiều rộng chạy theo màn hình. Nhờ vậy tranh không bị
 * cắt hai bên trên điện thoại dựng đứng.
 *
 * @param {number} viewportWidth Chiều rộng cửa sổ (px)
 * @param {number} viewportHeight Chiều cao cửa sổ (px)
 * @returns {{ width: number, height: number }}
 */
export function computeViewBox(viewportWidth, viewportHeight) {
  const raw = viewportHeight > 0 ? viewportWidth / viewportHeight : 1;
  const ratio = Math.min(ASPECT_RANGE.max, Math.max(ASPECT_RANGE.min, raw));

  return { width: Math.round(ART_HEIGHT * ratio), height: ART_HEIGHT };
}

/**
 * Ghép chuỗi SVG cho một cảnh cụ thể.
 *
 * @param {object} scene Cảnh cần vẽ
 * @param {number} seed Hạt giống ngẫu nhiên
 * @param {{ width: number, height: number }} viewBox Khung toạ độ
 * @returns {string} Chuỗi SVG hoàn chỉnh
 */
export function buildSceneSvg(scene, seed, viewBox = { width: 1000, height: ART_HEIGHT }) {
  const W = viewBox.width;
  const random = createRandom(seed);
  const isNight = scene.daypart === 'toi';
  const parts = [];

  parts.push(isNight ? stars(random, W) : clouds(random, W, 3));
  parts.push(celestial(W, scene.daypart));
  parts.push(scene.layout.ve(W, random));

  if (scene.isTet) {
    parts.push(lanterns(W), blossomBranch(random, W));
  }

  return `<svg viewBox="0 0 ${W} ${viewBox.height}" preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg" role="presentation">${parts.join('')}</svg>`;
}

/**
 * Gắn cảnh lên trang: đổi biến màu qua thuộc tính trên <body> và vẽ tranh SVG.
 *
 * @param {object} params Tham số
 * @param {HTMLElement} params.root Phần tử <body>
 * @param {HTMLElement} params.artContainer Nơi nhét chuỗi SVG vào
 * @param {object} params.scene Cảnh
 * @param {number} params.seed Hạt giống
 * @param {{ width: number, height: number }} params.viewBox Khung toạ độ
 */
export function applyScene({ root, artContainer, scene, seed, viewBox }) {
  root.dataset.scene = scene.season;
  root.dataset.buoi = scene.daypart;
  root.dataset.boCuc = scene.layout.ten;
  root.dataset.tet = String(scene.isTet);

  artContainer.innerHTML = buildSceneSvg(scene, seed, viewBox);
}
