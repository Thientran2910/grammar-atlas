# Glossary

- **Hub** — trang chủ ở gốc site (`index.html`), liệt kê các module kỹ năng.
- **Module kỹ năng** — một thư mục tự đủ (`grammar/`, `listening/`, ...) chứa một ứng dụng tĩnh luyện một kỹ năng.
- **Bản gốc** — site do user dựng trên chatgpt.site mà module được sao từ đó (Grammar Atlas, Listening Atlas).
- **Chỗ sửa được phép** — thay đổi có chủ đích so với bản gốc (bỏ script hosting, đổi link chéo), được liệt kê ở mục `patches` trong `tests/fixtures/<module>.json`; test đảo ngược chúng để so sha256 với bản gốc.
