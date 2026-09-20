/**
 * Tính mốc "28 tháng Chạp" và số ngày còn lại.
 *
 * Nguyên tắc quan trọng nhất của file này:
 * KHÔNG đếm bằng mili-giây. Chỉ đếm bằng NGÀY LỊCH theo giờ Việt Nam.
 *
 * Lý do: người xem đang ở hai múi giờ khác nhau. Nếu lấy hiệu thời gian rồi
 * chia cho 86400000 thì hai người sẽ thấy hai con số khác nhau, và con số
 * cũng không giảm đúng 1 vào lúc nửa đêm. Quy cả hai đầu về Julian Day Number
 * của ngày ở Việt Nam thì kết quả luôn là số nguyên và luôn giống nhau.
 */

import { TIMEZONE_VN, jdFromDate, lunarToSolar, solarToLunar } from './lunar.js?v=015067cd';

/** Ngày âm lịch mục tiêu: 28 tháng Chạp - ngày anh về tới nhà. */
export const TARGET_LUNAR_DAY = 28;
export const TARGET_LUNAR_MONTH = 12;

/** Múi giờ Việt Nam dạng chuỗi IANA. */
const VN_TIME_ZONE = 'Asia/Ho_Chi_Minh';

/**
 * Sau ngày về, trang vẫn giữ màn hình chúc mừng thêm ngần này ngày
 * (hết mùng 5 Tết) rồi mới bắt đầu đếm ngược cho lần gặp năm sau.
 */
export const GRACE_DAYS = 7;

/** Số mili-giây trong một ngày. */
const MS_PER_DAY = 86400000;

/**
 * Lấy ngày hôm nay theo giờ Việt Nam, bất kể máy người xem ở múi giờ nào.
 *
 * @param {Date} [now=new Date()] Thời điểm cần quy đổi
 * @returns {{ day: number, month: number, year: number }}
 */
export function getVietnamToday(now = new Date()) {
  try {
    // 'en-CA' cho ra định dạng YYYY-MM-DD, dễ tách và không phụ thuộc locale máy.
    const formatted = new Intl.DateTimeFormat('en-CA', {
      timeZone: VN_TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);

    const [year, month, day] = formatted.split('-').map(Number);
    if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) {
      return { day, month, year };
    }
  } catch {
    // Trình duyệt quá cũ hoặc thiếu dữ liệu múi giờ - rơi xuống cách tính tay.
  }

  // Việt Nam không áp dụng giờ mùa hè nên cộng thẳng 7 tiếng là chính xác.
  const shifted = new Date(now.getTime() + TIMEZONE_VN * 60 * 60 * 1000);
  return {
    day: shifted.getUTCDate(),
    month: shifted.getUTCMonth() + 1,
    year: shifted.getUTCFullYear(),
  };
}

/**
 * Đọc ngày ép buộc từ chuỗi dạng YYYY-MM-DD (dùng cho ?ngay=... và cho config).
 *
 * @param {string | null | undefined} value Chuỗi ngày
 * @returns {{ day: number, month: number, year: number } | null}
 */
export function parseDateString(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const matched = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!matched) {
    return null;
  }

  const year = Number(matched[1]);
  const month = Number(matched[2]);
  const day = Number(matched[3]);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  return { day, month, year };
}

/**
 * Tìm ngày 28 tháng Chạp sắp tới tính từ một ngày dương lịch cho trước.
 *
 * Nếu 28 tháng Chạp của năm âm lịch hiện tại đã trôi qua (quá thời gian ân hạn)
 * thì tự động nhảy sang Tết năm sau - trang không bao giờ bị "hết hạn".
 *
 * @param {{ day: number, month: number, year: number }} today Ngày hôm nay (dương lịch, giờ VN)
 * @returns {{ day: number, month: number, year: number, lunarYear: number }}
 */
export function findNextTargetDate(today) {
  const todayJd = jdFromDate(today.day, today.month, today.year);
  const lunarToday = solarToLunar(today.day, today.month, today.year);

  // Bắt đầu từ -1: ngay sau Tết, năm âm lịch đã sang năm mới nhưng ngày về
  // vừa qua lại thuộc năm âm lịch cũ - phải xét nó thì màn hình chúc mừng
  // mới ở lại đủ thời gian ân hạn.
  for (let offset = -1; offset <= 2; offset += 1) {
    const lunarYear = lunarToday.year + offset;
    const target = lunarToSolar(TARGET_LUNAR_DAY, TARGET_LUNAR_MONTH, lunarYear);

    if (!target) {
      continue;
    }

    const targetJd = jdFromDate(target.day, target.month, target.year);
    if (todayJd - targetJd <= GRACE_DAYS) {
      return { ...target, lunarYear };
    }
  }

  // Không bao giờ nên tới đây, nhưng thà trả về một mốc hợp lệ còn hơn là undefined.
  const fallback = lunarToSolar(TARGET_LUNAR_DAY, TARGET_LUNAR_MONTH, lunarToday.year + 1);
  return { ...fallback, lunarYear: lunarToday.year + 1 };
}

/**
 * Số mili-giây còn lại cho tới nửa đêm kế tiếp ở Việt Nam.
 * Dùng để hiển thị đồng hồ phụ "còn bao lâu nữa thì bớt 1 ngày".
 *
 * @param {Date} [now=new Date()] Thời điểm hiện tại
 * @returns {number} Mili-giây, luôn trong khoảng (0, 86400000]
 */
export function msUntilVietnamMidnight(now = new Date()) {
  const vnNow = new Date(now.getTime() + TIMEZONE_VN * 60 * 60 * 1000);
  const elapsed =
    vnNow.getUTCHours() * 3600000 +
    vnNow.getUTCMinutes() * 60000 +
    vnNow.getUTCSeconds() * 1000 +
    vnNow.getUTCMilliseconds();

  return MS_PER_DAY - elapsed;
}

/**
 * Tính toàn bộ trạng thái đếm ngược tại một thời điểm.
 *
 * @param {Date} [now=new Date()] Thời điểm hiện tại
 * @param {object} [options] Tuỳ chọn
 * @param {{ day: number, month: number, year: number } | null} [options.today] Ép ngày hôm nay (xem thử)
 * @param {{ day: number, month: number, year: number } | null} [options.targetOverride] Ép ngày mục tiêu
 * @returns {{
 *   today: { day: number, month: number, year: number },
 *   lunarToday: { day: number, month: number, year: number, isLeap: boolean },
 *   target: { day: number, month: number, year: number, lunarYear: number },
 *   daysRemaining: number,
 *   hasArrived: boolean,
 *   msUntilMidnight: number
 * }}
 */
export function getCountdownState(now = new Date(), options = {}) {
  const today = options.today ?? getVietnamToday(now);
  const target = options.targetOverride
    ? { ...options.targetOverride, lunarYear: null }
    : findNextTargetDate(today);

  const todayJd = jdFromDate(today.day, today.month, today.year);
  const targetJd = jdFromDate(target.day, target.month, target.year);
  const daysRemaining = Math.max(0, targetJd - todayJd);

  return {
    today,
    lunarToday: solarToLunar(today.day, today.month, today.year),
    target,
    daysRemaining,
    hasArrived: todayJd >= targetJd,
    msUntilMidnight: msUntilVietnamMidnight(now),
  };
}
