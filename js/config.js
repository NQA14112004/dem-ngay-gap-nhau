/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ĐÂY LÀ FILE DUY NHẤT BẠN CẦN SỬA                                ║
 * ║  Đổi mấy dòng bên dưới cho đúng với hai bạn, rồi lưu lại là xong.║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

export const config = {
  /** Tên hoặc biệt danh bạn gọi người yêu. Hiện khắp trang. */
  tenEm: 'BichHaneee',

  /** Tên bạn. Dùng để ký cuối bức thư ngày về. */
  tenAnh: 'QuangAnh',

  /** Dòng chữ nhỏ trên cùng màn hình. */
  loiMoDau: 'Đếm ngược tới ngày anh về',

  /**
   * Bức thư hiện ra đúng ngày về (28 tháng Chạp).
   * Mỗi dòng trong mảng là một đoạn. Viết gì tuỳ bạn.
   */
  thuNgo: [
    'Em à,',
    'Số trên màn hình về 0 rồi.',
    'Mấy tháng qua anh ngồi bên kia nhìn nó bớt đi từng ngày một. Chỉ để chờ đúng hôm nay.',
    'Anh về rồi. Không phải đếm nữa.',
  ],

  /**
   * Nhạc nền. Chép file .mp3 vào thư mục assets/audio/ rồi điền đúng tên file.
   * Nếu chưa có nhạc thì cứ để nguyên - nút loa sẽ tự ẩn, trang vẫn chạy bình thường.
   */
  fileNhac: 'assets/audio/nhac-nen.mp3',

  /**
   * Bình thường trang tự tính ngày 28 tháng Chạp sắp tới.
   * Nếu ngày bay thật của bạn khác, điền vào đây dạng 'YYYY-MM-DD'.
   * Ví dụ: overrideTargetDate: '2027-02-01'
   */
  overrideTargetDate: null,
};
