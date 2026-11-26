/**
 * Lời chúc tự nhập trong ngày.
 *
 * Lời chúc chỉ được lưu trong trình duyệt đang dùng. Mỗi ngày theo giờ Việt
 * Nam có một ô lưu riêng; đã lưu thì không thể ghi đè bằng giao diện nữa.
 */

export const DAILY_WISH_STORAGE_KEY = 'dem-ngay-gap-nhau:daily-wish:v1';
export const DAILY_WISH_SAVE_KEY = 'bichhanhdangiu';

/** Tạo khoá ngày ổn định từ ngày đã tính theo giờ Việt Nam. */
export function makeDayKey({ day, month, year }) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Đọc lời chúc đã lưu cho đúng ngày, bỏ qua dữ liệu cũ hoặc lỗi. */
export function readDailyWish(storage, today) {
  try {
    const saved = JSON.parse(storage.getItem(DAILY_WISH_STORAGE_KEY) ?? 'null');
    const dayKey = makeDayKey(today);

    return saved?.dayKey === dayKey && typeof saved.message === 'string' && saved.message.trim()
      ? saved.message
      : null;
  } catch {
    return null;
  }
}

/**
 * Lưu lời chúc một lần duy nhất cho ngày hiện tại.
 *
 * @returns {{ ok: boolean, message?: string, reason?: 'key' | 'empty' | 'already-saved' | 'storage' }}
 */
export function saveDailyWish(storage, today, message, key) {
  const text = typeof message === 'string' ? message.trim() : '';

  if (key !== DAILY_WISH_SAVE_KEY) {
    return { ok: false, reason: 'key' };
  }
  if (!text) {
    return { ok: false, reason: 'empty' };
  }
  if (readDailyWish(storage, today)) {
    return { ok: false, reason: 'already-saved' };
  }

  try {
    storage.setItem(DAILY_WISH_STORAGE_KEY, JSON.stringify({ dayKey: makeDayKey(today), message: text }));
    return { ok: true, message: text };
  } catch {
    return { ok: false, reason: 'storage' };
  }
}

/** Kho lưu cục bộ, được dùng khi chưa điền cấu hình Supabase. */
export function createLocalDailyWishStore(storage) {
  return {
    mode: 'local',
    async read(today) {
      return { ok: true, message: readDailyWish(storage, today) };
    },
    async save(today, message, key) {
      return saveDailyWish(storage, today, message, key);
    },
  };
}

/** Gắn biểu mẫu nhập lời chúc, hộp xác nhận key và lá thư vào trang. */
export function setupDailyWish({
  form, input, status, messageNode, today,
  keyDialog, keyForm, keyInput, keyStatus, keyCancel,
  letterButton, letterDialog, letterContent, letterDate, letterSign, letterClose, authorName,
  store = null,
  storage = window.localStorage,
}) {
  const wishStore = store ?? createLocalDailyWishStore(storage);
  const saveButton = form.querySelector('button[type="submit"]');
  let isReady = false;
  let isDestroyed = false;

  const setInputEnabled = (enabled) => {
    input.disabled = !enabled;
    saveButton.disabled = !enabled;
  };
  const dayLabel = `Ngày ${String(today.day).padStart(2, '0')}/${String(today.month).padStart(2, '0')}/${today.year}`;

  const renderSavedWish = (message) => {
    form.hidden = true;
    letterButton.hidden = false;
    letterContent.textContent = message;
    letterDate.textContent = dayLabel;
    letterSign.textContent = authorName ? `— ${authorName}` : '';
  };

  const onLetterOpen = () => letterDialog.showModal();
  const onLetterClose = () => letterDialog.close();
  letterButton.addEventListener('click', onLetterOpen);
  letterClose.addEventListener('click', onLetterClose);

  form.hidden = false;
  letterButton.hidden = true;
  setInputEnabled(false);
  status.textContent = 'Mỗi ngày chỉ lưu được một lần.';
  status.dataset.state = 'hint';

  const loadSavedWish = async () => {
    const result = await wishStore.read(today);
    if (isDestroyed) return;

    if (!result.ok) {
      status.textContent = 'Chưa thể kết nối Supabase. Hãy kiểm tra mạng và thử lại trang.';
      status.dataset.state = 'error';
      return;
    }

    if (result.message) {
      renderSavedWish(result.message);
      return;
    }

    isReady = true;
    setInputEnabled(true);
    status.textContent = wishStore.mode === 'local'
      ? 'Mỗi ngày chỉ lưu được một lần. Hiện chưa bật đồng bộ Supabase.'
      : 'Mỗi ngày chỉ lưu được một lần và sẽ đồng bộ trên mọi thiết bị.';
    status.dataset.state = 'hint';
  };

  const onWishSubmit = (event) => {
    event.preventDefault();

    if (!isReady) return;

    if (!input.value.trim()) {
      status.textContent = 'Hãy nhập lời chúc trước khi lưu.';
      status.dataset.state = 'error';
      input.focus();
      return;
    }

    keyStatus.textContent = '';
    keyStatus.dataset.state = 'hint';
    keyInput.value = '';
    keyDialog.showModal();
    keyInput.focus();
  };

  const onKeySubmit = async (event) => {
    event.preventDefault();

    keyInput.disabled = true;
    keyStatus.textContent = 'Đang lưu lời nhắn…';
    keyStatus.dataset.state = 'hint';
    const result = await wishStore.save(today, input.value, keyInput.value);
    keyInput.disabled = false;
    if (result.ok) {
      keyDialog.close();
      renderSavedWish(result.message);
      return;
    }

    const messages = {
      network: 'Chưa thể lưu lên Supabase. Hãy kiểm tra mạng và thử lại.',
      key: 'Key chưa đúng, chưa thể lưu lời chúc.',
      empty: 'Hãy nhập lời chúc trước khi lưu.',
      'already-saved': 'Hôm nay đã có lời chúc được lưu rồi.',
      storage: 'Không thể lưu trên trình duyệt này. Hãy kiểm tra chế độ riêng tư.',
    };
    keyStatus.textContent = messages[result.reason] ?? 'Không thể lưu lời chúc.';
    keyStatus.dataset.state = 'error';
    if (result.reason === 'key') {
      keyInput.select();
    }
  };

  const onKeyCancel = () => keyDialog.close();
  const onDialogClose = () => {
    keyInput.value = '';
    keyStatus.textContent = '';
  };

  form.addEventListener('submit', onWishSubmit);
  keyForm.addEventListener('submit', onKeySubmit);
  keyCancel.addEventListener('click', onKeyCancel);
  keyDialog.addEventListener('close', onDialogClose);
  loadSavedWish();
  return {
    destroy() {
      isDestroyed = true;
      if (keyDialog.open) {
        keyDialog.close();
      }
      if (letterDialog.open) {
        letterDialog.close();
      }
      form.removeEventListener('submit', onWishSubmit);
      keyForm.removeEventListener('submit', onKeySubmit);
      keyCancel.removeEventListener('click', onKeyCancel);
      keyDialog.removeEventListener('close', onDialogClose);
      letterButton.removeEventListener('click', onLetterOpen);
      letterClose.removeEventListener('click', onLetterClose);
    },
  };
}
