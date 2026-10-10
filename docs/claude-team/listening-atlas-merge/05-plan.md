# 05 — Plan: listening-atlas-merge

**Goal:** Gộp bản sao Listening Atlas vào repo, chuyển Grammar Atlas vào `grammar/`, thêm hub "English Atlas" ở gốc.
**Spec:** `01-grill.md` (AC-1.1 … AC-6.1), ADR `docs/adr/0001-multi-skill-static-modules.md`, `GLOSSARY.md`.
**Tech:** site tĩnh HTML/CSS/JS thuần, không build, test bằng `node --test` (built-in, không thêm dependency).

## Track
M: khoảng 30 file nhưng phần lớn là sao chép nguyên văn; code tự viết khoảng 400 dòng (hub + 3 file test + README); 1 màn hình mới (hub); không đổi schema/API; không có vùng rủi ro. Vượt S (có màn hình mới, > 3 file nguồn).

## Backend
orca (runtime ready, có orchestration, repo đã đăng ký).

## Quy ước chung cho mọi task
- Nguồn bản gốc Listening Atlas đã tải sẵn: `SRC=/private/tmp/claude-501/-Users-thientv-Workspace-grammar-atlas/0f81fbc4-9346-4950-8168-90ee7c4e7f56/scratchpad/la` (gồm `style.css listening.css audio-data.js content.js app.js`; thư mục `audio/` ở đó **không** được copy) và `SRC/../index.clean.html` (index.html gốc đã bỏ script Cloudflare). Không đọc được → tải lại từ `https://listening-atlas-thien.thientran2910.chatgpt.site/<file>` (dùng `curl -sL -A "Mozilla/5.0"`), rồi bỏ đoạn `<script>(function(){function c()…})();</script>` ngay trước `</body>` của index.html.
- Định dạng fixture `tests/fixtures/<module>.json`:
  ```json
  { "files": { "<đường dẫn trong module>": "<sha256 của bản gốc>" },
    "patches": { "<đường dẫn>": [ { "original": "<chuỗi bản gốc>", "patched": "<chuỗi trong repo>" } ] } }
  ```
  Test cho mỗi file: nếu có patches thì với từng patch, `patched` phải xuất hiện đúng 1 lần trong file → thay bằng `original`; sau đó sha256 (utf8 cho text đã đảo ngược, byte nguyên cho file không có patch) phải bằng `files[path]`.
- Commit: `feat(listening-atlas-merge): <mô tả>` (hoặc `test(...)`, `docs(...)`), dòng cuối `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Không chạy toàn bộ test suite; chỉ chạy lệnh test của task.

## Task 1 — Chuyển Grammar Atlas vào `grammar/`
**Files:** `grammar/index.html`, `grammar/style.css`, `grammar/tests.css`, `grammar/content.js`, `grammar/quiz-bank.js`, `grammar/topic-tests.js`, `grammar/app.js` (chuyển bằng `git mv` từ gốc), `tests/grammar.test.mjs`, `tests/fixtures/grammar.json`, xoá `tests/clone.test.mjs`, `tests/fixtures/checksums.json`. **Không** đụng `index.html` mới ở gốc (Task 3 tạo), `.nojekyll`, `README.md`.
**Test:** `node --test tests/grammar.test.mjs`

1. Viết `tests/fixtures/grammar.json`: `files` = nguyên nội dung `tests/fixtures/checksums.json` hiện tại (7 file). `patches["index.html"]` = một patch:
   - original: `Về CEFR ↗</a></div></footer>`
   - patched: `Về CEFR ↗</a><a href="../listening/">Listening Atlas ↗</a><a href="../">English Atlas ↗</a></div></footer>`
2. Viết `tests/grammar.test.mjs` (theo mẫu `tests/clone.test.mjs` hiện có, gốc module = `grammar/`): kiểm sha theo quy ước đảo patch; `grammar/index.html` không chứa `cdn-cgi`; mọi `src`/`href` nội bộ (không `#`, không `:`) trong `grammar/index.html` trỏ tới file/thư mục có thật tính từ `grammar/` (`../listening/` được chấp nhận nếu thư mục chưa có — chỉ kiểm khi tồn tại; `../` luôn tồn tại); có `.nojekyll` ở gốc repo. Chạy → FAIL (chưa có `grammar/`).
3. `git mv index.html style.css tests.css content.js quiz-bank.js topic-tests.js app.js grammar/`; sửa footer `grammar/index.html` đúng patch ở bước 1; `git rm tests/clone.test.mjs tests/fixtures/checksums.json`. Chạy → PASS. Commit.

## Task 2 — Sao Listening Atlas vào `listening/`
**Files:** `listening/index.html`, `listening/style.css`, `listening/listening.css`, `listening/audio-data.js`, `listening/content.js`, `listening/app.js`, `tests/listening.test.mjs`, `tests/fixtures/listening.json`.
**Test:** `node --test tests/listening.test.mjs`

