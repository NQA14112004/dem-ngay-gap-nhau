/**
 * Buổi trong ngày: sáng, trưa, chiều, tối.
 *
 * Khác với con số đếm ngược (luôn tính theo ngày ở Việt Nam), màu nền lại bám
 * theo GIỜ MÁY của người đang mở trang. Lý do: cái này nói về ánh sáng ngoài
 * cửa sổ ngay lúc đó. Em mở lúc chập tối ở Hà Nội thì thấy trời chiều; anh mở
 * lúc sáng ở bên kia thì thấy trời sáng.
 */

/** Bốn buổi, kèm giờ bắt đầu. */
export const DAYPARTS = [
  { id: 'sang', ten: 'sáng', tuGio: 5 },
  { id: 'trua', ten: 'trưa', tuGio: 11 },
  { id: 'chieu', ten: 'chiều', tuGio: 15 },
  { id: 'toi', ten: 'tối', tuGio: 18 },
];

/** Danh sách id hợp lệ, dùng để kiểm tham số xem thử. */
export const DAYPART_IDS = DAYPARTS.map((b) => b.id);

/**
 * Buổi ứng với một giờ cụ thể.
 *
 * @param {number} hour Giờ trong ngày (0-23)
 * @returns {string} Id của buổi
 */
export function daypartFromHour(hour) {
  const gio = ((Math.floor(hour) % 24) + 24) % 24;

  if (gio >= 18 || gio < 5) {
    return 'toi';
  }
  if (gio < 11) {
    return 'sang';
  }
  if (gio < 15) {
    return 'trua';
  }
  return 'chieu';
}

/**
 * Buổi hiện tại theo giờ máy người xem.
 *
 * @param {Date} [now=new Date()] Thời điểm cần xét
 * @returns {string} Id của buổi
 */
export function getDaypart(now = new Date()) {
  return daypartFromHour(now.getHours());
}

/**
 * Tên tiếng Việt của một buổi.
 *
 * @param {string} id Id của buổi
 * @returns {string}
 */
export function daypartLabel(id) {
  return DAYPARTS.find((b) => b.id === id)?.ten ?? 'tối';
}

/**
 * Nhận id buổi do người dùng ép qua địa chỉ trang, bỏ qua giá trị lạ.
 *
 * @param {string | null | undefined} value Chuỗi cần kiểm
 * @returns {string | null}
 */
export function parseDaypart(value) {
  if (typeof value !== 'string') {
    return null;
  }
  const id = value.trim().toLowerCase();

  return DAYPART_IDS.includes(id) ? id : null;
}
