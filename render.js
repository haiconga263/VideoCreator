const puppeteer = require("puppeteer");
const { spawnSync } = require("child_process");
const ffmpegPath = require("ffmpeg-static");
const fs = require("fs");
const path = require("path");

const slides = require("./slides");
const css = require("./style");

const FPS = 60; // tăng lên 60fps cho mượt
const WIDTH = 1920;   // kích thước layout CSS (giữ nguyên)
const HEIGHT = 1080;
const SCALE = 2;      // deviceScaleFactor: 2 -> render ở 3840x2160 (4K UHD)
const FRAMES_DIR = path.join(__dirname, "frames");
const VIDEO_NOAUDIO = path.join(__dirname, "kiro-tutorial-silent.mp4");
const MUSIC = path.join(__dirname, "music.wav");
const OUTPUT = path.join(__dirname, "kiro-tutorial.mp4");

function pageHtml(slideHtml) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${slideHtml}</body></html>`;
}

(async () => {
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--force-color-profile=srgb"],
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: SCALE },
  });
  const page = await browser.newPage();

  let frameIndex = 0;
  const fadeDur = 0.25; // thời lượng fade chuyển cảnh (giây)

  for (let s = 0; s < slides.length; s++) {
    const slide = slides[s];
    const totalFrames = Math.round(slide.duration * FPS);
    await page.setContent(pageHtml(slide.html), { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 120)); // layout ổn định

    // Tạm dừng tất cả animation để tua tất định
    await page.evaluate(() => {
      window.__anims = document.getAnimations();
      window.__anims.forEach((a) => a.pause());
      // overlay fade chuyển cảnh
      const el = document.createElement("div");
      el.id = "__fade";
      el.style.cssText =
        "position:fixed;inset:0;background:#0d1220;z-index:9999;pointer-events:none;opacity:0;";
      document.body.appendChild(el);
    });

    for (let f = 0; f < totalFrames; f++) {
      const tMs = (f / FPS) * 1000; // thời điểm animation hiện tại
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

      const file = path.join(
        FRAMES_DIR,
        `frame_${String(frameIndex).padStart(6, "0")}.png`
      );
      await page.screenshot({ path: file });
      frameIndex++;
    }
    console.log(`Slide ${s + 1}/${slides.length} (${slide.id}): ${totalFrames} frames`);
  }

  await browser.close();
  console.log(`Tổng cộng ${frameIndex} frames @ ${FPS}fps. Ghép video...`);

  // 1) Frame -> video không tiếng
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

  // 2) Ghép nhạc nền (nếu có music.wav)
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
    console.log("Xong! Video có nhạc:", OUTPUT);
  } else {
    fs.renameSync(VIDEO_NOAUDIO, OUTPUT);
    console.log("Xong (không có music.wav):", OUTPUT);
  }
})();
