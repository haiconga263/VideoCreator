const puppeteer = require("puppeteer");
const { spawnSync } = require("child_process");
const ffmpegPath = require("ffmpeg-static");
const fs = require("fs");
const path = require("path");

const slides = require("./slides");
const css = require("./style");

// =============================================================================
//  render.js — tạo video từ slide HTML/CSS
//
//  Cách dùng:
//    node render.js                         # render + xuất video preset youtube (mặc định)
//    node render.js --preset tiktok         # chỉ preset tiktok
//    node render.js --preset youtube,tiktok # cả hai
//    node render.js --preset all            # tất cả preset
//
//  Cờ điều khiển:
//    --frames-only     Chỉ render (lưu) frame, KHÔNG ghép video
//    --video-only      KHÔNG render; chỉ ghép video từ frame đã lưu sẵn
//    --reuse-frames    Nếu frame đã đủ số lượng thì dùng lại (bỏ qua render)
//    --clean           Xóa thư mục frame của preset trước khi render
//    --no-music        Xuất video không nhạc nền
//    --fps <n>         Số khung hình/giây (mặc định 60)
//    --scale <n>       deviceScaleFactor (1=base, 2=4K...) (mặc định 2)
//
//  Ghi chú: frame LUÔN được giữ lại (lưu ở frames_<preset>/) trừ khi bạn dùng --clean.
// =============================================================================

