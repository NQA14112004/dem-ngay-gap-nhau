/**
 * Định dạng ngày tháng và thời lượng theo cách người Việt hay đọc.
 */

/** Tên tháng âm lịch. Tháng 1 là Giêng, tháng 11 là Một, tháng 12 là Chạp. */
export const LUNAR_MONTH_NAMES = [
  'Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu',
  'Bảy', 'Tám', 'Chín', 'Mười', 'Một', 'Chạp',
];

/** Thứ trong tuần, tra theo phần dư của Julian Day Number cho 7. */
export const WEEKDAY_NAMES = [
  'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật',
];

/**
 * Thêm số 0 phía trước cho đủ hai chữ số.
 *
 * @param {number} value Số cần đệm
 * @returns {string}
 */
function pad2(value) {
  return String(value).padStart(2, '0');
}

/**
 * Định dạng ngày dương lịch kiểu 15/09/2026.
 *
 * @param {{ day: number, month: number, year: number }} date Ngày
 * @returns {string}
 */
export function formatSolarDate(date) {
  return `${pad2(date.day)}/${pad2(date.month)}/${date.year}`;
}

/**
 * Định dạng ngày âm lịch kiểu "mùng 5 tháng Tám" hoặc "28 tháng Chạp".
 *
 * @param {{ day: number, month: number, isLeap?: boolean }} date Ngày âm lịch
 * @returns {string}
 */
export function formatLunarDate(date) {
  const tenThang = LUNAR_MONTH_NAMES[date.month - 1] ?? String(date.month);
  const nhuan = date.isLeap ? ' nhuận' : '';
  const ngay = date.day <= 10 ? `mùng ${date.day}` : `${date.day}`;

  return `${ngay} tháng ${tenThang}${nhuan}`;
}

/**
 * Tên thứ trong tuần của một ngày, tính từ Julian Day Number.
 *
 * @param {number} jd Julian Day Number
 * @returns {string}
 */
export function formatWeekday(jd) {
  return WEEKDAY_NAMES[((jd % 7) + 7) % 7];
}

/**
 * Đổi mili-giây thành chuỗi giờ:phút:giây.
 *
 * @param {number} ms Số mili-giây
 * @returns {string} Ví dụ "07:24:58"
 */
export function formatDuration(ms) {
  const tong = Math.max(0, Math.floor(ms / 1000));
  const gio = Math.floor(tong / 3600);
  const phut = Math.floor((tong % 3600) / 60);
  const giay = tong % 60;

  return `${pad2(gio)}:${pad2(phut)}:${pad2(giay)}`;
}
