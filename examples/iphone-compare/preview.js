// Chụp thử slide cho 1 preset để kiểm tra layout nhanh.
// Dùng: node preview.js <preset> <idx1> <idx2> ...
//   vd: node preview.js youtube 1 2 5
const puppeteer = require("puppeteer");
const path = require("path");
const slides = require("./slides");
const css = require("./style");

const PRESET = process.argv[2] || "youtube";
const idxs = process.argv.slice(3).map(Number);
const list = idxs.length ? idxs : [1, 2];
const DIMS = { youtube: [1920, 1080], tiktok: [1080, 1920] }[PRESET];

(async () => {
  const b = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const p = await b.newPage();
  await p.setViewport({ width: DIMS[0], height: DIMS[1], deviceScaleFactor: 1 });
  for (const idx of list) {
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
