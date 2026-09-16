/**
 * Chuyển đổi âm lịch <-> dương lịch theo thuật toán của Hồ Ngọc Đức
 * (dựa trên "Astronomical Algorithms" của Jean Meeus).
 *
 * Toàn bộ file này là hàm thuần: không đụng tới DOM, không đọc Date.now().
 * Nhờ vậy phần khó nhất của dự án có thể kiểm thử độc lập bằng node --test.
 *
 * Quy ước: múi giờ Việt Nam là UTC+7, không có DST.
 */

/** Múi giờ chuẩn dùng cho mọi phép tính âm lịch Việt Nam. */
export const TIMEZONE_VN = 7;

/** Mốc Julian Day Number của ngày 15/10/1582 - ranh giới lịch Julius / Gregory. */
const JD_GREGORIAN_START = 2299161;

/** Số ngày trung bình của một tuần trăng (tháng giao hội). */
const SYNODIC_MONTH = 29.530588853;

/**
 * Đổi một ngày dương lịch sang Julian Day Number.
 * JDN là số nguyên đếm ngày liên tục, nên trừ hai JDN cho nhau
 * là ra đúng số ngày lịch cách nhau - không bị ảnh hưởng bởi giờ giấc.
 *
 * @param {number} day Ngày (1-31)
 * @param {number} month Tháng (1-12)
 * @param {number} year Năm dương lịch
 * @returns {number} Julian Day Number
 */
export function jdFromDate(day, month, year) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  const gregorianJd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  if (gregorianJd < JD_GREGORIAN_START) {
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return gregorianJd;
}

/**
 * Đổi ngược Julian Day Number về ngày dương lịch.
 *
 * @param {number} jd Julian Day Number
 * @returns {{ day: number, month: number, year: number }}
 */
export function jdToDate(jd) {
  let b = 0;
  let c;

  if (jd > JD_GREGORIAN_START - 1) {
    const a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((b * 146097) / 4);
  } else {
    c = jd + 32082;
  }

  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);

  return {
    day: e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10),
    year: b * 100 + d - 4800 + Math.floor(m / 10),
  };
}

/**
 * Thời điểm trăng mới thứ k tính từ ngày 01/01/1900, trả về dưới dạng
 * Julian Date (có phần thập phân).
 *
 * @param {number} k Chỉ số tuần trăng
 * @returns {number} Julian Date của điểm sóc
 */
function newMoonJulianDate(k) {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;

  let jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  jd1 = jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);

  // Dị thường trung bình của Mặt Trời
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  // Dị thường trung bình của Mặt Trăng
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  // Khoảng cách tới điểm nút lên của Mặt Trăng
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;

  let c1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  c1 = c1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  c1 = c1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  c1 = c1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  c1 = c1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  c1 = c1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  c1 = c1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));

  const deltat =
    T < -11
      ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
      : -0.000278 + 0.000265 * T + 0.000262 * T2;

  return jd1 + c1 - deltat;
}

/**
 * Kinh độ Mặt Trời (radian) tại một thời điểm Julian Date.
 *
 * @param {number} jdn Julian Date
 * @returns {number} Kinh độ trong khoảng [0, 2*PI)
 */
function sunLongitude(jdn) {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;

  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;

  let dl = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  dl = dl + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);

  const L = (L0 + dl) * dr;
  return L - Math.PI * 2 * Math.floor(L / (Math.PI * 2));
}

/**
 * Trung khí của một ngày: chia vòng hoàng đạo thành 12 phần, trả về 0-11.
 *
 * @param {number} dayNumber JDN của ngày cần xét
 * @param {number} timeZone Múi giờ
 * @returns {number} Chỉ số trung khí
 */
function getSunLongitudeIndex(dayNumber, timeZone) {
  return Math.floor((sunLongitude(dayNumber - 0.5 - timeZone / 24) / Math.PI) * 6);
}

/**
 * Ngày (JDN) bắt đầu tuần trăng thứ k, quy về giờ địa phương.
 *
 * @param {number} k Chỉ số tuần trăng
 * @param {number} timeZone Múi giờ
 * @returns {number} JDN của ngày mùng 1 âm lịch
 */
