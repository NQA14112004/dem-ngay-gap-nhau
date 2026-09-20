/**
 * Các mảnh hình SVG ghép thành tranh nền.
 *
 * Mọi thứ vẽ dưới dạng bóng đổ (đen nửa trong suốt) hoặc dùng biến màu
 * var(--accent) của mùa, nhờ vậy một bộ hình duy nhất ăn khớp với cả 16 bảng màu.
 *
 * Hệ toạ độ: chiều cao luôn là 600, còn CHIỀU RỘNG do màn hình quyết định
 * (xem computeViewBox trong scene.js). Vì vậy mọi hàm ở đây đều nhận tham số W
 * và đặt hình theo tỉ lệ của W, chứ không dùng toạ độ cố định. Có vậy thì trên
 * điện thoại dựng đứng mới không bị cắt mất mặt trăng hay lồng đèn.
 */

import { between } from './rng.js?v=015067cd';

/** Chiều cao cố định của hệ toạ độ. */
export const ART_HEIGHT = 600;

/**
 * Hệ số thu nhỏ cho các vật thể rời (nhà, lồng đèn).
 *
 * Trên điện thoại dựng đứng khung chỉ rộng chừng 280 đơn vị, một ngôi nhà vẽ
 * nguyên cỡ sẽ chiếm gần nửa màn hình. Thu theo bề rộng thì tỉ lệ mới hợp mắt.
 *
 * @param {number} W Chiều rộng hệ toạ độ
 * @returns {number} Hệ số trong khoảng 0.5 - 1
 */
function objectScale(W) {
  return Math.min(1, Math.max(0.5, W / 1000));
}

/** Vị trí mặt trời / mặt trăng theo từng buổi: [tỉ lệ ngang, cao độ, bán kính]. */
const CELESTIAL_BY_DAYPART = {
  sang: { fx: 0.2, cy: 296, r: 46, opacity: 0.68 }, // mặt trời vừa lên, còn thấp phía đông
  trua: { fx: 0.68, cy: 104, r: 42, opacity: 0.74 }, // đứng bóng, nhỏ và gắt
  chieu: { fx: 0.78, cy: 372, r: 64, opacity: 0.94 }, // xuống thấp, to và đỏ
  toi: { fx: 0.72, cy: 118, r: 40, opacity: 0.82 }, // mặt trăng
};

/**
 * Vẽ mặt trời / mặt trăng kèm quầng sáng.
 *
 * @param {number} W Chiều rộng hệ toạ độ
 * @param {string} daypart Buổi trong ngày
 * @returns {string} Chuỗi SVG
 */
export function celestial(W, daypart) {
  const { fx, cy, r, opacity } = CELESTIAL_BY_DAYPART[daypart] ?? CELESTIAL_BY_DAYPART.toi;
  const cx = Math.round(fx * W);
  const isMoon = daypart === 'toi';

  const body = isMoon
    ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--accent)" opacity="${opacity}" />
       <circle cx="${cx + r * 0.36}" cy="${cy - r * 0.26}" r="${r * 0.92}" fill="var(--sky-top)" opacity="0.96" />`
    : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--accent)" opacity="${opacity}" />`;

  // Quầng sáng dùng gradient thay vì mấy vòng tròn chồng nhau, nếu không sẽ
  // thấy rõ viền cứng giữa các vòng khi mặt trời nằm sau khối chữ.
  const gradientId = `quang-${daypart}`;

  return `
    <defs>
      <radialGradient id="${gradientId}">
        <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.34" />
        <stop offset="42%" stop-color="var(--accent)" stop-opacity="0.15" />
        <stop offset="100%" stop-color="var(--accent)" stop-opacity="0" />
      </radialGradient>
    </defs>
    <g class="art-sun">
      <circle cx="${cx}" cy="${cy}" r="${(r * 3.1).toFixed(1)}" fill="url(#${gradientId})" />
      ${body}
    </g>
  `;
}

/**
 * Bầu trời sao, chỉ dùng cho biến thể ban đêm.
 *
 * @param {() => number} random Hàm ngẫu nhiên có hạt giống
 * @param {number} W Chiều rộng hệ toạ độ
 * @returns {string} Chuỗi SVG
 */
