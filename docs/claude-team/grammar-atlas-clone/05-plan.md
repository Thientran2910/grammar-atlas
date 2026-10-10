# 05 — Plan: grammar-atlas-clone

**Goal:** Bản sao giống hệt site Grammar Atlas, chạy trên GitHub Pages.
**Spec:** `01-grill.md` (AC-1.1 … AC-3.1).

## Track
S: 6 file tài nguyên được sao nguyên văn (không có code tự viết); code tự viết gồm 1 file test, README, `.nojekyll`. Không đổi schema/API, không có màn hình mới, không có vùng rủi ro.

## Backend
subagent (repo chưa đăng ký Orca; track S do Tech Lead code inline).

## Task 1 — Sao tài nguyên site + test đối chiếu
**Files:** `index.html`, `style.css`, `tests.css`, `content.js`, `quiz-bank.js`, `topic-tests.js`, `app.js`, `.nojekyll`, `README.md`, `tests/clone.test.mjs`, `tests/fixtures/checksums.json`
**Test:** `node --test tests/clone.test.mjs`

1. Viết `tests/fixtures/checksums.json` (sha256 của 6 file tải từ site gốc, cùng sha256 của index.html gốc sau khi bỏ script Cloudflare).
2. Viết `tests/clone.test.mjs`: kiểm sha256 từng file; `index.html` không chứa `cdn-cgi`; mọi `src`/`href` nội bộ trong index.html đều trỏ tới file có thật; có `.nojekyll`. Chạy → FAIL.
3. Copy 6 file và tạo index.html đã làm sạch. Chạy → PASS. Commit.
4. Thêm README (nguồn gốc, chạy local, link Pages). Commit.

## Bảng chia đợt
| Đợt | Task | Repo | File được sửa |
|---|---|---|---|
| 1 | t1 | main | các file ở Task 1 |

## Test tích hợp theo đợt
Đợt 1: `node --test tests/` + kiểm trên trình duyệt (Playwright) theo AC-2.x.

Không chạy toàn bộ test suite.

## Sau Build
Push lên `Thientran2910/grammar-atlas` (public), bật Pages ở `main` `/`, kiểm AC-3.1.
