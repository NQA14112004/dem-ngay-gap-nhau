import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { config } from '../js/config.js';
import { renderCountdown } from '../js/countdown.js';
import { applyScene, buildSceneSvg, computeViewBox, pickScene } from '../js/scene.js';
import { DAYPART_IDS } from '../js/daypart.js';
import { LAYOUTS } from '../js/scene-layouts.js';
import { getCountdownState } from '../js/target-date.js';

/** Thẻ DOM giả, đủ dùng cho phần vẽ chữ. */
function taoThe() {
  return {
    textContent: '',
    innerHTML: '',
    dataset: {},
    _classes: new Set(),
    classList: {
      add(c) { this._owner._classes.add(c); },
      remove(c) { this._owner._classes.delete(c); },
    },
  };
}

function taoBoThe() {
  const ids = ['eyebrow', 'days', 'unit', 'message', 'todayLine', 'targetLine', 'tick'];
  const el = {};

  for (const id of ids) {
    const the = taoThe();
    the.classList._owner = the;
    el[id] = the;
  }
  return el;
}

// renderCountdown dùng window.setTimeout để làm hiệu ứng mờ chữ.
globalThis.window = { setTimeout: (fn) => fn() };

test('vẽ đủ thông tin ra màn hình cho một ngày bình thường', () => {
  const el = taoBoThe();
  const today = { day: 15, month: 9, year: 2026 };
  const state = getCountdownState(new Date(), { today });

  renderCountdown(el, state, config);

  assert.equal(el.days.textContent, '142');
  assert.equal(el.unit.textContent, 'ngày nữa anh về');
  assert.match(el.todayLine.textContent, /^Hôm nay Thứ Ba, 15\/09\/2026 · mùng 5 tháng Tám$/);
  assert.match(el.targetLine.innerHTML, /28 tháng Chạp/);
  assert.match(el.targetLine.innerHTML, /Thứ Năm, 04\/02\/2027/);
  assert.ok(el.message.textContent.length > 12, 'phải có câu yêu thương');
});

test('còn đúng 1 ngày thì đổi cách xưng hô cho hợp', () => {
  const el = taoBoThe();
  const state = getCountdownState(new Date(), { today: { day: 3, month: 2, year: 2027 } });

  renderCountdown(el, state, config);

  assert.equal(el.days.textContent, '1');
  assert.equal(el.unit.textContent, 'ngày nữa. Mai anh về.');
});

test('ngày về thì con số là 0 và trang biết là đã tới nơi', () => {
  const el = taoBoThe();
  const state = getCountdownState(new Date(), { today: { day: 4, month: 2, year: 2027 } });

  renderCountdown(el, state, config);

  assert.equal(el.days.textContent, '0');
  assert.equal(state.hasArrived, true);
});

test('mùa chọn theo tháng, bố cục chọn theo tuần, ánh sáng chọn theo buổi', () => {
  const canh = (thang, ngay, conLai, buoi) =>
    pickScene({ month: thang, dayNumber: ngay, daysRemaining: conLai, daypart: buoi });

  assert.equal(canh(10, 2461299, 120, 'chieu').season, 'thu');
  assert.equal(canh(12, 2461360, 60, 'toi').season, 'dong');
  assert.equal(canh(1, 2461420, 15, 'sang').isTet, true, 'còn 15 ngày thì bật chế độ Tết');
  assert.equal(canh(12, 2461360, 60, 'toi').isTet, false, 'còn 60 ngày thì chưa tới Tết');

  // Cùng một ngày, đổi buổi thì ánh sáng đổi nhưng bố cục giữ nguyên
  const sang = canh(10, 2461299, 120, 'sang');
  const toi = canh(10, 2461299, 120, 'toi');
  assert.equal(sang.layout.ten, toi.layout.ten, 'trong cùng một ngày bố cục không được đổi');
  assert.notEqual(sang.daypart, toi.daypart);
});

test('trong cùng một tuần thì bố cục giữ nguyên, sang tuần mới thì đổi', () => {
  const boCuc = (ngay) =>
    pickScene({ month: 10, dayNumber: ngay, daysRemaining: 120, daypart: 'chieu' }).layout.ten;

  // Bảy ngày của cùng một tuần phải cho ra cùng một bố cục
  const goc = 2461299 - (2461299 % 7);
  const trongTuan = new Set(Array.from({ length: 7 }, (_, i) => boCuc(goc + i)));
  assert.equal(trongTuan.size, 1, 'bố cục không được đổi giữa chừng trong tuần');

  // Năm tuần liên tiếp phải ra năm bố cục khác nhau
  const nhieuTuan = Array.from({ length: 5 }, (_, i) => boCuc(goc + i * 7));
  assert.equal(new Set(nhieuTuan).size, 5, 'năm tuần liên tiếp phải là năm cảnh khác nhau');

  // Sang tuần thứ sáu thì quay lại từ đầu
  assert.equal(boCuc(goc + 35), nhieuTuan[0]);
});

