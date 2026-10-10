# 01 — Grill: listening-atlas-merge

## Tóm tắt tính năng
Sao y hệt (giao diện + chức năng) site `https://listening-atlas-thien.thientran2910.chatgpt.site/`, là site của chính user, rồi gộp vào repo `grammar-atlas` thay vì tạo repo riêng. Site gốc là SPA tĩnh giống Grammar Atlas: `index.html`, `style.css` (giống `style.css` của Grammar Atlas, chỉ khác dòng trống cuối file), `listening.css`, `audio-data.js` (16 bài nghe: transcript, waveform), `content.js`, `app.js`; audio là 16 file `audio/*.mp3` (khoảng 65MB) sao từ ELLLO — cùng file mà ELLLO đang host tại URL `audioSource` ghi trong `audio-data.js`. Repo được tổ chức lại thành một site luyện tiếng Anh nhiều kỹ năng: trang hub ở gốc, mỗi kỹ năng là một module tĩnh độc lập trong thư mục riêng (`grammar/`, `listening/`), sau này thêm `reading/`, ...

## Quyết định đã chốt
User uỷ quyền toàn bộ: "Lên ý tưởng / Làm từ đầu đến cuối / Không hỏi lại / Xong thì đẩy lên repo báo tôi duyệt review". Mọi quyết định dưới đây là đề xuất của Tech Lead, tự duyệt theo uỷ quyền.

| # | Câu hỏi | Quyết định | Lý do |
|---|---|---|---|
| 1 | Bố cục repo | Gốc = hub `index.html`; `grammar/` = Grammar Atlas (chuyển nguyên file từ gốc); `listening/` = Listening Atlas | Mỗi kỹ năng là một module tĩnh tự đủ; thêm kỹ năng mới chỉ là thêm một thư mục và một thẻ trên hub |
| 2 | Cách clone | Giữ nguyên byte mọi file của site gốc, trừ các chỗ sửa được liệt kê ở #3, #4 | "giống y hệt" là cách chắc nhất; test kiểm bằng cách đảo ngược đúng các chỗ sửa đó rồi so sha256 với bản gốc |
| 3 | `listening/index.html` | Bỏ script Cloudflare (`/cdn-cgi/...`) do hosting tiêm vào; link "Grammar Atlas ↗" trỏ sang `../grammar/` | Script đó trên Pages bị 404; link nội bộ không còn phụ thuộc domain chatgpt.site |
| 4 | Link chéo | `listening/app.js`: `https://grammar-atlas-thien.thientran2910.chatgpt.site#/…` → `../grammar/#/…`. `grammar/index.html`: thêm link "Listening Atlas ↗" (`../listening/`) vào footer. Cả hai footer thêm link "English Atlas ↗" (`../`) về hub | Hai module dẫn qua lại trong cùng site; sửa ít nhất có thể |
| 5 | `style.css` dùng chung? | Không. Mỗi module giữ bản `style.css` của riêng nó | Giữ đúng byte từng site gốc; module độc lập, sửa một bên không làm vỡ bên kia |
| 6 | Audio | **Không** commit mp3. `listening/app.js` phát từ `u.audioSource` (URL gốc trên elllo.org) thay cho `u.audio`; giữ nguyên ghi nguồn ELLLO / Todd Beuckens | Bản thu thuộc ELLLO (bên thứ ba): không phát tán lại 65MB audio trong repo public mà dẫn về nguồn gốc. ELLLO trả cùng file (cùng kích thước, `audio/mpeg`, có `accept-ranges`); waveform đã tính sẵn trong `audio-data.js`, app chỉ dùng thẻ `<audio>` nên phát khác origin vẫn chạy. Repo nhẹ đi 65MB |
| 7 | Link cũ của Grammar Atlas | Hub có script nhỏ: URL gốc có hash `#/…` (link Grammar Atlas cũ, ví dụ `/#/b1`) → chuyển sang `grammar/#/…` | Không làm hỏng bookmark/link đã chia sẻ của bản Pages hiện tại |
| 8 | Giao diện hub | Dùng lại ngôn ngữ thiết kế chung (font Be Vietnam Pro / DM Sans, serif Georgia, màu `--green #28594b`, `--lime`, nền `#f7f6f2`, header/footer giống hai module), CSS riêng `hub.css` + bản `style.css` gốc trong `assets/` | Nhìn liền mạch với hai module mà không sửa CSS của chúng |
| 9 | Nội dung hub | Brand "English Atlas"; hero; thẻ kỹ năng: Ngữ pháp (có), Nghe (có), Đọc / Từ vựng / Viết ("Sắp có", không bấm được); mỗi thẻ có hiển thị tiến độ đọc từ `localStorage` của module (nếu có) | Đúng định hướng "luyện tiếng Anh các loại"; tiến độ giúp người học quay lại đúng chỗ |
| 10 | Đụng `localStorage` khi chung origin | Không đụng: `grammar-atlas-v1`, `grammar-atlas-tests-v1`, `listening-atlas-v1` khác tên | Đã kiểm trong app.js của hai site |
| 11 | Kiểm thử | `node --test tests/` (built-in, không thêm dependency) + Playwright trên server local | Như lần clone trước |
| 12 | Push | Đẩy branch `team/listening-atlas-merge` lên GitHub và mở PR vào `main`; **không merge** | User yêu cầu "đẩy lên repo báo tôi duyệt review"; Pages chỉ thay đổi khi user merge |