export function stars(random, W) {
  const count = Math.round(52 * (W / 700) + 24);
  let out = '';

  for (let i = 0; i < count; i += 1) {
    const x = between(random, 6, W - 6);
    const y = between(random, 8, 340);
    const r = between(random, 0.8, 2.2);
    const delay = between(random, -5, 0);

    out += `<circle class="art-star" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}"
      fill="#fff" style="animation-delay:${delay.toFixed(2)}s" />`;
  }
  return `<g>${out}</g>`;
}

/**
 * Mây trôi ngang trời.
 *
 * Quãng đường trôi được truyền vào bằng biến CSS, vì phần trăm trong transform
 * của SVG tính theo khung bao của chính cụm mây chứ không theo bề rộng màn hình.
 *
 * @param {() => number} random Hàm ngẫu nhiên
 * @param {number} W Chiều rộng hệ toạ độ
 * @param {number} [count=3] Số cụm mây
 * @returns {string} Chuỗi SVG
 */
export function clouds(random, W, count = 3) {
  let out = '';

  for (let i = 0; i < count; i += 1) {
    const y = between(random, 54, 236);
    const scale = between(random, 0.5, 1.05);
    const delay = between(random, -80, 0);
    const slow = random() > 0.5 ? ' art-cloud--slow' : '';

    out += `
      <g class="art-cloud${slow}"
         style="animation-delay:${delay.toFixed(1)}s; --may-tu:-320px; --may-den:${Math.round(W + 220)}px">
        <g transform="translate(0 ${y.toFixed(0)}) scale(${scale.toFixed(2)})" opacity="0.16">
          <ellipse cx="120" cy="0" rx="96" ry="26" fill="#fff" />
          <ellipse cx="186" cy="8" rx="70" ry="20" fill="#fff" />
          <ellipse cx="62" cy="10" rx="58" ry="18" fill="#fff" />
        </g>
      </g>`;
  }
  return out;
}

/** Đường viền của ba lớp đồi, mô tả bằng tỉ lệ ngang để co giãn theo màn hình. */
const HILL_LAYERS = [
  [[0, 392], [0.15, 330], [0.27, 380], [0.39, 312], [0.52, 372], [0.65, 322], [0.79, 386], [1, 336]],
  [[0, 442], [0.13, 404], [0.25, 448], [0.4, 396], [0.55, 452], [0.7, 408], [0.85, 456], [1, 414]],
  [[0, 498], [0.18, 470], [0.33, 506], [0.5, 464], [0.66, 508], [0.82, 476], [1, 510]],
];

/**
 * Dãy đồi xếp lớp, tạo chiều sâu cho cảnh.
 *
 * @param {number} W Chiều rộng hệ toạ độ
 * @param {number[]} [alphas] Độ đậm của từng lớp, xa tới gần
 * @returns {string} Chuỗi SVG
 */
export function hills(W, alphas = [0.16, 0.28, 0.44]) {
  return HILL_LAYERS.map((points, i) => {
    const d = points
      .map(([fx, y], k) => `${k === 0 ? 'M' : 'L'}${(fx * W).toFixed(1)} ${y}`)
      .join(' ');

    return `<path d="${d} L${W} ${ART_HEIGHT} L0 ${ART_HEIGHT} Z"
      fill="#000" opacity="${alphas[i] ?? 0.3}" />`;
  }).join('');
}

/**
 * Mặt nước phản chiếu ở dải dưới khung hình.
 *
 * @param {number} W Chiều rộng hệ toạ độ
 * @returns {string} Chuỗi SVG
 */
export function water(W) {
  const lines = [520, 542, 560, 576, 590]
    .map((y, i) => {
      const w = (0.3 - i * 0.035) * W;
      const x = (0.08 + i * 0.11) * W;
      return `<rect x="${x.toFixed(1)}" y="${y}" width="${Math.max(24, w).toFixed(1)}" height="2.5"
        rx="1.25" fill="#fff" opacity="${(0.1 - i * 0.015).toFixed(3)}" />`;
    })
    .join('');

  return `
    <g class="art-water">
      <rect x="0" y="506" width="${W}" height="${ART_HEIGHT - 506}" fill="var(--accent)" opacity="0.07" />
      ${lines}
    </g>`;
}

/**
 * Hàng cây trụi lá kiểu mùa thu, đứng ở tiền cảnh.
 *
 * @param {() => number} random Hàm ngẫu nhiên
 * @param {number} W Chiều rộng hệ toạ độ
 * @returns {string} Chuỗi SVG
 */
