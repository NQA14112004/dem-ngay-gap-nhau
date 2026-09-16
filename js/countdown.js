/**
 * Đổ trạng thái đếm ngược ra màn hình và giữ nhịp đồng hồ.
 *
 * File này chỉ lo phần chữ nghĩa. Cảnh nền, nhạc và màn hình ngày về nằm ở
 * các module riêng, do main.js điều phối.
 */

import { formatDuration, formatLunarDate, formatSolarDate, formatWeekday } from './format.js';
import { jdFromDate } from './lunar.js';
import { pickMessage } from './message-picker.js';
import { msUntilVietnamMidnight } from './target-date.js';

/** Nhịp cập nhật đồng hồ phụ. */
const TICK_INTERVAL_MS = 1000;

/**
 * Câu mô tả đơn vị bên dưới con số, đổi theo việc còn nhiều hay ít ngày.
 *
 * @param {number} daysRemaining Số ngày còn lại
 * @returns {string}
 */
function unitText(daysRemaining) {
  if (daysRemaining === 1) {
    return 'ngày nữa. Mai anh về.';
  }
  if (daysRemaining <= 7) {
    return 'ngày nữa là anh về tới nhà';
  }
  return 'ngày nữa anh về';
}

/**
 * Vẽ toàn bộ phần chữ của trang theo trạng thái hiện tại.
 *
 * @param {Record<string, HTMLElement>} el Các phần tử DOM đã tra sẵn
 * @param {object} state Trạng thái từ getCountdownState()
 * @param {object} config Cấu hình người dùng
 */
export function renderCountdown(el, state, config) {
  const { today, lunarToday, target, daysRemaining } = state;
  const todayJd = jdFromDate(today.day, today.month, today.year);
  const targetJd = jdFromDate(target.day, target.month, target.year);

  el.eyebrow.textContent = config.loiMoDau;
  el.days.textContent = String(daysRemaining);
  el.unit.textContent = unitText(daysRemaining);

  el.todayLine.textContent =
    `Hôm nay ${formatWeekday(todayJd)}, ${formatSolarDate(today)} · ${formatLunarDate(lunarToday)}`;

  el.targetLine.innerHTML =
    `Ngày về: <strong>28 tháng Chạp</strong> · ${formatWeekday(targetJd)}, ${formatSolarDate(target)}`;

  const message = pickMessage({
    daysRemaining,
    dayNumber: todayJd,
    names: { tenEm: config.tenEm, tenAnh: config.tenAnh },
  });

  swapMessage(el.message, message);
}

/**
 * Đổi câu yêu thương kèm hiệu ứng mờ dần, tránh việc chữ nhảy đột ngột.
 *
 * @param {HTMLElement} node Thẻ chứa câu
 * @param {string} text Câu mới
 */
function swapMessage(node, text) {
  if (node.textContent === text) {
    return;
  }

  node.classList.add('is-swapping');
  window.setTimeout(() => {
    node.textContent = text;
    node.classList.remove('is-swapping');
  }, 320);
}

/**
 * Chạy đồng hồ phụ đếm tới nửa đêm giờ Việt Nam, và báo ra ngoài khi cần vẽ lại.
 *
 * Có hai lý do phải vẽ lại: sang ngày mới ở Việt Nam (con số bớt 1), hoặc sang
 * buổi mới ở chỗ người xem (trời chuyển từ chiều sang tối chẳng hạn). Trang mở
 * cả buổi tối vẫn tự chuyển màu chứ không đứng yên.
 *
 * @param {Record<string, HTMLElement>} el Các phần tử DOM
 * @param {object} params Tham số
 * @param {number} params.daysRemaining Số ngày còn lại lúc khởi động
 * @param {{ day: number, month: number, year: number }} params.today Ngày lúc khởi động
 * @param {string} params.daypart Buổi lúc khởi động
 * @param {() => { day: number, month: number, year: number }} params.readToday Đọc lại ngày
 * @param {() => string} params.readDaypart Đọc lại buổi
 * @param {() => void} params.onChange Gọi khi cần dựng lại màn hình
 * @returns {{ stop: () => void }}
 */
export function startTicking(el, { daysRemaining, today, daypart, readToday, readDaypart, onChange }) {
  const mocNgay = `${today.year}-${today.month}-${today.day}`;

  const timer = window.setInterval(() => {
    const homNay = readToday();
    const buoi = readDaypart();

    if (`${homNay.year}-${homNay.month}-${homNay.day}` !== mocNgay || buoi !== daypart) {
      onChange();
      return;
    }

    el.tick.textContent =
      daysRemaining > 0
        ? `Còn ${formatDuration(msUntilVietnamMidnight())} nữa là bớt một ngày`
        : '';
  }, TICK_INTERVAL_MS);

  return {
    stop() {
      window.clearInterval(timer);
    },
  };
}
