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
6. **`run.sh` / `run.bat`** — script chạy toàn bộ pipeline trên máy local (khuyến nghị).

## Yêu cầu

- Node.js 18+
- Font emoji (macOS có sẵn; Linux cài `fonts-noto-color-emoji`) để hiển thị icon
- FFmpeg đi kèm qua gói `ffmpeg-static` (không cần cài riêng)

## Chạy trên máy local (khuyến nghị — nhanh hơn)

Có sẵn script tự lo mọi thứ (cài deps, tạo nhạc, render):

```bash
# macOS / Linux
chmod +x run.sh
./run.sh                     # cài deps + tạo nhạc + render CẢ HAI preset
./run.sh --preset youtube    # chỉ YouTube
./run.sh --preset tiktok     # chỉ TikTok
```

```bat
:: Windows
run.bat
run.bat --preset tiktok
```

Hoặc chạy thủ công qua npm:

```bash
npm install
npm run music     # tạo nhạc nền music.wav
npm run youtube   # xuất bản ngang 16:9
npm run tiktok    # xuất bản dọc 9:16
npm run all       # cả hai
```

Yêu cầu máy local: **Node.js 18+**. FFmpeg đi kèm qua `ffmpeg-static` (không cần cài riêng).
macOS đã có sẵn font emoji; trên Linux nên cài `fonts-noto-color-emoji`.

## Các cờ điều khiển của `render.js`

`node render.js [--preset youtube|tiktok|youtube,tiktok|all] [cờ...]`

| Cờ | Ý nghĩa |
|----|---------|
| `--frames-only` | Chỉ render và **lưu frame** vào `frames_<preset>/`, không ghép video |
| `--video-only` | Không render; chỉ **ghép video từ frame đã lưu** |
| `--reuse-frames` | Nếu frame đã đủ số lượng thì dùng lại (bỏ qua render) |
| `--clean` | Xóa thư mục frame của preset trước khi render |
| `--no-music` | Xuất video không nhạc |
| `--fps <n>` | Số khung hình/giây (mặc định 60) |
| `--scale <n>` | deviceScaleFactor: 1=base, **2=4K**, 3=8K (mặc định 2) |

> **Frame luôn được giữ lại** (ở `frames_<preset>/`) trừ khi dùng `--clean`. Nhờ đó bạn
> có thể render 1 lần rồi ghép lại video nhiều lần bằng `--video-only` mà không phải render lại.

Ví dụ quy trình tách bước:

```bash
node render.js --preset all --frames-only   # bước 1: render + lưu toàn bộ frame
node render.js --preset youtube --video-only # bước 2: chỉ xuất video YouTube từ frame đã có
node render.js --preset tiktok  --video-only # xuất tiếp video TikTok, không render lại
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