test('mùa nào cũng có đủ bố cục và bố cục nào cũng vẽ ra hình', () => {
  const khung = computeViewBox(390, 844);

  for (const [mua, danhSach] of Object.entries(LAYOUTS)) {
    assert.ok(danhSach.length >= 4, `mùa ${mua} mới có ${danhSach.length} bố cục`);

    const ten = danhSach.map((b) => b.ten);
    assert.equal(new Set(ten).size, ten.length, `mùa ${mua} có bố cục trùng tên`);

    for (const boCuc of danhSach) {
      assert.ok(typeof boCuc.hat === 'string' && boCuc.hat, `${boCuc.ten} thiếu kiểu hạt rơi`);

      const hinh = boCuc.ve(khung.width, () => 0.5);
      assert.ok(hinh.length > 80, `bố cục ${boCuc.ten} vẽ ra quá ít`);
      assert.ok(!hinh.includes('NaN'), `bố cục ${boCuc.ten} có toạ độ NaN`);
    }
  }
});

test('chuỗi SVG dựng ra đúng cấu trúc ở mọi mùa, mọi buổi, mọi tuần', () => {
  const khung = computeViewBox(390, 844);

  for (const mua of Object.keys(LAYOUTS)) {
    for (const buoi of DAYPART_IDS) {
      for (let tuan = 0; tuan < LAYOUTS[mua].length; tuan += 1) {
        for (const isTet of [false, true]) {
          const canh = { season: mua, daypart: buoi, weekIndex: tuan, isTet, layout: LAYOUTS[mua][tuan] };
          const svg = buildSceneSvg(canh, 2461299 + tuan, khung);
          const nhan = `${mua}/${buoi}/${LAYOUTS[mua][tuan].ten}/tet=${isTet}`;

          assert.ok(svg.startsWith('<svg'), `${nhan} không mở bằng thẻ svg`);
          assert.ok(svg.trimEnd().endsWith('</svg>'), `${nhan} không đóng thẻ svg`);
          assert.equal(
            (svg.match(/<g[\s>]/g) ?? []).length,
            (svg.match(/<\/g>/g) ?? []).length,
            `${nhan}: thẻ <g> không cân bằng`,
          );
          assert.ok(!svg.includes('NaN'), `${nhan} có toạ độ NaN`);
          assert.ok(!svg.includes('undefined'), `${nhan} có giá trị undefined`);
        }
      }
    }
  }
});

test('cùng một ngày và cùng một buổi thì dựng lại ra đúng hình cũ', () => {
  const khung = computeViewBox(390, 844);
  const canh = pickScene({ month: 10, dayNumber: 2461299, daysRemaining: 120, daypart: 'chieu' });

  assert.equal(buildSceneSvg(canh, 2461299, khung), buildSceneSvg(canh, 2461299, khung));

  const maiSau = pickScene({ month: 10, dayNumber: 2461300, daysRemaining: 119, daypart: 'chieu' });
  assert.notEqual(buildSceneSvg(canh, 2461299, khung), buildSceneSvg(maiSau, 2461300, khung));
});

test('applyScene gắn đủ mùa, buổi, bố cục lên thẻ body', () => {
  const body = { dataset: {} };
  const art = { innerHTML: '' };
  const canh = pickScene({ month: 12, dayNumber: 2461420, daysRemaining: 15, daypart: 'sang' });

  applyScene({
    root: body, artContainer: art, scene: canh, seed: 2461420,
    viewBox: computeViewBox(390, 844),
  });

  assert.equal(body.dataset.scene, 'dong');
  assert.equal(body.dataset.buoi, 'sang');
  assert.equal(body.dataset.tet, 'true');
  assert.ok(body.dataset.boCuc.length > 0);
  assert.ok(art.innerHTML.includes('<svg'));
});

test('mọi id mà main.js tra cứu đều có thật trong index.html', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const main = await readFile(new URL('../js/main.js', import.meta.url), 'utf8');

  const idTrongHtml = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
  const idMainCan = [...main.matchAll(/getElementById\('([^']+)'\)/g)].map((m) => m[1]);

  assert.ok(idMainCan.length >= 12, 'main.js phải tra ít nhất 12 phần tử');
  for (const id of idMainCan) {
    assert.ok(idTrongHtml.has(id), `index.html thiếu phần tử id="${id}"`);
  }
});

