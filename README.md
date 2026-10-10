# Grammar Atlas

Ôn ngữ pháp tiếng Anh B1 đến B2+ bằng tiếng Việt: hiểu bản chất, so sánh các thì, xem ví dụ trong công việc, làm trắc nghiệm có giải thích.

- Bản gốc: https://grammar-atlas-thien.thientran2910.chatgpt.site/
- GitHub Pages: https://thientran2910.github.io/grammar-atlas/

## Cấu trúc
Site tĩnh, không có bước build:

| File | Vai trò |
|---|---|
| `index.html` | Khung trang |
| `style.css`, `tests.css` | Giao diện |
| `content.js` | Trình độ và bài học |
| `quiz-bank.js` | Ngân hàng câu hỏi luyện tập |
| `topic-tests.js` | Bài test theo chủ đề |
| `app.js` | Router hash, render, lưu tiến độ (`localStorage`) |

## Chạy local
```sh
python3 -m http.server 8000   # mở http://localhost:8000
```

## Kiểm thử
```sh
node --test tests/
```
Test đối chiếu sha256 với bản gốc, nên sau khi sửa nội dung cần cập nhật `tests/fixtures/checksums.json`.