1. Viết `tests/fixtures/listening.json`. `files` (sha256 bản gốc; index.html là bản đã bỏ script Cloudflare):
   ```
   index.html 9040f9eb2c68cf37666dbe28a79b06ad603676f0ee3f2aefe47a324b26a407f0
   style.css 903630cd10523aae770e02a1bff09a17b94b1ee908ae50d17b849951ed46dedf
   listening.css d4f0e51106648972bead7d6f6586ddcfa5b6eac5adb2ebc390ccdfc503efc133
   audio-data.js 5e9170f9fb2970eb84fe23dabd3a15a628fde8a743698ec9ad66e1d3bbd123df
   content.js 5e6caa8d1c0e5a5e3279aa8b77bcbb01e1a31d8b6e03fd8f4bf2b4e3bdad5965
   app.js 82188cafa8bdc08522e3ed9ce1999c98433590dab4367cb0b7816fdf7d5b2a33
   ```
   `patches`:
   - `index.html`: original `<a href="https://grammar-atlas-thien.thientran2910.chatgpt.site" target="_blank" rel="noopener">Grammar Atlas ↗</a></div></footer>` → patched `<a href="../grammar/">Grammar Atlas ↗</a><a href="../">English Atlas ↗</a></div></footer>`
   - `app.js`: (1) original `href="https://grammar-atlas-thien.thientran2910.chatgpt.site#/` → patched `href="../grammar/#/`; (2) original `src="${u.audio}"` → patched `src="${u.audioSource}"` (phát audio từ URL gốc ELLLO, không commit mp3)
2. Viết `tests/listening.test.mjs` (cùng cấu trúc với test grammar, gốc module = `listening/`): kiểm sha theo quy ước đảo patch; `listening/index.html` không chứa `cdn-cgi`; `listening/app.js` không còn chuỗi `chatgpt.site`; mọi `src`/`href` nội bộ của `listening/index.html` tồn tại (bỏ qua `../grammar/` nếu chưa có thư mục); mọi bài trong `listening/audio-data.js` có `audioSource` bắt đầu bằng `https://elllo.org/` và kết thúc `.mp3` (đọc bằng `vm.runInNewContext(src + ';AUDIO')`); không có file `.mp3` nào trong `listening/`. Chạy → FAIL.
3. Copy file từ `SRC` (index.html lấy từ `SRC/../index.clean.html`) vào `listening/`, áp 2 patch. Chạy → PASS. Commit.

## Task 3 — Hub "English Atlas" ở gốc
**Files:** `index.html` (gốc, tạo mới), `assets/style.css`, `assets/hub.css`, `assets/hub.js`, `tests/hub.test.mjs`.
**Test:** `node --test tests/hub.test.mjs`
**Phụ thuộc:** đợt 2 (sau Task 1, vì Task 1 chuyển `index.html` cũ đi).

Interface `assets/hub.js` (một file, chạy được cả trình duyệt lẫn Node):
```js
// Trình duyệt: gắn window.Hub; Node: module.exports (test dùng createRequire)
legacyTarget(hash) -> string|null   // '#/b1' -> 'grammar/#/b1'; '#/b2/wish' -> 'grammar/#/b2/wish'; '' | '#' | '#main' | null -> null
progressText(moduleId, storage) -> string|null
//  'grammar': đọc storage.getItem('grammar-atlas-v1'); hợp lệ khi value.read là mảng; trả 'Đã ôn N chủ đề' (N>0), còn lại null
//  'listening': đọc 'listening-atlas-v1'; hợp lệ khi value.results là object; trả 'Đã làm N bài nghe' (N>0), còn lại null
//  JSON hỏng / storage ném lỗi / moduleId lạ -> null (không ném)
```
Khi chạy trong trình duyệt: ngay khi tải (script đặt trong `<head>`, không `defer`) gọi `legacyTarget(location.hash)`, có kết quả → `location.replace(target)`. Sau `DOMContentLoaded`: với mỗi phần tử `[data-progress="<moduleId>"]`, gán text = `progressText(id, localStorage)` và bỏ `hidden` nếu khác null (bọc try/catch).

