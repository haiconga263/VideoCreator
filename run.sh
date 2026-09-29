#!/usr/bin/env bash
# =============================================================================
#  run.sh — chạy toàn bộ pipeline tạo video trên MÁY LOCAL (macOS / Linux)
#
#  Lần đầu:  chmod +x run.sh
#  Dùng:
#    ./run.sh                      # cài deps + tạo nhạc + render cả 2 preset
#    ./run.sh --preset youtube     # chỉ YouTube
#    ./run.sh --preset tiktok      # chỉ TikTok
#    ./run.sh --frames-only        # chỉ render + LƯU frame (không ghép video)
#    ./run.sh --video-only         # chỉ ghép video từ frame đã lưu
#    ./run.sh --reuse-frames       # dùng lại frame có sẵn nếu đủ
#
#  Mọi tham số truyền vào sẽ được chuyển thẳng cho render.js.
#  Mặc định (không có --preset) sẽ render cả hai preset: youtube + tiktok.
# =============================================================================
set -euo pipefail
cd "$(dirname "$0")"

echo "==> Kiểm tra Node.js..."
if ! command -v node >/dev/null 2>&1; then
  echo "LỖI: chưa cài Node.js. Cài tại https://nodejs.org (>= 18) rồi chạy lại." >&2
  exit 1
fi
echo "    Node $(node -v)"

echo "==> Cài dependencies (puppeteer, ffmpeg-static)..."
if [ ! -d node_modules ]; then
  npm install
else
  echo "    node_modules đã có — bỏ qua (xóa thư mục này nếu muốn cài lại)."
fi

# Cảnh báo font emoji (chỉ cảnh báo, không chặn)
if command -v fc-list >/dev/null 2>&1; then
  if ! fc-list | grep -qi emoji; then
    echo "    [Cảnh báo] Không thấy font emoji — icon có thể hiển thị thành ô vuông."
    echo "    macOS đã có sẵn Apple Color Emoji. Trên Linux: cài 'fonts-noto-color-emoji'."
  fi
fi

echo "==> Tạo nhạc nền (music.wav)..."
if [ ! -f music.wav ]; then
  node make-music.js
else
  echo "    music.wav đã có — bỏ qua (xóa file này để tạo lại)."
fi

# Nếu người dùng không chỉ định --preset thì mặc định render cả hai
ARGS=("$@")
if ! printf '%s\n' "$@" | grep -q -- '--preset'; then
  ARGS+=(--preset all)
fi

echo "==> Render: node render.js ${ARGS[*]}"
node render.js "${ARGS[@]}"

echo "==> Xong. Các file video (nếu đã ghép):"
ls -1 kiro-tutorial-*.mp4 2>/dev/null || echo "    (chưa có video — có thể bạn dùng --frames-only)"
