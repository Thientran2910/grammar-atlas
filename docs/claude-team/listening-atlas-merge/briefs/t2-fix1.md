# Brief t2-fix1 — Sao Listening Atlas vào listening/ (vòng sửa 1)
Bạn là Implementer trong team claude-team. Sửa Task 2 trong /Users/thientv/Workspace/grammar-atlas/docs/claude-team/listening-atlas-merge/05-plan.md theo quyết định mới của Tech Lead dưới đây (report trước của bạn: reports/t2.md).
- Worktree: thư mục hiện tại của bạn.
- File được sửa (chỉ các file này): listening/app.js, tests/listening.test.mjs, tests/fixtures/listening.json
- Quyết định mới: bài `black-friday` có audioSource là file .zip, ELLLO không host mp3 trực tiếp. Đổi patch (2) của app.js:
  - original: `src="${u.audio}"`
  - patched: `src="${/\.mp3$/.test(u.audioSource)?u.audioSource:'https://listening-atlas-thien.thientran2910.chatgpt.site/'+u.audio}"`
  Cập nhật `tests/fixtures/listening.json` (patches app.js) và áp vào `listening/app.js` (đảo patch vẫn phải ra đúng sha gốc 82188caf…).
- Sửa test `tests/listening.test.mjs`:
  - Bỏ kiểm "app.js không còn chuỗi chatgpt.site"; thay bằng: `listening/app.js` và `listening/index.html` không còn `grammar-atlas-thien`.
  - Kiểm audio chặt lại (bỏ phần đã nới): với mỗi bài trong AUDIO, hoặc `audioSource` khớp `^https://.+\.mp3$`, hoặc (`audioSource` không kết thúc `.mp3` VÀ `u.audio` khớp `^audio/[a-z0-9-]+\.mp3$`). Thêm test: app.js chứa đúng chuỗi patched ở trên. Vẫn kiểm không có file .mp3 trong listening/.
- TDD: sửa test trước (FAIL), rồi sửa app.js + fixture (PASS).
- Lệnh test: node --test tests/listening.test.mjs. Không chạy toàn bộ test suite.
- Commit: "fix(listening-atlas-merge): <mô tả>", dòng cuối "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>".
- Không push, không merge, không đổi branch, không sửa ngoài worktree. Không in nội dung transcript ra output/report.
- Trước khi báo xong: git status sạch. Ghi /Users/thientv/Workspace/grammar-atlas/docs/claude-team/listening-atlas-merge/reports/t2-fix1.md (≤ 15 dòng): status, commits, tests, notes.