export function bareTrees(random, W) {
  let out = '';

  for (const fx of [0.1, 0.9, 0.26]) {
    const baseX = fx * W;
    const height = between(random, 150, 230);
    const lean = between(random, -8, 8);
    const top = 560 - height;

    out += `
      <g opacity="0.52" transform="translate(${baseX.toFixed(1)} 0)">
        <path d="M0 566 Q${lean.toFixed(1)} ${(top + height * 0.5).toFixed(0)} ${(lean * 2).toFixed(1)} ${top.toFixed(0)}"
          stroke="#000" stroke-width="7" fill="none" stroke-linecap="round" />
        <path d="M${(lean * 1.2).toFixed(1)} ${(top + height * 0.36).toFixed(0)} L${(lean * 1.2 - 44).toFixed(1)} ${(top + height * 0.12).toFixed(0)}"
          stroke="#000" stroke-width="4" fill="none" stroke-linecap="round" />
        <path d="M${(lean * 1.5).toFixed(1)} ${(top + height * 0.24).toFixed(0)} L${(lean * 1.5 + 50).toFixed(1)} ${(top - 6).toFixed(0)}"
          stroke="#000" stroke-width="4" fill="none" stroke-linecap="round" />
        <path d="M${(lean * 1.8).toFixed(1)} ${(top + height * 0.12).toFixed(0)} L${(lean * 1.8 - 34).toFixed(1)} ${(top - 26).toFixed(0)}"
          stroke="#000" stroke-width="3" fill="none" stroke-linecap="round" />
      </g>`;
  }
  return out;
}

/**
 * Rừng thông phủ tuyết ở tiền cảnh.
 *
 * @param {() => number} random Hàm ngẫu nhiên
 * @param {number} W Chiều rộng hệ toạ độ
 * @returns {string} Chuỗi SVG
 */
export function pineTrees(random, W) {
  const count = Math.max(4, Math.round(W / 118));
  const buoc = W / count;
  let out = '';

  for (let i = 0; i < count; i += 1) {
    const x = buoc * (i + 0.5) + between(random, -buoc * 0.24, buoc * 0.24);
    const h = between(random, 96, 168);
    const w = h * 0.42;
    const base = 578;

    out += `
      <path opacity="${(0.4 + (i % 3) * 0.09).toFixed(2)}"
        d="M${x.toFixed(1)} ${(base - h).toFixed(0)} L${(x + w / 2).toFixed(1)} ${(base - h * 0.42).toFixed(0)}
           L${(x + w / 4).toFixed(1)} ${(base - h * 0.42).toFixed(0)} L${(x + w * 0.62).toFixed(1)} ${base}
           L${(x - w * 0.62).toFixed(1)} ${base} L${(x - w / 4).toFixed(1)} ${(base - h * 0.42).toFixed(0)}
           L${(x - w / 2).toFixed(1)} ${(base - h * 0.42).toFixed(0)} Z" fill="#000" />`;
  }
  return out;
}

/**
 * Cành hoa mai / hoa đào vắt ngang góc trên - dấu hiệu Tết đang tới gần.
 *
 * @param {() => number} random Hàm ngẫu nhiên
 * @param {number} W Chiều rộng hệ toạ độ
 * @returns {string} Chuỗi SVG
 */
export function blossomBranch(random, W) {
  const count = Math.max(14, Math.round(W / 26));
  let hoa = '';

  for (let i = 0; i < count; i += 1) {
    const t = i / (count - 1);
    const x = t * W * 0.98 + between(random, -W * 0.03, W * 0.03);
    const y = 34 + Math.sin(t * 3.1) * 52 + between(random, -24, 24);
    const r = between(random, 6, 12);

    // Mỗi bông là 5 cánh tròn quanh một nhuỵ
    let canh = '';
    for (let k = 0; k < 5; k += 1) {
      const goc = (k / 5) * Math.PI * 2;
      canh += `<circle cx="${(x + Math.cos(goc) * r * 0.62).toFixed(1)}"
        cy="${(y + Math.sin(goc) * r * 0.62).toFixed(1)}" r="${(r * 0.52).toFixed(1)}"
        fill="var(--accent)" opacity="0.9" />`;
    }
    hoa += `<g>${canh}<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * 0.22).toFixed(1)}"
      fill="#7a3b12" opacity="0.7" /></g>`;
  }

  const p = (f) => (f * W).toFixed(1);

  return `
    <g>
      <path d="M${p(-0.03)} 18 Q${p(0.2)} 86 ${p(0.42)} 40 T${p(0.86)} 92" stroke="#3a2416"
        stroke-width="9" fill="none" stroke-linecap="round" opacity="0.8" />
      <path d="M${p(0.26)} 58 Q${p(0.34)} 118 ${p(0.31)} 176" stroke="#3a2416"
        stroke-width="5" fill="none" stroke-linecap="round" opacity="0.7" />
      <path d="M${p(0.6)} 66 Q${p(0.68)} 10 ${p(0.78)} 26" stroke="#3a2416"
        stroke-width="5" fill="none" stroke-linecap="round" opacity="0.7" />
      ${hoa}
    </g>`;
}

