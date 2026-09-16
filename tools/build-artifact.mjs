/**
 * Dựng bản trang dùng để đăng lên dạng Artifact.
 *
 * Nơi đăng tự bọc sẵn khung <!doctype html><head></head><body>, nên bản này
 * chỉ chứa phần ruột: thẻ title, mấy thẻ link, rồi toàn bộ nội dung trong body.
 *
 * Nguồn vẫn là index.html, ở đây chỉ bóc khung ngoài ra chứ không chép tay lại,
 * để hai bản không bao giờ lệch nhau.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const NGUON = resolve(ROOT, 'index.html');
const DICH = resolve(ROOT, 'dist/artifact.html');

/**
 * Lấy phần nằm giữa hai thẻ.
 *
 * @param {string} html Chuỗi HTML
 * @param {string} tag Tên thẻ
 * @returns {string}
 */
function ruotThe(html, tag) {
  const mo = html.match(new RegExp(`<${tag}[^>]*>`, 'i'));
  const dong = html.toLowerCase().lastIndexOf(`</${tag}>`);

  if (!mo || dong < 0) {
    throw new Error(`index.html thiếu thẻ ${tag}`);
  }
  return html.slice(mo.index + mo[0].length, dong);
}

const html = await readFile(NGUON, 'utf8');

// Giữ lại title và các thẻ link; bỏ meta vì khung bọc ngoài đã có sẵn.
const head = ruotThe(html, 'head')
  .split('\n')
  .filter((dong) => !/^\s*<meta\b/i.test(dong))
  .join('\n')
  .trim();

const body = ruotThe(html, 'body').trim();

// Các thuộc tính trên thẻ <body> của index.html là màu dự phòng cho lần vẽ đầu.
// Khung bọc ngoài tự dựng thẻ body nên phải gắn lại bằng script, nếu không sẽ
// thấy loé một màu lạ trước khi main.js kịp chạy.
const thuocTinhBody = html.match(/<body([^>]*)>/i)?.[1] ?? '';
const capThuocTinh = [...thuocTinhBody.matchAll(/data-([\w-]+)="([^"]*)"/g)]
  .map(([, ten, giaTri]) => `  document.body.setAttribute('data-${ten}', '${giaTri}');`)
  .join('\n');

const ketQua = `${head}

<script>
  // Màu dự phòng cho lần vẽ đầu tiên, trước khi main.js kịp chạy.
${capThuocTinh}
</script>

${body}
`;

await mkdir(dirname(DICH), { recursive: true });
await writeFile(DICH, ketQua, 'utf8');

console.log(`Da dung: ${DICH}`);
console.log(`Kich thuoc: ${(ketQua.length / 1024).toFixed(1)} KB`);
