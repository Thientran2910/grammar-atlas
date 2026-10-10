# English Atlas

Bộ công cụ ôn tiếng Anh bằng tiếng Việt, gồm hai kỹ năng trong cùng một repo: **Grammar Atlas** (ngữ pháp B1 đến B2+) và **Listening Atlas** (luyện nghe). Site tĩnh, không có bước build.

- Hub (English Atlas): https://thientran2910.github.io/grammar-atlas/
- Grammar Atlas: https://thientran2910.github.io/grammar-atlas/grammar/ (bản gốc: https://grammar-atlas-thien.thientran2910.chatgpt.site/)
- Listening Atlas: https://thientran2910.github.io/grammar-atlas/listening/ (bản gốc: https://listening-atlas-thien.thientran2910.chatgpt.site/)

## Bố cục

| Đường dẫn | Vai trò |
|---|---|
| `index.html` + `assets/` | Hub: trang chọn kỹ năng, hiển thị tiến độ từng kỹ năng |
| `grammar/` | Grammar Atlas (tự đủ: html, css, content, quiz, app) |
| `listening/` | Listening Atlas (tự đủ: html, css, dữ liệu bài nghe, app) |
| `tests/` | Test `node --test` và `tests/fixtures/` |
| `docs/adr/` | Quyết định kiến trúc |

## Âm thanh Listening

Repo **không chứa file mp3**. Audio của Listening Atlas phát từ bản gốc `https://listening-atlas-thien.thientran2910.chatgpt.site/audio/` (site gốc phải còn chạy). ELLLO (elllo.org) chặn hotlink nên audio không phát trực tiếp từ ELLLO. Nếu muốn site độc lập hoàn toàn, có thể tự host 16 file mp3 (cân nhắc điều khoản phi thương mại của ELLLO).

## Thêm kỹ năng mới

1. Tạo thư mục `<skill>/` tự đủ (html, css, js riêng, không dùng file ngoài thư mục).
2. Lưu tiến độ bằng khoá `localStorage` `<skill>-atlas-v1`.
3. Thêm liên kết dẫn ngược về hub bằng `../`.
4. Thêm thẻ kỹ năng trong `index.html` và nhánh tương ứng trong `progressText` của `assets/hub.js`.
5. Thêm test `tests/<skill>.test.mjs` (kèm `tests/fixtures/<skill>.json` nếu sao chép từ nguồn).

## Chạy local

```sh
python3 -m http.server 8000   # mở http://localhost:8000
```

## Kiểm thử

```sh
node --test tests/
```

Mỗi module có `tests/fixtures/<module>.json` gồm:

- `files`: sha256 của bản gốc cho từng file.
- `patches`: các thay đổi có chủ đích so với bản gốc, mỗi mục có `original` và `patched`.

Test đảo ngược từng patch (`patched` phải xuất hiện đúng 1 lần) rồi so sha256 với `files`. Khi sửa nội dung module, cập nhật patch tương ứng trong fixture.

## Nguồn

Nội dung và audio bài nghe lấy từ ELLLO / Todd Beuckens (elllo.org), dùng cho mục đích học tập phi thương mại.
