import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const mod = join(root, 'grammar');
const { files, patches = {} } = JSON.parse(readFileSync(join(root, 'tests/fixtures/grammar.json'), 'utf8'));
const sha = buf => createHash('sha256').update(buf).digest('hex');

function original(file) {
  const p = join(mod, file);
  assert.ok(existsSync(p), `thiếu grammar/${file}`);
  const list = patches[file];
  if (!list) return readFileSync(p);
  let text = readFileSync(p, 'utf8');
  for (const { original: o, patched } of list) {
    assert.equal(text.split(patched).length - 1, 1, `patch phải xuất hiện đúng 1 lần trong ${file}`);
    text = text.replace(patched, () => o);
  }
  return Buffer.from(text, 'utf8');
}

for (const [file, expected] of Object.entries(files)) {
  test(`grammar/${file} khớp bản gốc`, () => {
    assert.equal(sha(original(file)), expected);
  });
}

test('grammar/index.html không còn script Cloudflare của hosting', () => {
  assert.doesNotMatch(readFileSync(join(mod, 'index.html'), 'utf8'), /cdn-cgi/);
});

test('mọi tài nguyên nội bộ trong grammar/index.html đều tồn tại', () => {
  const html = readFileSync(join(mod, 'index.html'), 'utf8');
  const refs = [...html.matchAll(/(?:src|href)="([^"#:]+)"/g)].map(m => m[1]);
  assert.ok(refs.length >= 6);
  for (const r of refs) {
    if (r === '../listening/' && !existsSync(join(root, 'listening'))) continue;
    assert.ok(existsSync(join(mod, r)), `thiếu ${r}`);
  }
});

test('có .nojekyll cho GitHub Pages', () => {
  assert.ok(existsSync(join(root, '.nojekyll')));
});
