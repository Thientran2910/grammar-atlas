# 09 — Báo cáo cuối: listening-atlas-merge

## Tóm tắt
Track M · 3 đợt · 5 task (t1 Grammar → `grammar/`, t2 Listening → `listening/`, t3 hub, t4 README, qa-fix-1 nguồn audio) · 21 commit trên `team/listening-atlas-merge` so với `main`. Backend Orca (worker Sonnet), review TASK từng task, review BRANCH: APPROVED, QA vòng 2: PASS.

Bố cục mới: `/` = hub "English Atlas" (`index.html`, `assets/`), `grammar/` = Grammar Atlas (giữ nguyên byte, chỉ thêm link footer), `listening/` = Listening Atlas (giữ nguyên byte, trừ 3 chỗ sửa được test đảo ngược để so sha256 với bản gốc). Link cũ `/#/…` chuyển sang `grammar/#/…`.

## Thời gian
Grill → Plan: 22:00–22:15 · Build (2 đợt): 22:15–22:28 · Verify (gồm vòng sửa audio): 22:28–22:50 · Finish: 22:50 (2026-10-10).

## Acceptance criteria
| AC | Kết quả |
|---|---|
| AC-1.1 hub + thẻ kỹ năng | PASS |
| AC-1.2 tiến độ trên thẻ | PASS |
| AC-1.3 375px không cuộn ngang | PASS |
| AC-2.1 sha256 khớp bản gốc, không có mp3 | PASS |
| AC-2.2 Listening chạy đủ chức năng, audio phát được | PASS (vòng 2, theo ruling nguồn audio) |
| AC-2.3 lưu tiến độ | PASS |
| AC-3.1 Grammar giữ nguyên byte | PASS |
| AC-3.2 chuyển link cũ `/#/b1` | PASS |
| AC-4.1 link chéo | PASS |
| AC-5.1 README | PASS |
| AC-6.1 push + PR | Chờ user (xem bên dưới) |

## Test đã chạy
- `node --test tests/grammar.test.mjs tests/listening.test.mjs tests/hub.test.mjs` → 31/31 pass.
- Trình duyệt headless (agent-browser): hub ở 1440/375px; Listening: trang trình độ, bài, bài tập, transcript, dictation, shadowing, lỗi đã gặp, nguồn; audio của 5 bài (readyState ≥ 1, duration khớp, không lỗi media); redirect `/#/b1`, `/#/b2/wish`.
- curl 16 URL audio trên site gốc kèm Referer github.io → đều 200 `audio/mpeg`.

## Phạm vi chưa kiểm
Chưa phát audio tới lúc `currentTime` tăng (chỉ kiểm tới `loadedmetadata`); mới mở 5/16 bài qua UI; chưa kiểm trên GitHub Pages thật (cần merge); không chạy toàn bộ test suite.

## Quyết định Tech Lead tự đưa ra
- [1] Tự duyệt gate 1 theo đề xuất — User: 'Lên ý tưởng / Làm từ đầu đến cuối / Không hỏi lại / Xong thì đẩy lên repo báo tôi duyệt review'
- [2] Bỏ team-ba/team-ui/team-architect — Track M, không đổi schema/API, không Figma; 01-grill.md đã có AC đủ, ADR 0001 đã ghi ranh giới module
- [3] Tự duyệt gate 2 (plan track M, backend orca, 2 đợt) — User uỷ quyền toàn bộ: 'Làm từ đầu đến cuối / Không hỏi lại'
- [4] Không commit 16 mp3 ELLLO; app.js phát từ audioSource (elllo.org) — Bản thu thuộc bên thứ ba, không phát tán lại trong repo public; ELLLO host đúng file đó (cùng size, range); repo nhẹ đi 65MB
- [4] Commit ADR/GLOSSARY trên team/listening-atlas-merge ngay sau build-init — build-init chỉ nhận thư mục feature; tài liệu thuộc tính năng nên vào cùng branch PR
- [4] Đổi danh sách file t2 từ 'listening/' sang 6 file cụ thể — check-scope chỉ so khớp đường dẫn chính xác; 6 file đúng như plan Task 2
- [4] Bài black-friday: audioSource là .zip → app.js lấy audio từ https://listening-atlas-thien.thientran2910.chatgpt.site/<u.audio> khi audioSource không phải .mp3 — ELLLO không host mp3 trực tiếp cho bài này (đã thử /Audio/A1451, S3 → 404/403); site gốc của user đang host đúng file; vẫn không commit mp3
- [4] Chấp nhận Minor t3 (aria-disabled, legacyTarget chỉ nhận #/); sửa opacity thẻ Sắp có ở Verify — Không ảnh hưởng chức năng; opacity làm giảm tương phản nên sửa luôn vì rẻ
- [5] Không dùng meta no-referrer; mọi bài phát audio từ https://listening-atlas-thien.thientran2910.chatgpt.site/<u.audio> — elllo.org cố ý chặn hotlink theo Referer (403) — không lách cơ chế của chủ nội dung; site gốc của user đang host đúng 16 file và cho phát khác origin (QA đo black-friday readyState 4); vẫn không commit mp3
- [6] Sửa Minor 1, 4, 5 của 07-review; Minor 2 đã hết hiệu lực sau qa-fix-1; Minor 3 ghi vào PR/báo cáo; Minor 6 chốt bằng commit-docs — Chỉ sửa tài liệu, rẻ, không đụng code

## Lỗi Minor còn lại
- `aria-disabled` trên `<article>` "Sắp có" không có tác dụng với trình đọc màn hình (vô hại).
- Đổi hash trên trang hub đang mở (không tải lại) không chuyển hướng; chỉ chuyển khi tải trang.

## Trade-off
- **Audio phụ thuộc site gốc** `listening-atlas-thien…chatgpt.site`: elllo.org chặn hotlink nên không phát trực tiếp từ ELLLO, và repo không chứa mp3. Tắt site gốc → mất audio. Muốn độc lập thì tự host 16 mp3 (cân nhắc điều khoản ELLLO).
- **Transcript ELLLO trong repo public**: `listening/audio-data.js` chứa nguyên transcript 16 bản thu ELLLO (nội dung của bên thứ ba). Repo đang public nên push là công khai vĩnh viễn trong lịch sử git. Cần user quyết trước khi push.
- `style.css` có 3 bản (gốc hub, grammar, listening) để giữ nguyên byte từng module.
