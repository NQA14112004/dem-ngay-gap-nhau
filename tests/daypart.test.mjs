import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  DAYPART_IDS,
  DAYPARTS,
  daypartFromHour,
  daypartLabel,
  getDaypart,
  parseDaypart,
} from '../js/daypart.js';

test('mỗi giờ trong ngày rơi vào đúng buổi', () => {
  const mongDoi = {
    toi: [18, 19, 21, 23, 0, 2, 4],
    sang: [5, 6, 8, 10],
    trua: [11, 12, 14],
    chieu: [15, 16, 17],
  };

  for (const [buoi, cacGio] of Object.entries(mongDoi)) {
    for (const gio of cacGio) {
      assert.equal(daypartFromHour(gio), buoi, `${gio} giờ phải là buổi ${buoi}`);
    }
  }
});

test('24 giờ trong ngày đều có buổi, không giờ nào lọt ra ngoài', () => {
  for (let gio = 0; gio < 24; gio += 1) {
    assert.ok(DAYPART_IDS.includes(daypartFromHour(gio)), `${gio} giờ không thuộc buổi nào`);
  }

  // Bốn buổi đều phải được dùng tới
  const daDung = new Set(Array.from({ length: 24 }, (_, g) => daypartFromHour(g)));
  assert.equal(daDung.size, 4);
});

test('ranh giới giữa các buổi nằm đúng chỗ', () => {
  assert.equal(daypartFromHour(4), 'toi');
  assert.equal(daypartFromHour(5), 'sang');
  assert.equal(daypartFromHour(10), 'sang');
  assert.equal(daypartFromHour(11), 'trua');
  assert.equal(daypartFromHour(14), 'trua');
  assert.equal(daypartFromHour(15), 'chieu');
  assert.equal(daypartFromHour(17), 'chieu');
  assert.equal(daypartFromHour(18), 'toi');
});

test('giờ âm hoặc quá 24 vẫn cho ra buổi hợp lệ', () => {
  for (const gio of [-1, -13, 24, 25, 48, 99.7]) {
    assert.ok(DAYPART_IDS.includes(daypartFromHour(gio)), `giờ ${gio} cho kết quả lạ`);
  }
});

test('buổi lấy theo giờ máy người xem, không phải giờ Việt Nam', () => {
  // Cùng một thời điểm, hai người ở hai múi giờ thấy hai buổi khác nhau - đúng
  // như mong muốn: màu nền nói về ánh sáng ngoài cửa sổ của chính người đang xem.
  const moc = new Date('2026-09-15T02:00:00Z');
  assert.equal(getDaypart(moc), daypartFromHour(moc.getHours()));
});

test('mỗi buổi có tên tiếng Việt', () => {
  assert.equal(daypartLabel('sang'), 'sáng');
  assert.equal(daypartLabel('trua'), 'trưa');
  assert.equal(daypartLabel('chieu'), 'chiều');
  assert.equal(daypartLabel('toi'), 'tối');
  assert.equal(daypartLabel('linh tinh'), 'tối', 'giá trị lạ thì lùi về buổi tối');
  assert.equal(DAYPARTS.length, 4);
});

test('đọc tham số ?buoi= và bỏ qua giá trị lạ', () => {
  assert.equal(parseDaypart('sang'), 'sang');
  assert.equal(parseDaypart('  CHIEU '), 'chieu');

  for (const rac of ['', 'sáng', 'noon', null, undefined, 3, {}]) {
    assert.equal(parseDaypart(rac), null, `${JSON.stringify(rac)} phải bị từ chối`);
  }
});