function getNewMoonDay(k, timeZone) {
  return Math.floor(newMoonJulianDate(k) + 0.5 + timeZone / 24);
}

/**
 * Tìm ngày bắt đầu tháng 11 âm lịch (tháng chứa Đông chí) của một năm dương lịch.
 *
 * @param {number} year Năm dương lịch
 * @param {number} timeZone Múi giờ
 * @returns {number} JDN ngày mùng 1 tháng 11 âm lịch
 */
function getLunarMonth11(year, timeZone) {
  const off = jdFromDate(31, 12, year) - 2415021;
  const k = Math.floor(off / SYNODIC_MONTH);
  const newMoon = getNewMoonDay(k, timeZone);

  if (getSunLongitudeIndex(newMoon, timeZone) >= 9) {
    return getNewMoonDay(k - 1, timeZone);
  }
  return newMoon;
}

/**
 * Xác định vị trí tháng nhuận trong một năm âm lịch nhuận.
 *
 * @param {number} a11 JDN mùng 1 tháng 11 âm lịch của năm trước
 * @param {number} timeZone Múi giờ
 * @returns {number} Khoảng cách tháng nhuận so với tháng 11
 */
function getLeapMonthOffset(a11, timeZone) {
  const k = Math.floor((a11 - 2415021.076998695) / SYNODIC_MONTH + 0.5);
  let last;
  let i = 1;
  let arc = getSunLongitudeIndex(getNewMoonDay(k + i, timeZone), timeZone);

  do {
    last = arc;
    i += 1;
    arc = getSunLongitudeIndex(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);

  return i - 1;
}

/**
 * Đổi một ngày dương lịch sang âm lịch.
 *
 * @param {number} day Ngày dương
 * @param {number} month Tháng dương
 * @param {number} year Năm dương
 * @param {number} [timeZone=TIMEZONE_VN] Múi giờ
 * @returns {{ day: number, month: number, year: number, isLeap: boolean }}
 */
export function solarToLunar(day, month, year, timeZone = TIMEZONE_VN) {
  const dayNumber = jdFromDate(day, month, year);
  const k = Math.floor((dayNumber - 2415021.076998695) / SYNODIC_MONTH);

  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }

  let a11 = getLunarMonth11(year, timeZone);
  let b11 = a11;
  let lunarYear;

  if (a11 >= monthStart) {
    lunarYear = year;
    a11 = getLunarMonth11(year - 1, timeZone);
  } else {
    lunarYear = year + 1;
    b11 = getLunarMonth11(year + 1, timeZone);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);

  let isLeap = false;
  let lunarMonth = diff + 11;

  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        isLeap = true;
      }
    }
  }

  if (lunarMonth > 12) {
    lunarMonth -= 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }

  return { day: lunarDay, month: lunarMonth, year: lunarYear, isLeap };
}

/**
 * Đổi một ngày âm lịch sang dương lịch.
 *
 * @param {number} day Ngày âm (1-30)
 * @param {number} month Tháng âm (1-12), 12 là tháng Chạp
 * @param {number} year Năm âm lịch
 * @param {boolean} [isLeap=false] Có phải tháng nhuận không
 * @param {number} [timeZone=TIMEZONE_VN] Múi giờ
 * @returns {{ day: number, month: number, year: number } | null} null nếu tháng nhuận không tồn tại
 */
export function lunarToSolar(day, month, year, isLeap = false, timeZone = TIMEZONE_VN) {
  let a11;
  let b11;

  if (month < 11) {
    a11 = getLunarMonth11(year - 1, timeZone);
    b11 = getLunarMonth11(year, timeZone);
  } else {
    a11 = getLunarMonth11(year, timeZone);
    b11 = getLunarMonth11(year + 1, timeZone);
  }

  let off = month - 11;
  if (off < 0) {
    off += 12;
  }

  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) {
      leapMonth += 12;
    }

    if (isLeap && month !== leapMonth) {
      return null;
    }
    if (isLeap || off >= leapOff) {
      off += 1;
    }
  }

  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / SYNODIC_MONTH);
  const monthStart = getNewMoonDay(k + off, timeZone);

  return jdToDate(monthStart + day - 1);
}
