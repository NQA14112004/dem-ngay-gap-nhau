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

  /** Dòng chữ nhỏ trên cùng màn hình. Dùng được {em} và {anh}. */
  loiMoDau: 'Anh làm trang này cho {em}',

  /**
   * Bức thư hiện ra đúng ngày về (25 tháng Chạp).
   * Mỗi dòng trong mảng là một đoạn. Dùng được {em} và {anh}. Viết gì tuỳ bạn.
   */
  thuNgo: [
    '{em} à,',
    'Con số trên màn hình về 0 rồi.',
    'Mấy tháng vừa rồi anh ở bên kia, ngày nào cũng nhìn nó bớt đi một, chỉ để chờ đúng hôm nay.',
    'Từ hôm nay, muốn gặp em anh chỉ cần đi mấy phút.',
  ],

  /**
   * Nhạc nền.
   *
   * Không cần làm gì cả: mặc định trang tự chơi một đoạn nhạc ngũ cung nhẹ,
   * sinh thẳng trong trình duyệt, không lặp lại y hệt bao giờ.
   *
   * Muốn dùng bài của riêng hai đứa thì chép file .mp3 vào assets/audio/ rồi
   * điền tên file vào đây, ví dụ: 'assets/audio/bai-cua-minh.mp3'
   * Có file thì trang ưu tiên file, để trống thì dùng nhạc tự sinh.
   */
  fileNhac: 'assets/audio/nhac-nen.mp3',

  /**
   * Bình thường trang tự tính ngày 25 tháng Chạp sắp tới.
   * Nếu ngày bay thật của bạn khác, điền vào đây dạng 'YYYY-MM-DD'.
   * Ví dụ: overrideTargetDate: '2027-02-01'
   */
  overrideTargetDate: null,
};
