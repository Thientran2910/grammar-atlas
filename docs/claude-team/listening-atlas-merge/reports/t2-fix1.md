# Report t2-fix1
- Status: DONE
- Commit: b6450bf fix(listening-atlas-merge): app.js dùng audio ELLLO .mp3, fallback audio/ cho bài .zip
- Tests: node --test tests/listening.test.mjs → 12 pass, 0 fail (đã thấy FAIL trước khi sửa app.js)
- Notes: patch (2) app.js đổi sang điều kiện /\.mp3$/ trên audioSource, fallback sang host listening-atlas; đảo patch vẫn ra sha gốc 82188caf…. Test thay: không còn grammar-atlas-thien, kiểm audio chặt, kiểm chuỗi patched. Không có file .mp3 trong listening/. git status sạch.
