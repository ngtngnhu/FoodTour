import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getRatingTheme,
  formatVND,
  filterRestaurants,
  searchDishesAcrossAllMenus,
  getPriceRange,
  generateMenuCaption
} from './restaurantUtils';
import { Restaurant, FilterState } from '../types/restaurant';

const mockRestaurants: Restaurant[] = [
  {
    id: 'res-1',
    name: 'Phở Bò Hà Nội',
    rating: 'tot',
    reasons: ['Nước dùng đậm đà', 'Thịt bò tươi mềm'],
    tags: ['Quán ăn', 'Món nước'],
    address: '123 Phố Huế, Hà Nội',
    link: 'https://maps.google.com/?q=Pho+Bo+Ha+Noi',
    menu: [
      { id: 'm1', name: 'Phở tái lăn', price: 65000, isSpecial: true },
      { id: 'm2', name: 'Quẩy giòn', price: 10000 }
    ],
    photos: [{ id: 'p1', url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600' }],
    createdAt: '2026-10-20T10:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z'
  },
  {
    id: 'res-2',
    name: 'Trà Sữa Matcha Zen',
    rating: 'binh_thuong',
    reasons: ['Vị trà hơi ngọt', 'Chỗ ngồi nhỏ'],
    tags: ['Quán nước', 'Trà sữa'],
    address: '45 Nguyễn Trãi, Q.1',
    link: 'https://maps.google.com/?q=Matcha+Zen',
    menu: [
      { id: 'm3', name: 'Trà sữa trân châu', price: 45000 },
      { id: 'm4', name: 'Matcha đá xay', price: 55000 }
    ],
    photos: [],
    createdAt: '2026-10-22T10:00:00.000Z',
    updatedAt: '2026-10-22T10:00:00.000Z'
  },
  {
    id: 'res-3',
    name: 'Quán Ốc Đêm Cay',
    rating: 'te',
    reasons: ['Ốc không tươi', 'Phục vụ rất chậm'],
    tags: ['Quán ăn', 'Ăn vặt', 'Vỉa hè'],
    address: '78 Vĩnh Khánh, Q.4',
    menu: [
      { id: 'm5', name: 'Ốc hương xào bơ tỏi', price: 120000 },
      { id: 'm6', name: 'Càng ghẹ rang muối', price: 140000 }
    ],
    photos: [],
    createdAt: '2026-10-25T10:00:00.000Z',
    updatedAt: '2026-10-25T10:00:00.000Z'
  }
];

test('getRatingTheme assigns correct colors for all 3 levels', () => {
  const totTheme = getRatingTheme('tot');
  assert.equal(totTheme.label, 'Tốt');
  assert.match(totTheme.borderColor, /border-emerald-500/);

  const btTheme = getRatingTheme('binh_thuong');
  assert.equal(btTheme.label, 'Bình thường');
  assert.match(btTheme.borderColor, /border-amber-400/);

  const teTheme = getRatingTheme('te');
  assert.equal(teTheme.label, 'Tệ');
  assert.match(teTheme.borderColor, /border-slate-400/);
});

test('formatVND formats Vietnamese currency strings properly', () => {
  assert.equal(formatVND(50000), '50.000 ₫');
  assert.equal(formatVND(0), '0 ₫');
});

test('filterRestaurants filters by rating', () => {
  const filterTot: FilterState = {
    searchQuery: '',
    rating: 'tot',
    tag: 'all',
    searchMode: 'all',
    sortBy: 'newest'
  };
  const totResults = filterRestaurants(mockRestaurants, filterTot);
  assert.equal(totResults.length, 1);
  assert.equal(totResults[0].id, 'res-1');

  const filterTe: FilterState = { ...filterTot, rating: 'te' };
  const teResults = filterRestaurants(mockRestaurants, filterTe);
  assert.equal(teResults.length, 1);
  assert.equal(teResults[0].id, 'res-3');
});

test('filterRestaurants filters by tag', () => {
  const filterTag: FilterState = {
    searchQuery: '',
    rating: 'all',
    tag: 'Quán nước',
    searchMode: 'all',
    sortBy: 'newest'
  };
  const results = filterRestaurants(mockRestaurants, filterTag);
  assert.equal(results.length, 1);
  assert.equal(results[0].name, 'Trà Sữa Matcha Zen');
});

test('filterRestaurants searches dishes in menu when searchMode is dish', () => {
  const filterDish: FilterState = {
    searchQuery: 'tái lăn',
    rating: 'all',
    tag: 'all',
    searchMode: 'dish',
    sortBy: 'newest'
  };
  const results = filterRestaurants(mockRestaurants, filterDish);
  assert.equal(results.length, 1);
  assert.equal(results[0].name, 'Phở Bò Hà Nội');
});

test('searchDishesAcrossAllMenus finds matching menu items across all restaurants', () => {
  const dishResults = searchDishesAcrossAllMenus(mockRestaurants, 'trà sữa');
  assert.equal(dishResults.length, 1);
  assert.equal(dishResults[0].dish.name, 'Trà sữa trân châu');
  assert.equal(dishResults[0].restaurant.name, 'Trà Sữa Matcha Zen');

  const allDishes = searchDishesAcrossAllMenus(mockRestaurants, '');
  assert.equal(allDishes.length, 6);
});

test('getPriceRange calculates min, max, average price', () => {
  const range = getPriceRange(mockRestaurants[0].menu);
  assert.equal(range.min, 10000);
  assert.equal(range.max, 65000);
  assert.equal(range.average, 37500);
});

test('generateMenuCaption creates formatted review article post', () => {
  const caption = generateMenuCaption(mockRestaurants[0]);
  assert.match(caption, /\[REVIEW THỰC ĐƠN\] PHỞ BÒ HÀ NỘI/);
  assert.match(caption, /THỰC ĐƠN CHI TIẾT & GIÁ CẢ/);
  assert.match(caption, /Phở tái lăn \(65\.000 ₫\)/);
  assert.match(caption, /LÝ DO ĐÁNH GIÁ/);
  assert.match(caption, /#Quánăn/);
});
