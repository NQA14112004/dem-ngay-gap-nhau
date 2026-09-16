/**
 * Nhạc nền bật/tắt bằng tay.
 *
 * Có hai nguồn nhạc, chọn tự động:
 *   1. File .mp3 trong assets/audio/ nếu bạn có bỏ vào - ưu tiên cái này
 *   2. Không có file thì dùng nhạc tự sinh trong js/music.js
 *
 * Cố ý KHÔNG tự phát khi mở trang: trình duyệt chặn, và mở trang ở chỗ đông
 * người mà tự nhiên có nhạc thì phiền. Trạng thái bật/tắt được nhớ cho lần sau.
 */

import { createMusic } from './music.js';

/** Khoá lưu trạng thái trong localStorage. */
const STORAGE_KEY = 'dem-ngay-gap-nhau:nhac';

/** Âm lượng của file mp3, để nhỏ cho dễ chịu. */
const FILE_VOLUME = 0.35;

/** Chờ file nhạc lâu nhất ngần này rồi thôi, quay sang nhạc tự sinh. */
const FILE_TIMEOUT_MS = 3000;

/**
 * Đọc trạng thái đã lưu. Trình duyệt chặn localStorage thì coi như tắt.
 *
 * @returns {boolean}
 */
function readSavedState() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'bat';
  } catch {
    return false;
  }
}

/**
 * Ghi trạng thái. Không ghi được thì bỏ qua, không làm hỏng trang.
 *
 * @param {boolean} isOn Đang bật nhạc hay không
 */
function saveState(isOn) {
  try {
    window.localStorage.setItem(STORAGE_KEY, isOn ? 'bat' : 'tat');
  } catch {
    // Chế độ ẩn danh hoặc trình duyệt chặn lưu trữ - bỏ qua.
  }
}

/**
 * Bọc thẻ audio thành nguồn nhạc có cùng giao diện với bộ nhạc tự sinh.
 *
 * @param {HTMLAudioElement} audio Thẻ audio
 * @returns {{ start: () => Promise<void>, stop: () => void, isPlaying: () => boolean }}
 */
function createFileSource(audio) {
  audio.volume = FILE_VOLUME;

  return {
    start: () => audio.play(),
    stop: () => audio.pause(),
    isPlaying: () => !audio.paused,
  };
}

/**
 * Quyết định dùng nguồn nhạc nào.
 *
 * Thử nạp file trước; file hỏng, không có, hoặc nạp quá lâu thì quay sang nhạc
 * tự sinh. Quyết xong mới hiện nút, để nút không đổi nguồn giữa chừng.
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
      resolve(tuFile ? { nguon: createFileSource(audio), tuFile: true } : { nguon: createMusic(), tuFile: false });
    };

    const hetGio = window.setTimeout(() => chot(false), FILE_TIMEOUT_MS);

    audio.addEventListener('canplay', () => chot(true), { once: true });
    audio.addEventListener('error', () => chot(false), { once: true });

    audio.src = src;
    audio.load();
  });
}

/**
 * Gắn nhạc nền vào trang.
 *
 * @param {object} params Tham số
 * @param {HTMLAudioElement} params.audio Thẻ audio
 * @param {HTMLButtonElement} params.button Nút bật/tắt
 * @param {string} params.src Đường dẫn file nhạc, để trống cũng được
 */
export async function setupAudio({ audio, button, src }) {
  const { nguon, tuFile } = await resolveSource(audio, src);
  const nhan = button.querySelector('.audio-toggle__label');

  button.dataset.nguon = tuFile ? 'file' : 'tu-sinh';
  button.hidden = false;

  /**
   * Cập nhật hình thức của nút theo trạng thái đang phát.
   *
   * @param {boolean} isOn Đang bật hay không
   */
  function setPressed(isOn) {
    button.setAttribute('aria-pressed', String(isOn));
    button.setAttribute('aria-label', isOn ? 'Tắt nhạc nền' : 'Bật nhạc nền');

    if (nhan) {
      nhan.textContent = isOn ? 'Đang bật' : 'Nhạc';
    }
  }

  setPressed(false);

  // Lần trước có bật thì thử bật lại. Trình duyệt thường chặn vì chưa có thao
  // tác nào, lúc đó cứ để nút ở trạng thái tắt, người xem bấm một cái là chạy.
  if (readSavedState()) {
    nguon.start().then(
      () => setPressed(true),
      () => setPressed(false),
    );
  }

  button.addEventListener('click', () => {
    if (nguon.isPlaying()) {
      nguon.stop();
      setPressed(false);
      saveState(false);
      return;
    }

    nguon.start().then(
      () => {
        setPressed(true);
        saveState(true);
      },
      () => setPressed(false),
    );
  });

  // Chuyển sang tab khác thì tắt tiếng cho đỡ phiền, quay lại thì bật tiếp.
  let dungVIAn = false;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && nguon.isPlaying()) {
      dungVIAn = true;
      nguon.stop();
    } else if (!document.hidden && dungVIAn) {
      dungVIAn = false;
      nguon.start().then(
        () => setPressed(true),
        () => setPressed(false),
      );
    }
  });
}
