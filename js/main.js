/**
 * Điểm khởi động: ráp tất cả các mảnh lại với nhau.
 *
 * Mẹo xem thử: thêm ?ngay=2027-02-01 vào cuối địa chỉ để giả vờ hôm nay là
 * ngày đó. Rất tiện để xem trước cảnh Tết và màn hình ngày về mà không phải
 * chỉnh đồng hồ máy.
 */

import { config } from './config.js?v=68fe0d9d';
import { getDaypart, parseDaypart } from './daypart.js?v=68fe0d9d';
import { renderCountdown, startTicking } from './countdown.js?v=68fe0d9d';
import { showFinale } from './finale.js?v=68fe0d9d';
import { jdFromDate } from './lunar.js?v=68fe0d9d';
import { startParticles } from './particles.js?v=68fe0d9d';
import { applyScene, computeViewBox, pickScene } from './scene.js?v=68fe0d9d';
import { setupAudio } from './audio.js?v=68fe0d9d';
import { setupDailyWish } from './daily-wish.js?v=68fe0d9d';
import { getCountdownState, getVietnamToday, parseDateString } from './target-date.js?v=68fe0d9d';

/** Tra sẵn các phần tử DOM dùng nhiều lần. */
const el = {
  body: document.body,
  eyebrow: document.getElementById('eyebrow'),
  days: document.getElementById('days'),
  unit: document.getElementById('unit'),
  message: document.getElementById('message'),
  dailyWishForm: document.getElementById('daily-wish-form'),
  dailyWishInput: document.getElementById('daily-wish-input'),
  dailyWishKeybox: document.getElementById('daily-wish-keybox'),
  dailyWishKeyForm: document.getElementById('daily-wish-key-form'),
  dailyWishKey: document.getElementById('daily-wish-key'),
  dailyWishKeyStatus: document.getElementById('daily-wish-key-status'),
  dailyWishKeyCancel: document.getElementById('daily-wish-key-cancel'),
  dailyWishStatus: document.getElementById('daily-wish-status'),
  dailyLetterButton: document.getElementById('daily-letter-button'),
  dailyLetterDialog: document.getElementById('daily-letter-dialog'),
  dailyLetterContent: document.getElementById('daily-letter-content'),
  dailyLetterDate: document.getElementById('daily-letter-date'),
  dailyLetterSign: document.getElementById('daily-letter-sign'),
  dailyLetterClose: document.getElementById('daily-letter-close'),
  todayLine: document.getElementById('today-line'),
  targetLine: document.getElementById('target-line'),
  tick: document.getElementById('tick'),
  sceneArt: document.getElementById('scene-art'),
  particles: document.getElementById('particles'),
  audio: document.getElementById('bgm'),
  player: document.getElementById('player'),
  audioToggle: document.getElementById('audio-toggle'),
  volume: document.getElementById('volume'),
  finale: document.getElementById('finale'),
  fireworks: document.getElementById('fireworks'),
  finaleDate: document.getElementById('finale-date'),
  finaleLetter: document.getElementById('finale-letter'),
  finaleSign: document.getElementById('finale-sign'),
};

/** Ngày bị ép từ địa chỉ trang, nếu có. */
const forcedToday = parseDateString(new URLSearchParams(window.location.search).get('ngay'));

/** Ngày mục tiêu bị ép từ config, nếu có. */
const targetOverride = parseDateString(config.overrideTargetDate);

/** Buổi bị ép từ địa chỉ trang (?buoi=sang|trua|chieu|toi), dùng để xem thử. */
const forcedDaypart = parseDaypart(new URLSearchParams(window.location.search).get('buoi'));

/** Các hiệu ứng đang chạy, cần dọn trước khi vẽ lại. */
let running = { particles: null, ticker: null, finale: null, dailyWish: null };

/** Hẹn giờ vẽ lại sau khi xoay máy hoặc đổi kích thước cửa sổ. */
let resizeTimer = null;

