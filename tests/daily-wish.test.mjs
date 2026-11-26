import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  DAILY_WISH_SAVE_KEY,
  DAILY_WISH_STORAGE_KEY,
  makeDayKey,
  readDailyWish,
  saveDailyWish,
} from '../js/daily-wish.js';

function makeStorage() {
  const data = new Map();
  return {
    getItem(key) { return data.get(key) ?? null; },
    setItem(key, value) { data.set(key, value); },
  };
}

test('lời chúc được lưu theo ngày Việt Nam và đọc lại đúng ngày đó', () => {
  const storage = makeStorage();
  const today = { day: 26, month: 11, year: 2026 };

  assert.equal(makeDayKey(today), '2026-11-26');
  assert.equal(saveDailyWish(storage, today, ' Chúc em một ngày vui. ', DAILY_WISH_SAVE_KEY).ok, true);
  assert.equal(readDailyWish(storage, today), 'Chúc em một ngày vui.');
  assert.equal(storage.getItem(DAILY_WISH_STORAGE_KEY) !== null, true);
});

test('mỗi ngày chỉ được lưu một lần và phải có key đúng', () => {
  const storage = makeStorage();
  const today = { day: 26, month: 11, year: 2026 };

  assert.equal(saveDailyWish(storage, today, 'Lời chúc', 'sai-key').reason, 'key');
  assert.equal(saveDailyWish(storage, today, 'Lời chúc đầu tiên', DAILY_WISH_SAVE_KEY).ok, true);
  assert.equal(saveDailyWish(storage, today, 'Lời chúc thứ hai', DAILY_WISH_SAVE_KEY).reason, 'already-saved');
  assert.equal(readDailyWish(storage, { day: 27, month: 11, year: 2026 }), null);
});

test('lời nhắn dài và có xuống dòng được giữ nguyên khi lưu', () => {
  const storage = makeStorage();
  const today = { day: 26, month: 11, year: 2026 };
  const message = `Gửi em,\n\n${'Anh nhớ em. '.repeat(280)}`;

  assert.ok(message.length > 3000);
  assert.equal(saveDailyWish(storage, today, message, DAILY_WISH_SAVE_KEY).ok, true);
  assert.equal(readDailyWish(storage, today), message.trim());
});
