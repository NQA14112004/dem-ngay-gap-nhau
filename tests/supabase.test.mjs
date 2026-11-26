import { test } from 'node:test';
import assert from 'node:assert/strict';

import { createSupabaseDailyWishStore } from '../js/supabase.js';

const options = {
  url: 'https://example-project.supabase.co',
  publishableKey: 'sb_publishable_12345678901234567890',
  writerEmail: 'quanganh@example.com',
};
const today = { day: 26, month: 11, year: 2026 };

function response({ ok, json }) {
  return { ok, json: async () => json };
}

test('kho Supabase đọc lời nhắn đúng ngày', async () => {
  const calls = [];
  const store = createSupabaseDailyWishStore(options, async (url, init) => {
    calls.push({ url, init });
    return response({ ok: true, json: [{ message: 'Gửi em một ngày bình an.' }] });
  });

  const result = await store.read(today);
  assert.deepEqual(result, { ok: true, message: 'Gửi em một ngày bình an.' });
  assert.match(calls[0].url, /daily_wishes\?day_key=eq\.2026-11-26/);
  assert.equal(calls[0].init.headers.apikey, options.publishableKey);
});

test('kho Supabase gọi RPC để lưu và báo đúng key sai', async () => {
  const calls = [];
  const store = createSupabaseDailyWishStore(options, async (url, init) => {
    calls.push({ url, init });
    if (url.includes('/auth/v1/token')) {
      return response({ ok: true, json: { access_token: 'access-token' } });
    }
    return response({ ok: false, json: { message: 'not-authorized' } });
  });

  const result = await store.save(today, ' Lời nhắn hôm nay ', 'sai-key');
  assert.deepEqual(result, { ok: false, reason: 'key' });
  assert.match(calls[0].url, /\/auth\/v1\/token\?grant_type=password$/);
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    email: options.writerEmail,
    password: 'sai-key',
  });
  assert.match(calls[1].url, /\/rest\/v1\/rpc\/save_daily_wish$/);
  assert.deepEqual(JSON.parse(calls[1].init.body), {
    p_day_key: '2026-11-26',
    p_message: 'Lời nhắn hôm nay',
  });
  assert.equal(calls[1].init.headers.Authorization, 'Bearer access-token');
});

test('kho Supabase không hoạt động khi chưa điền cấu hình', async () => {
  const store = createSupabaseDailyWishStore({ url: '', publishableKey: '' });
  assert.equal(store.configured, false);
  assert.deepEqual(await store.read(today), { ok: false, reason: 'not-configured' });
});