## User stories
- US-1: Là người học, tôi muốn mở trang chủ và chọn kỹ năng (Ngữ pháp, Nghe, ...) để luyện, để có một nơi học tất cả.
- US-2: Là người học, tôi muốn Listening Atlas trong site này giống hệt bản gốc (giao diện, nghe audio, transcript, bài tập, dictation, shadowing, lỗi đã gặp, lưu tiến độ).
- US-3: Là người học, tôi muốn Grammar Atlas vẫn chạy như cũ, kể cả link cũ dạng `/#/b1`.
- US-4: Là người học, tôi muốn đi qua lại giữa Nghe ↔ Ngữ pháp ↔ trang chủ mà không rời site.
- US-5: Là chủ site, tôi muốn thêm kỹ năng mới sau này chỉ bằng cách thêm một thư mục và một thẻ trên hub.

## Acceptance criteria
- AC-1.1: Given mở `/`, When trang tải xong, Then thấy hub "English Atlas" với thẻ Ngữ pháp → `grammar/`, Nghe → `listening/`, và các thẻ "Sắp có" không phải link; console không lỗi.
- AC-1.2: Given đã có tiến độ trong `localStorage` của một module, When mở hub, Then thẻ của module đó hiển thị tóm tắt tiến độ; không có dữ liệu hoặc dữ liệu hỏng thì thẻ vẫn hiện bình thường.
- AC-1.3: Given chiều rộng 375px, When mở hub, Then không có thanh cuộn ngang và các thẻ xếp một cột.
- AC-2.1: Given các file trong `listening/`, When đảo ngược đúng các chỗ sửa ở quyết định #3/#4/#6, Then sha256 trùng bản tải từ site gốc; các file không sửa trùng sha256 nguyên vẹn; repo không chứa file mp3.
- AC-2.2: Given mở `listening/`, When vào trang trình độ, mở một bài, bấm phát audio, làm bài tập, mở transcript, trang Lỗi đã gặp, trang `#/sources`, Then nội dung hiện như bản gốc, audio phát được từ elllo.org (HTTP 200/206, `audio/mpeg`, thời lượng khớp `duration`), console không lỗi JS.
- AC-2.3: Given trả lời một câu trong Listening, When tải lại trang, Then `localStorage['listening-atlas-v1']` vẫn còn dữ liệu.
- AC-3.1: Given các file trong `grammar/`, When đảo ngược chỗ sửa ở quyết định #4, Then sha256 trùng checksum gốc cũ (`tests/fixtures`).
- AC-3.2: Given mở `/#/b1` (hoặc hash `#/…` bất kỳ), When trang tải, Then chuyển sang `grammar/#/b1` và Grammar Atlas hiện đúng trang.
- AC-4.1: Given ở bài nghe có liên kết "Ôn cấu trúc trên Grammar Atlas", When xem link, Then href là `../grammar/#/<level>/<topic>` và trỏ tới bài có thật; footer cả hai module có link về hub và sang module kia.
- AC-5.1: Given README, When đọc, Then có mô tả bố cục module và các bước thêm kỹ năng mới.
- AC-6.1: Given công việc xong, When kiểm GitHub, Then branch `team/listening-atlas-merge` đã push và có PR vào `main` đang mở, chưa merge.

## Phạm vi
Sao Listening Atlas; chuyển Grammar Atlas vào `grammar/`; hub mới ở gốc; link chéo; script chuyển link cũ; test; README; push branch + mở PR.

## Ngoài phạm vi
Nội dung kỹ năng mới (Đọc, Từ vựng, Viết); viết lại/refactor code hai module; gộp `style.css`; tài khoản/đồng bộ tiến độ; tên miền riêng; merge PR.

## Ràng buộc
Audio phụ thuộc elllo.org còn hoạt động (đã ghi trong README). Site tĩnh không có bước build; mọi đường dẫn tương đối (chạy dưới `/grammar-atlas/` trên Pages); không thêm dependency; mỗi file < 100MB (giới hạn GitHub).

## ADR & glossary
- ADR: `docs/adr/0001-multi-skill-static-modules.md` (bố cục module theo kỹ năng, hub ở gốc).
- Glossary: `GLOSSARY.md` (Hub, Module kỹ năng, Bản gốc, Chỗ sửa được phép).

## Figma
none

## Repo phụ thuộc
none

## Tín hiệu cỡ việc
Khoảng 30 file (phần lớn là sao chép nguyên văn); code tự viết: hub (html/css/js, khoảng 250 dòng), test (khoảng 150 dòng), README/ADR. Không đổi schema/API; có 1 màn hình mới (hub); chuyển file của module có sẵn; không có vùng rủi ro.