Giao diện (khớp ngôn ngữ thiết kế hai module; gọi skill `frontend-design` để hoàn thiện chi tiết, nhưng không đổi token/brand):
- `assets/style.css` = bản copy y nguyên `grammar/style.css` (để dùng chung token, header, footer, `.hero`, `.primary`, `.secondary`, `.eyebrow`...). Nếu Task 1 chưa merge khi bắt đầu thì copy từ `style.css` ở gốc của base.
- `index.html`: `lang="vi"`, title `English Atlas · Luyện tiếng Anh B1 đến B2+`, meta description, `theme-color #244b42`, link `assets/style.css` + `assets/hub.css`, `<script src="assets/hub.js"></script>` trong head. Skip-link "Đến nội dung". Header giống module: brandmark `e<span>·</span>`, chữ `english<span class="brand-sub">ATLAS</span>`, nav có link "Ngữ pháp" (`grammar/`) và "Nghe" (`listening/`).
- Hero: eyebrow "B1 đến B2+ · Giải thích bằng tiếng Việt"; h1 serif kiểu module: `Luyện tiếng Anh <em>từng kỹ năng</em>, chung một lộ trình.`; đoạn mô tả ngắn; nút `.primary` "Bắt đầu với Ngữ pháp" (`grammar/`) và `.secondary` "Luyện nghe" (`listening/`).
- Lưới thẻ kỹ năng (`<section aria-labelledby>` với h2 "Chọn kỹ năng"): thẻ **Ngữ pháp** (`<a href="grammar/">`: mô tả, mục "So sánh thì · Trắc nghiệm · Bài test chủ đề", `<span data-progress="grammar" hidden>`), thẻ **Nghe** (`<a href="listening/">`: "16 bài thu thật · giọng Anh/Mỹ · dictation, shadowing", `<span data-progress="listening" hidden>`), thẻ **Đọc**, **Từ vựng**, **Viết** là `<article aria-disabled="true">` có nhãn "Sắp có", không phải link.
- Footer giống module: "English Atlas" + tagline "Một kỹ năng mỗi ngày. Tiến bộ mỗi tuần."; đoạn ghi nguồn: Grammar Atlas do website biên soạn; bản thu Listening Atlas từ ELLLO / Todd Beuckens, dùng cho tự học phi thương mại; link "Grammar Atlas ↗", "Listening Atlas ↗".
- Responsive: ≤ 760px thẻ một cột, header/hero không tràn ngang ở 375px. Có trạng thái `:hover`/`:focus-visible` cho thẻ link.

Bước TDD:
1. Viết `tests/hub.test.mjs`: test `legacyTarget` (các ca ở interface), `progressText` (hợp lệ, N=0 → null, JSON hỏng, storage ném lỗi, module lạ) bằng storage giả `{getItem}`; kiểm tĩnh `index.html`: mọi `src`/`href` nội bộ tồn tại, có `href="grammar/"` và `href="listening/"`, ba thẻ "Sắp có" không nằm trong `<a`, không có `cdn-cgi`; `assets/style.css` giống byte `grammar/style.css`. Chạy → FAIL.
2. Viết `assets/hub.js` → test logic PASS. Commit.
3. Viết `index.html`, `assets/style.css`, `assets/hub.css` → toàn bộ `tests/hub.test.mjs` PASS. Commit.

## Task 4 — README
**Files:** `README.md`
**Test:** `node -e "const s=require('fs').readFileSync('README.md','utf8');for(const k of ['grammar/','listening/','index.html','Thêm kỹ năng mới','node --test tests/'])if(!s.includes(k))throw new Error('thiếu '+k)"`
**Phụ thuộc:** đợt 2.

1. Viết lại `README.md` (tiếng Việt): tên "English Atlas", mô tả; link bản gốc hai module và GitHub Pages `https://thientran2910.github.io/grammar-atlas/` (hub), `/grammar/`, `/listening/`; bảng bố cục (`index.html` + `assets/` = hub; `grammar/` Grammar Atlas; `listening/` Listening Atlas; `tests/`; `docs/adr/`); mục "Thêm kỹ năng mới" (tạo thư mục `<skill>/` tự đủ, khoá localStorage `<skill>-atlas-v1`, dẫn ngược `../`, thêm thẻ trong `index.html` và nhánh trong `progressText` của `assets/hub.js`, thêm test `tests/<skill>.test.mjs`); chạy local `python3 -m http.server 8000`; kiểm thử `node --test tests/` cùng giải thích fixtures/patches; ghi nguồn ELLLO (phi thương mại). Chạy lệnh test. Commit.

## Bảng chia đợt
| Đợt | Task | Repo | File được sửa |
|---|---|---|---|
| 1 | t1 | main | grammar/*, tests/grammar.test.mjs, tests/fixtures/grammar.json, tests/clone.test.mjs, tests/fixtures/checksums.json, index.html, style.css, tests.css, content.js, quiz-bank.js, topic-tests.js, app.js |
| 1 | t2 | main | listening/**, tests/listening.test.mjs, tests/fixtures/listening.json |
| 2 | t3 | main | index.html, assets/style.css, assets/hub.css, assets/hub.js, tests/hub.test.mjs |
| 2 | t4 | main | README.md |

## Test tích hợp theo đợt
- Đợt 1: `node --test tests/grammar.test.mjs tests/listening.test.mjs`
- Đợt 2: `node --test tests/grammar.test.mjs tests/listening.test.mjs tests/hub.test.mjs` + kiểm Playwright trên `python3 -m http.server` (AC-1.x, 2.2, 2.3, 3.2, 4.1).

Không chạy toàn bộ test suite.

## Sau Verify
Push `team/listening-atlas-merge` lên `origin`, mở PR vào `main` (không merge) — AC-6.1.
