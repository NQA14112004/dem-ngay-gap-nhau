import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

import {
  GRACE_DAYS,
  findNextTargetDate,
  getCountdownState,
  getVietnamToday,
  msUntilVietnamMidnight,
  parseDateString,
} from '../js/target-date.js';

/** Mốc của trang: 28 tháng Chạp năm Bính Ngọ. */
const NGAY_VE = { day: 4, month: 2, year: 2027 };

test('ngày về là 04/02/2027 dù hôm nay là ngày nào trong năm trước đó', () => {
  const cacNgay = [
    { day: 15, month: 9, year: 2026 },
    { day: 1, month: 1, year: 2027 },
    { day: 3, month: 2, year: 2027 },
    { day: 4, month: 2, year: 2027 },
  ];

  for (const today of cacNgay) {
    const target = findNextTargetDate(today);
    assert.deepEqual(
      { day: target.day, month: target.month, year: target.year },
      NGAY_VE,
      `Đứng ở ngày ${today.day}/${today.month}/${today.year} thì mốc vẫn phải là 4/2/2027`,
    );
  }
});

test('số ngày còn lại giảm đúng 1 sau mỗi ngày, không nhảy cóc', () => {
  const state = (today) => getCountdownState(new Date(), { today }).daysRemaining;

  assert.equal(state({ day: 4, month: 2, year: 2027 }), 0, 'đúng ngày về thì bằng 0');
  assert.equal(state({ day: 3, month: 2, year: 2027 }), 1);
  assert.equal(state({ day: 2, month: 2, year: 2027 }), 2);
  assert.equal(state({ day: 31, month: 1, year: 2027 }), 4, 'qua mốc đổi tháng vẫn đúng');
  assert.equal(state({ day: 31, month: 12, year: 2026 }), 35, 'qua mốc đổi năm vẫn đúng');
  assert.equal(state({ day: 15, month: 9, year: 2026 }), 142);
});

test('mỗi ngày trôi qua thì con số bớt đúng 1 - kiểm 200 ngày liên tiếp', () => {
  let truoc = null;

  for (let i = 0; i < 200; i += 1) {
    const moc = new Date(Date.UTC(2026, 6, 1) + i * 86400000);
    const today = getVietnamToday(moc);
    const { daysRemaining } = getCountdownState(moc, { today });

    if (truoc !== null) {
      assert.equal(daysRemaining, truoc - 1, `Ngày thứ ${i} nhảy sai bước`);
    }
    truoc = daysRemaining;
  }
});

test('về 0 rồi thì kẹp ở 0 và báo đã về, không hiện số âm', () => {
  for (let i = 0; i <= GRACE_DAYS; i += 1) {
    const today = { day: 4 + i, month: 2, year: 2027 };
    const state = getCountdownState(new Date(), { today });

    assert.equal(state.daysRemaining, 0, `Ngày ${today.day}/2 phải vẫn là 0`);
    assert.equal(state.hasArrived, true);
  }
});

test('qua thời gian ân hạn thì tự bắt đầu đếm ngược cho Tết năm sau', () => {
  const today = { day: 4 + GRACE_DAYS + 1, month: 2, year: 2027 };
  const state = getCountdownState(new Date(), { today });

  assert.equal(state.hasArrived, false);
  assert.deepEqual(
    { day: state.target.day, month: state.target.month, year: state.target.year },
    { day: 24, month: 1, year: 2028 },
    '28 tháng Chạp năm Đinh Mùi là 24/01/2028',
  );
  assert.ok(state.daysRemaining > 300 && state.daysRemaining < 370);
});

test('máy ở múi giờ nào cũng hiện cùng một con số', () => {
  // Đây là lý do cả file này tồn tại: anh và em đang ở hai múi giờ khác nhau,
  // mở trang cùng lúc thì phải thấy cùng một con số.
  const moduleUrl = new URL('../js/target-date.js', import.meta.url).href;
  const thoiDiem = '2027-02-02T20:30:00.000Z';

  const code = `
    const mod = await import(process.env.MODULE_URL);
    const now = new Date(process.env.MOMENT);
    const state = mod.getCountdownState(now);
    console.log(JSON.stringify({ today: state.today, days: state.daysRemaining }));
  `;

  const chay = (timeZone) =>
    execFileSync(process.execPath, ['--input-type=module', '-e', code], {
      env: { ...process.env, TZ: timeZone, MODULE_URL: moduleUrl, MOMENT: thoiDiem },
      encoding: 'utf8',
    }).trim();

  const ketQua = ['UTC', 'Asia/Ho_Chi_Minh', 'America/Los_Angeles', 'Europe/Berlin', 'Pacific/Auckland'].map(chay);
  const mongDoi = JSON.stringify({ today: { day: 3, month: 2, year: 2027 }, days: 1 });

  for (const [i, dong] of ketQua.entries()) {
    assert.equal(dong, mongDoi, `Múi giờ thứ ${i} cho kết quả khác: ${dong}`);
  }
});

test('giờ Việt Nam được tính đúng quanh mốc nửa đêm', () => {
  // 16:59 UTC = 23:59 cùng ngày ở Việt Nam
  assert.deepEqual(getVietnamToday(new Date('2027-02-03T16:59:00Z')), {
    day: 3,
    month: 2,
    year: 2027,
  });

  // 17:00 UTC = 00:00 ngày hôm sau ở Việt Nam - con số phải bớt 1 ngay lúc này
  assert.deepEqual(getVietnamToday(new Date('2027-02-03T17:00:00Z')), {
    day: 4,
    month: 2,
    year: 2027,
  });
});

test('đồng hồ đếm tới nửa đêm Việt Nam nằm trong khoảng hợp lệ', () => {
  const motNgay = 86400000;

  assert.equal(msUntilVietnamMidnight(new Date('2027-02-03T17:00:00Z')), motNgay);
  assert.equal(msUntilVietnamMidnight(new Date('2027-02-03T16:59:59Z')), 1000);

  for (let gio = 0; gio < 24; gio += 1) {
    const con = msUntilVietnamMidnight(new Date(Date.UTC(2026, 8, 15, gio)));
    assert.ok(con > 0 && con <= motNgay, `Giờ ${gio} cho kết quả ngoài khoảng: ${con}`);
  }
});

test('đọc chuỗi ngày YYYY-MM-DD, bỏ qua chuỗi rác', () => {
  assert.deepEqual(parseDateString('2027-02-04'), { day: 4, month: 2, year: 2027 });
  assert.deepEqual(parseDateString('  2026-12-20  '), { day: 20, month: 12, year: 2026 });

  for (const rac of ['', '04/02/2027', '2027-2-4', '2027-13-01', '2027-02-00', null, undefined, 42]) {
    assert.equal(parseDateString(rac), null, `Chuỗi ${JSON.stringify(rac)} phải bị từ chối`);
  }
});
