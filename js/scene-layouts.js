/**
 * Bố cục cảnh nền, đổi theo TUẦN.
 *
 * Mỗi mùa có năm bố cục. Cứ sang tuần mới thì đổi sang bố cục kế tiếp, nên
 * suốt một mùa em không phải nhìn đi nhìn lại một khung hình. Trong cùng một
 * tuần thì bố cục giữ nguyên, chỉ có ánh sáng đổi theo buổi trong ngày.
 *
 * Mỗi bố cục cũng kèm sẵn kiểu hạt rơi cho hợp cảnh.
 */

import {
  bareTrees,
  birds,
  citySkyline,
  fieldRows,
  fogBank,
  hills,
  lotusPond,
  pineTrees,
  sea,
  streetLamps,
  terraces,
  warmHouse,
  water,
} from './scene-art.js?v=009849fb';

/**
 * Danh sách bố cục theo mùa.
 *
 * `hat` là kiểu hạt rơi, tra trong PRESETS của particles.js.
 */
export const LAYOUTS = {
  thu: [
    {
      ten: 'doi-heo-may',
      hat: 'la',
      ve: (W, r) => hills(W, [0.18, 0.3, 0.46]) + bareTrees(r, W) + birds(r, W),
    },
    {
      ten: 'ho-thu',
      hat: 'la',
      ve: (W, r) => hills(W, [0.16, 0.26, 0.4]) + water(W) + bareTrees(r, W),
    },
    {
      ten: 'pho-com',
      hat: 'la',
      ve: (W, r) => hills(W, [0.1, 0.18, 0.28]) + citySkyline(r, W) + streetLamps(W),
    },
    {
      ten: 'canh-dong',
      hat: 'suong',
      ve: (W, r) => hills(W, [0.14, 0.24, 0.36]) + fieldRows(W) + birds(r, W),
    },
    {
      ten: 'sang-suong',
      hat: 'suong',
      ve: (W, r) => hills(W, [0.2, 0.32, 0.48]) + fogBank(W) + bareTrees(r, W),
    },
  ],

  dong: [
    {
      ten: 'rung-thong',
      hat: 'tuyet',
      ve: (W, r) => hills(W, [0.2, 0.32, 0.5]) + warmHouse(W) + pineTrees(r, W),
    },
    {
      ten: 'suong-som',
      hat: 'suong',
      ve: (W, r) => hills(W, [0.22, 0.34, 0.5]) + fogBank(W) + pineTrees(r, W),
    },
    {
      ten: 'pho-dem',
      hat: 'tuyet',
      ve: (W, r) => hills(W, [0.12, 0.2, 0.3]) + citySkyline(r, W) + streetLamps(W),
    },
    {
      ten: 'ho-mua-dong',
      hat: 'tuyet',
      ve: (W, r) => hills(W, [0.18, 0.3, 0.44]) + water(W) + bareTrees(r, W),
    },
    {
      ten: 'nui-xa',
      hat: 'suong',
      ve: (W, r) => hills(W, [0.24, 0.36, 0.52]) + fogBank(W) + warmHouse(W) + birds(r, W),
    },
  ],

  xuan: [
    {
      ten: 'mua-phun',
      hat: 'mua',
      ve: (W, r) => hills(W, [0.15, 0.26, 0.42]) + water(W) + bareTrees(r, W),
    },
    {
      ten: 'ruong-bac-thang',
      hat: 'mua',
      ve: (W, r) => hills(W, [0.14, 0.24, 0.34]) + terraces(W) + birds(r, W),
    },
    {
      ten: 'pho-mua',
      hat: 'mua',
      ve: (W, r) => hills(W, [0.1, 0.18, 0.28]) + citySkyline(r, W) + streetLamps(W),
    },
    {
      ten: 'doi-loc-non',
      hat: 'canh',
      ve: (W, r) => hills(W, [0.16, 0.28, 0.44]) + bareTrees(r, W) + birds(r, W),
    },
    {
      ten: 'sang-nom',
      hat: 'suong',
      ve: (W, r) => hills(W, [0.18, 0.3, 0.46]) + fogBank(W) + water(W),
    },
  ],

  ha: [
    {
      ten: 'bien',
      hat: 'nang',
      ve: (W, r) => hills(W, [0.12, 0.2, 0.3]) + sea(r, W) + birds(r, W),
    },
    {
      ten: 'dam-sen',
      hat: 'nang',
      ve: (W, r) => hills(W, [0.14, 0.24, 0.36]) + lotusPond(r, W),
    },
    {
      ten: 'pho-trua',
      hat: 'nang',
      ve: (W, r) => hills(W, [0.1, 0.18, 0.28]) + citySkyline(r, W) + streetLamps(W),
    },
    {
      ten: 'dong-lua',
      hat: 'nang',
      ve: (W, r) => hills(W, [0.14, 0.24, 0.36]) + fieldRows(W) + birds(r, W),
    },
    {
      ten: 'mua-rao',
      hat: 'mua',
      ve: (W, r) => hills(W, [0.18, 0.3, 0.44]) + water(W) + bareTrees(r, W),
    },
  ],
};

/** Số ngày trong một tuần - mốc để đổi bố cục. */
export const DAYS_PER_WEEK = 7;

/**
 * Chọn bố cục cho một tuần cụ thể.
 *
 * @param {string} season Mùa
 * @param {number} weekIndex Số thứ tự tuần
 * @returns {{ ten: string, hat: string, ve: Function }}
 */
export function pickLayout(season, weekIndex) {
  const danhSach = LAYOUTS[season] ?? LAYOUTS.thu;
  const i = ((weekIndex % danhSach.length) + danhSach.length) % danhSach.length;

  return danhSach[i];
}
