/**
 * Gắn dấu phiên bản vào mọi đường dẫn css và js.
 *
 * Vì sao cần: GitHub Pages trả về Cache-Control max-age=600, nghĩa là sau khi
 * đẩy bản mới, trình duyệt người xem vẫn dùng bản cũ trong máy tối đa 10 phút.
 * Gắn thêm ?v=<mã> vào sau đường dẫn thì địa chỉ đổi, trình duyệt buộc phải
 * tải lại - cập nhật có hiệu lực ngay lập tức.
 *
 * Mã phiên bản lấy từ chính nội dung các file, nên nội dung không đổi thì mã
 * cũng không đổi; chạy lại bao nhiêu lần cũng cho ra cùng kết quả.
 *
 * Chạy: npm run stamp
 */

import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

/** Độ dài mã phiên bản. Tám ký tự là quá đủ để phân biệt các bản. */
const HASH_LENGTH = 8;

/**
 * Bỏ dấu phiên bản cũ đi, để băm chỉ dựa trên nội dung thật.
 *
 * @param {string} text Nội dung file
 * @returns {string}
 */
function stripStamp(text) {
  return text.replaceAll(/\?v=[0-9a-f]{8}/g, '');
}

/**
 * Liệt kê file theo đuôi trong một thư mục.
 *
 * @param {string} dir Thư mục
 * @param {string} ext Đuôi file
 * @returns {Promise<string[]>} Đường dẫn tương đối so với gốc dự án
 */
async function listFiles(dir, ext) {
  const names = await readdir(join(ROOT, dir));
  return names.filter((n) => n.endsWith(ext)).map((n) => `${dir}/${n}`);
}

const cssFiles = await listFiles('css', '.css');
const jsFiles = await listFiles('js', '.js');

// Mã phiên bản tính từ nội dung của toàn bộ css và js gộp lại
const hasher = createHash('sha1');
for (const rel of [...cssFiles, ...jsFiles].sort()) {
  hasher.update(rel);
  hasher.update(stripStamp(await readFile(join(ROOT, rel), 'utf8')));
}
const version = hasher.digest('hex').slice(0, HASH_LENGTH);

let soFileSua = 0;

// Trong các file js: gắn dấu vào từng lệnh import
for (const rel of jsFiles) {
  const duongDan = join(ROOT, rel);
  const goc = await readFile(duongDan, 'utf8');
  const moi = stripStamp(goc).replaceAll(
    /(from '\.\/[\w-]+\.js)'/g,
    `$1?v=${version}'`,
  );

  if (moi !== goc) {
    await writeFile(duongDan, moi, 'utf8');
    soFileSua += 1;
  }
}

// Trong index.html: gắn dấu vào thẻ link và thẻ script
const htmlPath = join(ROOT, 'index.html');
const htmlGoc = await readFile(htmlPath, 'utf8');
const htmlMoi = stripStamp(htmlGoc).replaceAll(
  /((?:href|src)="(?:css|js)\/[\w-]+\.(?:css|js))"/g,
  `$1?v=${version}"`,
);

if (htmlMoi !== htmlGoc) {
  await writeFile(htmlPath, htmlMoi, 'utf8');
  soFileSua += 1;
}

console.log(`Ma phien ban: ${version}`);
console.log(`Da cap nhat : ${soFileSua} file`);
