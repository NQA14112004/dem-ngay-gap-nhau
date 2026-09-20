/**
 * Nhạc nền: tự phát khi vào trang, có nút tạm dừng và thanh âm lượng.
 *
 * Có hai nguồn nhạc, chọn tự động:
 *   1. File .mp3 trong assets/audio/ nếu có - ưu tiên cái này
 *   2. Không có file thì dùng nhạc tự sinh trong js/music.js
 *
 * Về chuyện tự phát: Chrome, Safari, Firefox đều chặn trang phát tiếng khi
 * người xem chưa chạm vào gì. Không lách được. Nên cách làm ở đây là thử phát
 * ngay; bị chặn thì chờ cú chạm đầu tiên bất kỳ đâu trên màn hình rồi phát.
 * Với người xem thì gần như không khác gì tự phát.
 */

import { createMusic } from './music.js?v=009849fb';

/** Khoá lưu trạng thái bật/tắt. */
const STATE_KEY = 'dem-ngay-gap-nhau:nhac';

/** Khoá lưu mức âm lượng. */
const VOLUME_KEY = 'dem-ngay-gap-nhau:am-luong';

/** Âm lượng mặc định khi mở trang lần đầu. */
export const DEFAULT_VOLUME = 0.45;

/** Chờ file nhạc lâu nhất ngần này rồi thôi, quay sang nhạc tự sinh. */
const FILE_TIMEOUT_MS = 8000;

/** Những thao tác được tính là "người xem đã chạm vào trang". */
const GESTURE_EVENTS = ['pointerdown', 'touchstart', 'keydown'];

/**
 * Kẹp âm lượng về khoảng hợp lệ.
 *
 * @param {number} value Giá trị cần kẹp
 * @returns {number} Số trong khoảng 0 - 1
 */
export function clampVolume(value) {
  if (!Number.isFinite(value)) {
    return DEFAULT_VOLUME;
  }
  return Math.min(1, Math.max(0, value));
}

/**
 * Đọc mức âm lượng đã lưu, dạng chuỗi 0-100.
 *
 * @param {string | null} raw Giá trị đọc từ localStorage
 * @param {number} [fallback] Dùng khi chưa lưu gì hoặc giá trị hỏng
 * @returns {number} Âm lượng trong khoảng 0 - 1
 */
export function parseStoredVolume(raw, fallback = DEFAULT_VOLUME) {
  if (raw === null || raw === undefined || raw === '') {
    return fallback;
  }

  const so = Number(raw);
  if (!Number.isFinite(so)) {
    return fallback;
  }
  return clampVolume(so / 100);
}

/**
 * Có nên thử tự phát khi mở trang không.
 *
 * Chưa lưu gì thì có - đây là lần đầu người xem vào. Lần trước tự tay tắt thì
 * thôi, tôn trọng lựa chọn đó.
 *
 * @param {string | null} saved Trạng thái đã lưu
 * @returns {boolean}
 */
export function shouldAutoplay(saved) {
  return saved !== 'tat';
}

/**
 * Đọc một khoá trong localStorage, trình duyệt chặn thì coi như chưa lưu gì.
 *
 * @param {string} key Khoá
 * @returns {string | null}
 */
function readStored(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Ghi một khoá. Không ghi được thì bỏ qua, không làm hỏng trang.
 *
 * @param {string} key Khoá
 * @param {string} value Giá trị
 */
function writeStored(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Chế độ ẩn danh hoặc trình duyệt chặn lưu trữ - bỏ qua.
  }
}

/**
 * Bọc thẻ audio thành nguồn nhạc có cùng giao diện với bộ nhạc tự sinh.
 *
 * @param {HTMLAudioElement} audio Thẻ audio
 * @returns {{ start: Function, stop: Function, isPlaying: Function, setVolume: Function }}
 */
function createFileSource(audio) {
  return {
    start: () => audio.play(),
    stop: () => audio.pause(),
    isPlaying: () => !audio.paused,
    setVolume: (muc) => {
      audio.volume = clampVolume(muc);
    },
  };
}

/**
 * Quyết định dùng nguồn nhạc nào.
 *
 * Thử nạp file trước; file hỏng, không có, hoặc nạp quá lâu thì quay sang nhạc
 * tự sinh. Quyết xong mới hiện trình phát, để nó không đổi nguồn giữa chừng.
 *
 * @param {HTMLAudioElement} audio Thẻ audio
 * @param {string} src Đường dẫn file nhạc
 * @returns {Promise<{ nguon: object, tuFile: boolean }>}
 */