/**
 * Đôi lồng đèn đỏ treo hai bên khung hình, đung đưa nhè nhẹ.
 *
 * @param {number} W Chiều rộng hệ toạ độ
 * @returns {string} Chuỗi SVG
 */
export function lanterns(W) {
  const k = objectScale(W);

  // Lưu ý: lớp mang class art-lantern KHÔNG được có transform riêng. Animation
  // trong CSS đặt transform: rotate(...), mà CSS transform luôn thắng thuộc tính
  // transform của SVG - đặt chung một chỗ thì vị trí bị xoá sạch và cả hai lồng
  // đèn dồn về góc trái. Vì vậy phải tách: lớp ngoài định vị, lớp trong đung đưa.
  const mot = (x, extraClass) => `
    <g transform="translate(${x.toFixed(1)} 0) scale(${k.toFixed(2)})">
      <g class="art-lantern${extraClass}">
        <line x1="0" y1="0" x2="0" y2="76" stroke="#5a1f1f" stroke-width="2.5" opacity="0.8" />
        <circle cx="0" cy="112" r="62" fill="#ff8a4a" opacity="0.14" />
        <ellipse cx="0" cy="112" rx="34" ry="42" fill="#d92e2e" opacity="0.92" />
        <ellipse cx="0" cy="112" rx="34" ry="42" fill="var(--accent)" opacity="0.18" />
        <rect x="-15" y="66" width="30" height="10" rx="3" fill="#f0c15a" opacity="0.95" />
        <rect x="-15" y="148" width="30" height="10" rx="3" fill="#f0c15a" opacity="0.95" />
        <line x1="0" y1="158" x2="0" y2="196" stroke="#f0c15a" stroke-width="3" opacity="0.9" />
      </g>
    </g>`;

  return `<g>${mot(W * 0.18, '')}${mot(W * 0.82, ' art-lantern--b')}</g>`;
}

/**
 * Ngôi nhà nhỏ có ánh đèn ấm phía xa - hình ảnh "nhà mình" trong cảnh mùa đông.
 *
 * @param {number} W Chiều rộng hệ toạ độ
 * @returns {string} Chuỗi SVG
 */
export function warmHouse(W) {
  const k = objectScale(W);
  const x = W * 0.56;

  // Ánh đèn dùng màu vàng ấm cố định chứ không theo var(--accent): đèn trong nhà
  // thì mùa nào cũng vàng, và nhờ vậy ngôi nhà luôn nổi lên khỏi nền tối.
  return `
    <g transform="translate(${x.toFixed(1)} ${(ART_HEIGHT * (1 - k)).toFixed(1)}) scale(${k.toFixed(2)})">
      <circle cx="54" cy="520" r="78" fill="#ff9a4a" opacity="0.16" />
      <path d="M-6 500 L54 452 L114 500 Z" fill="#160d14" opacity="0.94"
        stroke="#ffcf8a" stroke-width="1.6" stroke-opacity="0.3" />
      <rect x="10" y="498" width="88" height="58" fill="#160d14" opacity="0.94"
        stroke="#ffcf8a" stroke-width="1.6" stroke-opacity="0.26" />
      <rect x="40" y="514" width="26" height="26" rx="3" fill="#ffcf8a" opacity="0.95" />
      <rect x="40" y="514" width="26" height="26" rx="3" fill="#fff" opacity="0.35" />
    </g>`;
}

/**
 * Dãy nhà phố in bóng lên nền trời, vài ô cửa còn sáng đèn.
 *
 * @param {() => number} random Hàm ngẫu nhiên
 * @param {number} W Chiều rộng hệ toạ độ
 * @returns {string} Chuỗi SVG
 */
