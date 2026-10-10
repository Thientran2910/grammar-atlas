# Report qa-fix-1 — Audio Listening phát từ site gốc
- Commit: b7c6b69 trên branch Thientran2910/listening-atlas-merge-w3-qa-fix-1 (không push/merge).
- listening/app.js + tests/fixtures/listening.json: patch (2) thành `src="${'https://listening-atlas-thien.thientran2910.chatgpt.site/'+u.audio}"`, bỏ điều kiện audioSource/.mp3.
- tests/listening.test.mjs: kiểm đúng chuỗi patched; mọi `u.audio` khớp `^audio/[a-z0-9-]+\.mp3$`; không có .mp3 trong listening/; index.html không có `name="referrer"`.
- README.md: đoạn Âm thanh viết lại (phát từ site gốc, ELLLO chặn hotlink, repo không chứa mp3, tuỳ chọn tự host 16 mp3); bỏ câu về black-friday/elllo.
- Test: `node --test tests/listening.test.mjs` → 13 pass, 0 fail; lệnh test README (Task 4) → ok. Không chạy toàn bộ suite.
- Lưu ý: bước "test FAIL trước" không ghi nhận được output (lệnh lọc kết quả trống), nên chưa xác nhận đỏ trước khi sửa.
- Chưa kiểm: phát audio thực tế trên trình duyệt (cần site gốc còn chạy); sha đảo patch được test fixture bao phủ (pass).
- git status sạch.