function resolveSource(audio, src) {
  if (!src) {
    return Promise.resolve({ nguon: createMusic(), tuFile: false });
  }

  return new Promise((resolve) => {
    let xong = false;

    const chot = (tuFile) => {
      if (xong) {
        return;
      }
      xong = true;
      window.clearTimeout(hetGio);
      resolve(
        tuFile
          ? { nguon: createFileSource(audio), tuFile: true }
          : { nguon: createMusic(), tuFile: false },
      );
    };

    const hetGio = window.setTimeout(() => chot(false), FILE_TIMEOUT_MS);

    audio.addEventListener('canplay', () => chot(true), { once: true });
    audio.addEventListener('error', () => chot(false), { once: true });

    audio.src = src;
    audio.load();
  });
}

/**
 * Gắn trình phát nhạc vào trang.
 *
 * @param {object} params Tham số
 * @param {HTMLElement} params.player Khối trình phát
 * @param {HTMLButtonElement} params.button Nút chạy/tạm dừng
 * @param {HTMLInputElement} params.slider Thanh âm lượng
 * @param {HTMLAudioElement} params.audio Thẻ audio
 * @param {string} params.src Đường dẫn file nhạc, để trống cũng được
 */
export async function setupAudio({ player, button, slider, audio, src }) {
  const { nguon, tuFile } = await resolveSource(audio, src);

  player.dataset.nguon = tuFile ? 'file' : 'tu-sinh';
  player.hidden = false;

  let mucAmLuong = parseStoredVolume(readStored(VOLUME_KEY));
  let daChoDoiCham = false;

  /**
   * Đồng bộ thanh âm lượng: vị trí con trượt, phần tô đậm, và dấu tắt tiếng.
   *
   * @param {number} muc Âm lượng trong khoảng 0 - 1
   */
  function veThanhAmLuong(muc) {
    const phanTram = Math.round(muc * 100);

    slider.value = String(phanTram);
    slider.style.setProperty('--muc', `${phanTram}%`);
    player.dataset.im = String(muc === 0);
  }

  nguon.setVolume(mucAmLuong);
  veThanhAmLuong(mucAmLuong);

  /**
   * Cập nhật hình thức nút theo trạng thái đang phát.
   *
   * @param {boolean} dangPhat Đang phát hay không
   */
  function setPressed(dangPhat) {
    button.setAttribute('aria-pressed', String(dangPhat));
    button.setAttribute('aria-label', dangPhat ? 'Tạm dừng nhạc nền' : 'Bật nhạc nền');
  }

  /** Chờ cú chạm đầu tiên rồi mới phát - dùng khi trình duyệt chặn tự phát. */
  function choDoiCham() {
    if (daChoDoiCham) {
      return;
    }
    daChoDoiCham = true;

    const chay = () => {
      go();
      nguon.start().then(() => setPressed(true), () => {});
    };

    const go = () => {
      daChoDoiCham = false;
      for (const ten of GESTURE_EVENTS) {
        document.removeEventListener(ten, chay);
      }
    };

    for (const ten of GESTURE_EVENTS) {
      document.addEventListener(ten, chay, { once: true, passive: true });
    }
  }

  /**
   * Thử phát. Bị chặn thì quay sang chờ cú chạm đầu tiên.
   *
   * @param {boolean} [choDuocChan=true] Có dựng sẵn cơ chế chờ chạm không
   */
  function thuPhat(choDuocChan = true) {
    return nguon.start().then(
      () => setPressed(true),
      () => {
        setPressed(false);
        if (choDuocChan) {
          choDoiCham();
        }
      },
    );
  }

  setPressed(false);

  if (shouldAutoplay(readStored(STATE_KEY))) {
    thuPhat();
  }

  button.addEventListener('click', () => {
    if (nguon.isPlaying()) {
      nguon.stop();
      setPressed(false);
      writeStored(STATE_KEY, 'tat');
      return;
    }

    // Đây đã là một cú bấm rồi nên không cần dựng cơ chế chờ chạm nữa
    thuPhat(false).then(() => {
      if (nguon.isPlaying()) {
        writeStored(STATE_KEY, 'bat');
      }
    });
  });

  slider.addEventListener('input', () => {
    mucAmLuong = clampVolume(Number(slider.value) / 100);

    nguon.setVolume(mucAmLuong);
    veThanhAmLuong(mucAmLuong);
    writeStored(VOLUME_KEY, String(Math.round(mucAmLuong * 100)));
  });

  // Chuyển sang tab khác thì tắt tiếng cho đỡ phiền, quay lại thì chạy tiếp.
  let dungViAn = false;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && nguon.isPlaying()) {
      dungViAn = true;
      nguon.stop();
      setPressed(false);
    } else if (!document.hidden && dungViAn) {
      dungViAn = false;
      thuPhat(false);
    }
  });
}
