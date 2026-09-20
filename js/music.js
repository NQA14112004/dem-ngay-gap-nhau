/**
 * Nhạc nền tự sinh trong trình duyệt bằng Web Audio.
 *
 * Không dùng file nhạc: mấy nốt này được tính ra và phát ngay lúc chạy. Nhờ
 * vậy trang không phải tải thêm gì, không vướng bản quyền, và nhạc không bao
 * giờ lặp lại y hệt một vòng để người nghe thấy chán.
 *
 * Thang âm là ngũ cung điệu Bắc (Đô Rê Fa Sol La) - thang quen thuộc của nhạc
 * cổ truyền miền Bắc, nghe ra chất Tết mà không cần trích một bài nào cả.
 *
 * Phần tính nốt tách riêng thành hàm thuần ở đầu file để kiểm thử được mà không
 * cần trình duyệt; phần dựng đồ thị âm thanh nằm ở createMusic() bên dưới.
 */

/** Ngũ cung điệu Bắc, tính bằng số nửa cung so với nốt gốc. */
export const SCALE_SEMITONES = [0, 2, 5, 7, 9];

/** Nốt gốc: Đô quãng 3, khoảng 130.81 Hz. */
export const BASE_FREQ = 130.81;

/** Âm lượng tổng. Để nhỏ vì đây là nhạc nền, không phải để nghe chăm chú. */
export const DEFAULT_VOLUME = 0.16;

/**
 * Tần số của một bậc trong thang âm.
 *
 * Bậc 0 là nốt gốc, bậc 5 là nốt gốc quãng tám trên, bậc âm thì xuống dưới.
 *
 * @param {number} step Bậc trong thang âm
 * @returns {number} Tần số, tính bằng Hz
 */
export function noteFrequency(step) {
  const soBac = SCALE_SEMITONES.length;
  const quangTam = Math.floor(step / soBac);
  const bac = ((step % soBac) + soBac) % soBac;
  const nuaCung = SCALE_SEMITONES[bac] + quangTam * 12;

  return BASE_FREQ * 2 ** (nuaCung / 12);
}

/**
 * Dựng một hợp âm ba nốt từ thang âm.
 *
 * Chồng quãng theo bậc thang âm chứ không theo quãng ba như nhạc phương Tây -
 * đó là chỗ làm nên màu ngũ cung.
 *
 * @param {number} goc Bậc thấp nhất của hợp âm
 * @returns {number[]} Ba bậc trong thang âm
 */
export function buildChord(goc) {
  return [goc, goc + 2, goc + 4];
}

/**
 * Chọn nốt giai điệu kế tiếp.
 *
 * Ưu tiên đi liền bậc và thi thoảng mới nhảy quãng, để câu nhạc nghe như có
 * người chơi chứ không phải máy bốc ngẫu nhiên.
 *
 * @param {() => number} random Hàm ngẫu nhiên
 * @param {number} truoc Bậc của nốt vừa chơi
 * @param {{ thap?: number, cao?: number }} [pham] Khoảng bậc cho phép
 * @returns {number} Bậc của nốt kế tiếp
 */
export function nextMelodyStep(random, truoc, pham = {}) {
  const thap = pham.thap ?? 5;
  const cao = pham.cao ?? 14;

  const r = random();
  let buoc;

  if (r < 0.46) {
    buoc = random() < 0.5 ? 1 : -1; // đi liền bậc
  } else if (r < 0.76) {
    buoc = random() < 0.5 ? 2 : -2; // nhảy ngắn
  } else if (r < 0.9) {
    buoc = random() < 0.5 ? 4 : -4; // nhảy xa, thưa thôi
  } else {
    buoc = 0; // lặp lại nốt cũ
  }

  const moi = truoc + buoc;

  // Chạm trần hoặc chạm đáy thì quay đầu, không để giai điệu trôi tuột đi
  if (moi > cao || moi < thap) {
    return truoc - buoc;
  }
  return moi;
}

/** Nhịp gọi bộ xếp lịch, tính bằng mili-giây. */
const LOOKAHEAD_MS = 260;

