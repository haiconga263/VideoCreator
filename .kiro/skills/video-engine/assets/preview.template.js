// Chụp thử 1 frame cho mỗi slide ở 1 preset để kiểm tra layout nhanh (không render cả video).
// Dùng: node preview.js tiktok  |  node preview.js youtube
const puppeteer = require("puppeteer");
const path = require("path");
const slides = require("./slides");
const css = require("./style");

const PRESET = process.argv[2] || "tiktok";
const DIMS = { youtube: [1920, 1080], tiktok: [1080, 1920] }[PRESET];

(async () => {
  const b = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const p = await b.newPage();
  await p.setViewport({ width: DIMS[0], height: DIMS[1], deviceScaleFactor: 1 });
  // Chụp slide bước 1 (index 1) và pipeline (index 3) làm đại diện
  for (const idx of [1, 3]) {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body data-preset="${PRESET}">${slides[idx].html}</body></html>`;
    await p.setContent(html, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 200));
    await p.evaluate(() => document.getAnimations().forEach((a) => { a.currentTime = 2000; a.pause(); }));
    const f = path.join(__dirname, `preview_${PRESET}_${idx}.png`);
    await p.screenshot({ path: f });
    console.log("Đã chụp:", f);
  }
  await b.close();
})();