test('mọi file css và js mà index.html gọi đều tồn tại', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const duongDan = [
    ...[...html.matchAll(/href="((?:css|js)\/[^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/src="((?:css|js)\/[^"]+)"/g)].map((m) => m[1]),
  ];

  assert.ok(duongDan.length >= 6, `Mới thấy ${duongDan.length} file được gọi`);
  for (const p of duongDan) {
    await assert.doesNotReject(
      readFile(new URL(`../${p}`, import.meta.url)),
      `index.html gọi ${p} nhưng file không tồn tại`,
    );
  }
});

test('mọi lệnh import giữa các module đều trỏ tới file có thật', async () => {
  const files = [
    'audio.js', 'config.js', 'countdown.js', 'daypart.js', 'finale.js', 'format.js',
    'lunar.js', 'main.js', 'message-picker.js', 'messages.js', 'particles.js', 'rng.js',
    'scene-art.js', 'scene-layouts.js', 'scene.js', 'target-date.js',
  ];

  for (const file of files) {
    const url = new URL(`../js/${file}`, import.meta.url);
    const source = await readFile(url, 'utf8');
    const imports = [...source.matchAll(/from '(\.\/[^']+)'/g)].map((m) => m[1]);

    for (const spec of imports) {
      await assert.doesNotReject(
        readFile(new URL(spec, url)),
        `${file} import '${spec}' nhưng file đó không tồn tại`,
      );
    }
  }
});

test('khung tranh co giãn theo tỉ lệ màn hình, không để bị cắt hai bên', () => {
  const dienThoaiDung = computeViewBox(390, 844);
  const mayTinh = computeViewBox(1920, 1080);
  const vuong = computeViewBox(800, 800);

  assert.equal(dienThoaiDung.height, 600, 'chiều cao luôn cố định');
  assert.ok(dienThoaiDung.width < vuong.width, 'màn hình dọc thì khung hẹp lại');
  assert.ok(mayTinh.width > vuong.width, 'màn hình ngang thì khung rộng ra');

  // Tỉ lệ khung phải bám sát tỉ lệ màn hình thì mới không bị cắt
  assert.ok(Math.abs(dienThoaiDung.width / 600 - 390 / 844) < 0.05);
  assert.ok(Math.abs(mayTinh.width / 600 - 1920 / 1080) < 0.05);

  // Màn hình méo bất thường vẫn phải cho ra khung dùng được
  for (const [w, h] of [[320, 3000], [4000, 300], [0, 0], [500, 0]]) {
    const khung = computeViewBox(w, h);
    assert.ok(khung.width >= 250 && khung.width <= 1560, `khung sai với ${w}x${h}: ${khung.width}`);
  }
});

test('lồng đèn nằm trong khung nhìn của điện thoại dựng đứng', () => {
  const khung = computeViewBox(390, 844);
  const svgTet = buildSceneSvg(
    pickScene({ month: 12, dayNumber: 2461420, daysRemaining: 15, daypart: 'toi' }),
    2461420,
    khung,
  );

  const toaDo = [...svgTet.matchAll(/<g transform="translate\(([\d.]+) 0\) scale/g)].map((m) => Number(m[1]));

  assert.equal(toaDo.length, 2, 'phải có đúng hai lồng đèn');
  for (const x of toaDo) {
    assert.ok(x > 20 && x < khung.width - 20, `lồng đèn ở ${x} lọt ra mép khung rộng ${khung.width}`);
  }
});

test('phần tử có animation xoay không được mang transform riêng của SVG', () => {
  // CSS transform luôn thắng thuộc tính transform của SVG. Nếu gộp chung thì
  // animation sẽ xoá mất vị trí - đúng lỗi đã làm hai lồng đèn dồn về góc trái.
  const khung = computeViewBox(390, 844);
  const svg = buildSceneSvg(
    pickScene({ month: 12, dayNumber: 2461420, daysRemaining: 15, daypart: 'toi' }),
    2461420,
    khung,
  );

  const theCoAnimation = [...svg.matchAll(/<g class="(art-lantern[^"]*)"([^>]*)>/g)];
  assert.ok(theCoAnimation.length >= 2, 'phải tìm thấy các thẻ lồng đèn');

  for (const [, ten, thuocTinh] of theCoAnimation) {
    assert.ok(!thuocTinh.includes('transform='), `${ten} vừa có animation vừa có transform riêng`);
  }
});

test('animation không được gắn thẳng lên phần tử có độ mờ riêng', () => {
  // CSS animation ghi đè cả thuộc tính opacity của phần tử. Gắn class có
  // animation opacity lên đúng phần tử đang cần độ mờ riêng thì độ mờ đó bị
  // xoá - đúng lỗi đã làm dải sương loá trắng che mất chữ.
  const khung = computeViewBox(390, 844);

  for (const [mua, danhSach] of Object.entries(LAYOUTS)) {
    for (const boCuc of danhSach) {
      const hinh = boCuc.ve(khung.width, () => 0.5);
      const viPham = [...hinh.matchAll(/<(\w+)([^>]*class="[^"]*art-water[^"]*"[^>]*)>/g)]
        .filter(([, the, thuocTinh]) => the !== 'g' && thuocTinh.includes('opacity='));

      assert.equal(
        viPham.length,
        0,
        `${mua}/${boCuc.ten}: có phần tử vừa mang art-water vừa có opacity riêng`,
      );
    }
  }
});
