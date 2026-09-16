import { test } from 'node:test';
import assert from 'node:assert/strict';

import { jdFromDate, jdToDate, lunarToSolar, solarToLunar } from '../js/lunar.js';

/**
 * Bảng mùng 1 Tết Nguyên Đán theo lịch Việt Nam (UTC+7), đối chiếu với lịch in.
 * Đây là "sự thật" để bắt lỗi nếu ai đó sửa nhầm thuật toán.
 */
const TET_DATES = [
  { lunarYear: 2020, day: 25, month: 1, year: 2020 },
  { lunarYear: 2021, day: 12, month: 2, year: 2021 },
  { lunarYear: 2022, day: 1, month: 2, year: 2022 },
  { lunarYear: 2023, day: 22, month: 1, year: 2023 },
  { lunarYear: 2024, day: 10, month: 2, year: 2024 },
  { lunarYear: 2025, day: 29, month: 1, year: 2025 },
  { lunarYear: 2026, day: 17, month: 2, year: 2026 },
  { lunarYear: 2027, day: 6, month: 2, year: 2027 },
  { lunarYear: 2028, day: 26, month: 1, year: 2028 },
  { lunarYear: 2029, day: 13, month: 2, year: 2029 },
  // 2030 la nam lich Viet (UTC+7) lech lich Trung Quoc (UTC+8) dung 1 ngay:
  // Viet Nam an Tet 02/02, Trung Quoc 03/02. Con so duoi day la theo lich Viet Nam.
  { lunarYear: 2030, day: 2, month: 2, year: 2030 },
  { lunarYear: 2031, day: 23, month: 1, year: 2031 },
  { lunarYear: 2032, day: 11, month: 2, year: 2032 },
  { lunarYear: 2033, day: 31, month: 1, year: 2033 },
  { lunarYear: 2034, day: 19, month: 2, year: 2034 },
  { lunarYear: 2035, day: 8, month: 2, year: 2035 },
];

test('mùng 1 Tết các năm 2020-2035 khớp với lịch Việt Nam', () => {
  for (const expected of TET_DATES) {
    const actual = lunarToSolar(1, 1, expected.lunarYear);
    assert.deepEqual(
      actual,
      { day: expected.day, month: expected.month, year: expected.year },
      `Tết năm âm lịch ${expected.lunarYear} phải rơi vào ${expected.day}/${expected.month}/${expected.year}`,
    );
  }
});

test('28 tháng Chạp năm Bính Ngọ là ngày 04/02/2027 - mốc đếm ngược của trang', () => {
  assert.deepEqual(lunarToSolar(28, 12, 2026), { day: 4, month: 2, year: 2027 });
});

test('28 tháng Chạp luôn cách mùng 1 Tết đúng 2 hoặc 3 ngày', () => {
  for (const { lunarYear } of TET_DATES) {
    const trongTet = lunarToSolar(28, 12, lunarYear - 1);
    const tet = lunarToSolar(1, 1, lunarYear);

    const khoangCach =
      jdFromDate(tet.day, tet.month, tet.year) -
      jdFromDate(trongTet.day, trongTet.month, trongTet.year);

    assert.ok(
      khoangCach === 2 || khoangCach === 3,
      `Năm âm lịch ${lunarYear}: khoảng cách là ${khoangCach} ngày, phải là 2 (tháng thiếu) hoặc 3 (tháng đủ)`,
    );
  }
});

test('đổi dương sang âm rồi đổi ngược lại phải ra đúng ngày cũ (3000 ngày liên tiếp)', () => {
  const batDau = jdFromDate(1, 1, 2024);

  for (let i = 0; i < 3000; i += 1) {
    const duong = jdToDate(batDau + i);
    const am = solarToLunar(duong.day, duong.month, duong.year);
    const quayLai = lunarToSolar(am.day, am.month, am.year, am.isLeap);

    assert.deepEqual(
      quayLai,
      duong,
      `Sai ở ngày ${duong.day}/${duong.month}/${duong.year} (âm lịch ${am.day}/${am.month}/${am.year}${am.isLeap ? ' nhuận' : ''})`,
    );
  }
});

test('jdFromDate và jdToDate là hai chiều của nhau', () => {
  const cacNgay = [
    { day: 1, month: 1, year: 2000 },
    { day: 29, month: 2, year: 2024 },
    { day: 4, month: 2, year: 2027 },
    { day: 31, month: 12, year: 2099 },
  ];

  for (const ngay of cacNgay) {
    assert.deepEqual(jdToDate(jdFromDate(ngay.day, ngay.month, ngay.year)), ngay);
  }
});

test('hiệu hai JDN chính là số ngày lịch cách nhau', () => {
  // Đây là nền tảng của toàn bộ phép đếm ngược: không dùng mili-giây.
  assert.equal(jdFromDate(4, 2, 2027) - jdFromDate(3, 2, 2027), 1);
  assert.equal(jdFromDate(1, 3, 2024) - jdFromDate(28, 2, 2024), 2, 'năm nhuận có 29/2');
  assert.equal(jdFromDate(1, 1, 2027) - jdFromDate(1, 1, 2026), 365);
});
