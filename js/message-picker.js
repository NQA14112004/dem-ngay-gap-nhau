/**
 * Chọn câu yêu thương cho một ngày cụ thể.
 *
 * Điểm quan trọng: câu được chọn theo NGÀY, không theo lần mở trang. Em có
 * mở đi mở lại mười lần trong ngày thì vẫn thấy đúng câu đó; sang hôm sau mới
 * đổi câu mới.
 */

import { MESSAGES } from './messages.js?v=015067cd';

/** Ngưỡng chia nhóm theo số ngày còn lại. */
export const THRESHOLDS = { giua: 90, gan: 30, cuoi: 7 };

/**
 * Xác định hôm nay dùng nhóm câu nào.
 *
 * @param {number} daysRemaining Số ngày còn lại
 * @returns {'xa' | 'giua' | 'gan' | 'cuoi'}
 */
export function pickGroup(daysRemaining) {
  if (daysRemaining > THRESHOLDS.giua) {
    return 'xa';
  }
  if (daysRemaining > THRESHOLDS.gan) {
    return 'giua';
  }
  if (daysRemaining > THRESHOLDS.cuoi) {
    return 'gan';
  }
  return 'cuoi';
}

/**
 * Thay các ký hiệu trong câu bằng tên thật.
 *
 * @param {string} text Câu gốc
 * @param {{ tenEm?: string, tenAnh?: string }} [names] Tên trong config
 * @returns {string}
 */
export function fillNames(text, names = {}) {
  return text
    .replaceAll('{em}', names.tenEm ?? 'em')
    .replaceAll('{anh}', names.tenAnh ?? 'anh');
}

/**
 * Lấy câu của ngày hôm nay.
 *
 * @param {object} params Tham số
 * @param {number} params.daysRemaining Số ngày còn lại
 * @param {number} params.dayNumber Julian Day Number của hôm nay
 * @param {{ tenEm?: string, tenAnh?: string }} [params.names] Tên trong config
 * @returns {string} Câu đã thay tên
 */
export function pickMessage({ daysRemaining, dayNumber, names }) {
  const group = pickGroup(daysRemaining);
  const list = MESSAGES[group];

  // Bảy ngày cuối thì đi theo thứ tự đã viết sẵn, để câu cuối cùng rơi đúng
  // vào hôm sát ngày về. Các nhóm khác thì xoay vòng theo số thứ tự ngày.
  const index =
    group === 'cuoi'
      ? Math.min(list.length - 1, Math.max(0, list.length - daysRemaining))
      : ((dayNumber % list.length) + list.length) % list.length;

  return fillNames(list[index], names);
}
