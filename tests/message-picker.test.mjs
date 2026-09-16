import { test } from 'node:test';
import assert from 'node:assert/strict';

import { MESSAGES } from '../js/messages.js';
import { fillNames, pickGroup, pickMessage } from '../js/message-picker.js';

test('kho câu đủ dùng cho cả một mùa chờ và không có câu nào trùng nhau', () => {
  const tatCa = Object.values(MESSAGES).flat();

  assert.ok(tatCa.length >= 150, `Mới có ${tatCa.length} câu, nên có ít nhất 150`);
  assert.equal(new Set(tatCa).size, tatCa.length, 'Có câu bị viết trùng');

  for (const cau of tatCa) {
    assert.ok(cau.trim().length > 12, `Câu quá ngắn: ${cau}`);
    assert.ok(!cau.includes('  '), `Câu bị dính hai khoảng trắng: ${cau}`);
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
  const cauCuoi = pickMessage({ daysRemaining: 1, dayNumber: 2461440 });
  assert.equal(cauCuoi, MESSAGES.cuoi.at(-1));

  const cacCau = [7, 6, 5, 4, 3, 2, 1].map((con) =>
    pickMessage({ daysRemaining: con, dayNumber: 2461440 }),
  );
  assert.equal(new Set(cacCau).size, 7, 'Bảy ngày cuối không được lặp câu');
});

test('thay tên vào câu', () => {
  assert.equal(fillNames('Ngủ ngon nhé {em}.', { tenEm: 'Mèo' }), 'Ngủ ngon nhé Mèo.');
  assert.equal(fillNames('Ngủ ngon nhé {em}.'), 'Ngủ ngon nhé em.');
});