/** Xếp trước ngần này giây, đủ để tiếng không bị vấp khi máy bận. */
const SCHEDULE_AHEAD_S = 2.2;

/** Hợp âm nền giữ bao lâu rồi mới đổi sang hợp âm khác. */
const CHORD_EVERY_S = 13;

/**
 * Dựng bộ phát nhạc nền.
 *
 * Trình duyệt không cho phát tiếng trước khi người dùng bấm một cái gì đó, nên
 * AudioContext chỉ được tạo ở lần start() đầu tiên chứ không tạo sẵn lúc nạp trang.
 *
 * @param {object} [options] Tuỳ chọn
 * @param {number} [options.volume] Âm lượng tổng
 * @param {() => number} [options.random] Hàm ngẫu nhiên
 * @returns {{ start: () => Promise<void>, stop: () => void, isPlaying: () => boolean }}
 */
export function createMusic({ volume = DEFAULT_VOLUME, random = Math.random } = {}) {
  let mucHienTai = volume;
  let ctx = null;
  let master = null;
  let timer = null;
  let dangChay = false;

  // Mốc thời gian của nốt kế tiếp, và vị trí hiện tại trong câu nhạc
  let nextChordAt = 0;
  let nextNoteAt = 0;
  let chordRoot = 0;
  let melodyStep = 9;

  /** Dựng đồ thị âm thanh: nhạc đi qua bộ lọc, rồi tách một nhánh sang tiếng vọng. */
  function buildGraph() {
    master = ctx.createGain();
    master.gain.value = 0;

    const loc = ctx.createBiquadFilter();
    loc.type = 'lowpass';
    loc.frequency.value = 1900;
    loc.Q.value = 0.4;

    // Tiếng vọng nhẹ cho đỡ khô, giống như đang nghe trong một căn phòng
    const vong = ctx.createDelay(1);
    vong.delayTime.value = 0.42;

    const doiAm = ctx.createGain();
    doiAm.gain.value = 0.26;

    const luongVong = ctx.createGain();
    luongVong.gain.value = 0.22;

    loc.connect(master);
    loc.connect(vong);
    vong.connect(doiAm);
    doiAm.connect(vong);
    vong.connect(luongVong);
    luongVong.connect(master);

    master.connect(ctx.destination);
    return loc;
  }

  let nhanhVao = null;

  /**
   * Một nốt nền: vào rất chậm, giữ lâu, tắt dần. Nghe như tiếng đàn kéo.
   *
   * @param {number} step Bậc trong thang âm
   * @param {number} luc Thời điểm bắt đầu
   * @param {number} keoDai Độ dài tiếng
   * @param {number} muc Âm lượng
   */
  function padNote(step, luc, keoDai, muc) {
    const tanSo = noteFrequency(step);

    for (const lech of [-3, 3]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = tanSo;
      osc.detune.value = lech;

      gain.gain.setValueAtTime(0.0001, luc);
      gain.gain.exponentialRampToValueAtTime(muc, luc + keoDai * 0.35);
      gain.gain.setValueAtTime(muc, luc + keoDai * 0.55);
      gain.gain.exponentialRampToValueAtTime(0.0001, luc + keoDai);

      osc.connect(gain);
      gain.connect(nhanhVao);
      osc.start(luc);
      osc.stop(luc + keoDai + 0.1);
    }
  }

  /**
   * Một nốt giai điệu: gõ vào rồi ngân tắt dần, nghe như tiếng gảy.
   *
   * @param {number} step Bậc trong thang âm
   * @param {number} luc Thời điểm bắt đầu
   * @param {number} muc Âm lượng
   */
  function pluckNote(step, luc, muc) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const loc = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.value = noteFrequency(step);

    // Bộ lọc khép dần: tiếng sáng lúc vừa gảy rồi tối lại, giống dây đàn thật
    loc.type = 'lowpass';
    loc.frequency.setValueAtTime(2600, luc);
    loc.frequency.exponentialRampToValueAtTime(700, luc + 1.6);

    gain.gain.setValueAtTime(0.0001, luc);
    gain.gain.exponentialRampToValueAtTime(muc, luc + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, luc + 2.8);

    osc.connect(loc);
    loc.connect(gain);
    gain.connect(nhanhVao);
    osc.start(luc);
    osc.stop(luc + 3);
  }

  /** Xếp lịch cho mấy giây sắp tới. Gọi lại đều đặn chứ không xếp một lần cho cả bài. */
  function scheduler() {
    const den = ctx.currentTime + SCHEDULE_AHEAD_S;

    while (nextChordAt < den) {
      // Đổi hợp âm: đi xuống hoặc lên vài bậc, quanh quẩn một vùng cho có màu
      chordRoot += random() < 0.5 ? -1 : 1;
      chordRoot = Math.max(-2, Math.min(3, chordRoot));

      for (const step of buildChord(chordRoot)) {
        padNote(step, nextChordAt, CHORD_EVERY_S * 1.25, 0.07);
      }
      nextChordAt += CHORD_EVERY_S;
    }

    while (nextNoteAt < den) {
      // Thi thoảng nghỉ một nhịp - im lặng cũng là một phần của câu nhạc
      if (random() > 0.3) {
        melodyStep = nextMelodyStep(random, melodyStep);
        pluckNote(melodyStep, nextNoteAt, 0.1 + random() * 0.05);
      }
      nextNoteAt += 1.6 + random() * 2.2;
    }
  }

  return {
    /** Bật nhạc. Phải gọi từ trong một cú bấm của người dùng thì trình duyệt mới cho. */
    async start() {
      if (dangChay) {
        return;
      }

      if (!ctx) {
        const AudioCtx = window.AudioContext ?? window.webkitAudioContext;
        if (!AudioCtx) {
          throw new Error('Trinh duyet khong ho tro Web Audio');
        }
        ctx = new AudioCtx();
        nhanhVao = buildGraph();
      }

      await ctx.resume();

      // Gọi ngoài một cú bấm thì trình duyệt cho resume() chạy nhưng vẫn giữ
      // trạng thái treo. Báo lỗi ra để bên gọi biết là nhạc chưa thật sự bật.
      if (ctx.state !== 'running') {
        throw new Error('Trinh duyet chan phat tieng khi chua co thao tac');
      }

      const bayGio = ctx.currentTime;
      nextChordAt = bayGio + 0.1;
      nextNoteAt = bayGio + 1.2;

      master.gain.cancelScheduledValues(bayGio);
      master.gain.setValueAtTime(0.0001, bayGio);
      master.gain.exponentialRampToValueAtTime(Math.max(0.0001, mucHienTai), bayGio + 2.5);

      dangChay = true;
      scheduler();
      timer = window.setInterval(scheduler, LOOKAHEAD_MS);
    },

    /** Tắt nhạc: nhỏ dần rồi mới dừng hẳn, không cắt phựt một cái. */
    stop() {
      if (!dangChay || !ctx) {
        return;
      }
      dangChay = false;

      window.clearInterval(timer);
      timer = null;

      const bayGio = ctx.currentTime;
      master.gain.cancelScheduledValues(bayGio);
      master.gain.setValueAtTime(master.gain.value || 0.0001, bayGio);
      master.gain.exponentialRampToValueAtTime(0.0001, bayGio + 1.2);

      // Chờ tiếng tắt hẳn rồi mới treo AudioContext cho đỡ tốn pin
      window.setTimeout(() => {
        if (!dangChay && ctx) {
          ctx.suspend();
        }
      }, 1400);
    },

    /**
     * Đổi âm lượng, kể cả khi nhạc đang phát.
     *
     * @param {number} muc Âm lượng trong khoảng 0 - 1
     */
    setVolume(muc) {
      mucHienTai = Math.min(1, Math.max(0, muc));

      if (ctx && master && dangChay) {
        const bayGio = ctx.currentTime;
        master.gain.cancelScheduledValues(bayGio);
        master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), bayGio);
        // Trượt dần trong 0.15 giây thay vì nhảy cái rụp, tránh tiếng tạch
        master.gain.linearRampToValueAtTime(Math.max(0.0001, mucHienTai), bayGio + 0.15);
      }
    },

    isPlaying() {
      return dangChay;
    },
  };
}
