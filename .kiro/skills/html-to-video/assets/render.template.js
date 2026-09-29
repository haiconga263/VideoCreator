const puppeteer = require("puppeteer");
const { spawnSync } = require("child_process");
const ffmpegPath = require("ffmpeg-static");
const fs = require("fs");
const path = require("path");

const slides = require("./slides");
const css = require("./style");

// ---------- Preset (nền tảng) ----------
// Dùng: node render.js --preset youtube   (16:9 ngang, mặc định)
//       node render.js --preset tiktok    (9:16 dọc, cho TikTok / YouTube Shorts / Reels)
const arg = process.argv.find((a) => a.startsWith("--preset="));
const flagIdx = process.argv.indexOf("--preset");
const PRESET =
  (arg ? arg.split("=")[1] : flagIdx >= 0 ? process.argv[flagIdx + 1] : "youtube") ||
  "youtube";

const PRESETS = {
  youtube: { w: 1920, h: 1080, out: "kiro-tutorial-youtube.mp4", label: "YouTube 16:9" },
  tiktok:  { w: 1080, h: 1920, out: "kiro-tutorial-tiktok.mp4",  label: "TikTok 9:16" },
};
if (!PRESETS[PRESET]) {
  console.error(`Preset không hợp lệ: "${PRESET}". Chọn: ${Object.keys(PRESETS).join(", ")}`);
  process.exit(1);
}

const FPS = 60;
const SCALE = 2; // deviceScaleFactor: 2 -> 4K (youtube 3840x2160, tiktok 2160x3840)
const { w: WIDTH, h: HEIGHT, out: OUT_NAME, label } = PRESETS[PRESET];

const FRAMES_DIR = path.join(__dirname, `frames_${PRESET}`);
const VIDEO_NOAUDIO = path.join(__dirname, `_silent_${PRESET}.mp4`);
const MUSIC = path.join(__dirname, "music.wav");
const OUTPUT = path.join(__dirname, OUT_NAME);

function pageHtml(slideHtml) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body data-preset="${PRESET}">${slideHtml}</body></html>`;
}

(async () => {
  console.log(`Preset: ${label} — ${WIDTH * SCALE}x${HEIGHT * SCALE} @ ${FPS}fps`);
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

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
    await page.setContent(pageHtml(slide.html), { waitUntil: "domcontentloaded" });
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
          window.__anims.forEach((a) => {
            try { a.currentTime = ms; } catch (e) {}
          });
          document.getElementById("__fade").style.opacity = op;
        },
        tMs,
        overlay
      );

      const file = path.join(FRAMES_DIR, `frame_${String(frameIndex).padStart(6, "0")}.png`);
      await page.screenshot({ path: file });
      frameIndex++;
    }
    console.log(`Slide ${s + 1}/${slides.length} (${slide.id}): ${totalFrames} frames`);
  }

  await browser.close();
  console.log(`Tổng cộng ${frameIndex} frames @ ${FPS}fps. Ghép video...`);

  let res = spawnSync(
    ffmpegPath,
    [
      "-y",
      "-framerate", String(FPS),
      "-i", path.join(FRAMES_DIR, "frame_%06d.png"),
      "-c:v", "libx264",
      "-pix_fmt", "yuv420p",
      "-crf", "18",
      "-preset", "medium",
      VIDEO_NOAUDIO,
    ],
    { stdio: "inherit" }
  );
  if (res.status !== 0) { console.error("ffmpeg (video) lỗi"); process.exit(1); }

  if (fs.existsSync(MUSIC)) {
    res = spawnSync(
      ffmpegPath,
      [
        "-y",
        "-i", VIDEO_NOAUDIO,
        "-i", MUSIC,
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        OUTPUT,
      ],
      { stdio: "inherit" }
    );
    if (res.status !== 0) { console.error("ffmpeg (audio) lỗi"); process.exit(1); }
    fs.rmSync(VIDEO_NOAUDIO, { force: true });
    console.log(`Xong! Video (${label}) có nhạc:`, OUTPUT);
  } else {
    fs.renameSync(VIDEO_NOAUDIO, OUTPUT);
    console.log(`Xong (${label}, không có music.wav):`, OUTPUT);
  }
})();
