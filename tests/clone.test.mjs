import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sums = JSON.parse(readFileSync(join(root, 'tests/fixtures/checksums.json'), 'utf8'));
const sha = f => createHash('sha256').update(readFileSync(join(root, f))).digest('hex');

for (const [file, expected] of Object.entries(sums)) {
  test(`${file} khớp bản gốc`, () => {
    assert.ok(existsSync(join(root, file)), `thiếu ${file}`);
    assert.equal(sha(file), expected);
  });
}

test('index.html không còn script Cloudflare của hosting', () => {
  assert.doesNotMatch(readFileSync(join(root, 'index.html'), 'utf8'), /cdn-cgi/);
});

test('mọi tài nguyên nội bộ trong index.html đều tồn tại', () => {
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  const refs = [...html.matchAll(/(?:src|href)="([^"#:]+)"/g)].map(m => m[1]);
  assert.ok(refs.length >= 6);
  for (const r of refs) assert.ok(existsSync(join(root, r)), `thiếu ${r}`);
});

test('có .nojekyll cho GitHub Pages', () => {
  assert.ok(existsSync(join(root, '.nojekyll')));
});
