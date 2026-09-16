/**
 * Nhạc nền bật/tắt bằng tay.
 *
 * Cố ý KHÔNG tự phát khi mở trang: trình duyệt chặn, và mở trang ở chỗ đông
 * người mà tự nhiên có nhạc thì phiền. Trạng thái bật/tắt được nhớ lại cho lần
 * sau. Nếu chưa bỏ file mp3 vào thì nút tự ẩn, trang vẫn chạy bình thường.
 */

/** Khoá lưu trạng thái trong localStorage. */
const STORAGE_KEY = 'dem-ngay-gap-nhau:nhac';

/** Âm lượng mặc định, để nhỏ cho dễ chịu. */
const DEFAULT_VOLUME = 0.35;

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
 * Gắn nhạc nền vào trang.
 *
 * @param {object} params Tham số
 * @param {HTMLAudioElement} params.audio Thẻ audio
 * @param {HTMLButtonElement} params.button Nút bật/tắt
 * @param {string} params.src Đường dẫn file nhạc
 */
export function setupAudio({ audio, button, src }) {
  if (!src) {
    return;
  }

  audio.src = src;
  audio.volume = DEFAULT_VOLUME;

  let coNhac = false;

  // Chỉ hiện nút khi trình duyệt xác nhận đọc được file nhạc.
  audio.addEventListener('canplay', () => {
    coNhac = true;
    button.hidden = false;

    if (readSavedState()) {
      // Lần trước em bật nhạc: thử phát lại, nếu trình duyệt chặn thì để nguyên trạng thái tắt.
      audio.play().then(
        () => setPressed(true),
        () => setPressed(false),
      );
    }
  });

  audio.addEventListener('error', () => {
    button.hidden = true;
  });

  function setPressed(isOn) {
    button.setAttribute('aria-pressed', String(isOn));
    button.querySelector('.audio-toggle__label').textContent = isOn ? 'Đang bật' : 'Nhạc';
  }

  button.addEventListener('click', () => {
    if (!coNhac) {
      return;
    }

    if (audio.paused) {
      audio.play().then(
        () => {
          setPressed(true);
          saveState(true);
        },
        () => setPressed(false),
      );
    } else {
      audio.pause();
      setPressed(false);
      saveState(false);
    }
  });

  // preload="none" nên phải gọi load() thì sự kiện canplay mới bắn.
  audio.load();
}