/**
 * Đọc ngày hôm nay - ưu tiên ngày bị ép để xem thử.
 *
 * @returns {{ day: number, month: number, year: number }}
 */
function readToday() {
  return forcedToday ?? getVietnamToday();
}

/**
 * Đọc buổi hiện tại - ưu tiên buổi bị ép để xem thử.
 *
 * @returns {string} Id của buổi
 */
function readDaypart() {
  return forcedDaypart ?? getDaypart();
}

/** Dọn sạch mọi thứ đang chạy trước khi dựng lại màn hình. */
function teardown() {
  running.particles?.stop();
  running.ticker?.stop();
  running.finale?.stop();
  running.dailyWish?.destroy();
  running = { particles: null, ticker: null, finale: null, dailyWish: null };
}

/** Dựng lại toàn bộ màn hình theo ngày hiện tại. */
function draw() {
  teardown();

  const today = readToday();
  const state = getCountdownState(new Date(), { today, targetOverride });
  const dayNumber = jdFromDate(today.day, today.month, today.year);

  const scene = pickScene({
    month: today.month,
    dayNumber,
    daysRemaining: state.daysRemaining,
    daypart: readDaypart(),
  });

  applyScene({
    root: el.body,
    artContainer: el.sceneArt,
    scene,
    seed: dayNumber,
    viewBox: computeViewBox(window.innerWidth, window.innerHeight),
  });
  running.particles = startParticles(el.particles, {
    hat: scene.layout.hat,
    isTet: scene.isTet,
    seed: dayNumber,
  });

  renderCountdown(el, state, config);
  running.dailyWish = setupDailyWish({
    form: el.dailyWishForm,
    input: el.dailyWishInput,
    status: el.dailyWishStatus,
    messageNode: el.message,
    today,
    keyDialog: el.dailyWishKeybox,
    keyForm: el.dailyWishKeyForm,
    keyInput: el.dailyWishKey,
    keyStatus: el.dailyWishKeyStatus,
    keyCancel: el.dailyWishKeyCancel,
    letterButton: el.dailyLetterButton,
    letterDialog: el.dailyLetterDialog,
    letterContent: el.dailyLetterContent,
    letterDate: el.dailyLetterDate,
    letterSign: el.dailyLetterSign,
    letterClose: el.dailyLetterClose,
    authorName: config.tenAnh,
  });

  // Tiêu đề tab đếm theo luôn, để liếc lên thanh tab là biết còn mấy ngày.
  document.title =
    state.daysRemaining > 0
      ? `Còn ${state.daysRemaining} ngày nữa anh về`
      : 'Anh về rồi';

  if (state.hasArrived) {
    running.finale = showFinale({
      root: el.finale,
      canvas: el.fireworks,
      dateNode: el.finaleDate,
      letterNode: el.finaleLetter,
      signNode: el.finaleSign,
      config,
    });
  } else {
    el.finale.hidden = true;
  }

  running.ticker = startTicking(el, {
    daysRemaining: state.daysRemaining,
    today,
    daypart: scene.daypart,
    readToday,
    readDaypart,
    // Qua nửa đêm giờ Việt Nam thì vẽ lại: số bớt 1, đổi câu, có thể đổi cả bố cục.
    // Sang buổi mới (sáng sang trưa, chiều sang tối...) thì đổi ánh sáng.
    onChange: draw,
  });
}

draw();

// Xoay ngang điện thoại thì tỉ lệ khung hình đổi, phải dựng lại tranh cho khớp.
// Chờ một nhịp để tránh vẽ lại liên tục trong lúc người dùng đang kéo cửa sổ.
window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(draw, 250);
});

// Nhạc nền chạy độc lập với phần đếm ngược: hỏng nhạc thì trang vẫn chạy bình thường.
setupAudio({
  player: el.player,
  button: el.audioToggle,
  slider: el.volume,
  audio: el.audio,
  src: config.fileNhac,
}).catch(() => {
  el.player.hidden = true;
});
