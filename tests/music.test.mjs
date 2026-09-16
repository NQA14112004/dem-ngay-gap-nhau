import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  BASE_FREQ,
  SCALE_SEMITONES,
  buildChord,
  nextMelodyStep,
  noteFrequency,
} from '../js/music.js';

import { createRandom } from '../js/rng.js';

test('thang âm là ngũ cung điệu Bắc', () => {
  assert.deepEqual(SCALE_SEMITONES, [0, 2, 5, 7, 9], 'Đô Rê Fa Sol La');
  assert.equal(new Set(SCALE_SEMITONES).size, 5, 'năm bậc, không bậc nào trùng');
});

test('bậc 0 là nốt gốc, lên 5 bậc là đúng một quãng tám', () => {
  assert.equal(noteFrequency(0), BASE_FREQ);

  // Quãng tám nghĩa là tần số gấp đôi
  assert.ok(Math.abs(noteFrequency(5) - BASE_FREQ * 2) < 0.001);
  assert.ok(Math.abs(noteFrequency(10) - BASE_FREQ * 4) < 0.001);
  assert.ok(Math.abs(noteFrequency(-5) - BASE_FREQ / 2) < 0.001);
});

test('bậc càng cao thì tần số càng cao, không có chỗ nào tụt ngược', () => {
  for (let step = -12; step < 24; step += 1) {
    assert.ok(
      noteFrequency(step + 1) > noteFrequency(step),
      `bậc ${step + 1} phải cao hơn bậc ${step}`,
    );
  }
});

test('mọi nốt đều nằm trong khoảng tai người nghe được', () => {
  for (let step = -10; step <= 20; step += 1) {
    const f = noteFrequency(step);
    assert.ok(f > 20 && f < 5000, `bậc ${step} cho ${f.toFixed(1)} Hz, ra ngoài khoảng dùng được`);
  }
});

test('hợp âm có ba nốt chồng theo bậc thang âm', () => {
  assert.deepEqual(buildChord(0), [0, 2, 4]);
  assert.deepEqual(buildChord(-2), [-2, 0, 2]);

  for (const goc of [-3, -1, 0, 2, 5]) {
    const hopAm = buildChord(goc);

    assert.equal(hopAm.length, 3);
    assert.ok(hopAm[0] < hopAm[1] && hopAm[1] < hopAm[2], 'ba nốt phải xếp từ thấp lên cao');
    assert.equal(new Set(hopAm).size, 3, 'không được có hai nốt trùng nhau');
  }
});

test('giai điệu không trôi ra khỏi quãng đã định, chạy 5000 nốt vẫn không lạc', () => {
  const random = createRandom(12345);
  let step = 9;

  for (let i = 0; i < 5000; i += 1) {
    step = nextMelodyStep(random, step);
    assert.ok(step >= 5 && step <= 14, `nốt thứ ${i} lạc ra ngoài quãng: ${step}`);
    assert.ok(Number.isInteger(step), `nốt thứ ${i} không phải số nguyên: ${step}`);
  }
});

test('giai điệu chủ yếu đi liền bậc, thi thoảng mới nhảy xa', () => {
  const random = createRandom(777);
  let step = 9;
  const buoc = [];

  for (let i = 0; i < 3000; i += 1) {
    const truoc = step;
    step = nextMelodyStep(random, step);
    buoc.push(Math.abs(step - truoc));
  }

  const lienBac = buoc.filter((b) => b === 1).length / buoc.length;
  const nhayXa = buoc.filter((b) => b >= 4).length / buoc.length;

  assert.ok(lienBac > 0.3, `mới ${(lienBac * 100).toFixed(0)}% đi liền bậc, nghe sẽ rời rạc`);
  assert.ok(nhayXa < 0.25, `tới ${(nhayXa * 100).toFixed(0)}% nhảy xa, nghe sẽ lộn xộn`);
  assert.ok(new Set(buoc).size >= 3, 'phải có nhiều kiểu bước, không chỉ một kiểu');
});

test('cùng hạt giống thì ra đúng câu nhạc cũ - để kiểm thử lặp lại được', () => {
  const chay = () => {
    const random = createRandom(2024);
    let step = 9;
    return Array.from({ length: 50 }, () => (step = nextMelodyStep(random, step)));
  };

  assert.deepEqual(chay(), chay());
});
