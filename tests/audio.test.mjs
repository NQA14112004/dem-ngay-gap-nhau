import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_VOLUME,
  clampVolume,
  parseStoredVolume,
  shouldAutoplay,
} from '../js/audio.js';

test('âm lượng luôn bị kẹp về khoảng 0 - 1', () => {
  assert.equal(clampVolume(0), 0);
  assert.equal(clampVolume(1), 1);
  assert.equal(clampVolume(0.45), 0.45);
  assert.equal(clampVolume(-3), 0, 'số âm thì về 0');
  assert.equal(clampVolume(99), 1, 'vượt trần thì về 1');
});

test('giá trị âm lượng hỏng thì lùi về mức mặc định chứ không làm vỡ trang', () => {
  for (const rac of [NaN, Infinity, -Infinity, undefined, null, 'to vao']) {
    assert.equal(clampVolume(rac), DEFAULT_VOLUME, `${rac} phải lùi về mặc định`);
  }
});

test('đọc mức âm lượng đã lưu, dạng 0-100', () => {
  assert.equal(parseStoredVolume('0'), 0);
  assert.equal(parseStoredVolume('45'), 0.45);
  assert.equal(parseStoredVolume('100'), 1);
  assert.equal(parseStoredVolume('130'), 1, 'quá trần thì kẹp lại');
  assert.equal(parseStoredVolume('-20'), 0, 'số âm thì kẹp lại');
});

test('chưa lưu gì hoặc lưu giá trị hỏng thì dùng mức mặc định', () => {
  for (const rac of [null, undefined, '', 'linh tinh', 'NaN']) {
    assert.equal(parseStoredVolume(rac), DEFAULT_VOLUME, `${JSON.stringify(rac)} phải về mặc định`);
  }
  assert.equal(parseStoredVolume(null, 0.2), 0.2, 'nhận mức dự phòng tự chọn');
});

test('mức 0 phải giữ nguyên là 0, không bị nhầm thành mặc định', () => {
  // Người xem kéo về 0 để tắt tiếng; mở lại trang mà nhạc tự to lên thì rất phiền
  assert.equal(parseStoredVolume('0'), 0);
  assert.notEqual(parseStoredVolume('0'), DEFAULT_VOLUME);
});

test('lần đầu vào trang thì thử tự phát, đã tự tay tắt thì tôn trọng', () => {
  assert.equal(shouldAutoplay(null), true, 'lần đầu vào thì thử phát');
  assert.equal(shouldAutoplay('bat'), true, 'lần trước đang bật thì phát tiếp');
  assert.equal(shouldAutoplay('tat'), false, 'lần trước tự tay tắt thì đừng phát');
});
