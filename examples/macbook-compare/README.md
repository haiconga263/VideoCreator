# Ví dụ: So sánh MacBook Pro 14" M2 vs M3

Video so sánh 2 đời MacBook Pro 14 inch, dựng bằng bộ skill `video-*` (workflow
`video-comparison`).

## File video
- `macbook-compare-youtube.mp4` — 1920×1080 (16:9), 32.5s, 60fps
- `macbook-compare-tiktok.mp4` — 1080×1920 (9:16), 32.5s, 60fps

> Render ở đây dùng `--scale 1` (1080p). Chạy local với `--scale 2` để ra 4K.

## Nội dung 7 slide
1. Mở đầu — MacBook Pro 14" M2 vs M3
2. Tổng quan (2 laptop mockup: M2 bạc, M3 Space Black)
3. Chip — bước nhảy 5nm → 3nm
4. Màn hình & pin
5. RAM tối đa (bar chart 96GB vs 128GB)
6. Kết luận nên chọn máy nào
7. Kết — kêu gọi bình luận

## Chạy ở máy local

Yêu cầu: **Node.js 18+**. FFmpeg đã đi kèm qua `ffmpeg-static` (không cần cài riêng).
macOS có sẵn font emoji; trên Linux cài `fonts-noto-color-emoji`.

```bash
# 1) Cài dependencies (chỉ lần đầu)
npm install

# 2) Cách nhanh nhất — script tự làm hết (cài + tạo nhạc + render cả 2 preset)
chmod +x run.sh
./run.sh                      # macOS/Linux
#   run.bat                   # Windows

# 3) Hoặc chạy từng bước thủ công
node make-music.js            # tạo nhạc nền music.wav
node render.js --preset youtube          # bản ngang 16:9
node render.js --preset tiktok           # bản dọc 9:16
node render.js --preset all --scale 2    # cả hai, độ phân giải 4K
```

Các cờ hữu ích của `render.js`: `--frames-only`, `--video-only`, `--reuse-frames`,
`--clean`, `--no-music`, `--fps <n>`, `--scale <n>`. Xem chi tiết ở `.kiro/skills/video-engine`.

## Nguồn số liệu
Apple newsroom + tech specs (2023) và tổng hợp macworld / 9to5mac / techradar / rtings.

- [Apple Newsroom — MacBook Pro M3](https://www.apple.com/newsroom/2023/10/apple-unveils-new-macbook-pro-featuring-m3-chips/)
- [Tech specs MacBook Pro 14" M3](https://support.apple.com/en-us/117735)

Điểm chính: thiết kế ngoài gần như y hệt; nâng cấp ở chip **3nm**, màn sáng hơn, pin lâu hơn,
RAM tối đa **96GB → 128GB**, thêm màu **Space Black**.

*Nội dung đã được diễn giải lại để tuân thủ quy định bản quyền.*
