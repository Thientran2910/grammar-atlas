# 01 — Grill: grammar-atlas-clone

## Tóm tắt tính năng
Tạo bản sao giống 100% (giao diện + tính năng) của site `https://grammar-atlas-thien.thientran2910.chatgpt.site/`, là site của chính user (subdomain `thientran2910`, trùng tài khoản GitHub `Thientran2910`). Site gốc là SPA tĩnh: `index.html` + `style.css`, `tests.css` + `content.js`, `quiz-bank.js`, `topic-tests.js`, `app.js`, điều hướng bằng hash, lưu tiến độ bằng `localStorage`. Bản sao được đưa lên repo GitHub công khai và chạy trên GitHub Pages.

## Quyết định đã chốt
User uỷ quyền toàn bộ: "Làm từ đầu đến cuối, không hỏi lại bất cứ gì! Làm xong đẩy lên github + github pages luôn!", nên mọi quyết định dưới đây là đề xuất của Tech Lead, được tự duyệt.

| # | Câu hỏi | Quyết định | Lý do |
|---|---|---|---|
| 1 | Clone bằng cách nào | Giữ nguyên byte 6 file tài nguyên của site gốc | "100%" giống nhau là cách đảm bảo nhất; đây là site của user nên được dùng nguyên |
| 2 | index.html | Giữ nguyên, chỉ bỏ đoạn script Cloudflare challenge (`/cdn-cgi/...`) | Script đó do hosting chatgpt.site tiêm vào, trên Pages sẽ lỗi 404, không thuộc tính năng của app |
| 3 | Repo | `~/Workspace/grammar-atlas`, GitHub `Thientran2910/grammar-atlas`, public | Pages miễn phí cần repo public |
| 4 | Deploy Pages | Pages từ branch `main`, thư mục `/` (legacy), có `.nojekyll` | Site tĩnh, không cần bước build |
| 5 | Kiểm thử | `node --test tests/` (built-in, không cài dependency) + kiểm trên trình duyệt (Playwright) cả bản local lẫn bản Pages | Không có toolchain, không thêm dependency |
| 6 | Merge/push | Merge `team/<slug>` vào `main` rồi push | User đã yêu cầu rõ ràng là đẩy lên |

## User stories
- US-1: Là người học, tôi muốn mở bản trên GitHub Pages và thấy giao diện y hệt site gốc, để dùng thay cho bản gốc.
- US-2: Là người học, tôi muốn mọi tính năng (trang trình độ B1…B2+, bài học, so sánh thì, luyện tập/trắc nghiệm, bài test theo chủ đề, lưu tiến độ) hoạt động như bản gốc.
- US-3: Là chủ site, tôi muốn mã nguồn nằm trên GitHub, để tự quản lý và sửa tiếp.

## Acceptance criteria
- AC-1.1: Given bản sao trong repo, When so sánh sha256 6 file tài nguyên với bản tải từ site gốc, Then tất cả trùng khớp.
- AC-1.2: Given `index.html` của bản sao, When so với bản gốc đã bỏ script Cloudflare, Then giống hệt nhau, và không còn chuỗi `cdn-cgi`.
- AC-2.1: Given mở bản sao trên trình duyệt, When vào lần lượt `#/b1`, `#/compare`, `#/practice/<id>`, `#/tests/<id>`, `#/errors`, Then mỗi trang hiện nội dung và console không có lỗi JS.
- AC-2.2: Given đang làm trắc nghiệm, When chọn một đáp án, Then hiện phản hồi đúng/sai, và sau khi tải lại trang `localStorage['grammar-atlas-v1']` hoặc `grammar-atlas-tests-v1` vẫn còn dữ liệu.
- AC-3.1: Given repo `Thientran2910/grammar-atlas` đã push, When mở `https://thientran2910.github.io/grammar-atlas/`, Then HTTP 200 và trang chạy được như AC-2.1.

## Phạm vi
Sao chép tài nguyên tĩnh, bỏ script do hosting tiêm vào, thêm test, README, `.nojekyll`, tạo repo GitHub, bật Pages.

## Ngoài phạm vi
Viết lại/refactor code, thêm tính năng mới, tên miền riêng, analytics.

## Ràng buộc
Không có bước build; đường dẫn tương đối (chạy được dưới `/grammar-atlas/`); font Google Fonts tải qua CDN giống bản gốc.

## ADR & glossary
none (không có quyết định khó đảo ngược ngoài việc tạo repo public; ghi ở Quyết định #3).

## Figma
none

## Repo phụ thuộc
none

## Tín hiệu cỡ việc
~10 file, nhưng 6 file là bản sao nguyên văn; code tự viết: 1 file test + README + `.nojekyll`. Không có schema/API. Không có màn hình mới (giữ nguyên màn hình gốc). Không có vùng rủi ro.
