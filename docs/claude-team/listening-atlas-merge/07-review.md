# 07 — Branch review: listening-atlas-merge

- MODE: BRANCH · ROUND 1
- BASE: `main` · HEAD: `team/listening-atlas-merge` (2d3fd9e)
- EXTERNAL: none
- Phạm vi: 18 commit, 31 file (t1 chuyển grammar/, t2 sao listening/, t3 hub, t4 README, sửa opacity 2d3fd9e). Chỉ đọc diff và file; không chạy test (lệnh test tích hợp do Tech Lead chạy ở mỗi đợt, đợt 2 ghi PASS).

## Đã kiểm xuyên task

- **Bố cục, AC-3.1**: 7 file Grammar Atlas đã `git mv` vào `grammar/`. `files` trong `tests/fixtures/grammar.json` trùng khớp 7 sha của `main:tests/fixtures/checksums.json`. Patch footer duy nhất của `grammar/index.html` đúng như plan. Mọi `src`/`href` nội bộ của `grammar/index.html` là đường dẫn tương đối và còn tồn tại.
- **AC-2.1**: `tests/fixtures/listening.json` có 6 sha đúng như plan. Patch `index.html` và patch `app.js` (link grammar, nguồn audio) xuất hiện đúng 1 lần. Patch audio theo ruling black-friday (`.mp3` thì dùng `audioSource`, còn lại fallback về site gốc + `u.audio`). `u.audio` chỉ được dùng ở đúng một chỗ trong `app.js` nên patch phủ hết. `git ls-files` không có mp3 nào.
- **AC-4.1, tích hợp t2↔t1**: `listening/app.js` dẫn tới `../grammar/#/${grammarLevel(topic)}/${topic}`. Đã đối chiếu cả 12 topic dùng trong `listening/content.js` với `lesson('<id>','<level>',…)` trong `grammar/content.js`: level của `grammarLevel()` khớp hết, nên các bài đích đều có thật. Footer hai module đều có link về hub (`../`) và sang module kia.
- **Tích hợp t3↔t1/t2**: hub dẫn tới `grammar/` và `listening/`, cả hai đều tồn tại. `assets/style.css` giống byte `grammar/style.css` (git nhận là rename của `style.css` gốc). `hub.css` chỉ dùng các token có sẵn trong style.css (`--paper --line --ink --muted --green --lime --serif`).
- **AC-1.2, interface hub.js ↔ schema localStorage của module**: `grammar-atlas-v1.read` đúng là mảng id bài (`grammar/app.js`). `listening-atlas-v1.results` là object có key theo `u.id` (`results[u.id]={...result}`). Hai bên khớp nhau. JSON hỏng hoặc storage ném lỗi thì trả null, đã có test.
- **AC-3.2**: `legacyTarget` chỉ nhận hash bắt đầu bằng `#/` và trả về đường dẫn tương đối `grammar/#/…`, nên vẫn đúng dưới `/grammar-atlas/` trên Pages. Script nằm trong `<head>`, không `defer`.
- **AC-1.1**: ba thẻ "Sắp có" là `<article>`, không phải `<a>`. Không có `cdn-cgi`. Opacity đã được bỏ ở 2d3fd9e.
- **localStorage khi chung origin** (quyết định #10): ba khoá khác tên, không đụng nhau.
- **AC-5.1**: README có bảng bố cục, mục "Thêm kỹ năng mới" và hướng dẫn chạy test. Phần giải thích fixtures/patches khớp cách hai file test làm.

## Critical
none

## Important
none

## Minor
1. `GLOSSARY.md:6`: ghi nhầm vị trí patch là `tests/fixtures/patches.json`, nhưng file thật là `tests/fixtures/<module>.json` (mục `patches`). Cách sửa: đổi thành "mục `patches` trong `tests/fixtures/<module>.json`".
2. `README.md:21`: ghi audio "phát trực tiếp từ URL gốc trên ELLLO… phụ thuộc vào elllo.org", nhưng thực tế 6/16 bài có `audioSource` trên `s3-us-west-1.amazonaws.com/elllo-audio/` (bucket của ELLLO). Test t2 đã nới cho bucket này, còn AC-2.2 vẫn ghi "từ elllo.org". Cách sửa: README ghi "elllo.org và bucket S3 `elllo-audio` của ELLLO"; QA cần hiểu AC-2.2 theo nghĩa nguồn ELLLO.
3. `README.md:21`, `listening/app.js` (patch audio): bài black-friday phụ thuộc site gốc `listening-atlas-thien…chatgpt.site`, đã có ruling. Rủi ro: nếu user gỡ site gốc sau khi gộp, bài đó mất audio mà không có test nào báo. Cách sửa: ghi rõ phụ thuộc này trong mô tả PR để user biết trước khi tắt site gốc.
4. `README.md:52`: phần "Nguồn" chỉ ghi ELLLO, thiếu "Todd Beuckens", trong khi hub footer và quyết định #6 đều ghi "ELLLO / Todd Beuckens". Cách sửa: thêm tên tác giả cho thống nhất.
5. `docs/adr/0001-multi-skill-static-modules.md:13`: câu "thêm một mục trong danh sách module của hub" không khớp cách làm thực tế (thêm thẻ HTML trong `index.html` và nhánh trong `progressText`, như README mục 4). Cách sửa: viết lại cho khớp README.
6. PR có kèm file điều phối `docs/claude-team/listening-atlas-merge/state.json` (296 dòng) và `STATE.md`, trong khi working tree đang có thay đổi chưa commit ở hai file này cùng `briefs/ reports/ reviews/`. Cách sửa: trước khi push, chốt một hướng: commit trạng thái cuối, hoặc bỏ thư mục này khỏi PR.
7. `tests/hub.test.mjs`: AC-1.3 (375px không cuộn ngang, một cột) chỉ kiểm được bằng trình duyệt. Unit test không phủ, cần Playwright ở QA xác nhận. `hub.css` đã có media ≤760px một cột và header `flex-wrap`.

## Kết luận
APPROVED