export function citySkyline(random, W) {
  const count = Math.max(7, Math.round(W / 46));
  const buoc = W / count;
  let out = '';

  for (let i = 0; i < count; i += 1) {
    const x = i * buoc;
    const w = buoc * between(random, 0.82, 1.02);
    const h = between(random, 70, 190);
    const top = 560 - h;

    let cuaSo = '';
    const cot = Math.max(1, Math.floor(w / 13));
    const hang = Math.max(1, Math.floor(h / 26));

    for (let c = 0; c < cot; c += 1) {
      for (let r = 0; r < hang; r += 1) {
        if (random() > 0.62) {
          cuaSo += `<rect x="${(x + 5 + c * 13).toFixed(1)}" y="${(top + 12 + r * 26).toFixed(1)}"
            width="5" height="7" fill="#ffcf8a" opacity="${(0.5 + random() * 0.45).toFixed(2)}" />`;
        }
      }
    }

    out += `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${w.toFixed(1)}"
      height="${(560 - top + 40).toFixed(1)}" fill="#000" opacity="0.62" />${cuaSo}`;
  }
  return `<g>${out}</g>`;
}

/**
 * Cột đèn đường, thứ ánh sáng quen thuộc của phố buổi tối.
 *
 * @param {number} W Chiều rộng hệ toạ độ
 * @returns {string} Chuỗi SVG
 */
export function streetLamps(W) {
  const k = objectScale(W);

  // scale() thu nhỏ cả toạ độ dọc, nên phải dịch xuống bù lại thì chân cột đèn
  // mới đứng trên mặt đất chứ không lơ lửng giữa trời.
  const buDoc = (ART_HEIGHT * (1 - k)).toFixed(1);

  return [0.24, 0.72]
    .map(
      (fx) => `
      <g transform="translate(${(fx * W).toFixed(1)} ${buDoc}) scale(${k.toFixed(2)})">
        <circle cx="0" cy="430" r="56" fill="#ffcf8a" opacity="0.14" />
        <rect x="-2.5" y="432" width="5" height="148" fill="#000" opacity="0.66" />
        <path d="M0 432 q0 -18 18 -18" stroke="#000" stroke-width="5" fill="none" opacity="0.66" />
        <ellipse cx="20" cy="418" rx="9" ry="6" fill="#ffcf8a" opacity="0.92" />
      </g>`,
    )
    .join('');
}

/**
 * Dải sương là là mặt đất - sáng sớm mùa đông ở nhà hay có.
 *
 * @param {number} W Chiều rộng hệ toạ độ
 * @returns {string} Chuỗi SVG
 */
export function fogBank(W) {
  // Class art-water phải nằm ở lớp bọc ngoài, không được gắn lên từng dải.
  // Animation của nó đặt thẳng thuộc tính opacity, mà animation thì ghi đè cả
  // opacity riêng của phần tử - gắn vào từng dải là sương trắng loá lên 0.85,
  // che mất chữ phía dưới.
  const dai = [
    { y: 448, ry: 26, o: 0.14 },
    { y: 486, ry: 32, o: 0.18 },
    { y: 528, ry: 38, o: 0.22 },
  ]
    .map(
      ({ y, ry, o }) =>
        `<ellipse cx="${(W / 2).toFixed(1)}" cy="${y}" rx="${(W * 0.78).toFixed(1)}"
          ry="${ry}" fill="#fff" opacity="${o}" />`,
    )
    .join('');

  return `<g class="art-water">${dai}</g>`;
}

/**
 * Luống ruộng chạy hút về phía chân trời.
 *
 * @param {number} W Chiều rộng hệ toạ độ
 * @returns {string} Chuỗi SVG
 */
export function fieldRows(W) {
  const giua = W / 2;
  let out = '';

  for (let i = -6; i <= 6; i += 1) {
    const chanX = giua + i * (W / 7);
    const dinhX = giua + i * (W / 46);

    out += `<path d="M${chanX.toFixed(1)} 600 L${dinhX.toFixed(1)} 506" stroke="#000"
      stroke-width="${(2.2 - Math.abs(i) * 0.12).toFixed(2)}" opacity="0.1" fill="none" />`;
  }

  // Dải bờ mờ ở chân trời để mảng ruộng không bị hẫng, và một lớp phủ nhạt dần
  // lên trên cho ra chiều sâu thay vì trông như mặt sàn lát ván.
  return `
    <g>
      <defs>
        <linearGradient id="ruong" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#000" stop-opacity="0.06" />
          <stop offset="100%" stop-color="#000" stop-opacity="0.34" />
        </linearGradient>
      </defs>
      <rect x="0" y="502" width="${W}" height="98" fill="url(#ruong)" />
      <rect x="0" y="500" width="${W}" height="5" fill="#000" opacity="0.18" />
      ${out}
    </g>`;
}

