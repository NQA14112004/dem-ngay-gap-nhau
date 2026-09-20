import { test } from 'node:test';
import assert from 'node:assert/strict';

import { MESSAGES } from '../js/messages.js';
import { THRESHOLDS, fillNames, pickGroup, pickMessage } from '../js/message-picker.js';
import { getCountdownState } from '../js/target-date.js';
import { jdFromDate } from '../js/lunar.js';

test('kho câu không có câu nào trùng và không câu nào hỏng', () => {
  const tatCa = Object.values(MESSAGES).flat();

  assert.equal(new Set(tatCa).size, tatCa.length, 'Có câu bị viết trùng');

  for (const cau of tatCa) {
    assert.ok(cau.trim().length > 12, `Câu quá ngắn: ${cau}`);
    assert.ok(!cau.includes('  '), `Câu bị dính hai khoảng trắng: ${cau}`);
    assert.equal(cau, cau.trim(), `Câu thừa khoảng trắng ở đầu hoặc cuối: ${cau}`);
  }
});

test('nhóm nào cũng có câu, không nhóm nào để trống', () => {
  for (const [ten, ds] of Object.entries(MESSAGES)) {
    assert.ok(Array.isArray(ds) && ds.length > 0, `Nhóm ${ten} không có câu nào`);
  }
});

test('không câu nào quay lại quá sớm', () => {
  // Bớt câu đi thì có lúc sẽ lặp lại, không sao. Nhưng lặp lại quá sớm thì
  // người đọc nhận ra ngay và mất hết cảm giác mỗi ngày một câu mới.
  //
  // Mỗi nhóm chỉ cần đủ câu cho khoảng ngày của chính nó, tối đa là 20 ngày.
  // Nhóm cuối chạy theo thứ tự cố định chứ không xoay vòng nên chỉ cần phủ
  // đúng 7 ngày cuối.
  const KHOANG_TOI_DA = 20;

  const soNgayCuaNhom = {
    cuoi: THRESHOLDS.cuoi,
    gan: THRESHOLDS.gan - THRESHOLDS.cuoi,
    giua: THRESHOLDS.giua - THRESHOLDS.gan,
    xa: KHOANG_TOI_DA,
  };

  for (const [ten, ds] of Object.entries(MESSAGES)) {
    const canCo = Math.min(KHOANG_TOI_DA, soNgayCuaNhom[ten]);

    assert.ok(
      ds.length >= canCo,
      `Nhóm ${ten} chỉ có ${ds.length} câu, cần ít nhất ${canCo} thì mới không lặp sớm`,
    );
  }
});

test('chia nhóm đúng theo số ngày còn lại', () => {
  assert.equal(pickGroup(142), 'xa');
  assert.equal(pickGroup(91), 'xa');
  assert.equal(pickGroup(90), 'giua');
  assert.equal(pickGroup(31), 'giua');
  assert.equal(pickGroup(30), 'gan');
  assert.equal(pickGroup(8), 'gan');
  assert.equal(pickGroup(7), 'cuoi');
  assert.equal(pickGroup(1), 'cuoi');
});

test('cùng một ngày luôn ra cùng một câu, sang ngày khác thì đổi câu', () => {
  const homNay = { daysRemaining: 142, dayNumber: 2461299 };

  assert.equal(pickMessage(homNay), pickMessage(homNay), 'Mở lại trong ngày phải ra câu cũ');
  assert.notEqual(
    pickMessage(homNay),
    pickMessage({ daysRemaining: 141, dayNumber: 2461300 }),
    'Sang ngày mới phải đổi câu',
  );
});

test('suốt 142 ngày chờ không ngày nào thiếu câu', () => {
  for (let con = 142; con >= 1; con -= 1) {
    const cau = pickMessage({ daysRemaining: con, dayNumber: 2461441 - con });

    assert.equal(typeof cau, 'string');
    assert.ok(cau.length > 0, `Ngày còn ${con} không có câu`);
    assert.ok(!cau.includes('{'), `Ngày còn ${con} còn sót ký hiệu chưa thay: ${cau}`);
  }
});

test('bảy ngày cuối chạy đúng thứ tự và kết bằng câu sát ngày về nhất', () => {
  // So với bản đã thay tên, vì pickMessage luôn thay {em} trước khi trả về
  const cauCuoi = pickMessage({ daysRemaining: 1, dayNumber: 2461440 });
  assert.equal(cauCuoi, fillNames(MESSAGES.cuoi.at(-1)));

  const cacCau = [7, 6, 5, 4, 3, 2, 1].map((con) =>
    pickMessage({ daysRemaining: con, dayNumber: 2461440 }),
  );
  assert.equal(new Set(cacCau).size, 7, 'Bảy ngày cuối không được lặp câu');
});

test('thay tên vào câu', () => {
  assert.equal(fillNames('Ngủ ngon nhé {em}.', { tenEm: 'Mèo' }), 'Ngủ ngon nhé Mèo.');
  assert.equal(fillNames('Ngủ ngon nhé {em}.'), 'Ngủ ngon nhé em.');
});

test('đi hết chặng đếm ngược không ngày nào gặp lại câu cũ', () => {
  // Đây là lời hứa thật với người đọc: mỗi ngày mở ra là một câu chưa từng thấy.
  // Mô phỏng nguyên chặng từ hôm nay tới ngày về, đối chiếu từng ngày một.
  const { daysRemaining, today } = getCountdownState(new Date());
  const homNayJd = jdFromDate(today.day, today.month, today.year);

  const daGap = new Map();

  for (let con = daysRemaining; con >= 1; con -= 1) {
    const dayNumber = homNayJd + (daysRemaining - con);
    const cau = pickMessage({ daysRemaining: con, dayNumber });

    if (daGap.has(cau)) {
      assert.fail(
        `Câu này hiện lại lần nữa sau ${daGap.get(cau) - con} ngày ` +
          `(lần đầu lúc còn ${daGap.get(cau)} ngày, lặp lúc còn ${con} ngày):\n  ${cau}`,
      );
    }
    daGap.set(cau, con);
  }

  assert.equal(daGap.size, daysRemaining, `Phải có đúng ${daysRemaining} câu khác nhau`);
});

test('nhóm cuối phải có đúng số câu bằng số ngày nó phủ', () => {
  // Nhóm này chạy theo thứ tự chứ không xoay vòng. Thừa câu thì mấy câu đầu
  // không bao giờ được dùng và cả dãy bị đẩy lệch - câu viết cho ngày cuối sẽ
  // rơi vào hôm trước đó.
  assert.equal(
    MESSAGES.cuoi.length,
    THRESHOLDS.cuoi,
    `Nhóm cuối có ${MESSAGES.cuoi.length} câu nhưng chỉ phủ ${THRESHOLDS.cuoi} ngày`,
  );

  // Mỗi câu trong nhóm phải thực sự được dùng đúng một lần
  const daDung = new Set();
  for (let con = THRESHOLDS.cuoi; con >= 1; con -= 1) {
    daDung.add(pickMessage({ daysRemaining: con, dayNumber: 2461440 }));
  }
  assert.equal(daDung.size, MESSAGES.cuoi.length, 'Có câu trong nhóm cuối không bao giờ hiện ra');

  // Câu cuối cùng phải rơi đúng vào ngày còn 1
  assert.equal(
    pickMessage({ daysRemaining: 1, dayNumber: 2461440 }),
    fillNames(MESSAGES.cuoi.at(-1)),
  );
});
