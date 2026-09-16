import { test } from 'node:test';
import assert from 'node:assert/strict';

import { jdFromDate } from '../js/lunar.js';
import {
  formatDuration,
  formatLunarDate,
  formatSolarDate,
  formatWeekday,
} from '../js/format.js';

test('định dạng ngày dương lịch', () => {
  assert.equal(formatSolarDate({ day: 4, month: 2, year: 2027 }), '04/02/2027');
  assert.equal(formatSolarDate({ day: 15, month: 9, year: 2026 }), '15/09/2026');
});

test('định dạng ngày âm lịch theo cách gọi của người Việt', () => {
  assert.equal(formatLunarDate({ day: 28, month: 12 }), '28 tháng Chạp');
  assert.equal(formatLunarDate({ day: 1, month: 1 }), 'mùng 1 tháng Giêng');
  assert.equal(formatLunarDate({ day: 5, month: 8 }), 'mùng 5 tháng Tám');
  assert.equal(formatLunarDate({ day: 10, month: 11 }), 'mùng 10 tháng Một');
  assert.equal(formatLunarDate({ day: 12, month: 4, isLeap: true }), '12 tháng Tư nhuận');
});

test('tên thứ khớp với lịch thật trong suốt 400 ngày', () => {
  const tenTheoJs = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

  for (let i = 0; i < 400; i += 1) {
    const moc = new Date(Date.UTC(2026, 0, 1) + i * 86400000);
    const jd = jdFromDate(moc.getUTCDate(), moc.getUTCMonth() + 1, moc.getUTCFullYear());

    assert.equal(
      formatWeekday(jd),
      tenTheoJs[moc.getUTCDay()],
      `Sai thứ ở ngày ${moc.toISOString().slice(0, 10)}`,
    );
  }
});

test('ngày về 04/02/2027 là Thứ Năm', () => {
  assert.equal(formatWeekday(jdFromDate(4, 2, 2027)), 'Thứ Năm');
});

test('định dạng đồng hồ đếm tới nửa đêm', () => {
  assert.equal(formatDuration(0), '00:00:00');
  assert.equal(formatDuration(1000), '00:00:01');
  assert.equal(formatDuration(3661000), '01:01:01');
  assert.equal(formatDuration(86399000), '23:59:59');
  assert.equal(formatDuration(-500), '00:00:00', 'số âm thì kẹp về 0');
});