/**
 * Đầm sen - hình ảnh mùa hè Hà Nội.
 *
 * @param {() => number} random Hàm ngẫu nhiên
 * @param {number} W Chiều rộng hệ toạ độ
 * @returns {string} Chuỗi SVG
 */
export function lotusPond(random, W) {
  let out = water(W);

  for (let i = 0; i < Math.max(5, Math.round(W / 90)); i += 1) {
    const x = between(random, 10, W - 10);
    const y = between(random, 512, 588);
    const rx = between(random, 14, 30);

    out += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx.toFixed(1)}"
      ry="${(rx * 0.32).toFixed(1)}" fill="#000" opacity="0.26" />`;

    if (random() > 0.55) {
      const hy = y - between(random, 16, 30);
      out += `<g opacity="0.88">
        <line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x.toFixed(1)}" y2="${hy.toFixed(1)}"
          stroke="#2f4a2a" stroke-width="2" opacity="0.7" />
        <ellipse cx="${x.toFixed(1)}" cy="${hy.toFixed(1)}" rx="6" ry="9" fill="#f6b8c8" />
        <ellipse cx="${(x - 4).toFixed(1)}" cy="${(hy + 2).toFixed(1)}" rx="5" ry="8" fill="#eda3b6" />
      </g>`;
    }
  }
  return `<g>${out}</g>`;
}

/**
 * Biển: đường chân trời phẳng và mấy vệt sóng.
 *
 * @param {() => number} random Hàm ngẫu nhiên
 * @param {number} W Chiều rộng hệ toạ độ
 * @returns {string} Chuỗi SVG
 */
export function sea(random, W) {
  let song = '';

  for (let i = 0; i < Math.max(10, Math.round(W / 34)); i += 1) {
    const x = between(random, 0, W);
    const y = between(random, 474, 596);
    const w = between(random, 16, 52) * (y - 460) / 90;

    song += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(8, w).toFixed(1)}"
      height="2" rx="1" fill="#fff" opacity="${(0.05 + (y - 470) / 1400).toFixed(3)}" />`;
  }

  return `
    <g class="art-water">
      <rect x="0" y="466" width="${W}" height="${ART_HEIGHT - 466}" fill="#000" opacity="0.2" />
      <rect x="0" y="466" width="${W}" height="${ART_HEIGHT - 466}" fill="var(--accent)" opacity="0.06" />
      ${song}
    </g>`;
}

/**
 * Ruộng bậc thang xếp lớp.
 *
 * @param {number} W Chiều rộng hệ toạ độ
 * @returns {string} Chuỗi SVG
 */
export function terraces(W) {
  let out = '';

  for (let i = 0; i < 6; i += 1) {
    const y = 470 + i * 24;
    const lech = (i % 2 === 0 ? 1 : -1) * W * 0.04;

    out += `<path d="M0 ${y + 14} Q${(W / 2 + lech).toFixed(1)} ${y - 10} ${W} ${y + 14}
      L${W} ${y + 30} Q${(W / 2 + lech).toFixed(1)} ${y + 6} 0 ${y + 30} Z"
      fill="#000" opacity="${(0.16 + i * 0.045).toFixed(3)}" />`;
  }
  return `<g>${out}</g>`;
}

/**
 * Vài cánh chim ở xa, chỉ là mấy nét chữ V.
 *
 * @param {() => number} random Hàm ngẫu nhiên
 * @param {number} W Chiều rộng hệ toạ độ
 * @returns {string} Chuỗi SVG
 */
export function birds(random, W) {
  let out = '';

  for (let i = 0; i < 6; i += 1) {
    const x = between(random, W * 0.1, W * 0.9);
    const y = between(random, 110, 290);
    const s = between(random, 5, 11);

    out += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} q${(s / 2).toFixed(1)} ${(-s / 2).toFixed(1)} ${s.toFixed(1)} 0
      M${(x + s).toFixed(1)} ${y.toFixed(1)} q${(s / 2).toFixed(1)} ${(-s / 2).toFixed(1)} ${s.toFixed(1)} 0"
      stroke="#000" stroke-width="1.6" fill="none" opacity="0.34" stroke-linecap="round" />`;
  }
  return `<g>${out}</g>`;
}
