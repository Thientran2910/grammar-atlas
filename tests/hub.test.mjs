import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { legacyTarget, progressText } = createRequire(import.meta.url)(join(root, 'assets/hub.js'));
const store = obj => ({ getItem: k => (k in obj ? obj[k] : null) });

test('legacyTarget chuyển hash cũ của Grammar Atlas', () => {
  assert.equal(legacyTarget('#/b1'), 'grammar/#/b1');
  assert.equal(legacyTarget('#/b2/wish'), 'grammar/#/b2/wish');
});

test('legacyTarget bỏ qua hash không phải route', () => {
  for (const h of ['', '#', '#main', null, undefined]) assert.equal(legacyTarget(h), null);
});

test('progressText grammar', () => {
  assert.equal(progressText('grammar', store({ 'grammar-atlas-v1': JSON.stringify({ read: ['a', 'b', 'c'] }) })), 'Đã ôn 3 chủ đề');
  assert.equal(progressText('grammar', store({ 'grammar-atlas-v1': JSON.stringify({ read: [] }) })), null);
  assert.equal(progressText('grammar', store({ 'grammar-atlas-v1': JSON.stringify({ read: 'x' }) })), null);
  assert.equal(progressText('grammar', store({})), null);
});

test('progressText listening', () => {
  assert.equal(progressText('listening', store({ 'listening-atlas-v1': JSON.stringify({ results: { a: 1, b: 2 } }) })), 'Đã làm 2 bài nghe');
  assert.equal(progressText('listening', store({ 'listening-atlas-v1': JSON.stringify({ results: {} }) })), null);
  assert.equal(progressText('listening', store({ 'listening-atlas-v1': JSON.stringify({ results: [] }) })), null);
});

test('progressText chịu lỗi', () => {
  assert.equal(progressText('grammar', store({ 'grammar-atlas-v1': '{hỏng' })), null);
  assert.equal(progressText('grammar', { getItem() { throw new Error('denied'); } }), null);
  assert.equal(progressText('lạ', store({})), null);
});

const html = readFileSync(join(root, 'index.html'), 'utf8');

test('index.html: không cdn-cgi, link nội bộ tồn tại', () => {
  assert.ok(!html.includes('cdn-cgi'));
  for (const [, u] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (u.startsWith('#') || u.includes(':')) continue;
    assert.ok(existsSync(join(root, u.split('#')[0])), `thiếu ${u}`);
  }
  assert.ok(html.includes('href="grammar/"'));
  assert.ok(html.includes('href="listening/"'));
});

test('index.html: thẻ "Sắp có" không phải link', () => {
  const cards = [...html.matchAll(/<article aria-disabled="true"[\s\S]*?<\/article>/g)];
  assert.equal(cards.length, 3);
  for (const [c] of cards) assert.ok(c.includes('Sắp có') && !c.includes('<a '));
});

test('assets/style.css giống byte grammar/style.css', () => {
  assert.ok(readFileSync(join(root, 'assets/style.css')).equals(readFileSync(join(root, 'grammar/style.css'))));
});
