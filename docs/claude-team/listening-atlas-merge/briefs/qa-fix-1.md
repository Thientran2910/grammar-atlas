# Brief qa-fix-1 — Audio Listening phát từ site gốc của user
Bạn là Implementer trong team claude-team. Sửa lỗi AC-2.2 trong /Users/thientv/Workspace/grammar-atlas/docs/claude-team/listening-atlas-merge/08-qa.md mục Lỗi phát hiện, theo quyết định của Tech Lead dưới đây (KHÔNG theo hướng sửa "meta no-referrer" mà QA gợi ý — elllo.org cố ý chặn hotlink, không được lách).
- Worktree: thư mục hiện tại của bạn.
- File được sửa (chỉ các file này): listening/app.js, tests/listening.test.mjs, tests/fixtures/listening.json, README.md
- Quyết định: mọi bài phát audio từ site gốc của user. Đổi patch (2) của app.js trong fixture và trong file:
  - original: `src="${u.audio}"`
  - patched: `src="${'https://listening-atlas-thien.thientran2910.chatgpt.site/'+u.audio}"`
  (bỏ hẳn điều kiện audioSource/.mp3 cũ). Đảo patch vẫn phải ra sha gốc 82188caf….
- Test `tests/listening.test.mjs`: thay các kiểm audioSource bằng: app.js chứa đúng chuỗi patched; mọi bài trong AUDIO có `u.audio` khớp `^audio/[a-z0-9-]+\.mp3$`; vẫn kiểm không có file .mp3 trong listening/; KHÔNG thêm meta referrer (kiểm `listening/index.html` không chứa `name="referrer"`).
- README.md: sửa đoạn về audio: audio phát từ bản gốc `https://listening-atlas-thien.thientran2910.chatgpt.site/audio/` (site gốc phải còn chạy); elllo.org chặn hotlink nên không phát trực tiếp từ ELLLO; repo không chứa mp3; nếu muốn site độc lập hoàn toàn thì có thể tự host 16 file mp3 (cân nhắc điều khoản phi thương mại của ELLLO). Bỏ mọi câu nói audio phát từ elllo.org / trường hợp riêng black-friday. Lệnh test README trong plan Task 4 vẫn phải pass.
- TDD: sửa test trước (FAIL), rồi sửa app.js + fixture (PASS).
- Lệnh test: node --test tests/listening.test.mjs (và lệnh test README ở mục Task 4 của 05-plan.md). Không chạy toàn bộ test suite.
- Commit: "fix(listening-atlas-merge): <mô tả>", dòng cuối "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>".
- Không push, không merge, không đổi branch, không sửa ngoài worktree. Không in nội dung transcript.
- Trước khi báo xong: git status sạch. Ghi /Users/thientv/Workspace/grammar-atlas/docs/claude-team/listening-atlas-merge/reports/qa-fix-1.md (≤ 15 dòng).
