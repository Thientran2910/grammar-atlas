# ADR 0001 — Mỗi kỹ năng là một module tĩnh, hub ở gốc

- Trạng thái: chấp nhận (2026-10-10)
- Bối cảnh: repo ban đầu chỉ chứa Grammar Atlas ở gốc. Cần thêm Listening Atlas và sau này các kỹ năng khác (đọc, từ vựng, viết) trong cùng một repo, cùng một site GitHub Pages.

## Quyết định
- Gốc repo là hub (`index.html`, `assets/`), chỉ chứa trang chọn kỹ năng.
- Mỗi kỹ năng nằm trong thư mục riêng (`grammar/`, `listening/`, ...), tự đủ: có `index.html`, CSS, JS, dữ liệu riêng; chỉ dẫn tới module khác bằng đường dẫn tương đối (`../<module>/`).
- Không dùng chung CSS/JS giữa các module. Mỗi module có khoá `localStorage` riêng, dạng `<module>-atlas-v<n>`.
- URL cũ dạng `/#/…` (Grammar Atlas trước đây ở gốc) được hub chuyển sang `grammar/#/…`.

## Hệ quả
- Thêm kỹ năng = thêm thư mục + thêm một mục trong danh sách module của hub. Không phải sửa module khác.
- Có trùng lặp (`style.css` có ở nhiều module) — chấp nhận để giữ nguyên byte bản gốc và tránh sửa một nơi vỡ nơi khác.
- Chuyển Grammar Atlas khỏi gốc làm đổi URL; script chuyển hướng ở hub giữ link cũ chạy được.
