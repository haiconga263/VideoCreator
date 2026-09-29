# VideoCreator

Tạo video hướng dẫn (tutorial) bằng cách render HTML/CSS thành từng frame rồi ghép thành video MP4 — kèm nhạc nền tự sinh.

Ví dụ đi kèm: một video hướng dẫn sử dụng **Kiro** (23 giây, 1920×1080, 60fps).

## Cách hoạt động

```
slides.js  ──►  Puppeteer (Chromium headless)  ──►  frames/*.png  ──►  FFmpeg  ──►  kiro-tutorial.mp4
style.js                                                                    ▲
make-music.js  ──►  music.wav  ─────────────────────────────────────────────┘
```

1. **`slides.js`** — nội dung và HTML của từng slide (dễ chỉnh sửa text).
2. **`style.js`** — CSS dùng chung + animation dạng `@keyframes` (tua được để render tất định).
3. **`render.js`** — dùng Puppeteer đặt `currentTime` cho animation ở mỗi frame (60fps), chụp thành ảnh PNG, rồi FFmpeg ghép frame và trộn nhạc nền.
4. **`make-music.js`** — tự tổng hợp một bản nhạc nền ambient/lo-fi (không vướng bản quyền) ra `music.wav`.

## Yêu cầu

- Node.js 18+
- Font emoji (ví dụ Noto Color Emoji) để hiển thị icon
- Các gói npm: `puppeteer`, `ffmpeg-static`

## Cài đặt & chạy

```bash
npm install puppeteer ffmpeg-static
node make-music.js   # tạo nhạc nền music.wav
node render.js       # render frames + ghép video -> kiro-tutorial.mp4
```

## Tùy chỉnh

- Đổi **nội dung**: sửa `slides.js`.
- Đổi **màu / font / animation**: sửa `style.js`.
- Đổi **phong cách nhạc / tempo**: sửa `make-music.js`.
- Đổi **FPS / độ phân giải**: sửa hằng số `FPS`, `WIDTH`, `HEIGHT` trong `render.js`.

## Kết quả

- `kiro-tutorial.mp4` — 23s, 1920×1080, H.264 60fps, audio AAC.
