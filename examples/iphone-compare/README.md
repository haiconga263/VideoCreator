# Ví dụ: Video so sánh iPhone 17 vs iPhone 18 Pro

Video so sánh 2 dòng máy, dựng bằng cùng pipeline HTML→video ở thư mục gốc.

## File video
- `iphone-compare-youtube.mp4` — 1920×1080 (16:9), 32.5s, 60fps
- `iphone-compare-tiktok.mp4` — 1080×1920 (9:16), 32.5s, 60fps

> Render ở đây dùng `--scale 1` (1080p) cho nhanh. Chạy local với `--scale 2` để ra 4K.

## Nội dung 7 slide
1. Mở đầu — iPhone 17 vs iPhone 18 Pro
2. Tổng quan (2 cột VS)
3. Chip xử lý — A19 vs A20 Pro (2nm)
4. Màn hình & thiết kế
5. Camera & pin
6. Kết luận nên chọn máy nào
7. Kết — kêu gọi bình luận

## Chạy lại
```bash
./run.sh                    # cả 2 preset
node render.js --preset youtube --scale 2   # bản 4K ngang
```

## Nguồn số liệu
Thông số lấy từ trang chính thức Apple (newsroom + tech specs) và tổng hợp từ MacRumors,
tháng 9/2026.

- iPhone 17: [apple.com/iphone-17](https://www.apple.com/iphone-17/), [tech specs](https://support.apple.com/en-us/125089)
- iPhone 18 Pro: [apple.com/iphone-18-pro](https://www.apple.com/iphone-18-pro/), [Apple Newsroom](https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/)

**Lưu ý:** iPhone 18 bản thường dự kiến ra mùa xuân 2027; máy đã phát hành (9/2026) là
iPhone 18 **Pro** / Pro Max — nên video so sánh iPhone 17 với iPhone 18 Pro.

*Nội dung đã được diễn giải lại để tuân thủ quy định bản quyền.*
