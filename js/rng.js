/**
 * Bộ sinh số ngẫu nhiên có hạt giống (mulberry32).
 *
 * Dùng thay cho Math.random() để cùng một ngày thì cảnh vẽ ra luôn giống hệt nhau:
 * ngôi sao nằm đúng chỗ cũ, lá rơi đúng kiểu cũ. Sang ngày mới thì hạt giống đổi,
 * cảnh cũng đổi theo.
 *
 * @param {number} seed Hạt giống, thường là Julian Day Number của hôm nay
 * @returns {() => number} Hàm trả về số thực trong [0, 1)
 */
export function createRandom(seed) {
  let state = seed >>> 0;

  return function random() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Lấy một số thực trong khoảng [min, max).
 *
 * @param {() => number} random Hàm ngẫu nhiên
 * @param {number} min Cận dưới
 * @param {number} max Cận trên
 * @returns {number}
 */
export function between(random, min, max) {
  return min + random() * (max - min);
}
