import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const mod = join(root, 'listening');
const fx = JSON.parse(readFileSync(join(root, 'tests/fixtures/listening.json'), 'utf8'));
const sha = b => createHash('sha256').update(b).digest('hex');

function original(file) {
  const patches = fx.patches[file];
  if (!patches) return readFileSync(join(mod, file));
  let text = readFileSync(join(mod, file), 'utf8');
  for (const { original: o, patched: p } of patches) {
    assert.equal(text.split(p).length - 1, 1, `${file}: patch phải xuất hiện đúng 1 lần`);
    text = text.replace(p, () => o);
  }
  return Buffer.from(text, 'utf8');
}

for (const [file, expected] of Object.entries(fx.files)) {
  test(`listening/${file} khớp bản gốc (sau khi đảo patch)`, () => {
    assert.ok(existsSync(join(mod, file)), `thiếu listening/${file}`);
    assert.equal(sha(original(file)), expected);
  });
}

test('index.html không còn script Cloudflare của hosting', () => {
  assert.doesNotMatch(readFileSync(join(mod, 'index.html'), 'utf8'), /cdn-cgi/);
});

test('app.js và index.html không còn grammar-atlas-thien', () => {
  for (const f of ['app.js', 'index.html']) {
    assert.doesNotMatch(readFileSync(join(mod, f), 'utf8'), /grammar-atlas-thien/, f);
  }
});

test('app.js chứa đúng chuỗi patched của nguồn audio', () => {
  const patched = "src=\"${'https://listening-atlas-thien.thientran2910.chatgpt.site/'+u.audio}\"";
  assert.equal(readFileSync(join(mod, 'app.js'), 'utf8').split(patched).length - 1, 1);
});

test('mọi tài nguyên nội bộ trong index.html đều tồn tại', () => {
  const html = readFileSync(join(mod, 'index.html'), 'utf8');
  const refs = [...html.matchAll(/(?:src|href)="([^"#:]+)"/g)].map(m => m[1]);
  assert.ok(refs.length >= 5);
  for (const r of refs) {
    if (r === '../grammar/' && !existsSync(join(root, 'grammar'))) continue;
    assert.ok(existsSync(join(mod, r)), `thiếu ${r}`);
  }
});

test('mọi bài nghe có u.audio dạng audio/<slug>.mp3', () => {
  const src = readFileSync(join(mod, 'audio-data.js'), 'utf8');
  const audio = vm.runInNewContext(src + ';AUDIO');
  const items = Array.isArray(audio) ? audio : Object.values(audio);
  assert.ok(items.length > 0);
  for (const u of items) {
    assert.match(u.audio, /^audio\/[a-z0-9-]+\.mp3$/, u.id);
  }
});

test('index.html không thêm meta referrer', () => {
  assert.doesNotMatch(readFileSync(join(mod, 'index.html'), 'utf8'), /name="referrer"/);
});

test('không commit file mp3 trong listening/', () => {
  const walk = d => readdirSync(d, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(join(d, e.name)) : [e.name]);
  assert.deepEqual(walk(mod).filter(n => n.toLowerCase().endsWith('.mp3')), []);
});