const argv = process.argv.slice(2);
function hasFlag(name) { return argv.includes(name); }
function getOpt(name, def) {
  const eq = argv.find((a) => a.startsWith(name + "="));
  if (eq) return eq.split("=").slice(1).join("=");
  const i = argv.indexOf(name);
  if (i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--")) return argv[i + 1];
  return def;
}

const PRESETS = {
  youtube: { w: 1920, h: 1080, out: "kiro-tutorial-youtube.mp4", label: "YouTube 16:9" },
  tiktok:  { w: 1080, h: 1920, out: "kiro-tutorial-tiktok.mp4",  label: "TikTok 9:16" },
};

const FPS = parseInt(getOpt("--fps", "60"), 10);
const SCALE = parseInt(getOpt("--scale", "2"), 10);
const FRAMES_ONLY = hasFlag("--frames-only");
const VIDEO_ONLY = hasFlag("--video-only");
const REUSE = hasFlag("--reuse-frames");
const CLEAN = hasFlag("--clean");
const USE_MUSIC = !hasFlag("--no-music");

// Chọn preset
let presetArg = getOpt("--preset", "youtube");
let presetList =
  presetArg === "all" ? Object.keys(PRESETS) : presetArg.split(",").map((s) => s.trim());
const invalid = presetList.filter((p) => !PRESETS[p]);
if (invalid.length) {
  console.error(`Preset không hợp lệ: ${invalid.join(", ")}. Chọn: ${Object.keys(PRESETS).join(", ")}, all`);
  process.exit(1);
}

const MUSIC = path.join(__dirname, "music.wav");

function pageHtml(preset, slideHtml) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body data-preset="${preset}">${slideHtml}</body></html>`;
}

function expectedFrameCount() {
  return slides.reduce((n, s) => n + Math.round(s.duration * FPS), 0);
}

async function renderFrames(preset) {
  const { w: WIDTH, h: HEIGHT, label } = PRESETS[preset];
  const FRAMES_DIR = path.join(__dirname, `frames_${preset}`);
  const expected = expectedFrameCount();

  // Tái dùng frame nếu đủ số lượng
  if (REUSE && fs.existsSync(FRAMES_DIR)) {
    const have = fs.readdirSync(FRAMES_DIR).filter((f) => f.endsWith(".png")).length;
    if (have >= expected) {
      console.log(`[${preset}] Dùng lại ${have} frame có sẵn (bỏ qua render).`);
      return FRAMES_DIR;
    }
    console.log(`[${preset}] Có ${have}/${expected} frame — render lại.`);
  }

  if (CLEAN) fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

  console.log(`[${preset}] Render: ${label} — ${WIDTH * SCALE}x${HEIGHT * SCALE} @ ${FPS}fps`);
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--force-color-profile=srgb"],
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: SCALE },
  });
  const page = await browser.newPage();

  let frameIndex = 0;
  const fadeDur = 0.25;

  for (let s = 0; s < slides.length; s++) {
    const slide = slides[s];
    const totalFrames = Math.round(slide.duration * FPS);
    await page.setContent(pageHtml(preset, slide.html), { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 120));

    await page.evaluate(() => {
      window.__anims = document.getAnimations();
      window.__anims.forEach((a) => a.pause());
      const el = document.createElement("div");
      el.id = "__fade";
      el.style.cssText =
        "position:fixed;inset:0;background:#0d1220;z-index:9999;pointer-events:none;opacity:0;";
      document.body.appendChild(el);
    });

    for (let f = 0; f < totalFrames; f++) {
      const tMs = (f / FPS) * 1000;
      let overlay = 0;
      if (s > 0 && f / FPS < fadeDur) overlay = 1 - f / FPS / fadeDur;

      await page.evaluate(
        (ms, op) => {
          window.__anims.forEach((a) => { try { a.currentTime = ms; } catch (e) {} });
          document.getElementById("__fade").style.opacity = op;
        },
        tMs,
        overlay
      );

      const file = path.join(FRAMES_DIR, `frame_${String(frameIndex).padStart(6, "0")}.png`);
      await page.screenshot({ path: file });
      frameIndex++;
    }
    console.log(`[${preset}] Slide ${s + 1}/${slides.length} (${slide.id}): ${totalFrames} frames`);
  }

  await browser.close();
  console.log(`[${preset}] Đã lưu ${frameIndex} frame vào ${path.relative(__dirname, FRAMES_DIR)}/`);
  return FRAMES_DIR;
}

function buildVideo(preset) {
  const { out, label } = PRESETS[preset];
  const FRAMES_DIR = path.join(__dirname, `frames_${preset}`);
  const OUTPUT = path.join(__dirname, out);
  const SILENT = path.join(__dirname, `_silent_${preset}.mp4`);

  if (!fs.existsSync(FRAMES_DIR) || fs.readdirSync(FRAMES_DIR).filter((f) => f.endsWith(".png")).length === 0) {
    console.error(`[${preset}] Không có frame trong ${path.relative(__dirname, FRAMES_DIR)}/. Hãy render trước (bỏ --video-only).`);
    process.exit(1);
  }

  let res = spawnSync(
    ffmpegPath,
    [
      "-y",
      "-framerate", String(FPS),
      "-i", path.join(FRAMES_DIR, "frame_%06d.png"),
      "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium",
      SILENT,
    ],
    { stdio: "inherit" }
  );
  if (res.status !== 0) { console.error(`[${preset}] ffmpeg (video) lỗi`); process.exit(1); }

  if (USE_MUSIC && fs.existsSync(MUSIC)) {
    res = spawnSync(
      ffmpegPath,
      [
        "-y", "-i", SILENT, "-i", MUSIC,
        "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest",
        OUTPUT,
      ],
      { stdio: "inherit" }
    );
    if (res.status !== 0) { console.error(`[${preset}] ffmpeg (audio) lỗi`); process.exit(1); }
    fs.rmSync(SILENT, { force: true });
    console.log(`[${preset}] Xong! Video (${label}) có nhạc: ${out}`);
  } else {
    fs.renameSync(SILENT, OUTPUT);
    console.log(`[${preset}] Xong! Video (${label})${USE_MUSIC ? " (không thấy music.wav)" : " (--no-music)"}: ${out}`);
  }
}

(async () => {
  console.log(`Preset: ${presetList.join(", ")} | fps=${FPS} scale=${SCALE} | ` +
    `${FRAMES_ONLY ? "chỉ render frame" : VIDEO_ONLY ? "chỉ ghép video" : "render + ghép video"}`);

  for (const preset of presetList) {
    if (!VIDEO_ONLY) {
      await renderFrames(preset);
    }
    if (!FRAMES_ONLY) {
      buildVideo(preset);
    }
  }
  console.log("Hoàn tất.");
})();
