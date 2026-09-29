# VideoCreator

Tạo video hướng dẫn (tutorial) bằng cách render HTML/CSS thành từng frame rồi ghép thành video MP4 — kèm nhạc nền tự sinh. Hỗ trợ xuất **cả tỉ lệ ngang (YouTube 16:9) lẫn dọc (TikTok / Shorts / Reels 9:16)**.

Ví dụ đi kèm: video hướng dẫn sử dụng **Kiro** (23 giây, 60fps, 4K).

## Cách hoạt động

```
slides.js  ──►  Puppeteer (Chromium headless)  ──►  frames_<preset>/*.png  ──►  FFmpeg  ──►  *.mp4
style.js                                                                          ▲
make-music.js  ──►  music.wav  ───────────────────────────────────────────────────┘
```

1. **`slides.js`** — nội dung và HTML của từng slide (dễ chỉnh sửa text).
2. **`style.js`** — CSS dùng chung + animation `@keyframes` (tua được để render tất định). Có layout riêng cho từng preset qua `body[data-preset]`.
3. **`render.js`** — Puppeteer đặt `currentTime` cho animation ở mỗi frame (60fps), chụp PNG, rồi FFmpeg ghép frame + trộn nhạc nền.
4. **`make-music.js`** — tự tổng hợp nhạc nền ambient/lo-fi (không vướng bản quyền) ra `music.wav`.
5. **`preview.js`** — chụp thử vài slide cho 1 preset để kiểm tra layout nhanh.

## Yêu cầu

- Node.js 18+
- Font emoji (ví dụ Noto Color Emoji) để hiển thị icon
- Các gói npm: `puppeteer`, `ffmpeg-static`

## Cài đặt & chạy

```bash
npm install puppeteer ffmpeg-static
node make-music.js                # tạo nhạc nền music.wav
node render.js --preset youtube   # xuất bản ngang 16:9 -> kiro-tutorial-youtube.mp4
node render.js --preset tiktok    # xuất bản dọc 9:16  -> kiro-tutorial-tiktok.mp4
```

## Tỉ lệ khung hình theo nền tảng

| | YouTube (ngang) | TikTok / Shorts / Reels (dọc) |
|---|---|---|
| Tỉ lệ | 16:9 | 9:16 |
| Độ phân giải (SCALE=2) | 3840×2160 | 2160×3840 |
| Bố cục | card/pipeline xếp **hàng ngang** | xếp **dọc**, chữ to hơn |
| Safe zone | dùng cả khung | chừa lề **phải** (nút) + **dưới** (caption) |
| Thời lượng | tùy ý | ngắn, tốt nhất 15–60s |

> Không chỉ "xoay" video — bố cục được thiết kế lại cho từng hướng. Bản TikTok đã chừa vùng an toàn để nút Like/Share và caption của TikTok không che nội dung.

## Tùy chỉnh

- Đổi **nội dung**: sửa `slides.js`.
- Đổi **màu / font / animation / layout dọc**: sửa `style.js`.
- Đổi **phong cách nhạc / tempo**: sửa `make-music.js`.
- Đổi **FPS / độ phân giải**: sửa hằng số `FPS`, `SCALE` trong `render.js`.
- Thêm **preset nền tảng mới**: thêm vào `PRESETS` trong `render.js` + rule `body[data-preset]` trong `style.js`.

## Kết quả

- `kiro-tutorial-youtube.mp4` — 23s, **3840×2160 (16:9)**, H.264 60fps, audio AAC.
- `kiro-tutorial-tiktok.mp4` — 23s, **2160×3840 (9:16)**, H.264 60fps, audio AAC.
