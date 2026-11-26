/**
 * Kết nối Supabase tối giản cho trang tĩnh.
 *
 * Publishable key (anon key) được phép nằm ở mã trình duyệt. Quyền ghi thật
 * được kiểm soát bởi hàm save_daily_wish trong Supabase, không nằm ở đây.
 */

function makeDayKey({ day, month, year }) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function isConfigured({ url, publishableKey, writerEmail } = {}) {
  return typeof url === 'string'
    && /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url.trim())
    && typeof publishableKey === 'string'
    && publishableKey.trim().length > 20
    && typeof writerEmail === 'string'
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(writerEmail.trim());
}

function makeHeaders(publishableKey) {
  return {
    apikey: publishableKey,
    Authorization: `Bearer ${publishableKey}`,
  };
}

async function readError(response) {
  try {
    const body = await response.json();
    return body.message ?? body.error ?? body.msg ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Tạo kho lời nhắn dùng bảng và RPC của Supabase.
 *
 * @param {{ url: string, publishableKey: string }} options
 * @param {typeof fetch} fetchImpl
 */
export function createSupabaseDailyWishStore(options, fetchImpl = fetch) {
  const configured = isConfigured(options);
  const baseUrl = options?.url?.trim().replace(/\/$/, '');
  const key = options?.publishableKey?.trim();
  const writerEmail = options?.writerEmail?.trim();

  return {
    configured,

    async read(today) {
      if (!configured) return { ok: false, reason: 'not-configured' };

      let response;
      try {
        const dayKey = encodeURIComponent(makeDayKey(today));
        response = await fetchImpl(
          `${baseUrl}/rest/v1/daily_wishes?day_key=eq.${dayKey}&select=message&limit=1`,
          { headers: makeHeaders(key) },
        );
      } catch {
        return { ok: false, reason: 'network' };
      }

      if (!response.ok) return { ok: false, reason: 'network' };
      const rows = await response.json();
      const message = rows?.[0]?.message;
      return typeof message === 'string' && message.trim()
        ? { ok: true, message }
        : { ok: true, message: null };
    },

    async save(today, message, saveKey) {
      if (!configured) return { ok: false, reason: 'not-configured' };

      let tokenResponse;
      try {
        tokenResponse = await fetchImpl(`${baseUrl}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            apikey: key,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: writerEmail, password: saveKey }),
        });
      } catch {
        return { ok: false, reason: 'network' };
      }

      if (!tokenResponse.ok) return { ok: false, reason: 'key' };
      const auth = await tokenResponse.json();
      if (typeof auth?.access_token !== 'string') return { ok: false, reason: 'key' };

      let response;
      try {
        response = await fetchImpl(`${baseUrl}/rest/v1/rpc/save_daily_wish`, {
          method: 'POST',
          headers: {
            apikey: key,
            Authorization: `Bearer ${auth.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            p_day_key: makeDayKey(today),
            p_message: message.trim(),
          }),
        });
      } catch {
        return { ok: false, reason: 'network' };
      }

      if (response.ok) return { ok: true, message: message.trim() };

      const reason = await readError(response);
      if (reason === 'not-authorized') return { ok: false, reason: 'key' };
      if (reason === 'already-saved') return { ok: false, reason: 'already-saved' };
      if (reason === 'invalid-message') return { ok: false, reason: 'empty' };
      return { ok: false, reason: 'network' };
    },
  };
}

export { isConfigured as isSupabaseConfigured };
