// CSS dùng chung cho tất cả các slide, hỗ trợ 2 preset qua thuộc tính body[data-preset]:
//   - "youtube": 1920x1080 (16:9, ngang)  -> giữ layout cũ
//   - "tiktok" : 1080x1920 (9:16, dọc)    -> xếp dọc, chữ to, chừa safe zone
// Animation dùng CSS @keyframes để "tua" tất định bằng Web Animations API trong Puppeteer.

module.exports = `
* { margin: 0; padding: 0; box-sizing: border-box; }

html, body {
  overflow: hidden;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ---------- Kích thước khung theo preset ---------- */
body[data-preset="youtube"], body[data-preset="youtube"] .slide { width: 1920px; height: 1080px; }
body[data-preset="tiktok"],  body[data-preset="tiktok"]  .slide { width: 1080px; height: 1920px; }

.slide {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
  position: relative;
}

body[data-preset="youtube"] .slide { padding: 120px 140px; }
/* TikTok: chừa safe zone — lề phải cho nút, lề dưới cho caption/username */
body[data-preset="tiktok"] .slide { padding: 220px 96px 380px 96px; gap: 40px; }

.slide-center { align-items: center; text-align: center; justify-content: center; }

/* Nền tech mới: xanh đen sâu + 2 vùng glow màu + lưới grid mờ */
.dark-bg {
  color: #e8ecf5;
  background:
    radial-gradient(900px 700px at 12% 8%, rgba(100,210,255,.18), transparent 60%),
    radial-gradient(1000px 800px at 92% 100%, rgba(255,159,10,.16), transparent 60%),
    linear-gradient(160deg, #0b1020 0%, #0a0e1a 60%, #090b14 100%);
}
.dark-bg::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(circle at 50% 40%, #000 55%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle at 50% 40%, #000 55%, transparent 100%);
}
/* Nền gradient mới: mesh nhiều màu tím–xanh–hồng, sống động hơn */
.gradient-bg {
  color: #fff;
  background:
    radial-gradient(700px 700px at 15% 20%, #6a5cff 0%, transparent 55%),
    radial-gradient(800px 800px at 85% 30%, #d63aff 0%, transparent 55%),
    radial-gradient(700px 700px at 50% 100%, #00c2ff 0%, transparent 55%),
    linear-gradient(135deg, #3a1c71 0%, #5b2a9d 50%, #2a1160 100%);
}
/* đảm bảo nội dung nằm trên lớp grid */
.slide > * { position: relative; z-index: 1; }

/* ---------- Typography (mặc định = youtube) ---------- */
h1 { font-size: 108px; font-weight: 800; letter-spacing: -2px; line-height: 1.05; }
h2 { font-size: 84px; font-weight: 800; letter-spacing: -1px; color: #fff; }
.accent { color: #ffe066; }
.subtitle { font-size: 40px; font-weight: 400; opacity: .95; max-width: 1200px; }
.body { font-size: 40px; opacity: .85; max-width: 1400px; line-height: 1.4; }

/* TikTok: phóng to chữ để đọc rõ trên điện thoại */
body[data-preset="tiktok"] h1 { font-size: 120px; }
body[data-preset="tiktok"] h2 { font-size: 92px; line-height: 1.08; }
body[data-preset="tiktok"] .subtitle { font-size: 52px; max-width: 100%; }
body[data-preset="tiktok"] .body { font-size: 52px; max-width: 100%; }

.logo-badge {
  width: 160px; height: 160px; border-radius: 36px;
  background: rgba(255,255,255,.18);
  border: 3px solid rgba(255,255,255,.5);
  display: flex; align-items: center; justify-content: center;
  font-size: 90px; margin-bottom: 20px;
  backdrop-filter: blur(4px);
}
body[data-preset="tiktok"] .logo-badge { width: 200px; height: 200px; font-size: 110px; }

.step-tag {
  display: inline-block; align-self: flex-start;
  background: #ffe066; color: #1a1a2e;
  font-size: 30px; font-weight: 700;
  padding: 10px 28px; border-radius: 40px;
}
body[data-preset="tiktok"] .step-tag { font-size: 40px; padding: 14px 36px; }

.cards { display: flex; gap: 40px; margin-top: 20px; }
/* TikTok: xếp card theo cột thay vì hàng ngang */
body[data-preset="tiktok"] .cards { flex-direction: column; gap: 44px; }
.card {
  flex: 1; background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 28px; padding: 44px;
}
.card-icon { font-size: 64px; margin-bottom: 20px; }
.card-title { font-size: 44px; font-weight: 700; margin-bottom: 14px; color: #fff; }
.card-desc { font-size: 30px; opacity: .78; line-height: 1.4; }
body[data-preset="tiktok"] .card-icon { font-size: 84px; }
body[data-preset="tiktok"] .card-title { font-size: 60px; }
body[data-preset="tiktok"] .card-desc { font-size: 42px; }

.chat { display: flex; flex-direction: column; gap: 28px; margin-top: 24px; max-width: 1400px; }
body[data-preset="tiktok"] .chat { max-width: 100%; gap: 36px; }
.msg { font-size: 36px; padding: 32px 40px; border-radius: 28px; line-height: 1.4; }
.msg.user { background: #5b6cff; color: #fff; align-self: flex-end; border-bottom-right-radius: 8px; max-width: 70%; }
.msg.bot { background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12); align-self: flex-start; border-bottom-left-radius: 8px; max-width: 80%; }
.msg code { background: rgba(0,0,0,.3); padding: 2px 12px; border-radius: 8px; color: #ffe066; }
body[data-preset="tiktok"] .msg { font-size: 48px; }
body[data-preset="tiktok"] .msg.user { max-width: 88%; }
body[data-preset="tiktok"] .msg.bot { max-width: 92%; }

.pipeline { display: flex; align-items: center; gap: 32px; margin-top: 40px; }
/* TikTok: pipeline xếp dọc, mũi tên xoay xuống */
body[data-preset="tiktok"] .pipeline { flex-direction: column; align-items: stretch; gap: 24px; }
.pipe-item {
  display: flex; align-items: center; gap: 20px;
  background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.14);
  padding: 36px 48px; border-radius: 24px; font-size: 44px; font-weight: 600;
}
.pipe-item .num {
  width: 60px; height: 60px; border-radius: 50%;
  background: #8b3bff; color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: 34px;
}
.pipe-arrow { font-size: 60px; opacity: .5; }
body[data-preset="tiktok"] .pipe-item { font-size: 56px; }
body[data-preset="tiktok"] .pipe-item .num { width: 76px; height: 76px; font-size: 42px; }
/* TikTok: thay mũi tên bằng tam giác vẽ bằng CSS border (không phụ thuộc font) */
body[data-preset="tiktok"] .pipe-arrow {
  align-self: center; width: 0; height: 0; font-size: 0; overflow: hidden;
  border-left: 26px solid transparent;
  border-right: 26px solid transparent;
  border-top: 34px solid rgba(255,255,255,.55);
  opacity: 1;
}

.code-block {
  background: #0a0e18; border: 1px solid rgba(255,255,255,.12);
  border-radius: 24px; padding: 48px; margin-top: 24px;
  font-family: 'Consolas', 'Monaco', monospace; font-size: 38px;
  line-height: 1.7; white-space: pre; color: #e8ecf5; max-width: 1400px;
}
.c-com { color: #6b7a99; }
.c-key { color: #d63aff; }
body[data-preset="tiktok"] .code-block { font-size: 40px; max-width: 100%; white-space: pre-wrap; }

/* ---------- Phone mockup (vẽ bằng CSS) ---------- */
.phone {
  width: 150px; height: 300px; margin: 0 auto 20px;
  border-radius: 34px; position: relative;
  background: linear-gradient(160deg, #2a2f3e, #12151f);
  border: 3px solid rgba(255,255,255,.18);
  box-shadow: 0 20px 50px rgba(0,0,0,.5), inset 0 0 0 6px #0a0d16;
}
.phone .screen {
  position: absolute; inset: 12px; border-radius: 24px;
  background: linear-gradient(160deg, #1b2745, #0d1730);
  overflow: hidden;
}
.phone .island {
  position: absolute; top: 14px; left: 50%; transform: translateX(-50%);
  width: 54px; height: 16px; border-radius: 10px; background: #05070d;
}
.phone.p18 .island { width: 40px; } /* Dynamic Island nhỏ hơn */
.phone .cam {
  position: absolute; top: 16px; left: 16px;
  width: 60px; height: 60px; border-radius: 18px;
  background: radial-gradient(circle at 30% 30%, #333a4d, #14171f);
  border: 2px solid rgba(255,255,255,.1);
}
.phone .cam::before, .phone .cam::after {
  content: ""; position: absolute; width: 20px; height: 20px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #6fb4ff, #10233f);
  border: 2px solid #0a0d16;
}
.phone .cam::before { top: 6px; left: 6px; }
.phone .cam::after  { bottom: 6px; right: 6px; }
.phone.p18 { background: linear-gradient(160deg, #3a2f22, #16120c); border-color: rgba(255,159,10,.35); }
.phone.p18 .screen { background: linear-gradient(160deg, #12233f, #0a1428); }
body[data-preset="tiktok"] .phone { width: 130px; height: 260px; }

/* ---------- Bar chart hiệu năng ---------- */
.bars { display: flex; align-items: flex-end; gap: 60px; height: 320px; margin: 30px auto 0; justify-content: center; }
.bar-group { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.bar {
  width: 130px; border-radius: 16px 16px 0 0; position: relative;
  display: flex; align-items: flex-start; justify-content: center;
  color: #0a0d16; font-weight: 800; font-size: 30px; padding-top: 14px;
}
.bar.b17 { background: linear-gradient(180deg, #ffe066, #f5c518); }
.bar.b18 { background: linear-gradient(180deg, #64d2ff, #2a9fd6); }
.bar-label { font-size: 28px; opacity: .85; text-align: center; }
.bar-cap { font-size: 24px; opacity: .55; }

/* ---------- Compare: 2 cột thiết bị ---------- */
.vs { display: flex; align-items: stretch; gap: 40px; margin-top: 20px; }
.vs-col {
  flex: 1; background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.12); border-radius: 28px;
  padding: 48px 40px; text-align: center;
}
.vs-col.hot { border-color: rgba(255,159,10,.5); background: rgba(255,159,10,.08); }
.vs-name { font-size: 44px; font-weight: 800; color: #fff; margin-bottom: 6px; }
.vs-year { font-size: 26px; opacity: .6; margin-bottom: 24px; }
.vs-big { font-size: 72px; font-weight: 800; color: #ffe066; line-height: 1.1; }
.vs-big.blue { color: #64d2ff; }
.vs-sub { font-size: 30px; opacity: .8; margin-top: 12px; line-height: 1.35; }
.vs-badge {
  display: inline-block; margin-top: 22px;
  background: #ff9f0a; color: #1a1a2e; font-weight: 700;
  font-size: 24px; padding: 8px 22px; border-radius: 30px;
}
.vs-mid {
  display: flex; align-items: center; justify-content: center;
  font-size: 56px; font-weight: 800; color: #fff; opacity: .35;
  min-width: 80px;
}

/* Bảng so sánh theo dòng */
.spec-row {
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
  gap: 24px; padding: 22px 32px; border-radius: 18px; margin-bottom: 14px;
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
}
.spec-a, .spec-b { font-size: 36px; font-weight: 600; color: #fff; }
.spec-a { text-align: right; }
.spec-b { text-align: left; }
.spec-label { font-size: 24px; opacity: .55; text-transform: uppercase; letter-spacing: 1px; white-space: nowrap; }
.spec-b.win { color: #64d2ff; }
.spec-a.win { color: #ffe066; }

/* TikTok: cột thiết bị xếp dọc, bảng spec chữ to hơn */
body[data-preset="tiktok"] .vs { flex-direction: row; gap: 24px; }
body[data-preset="tiktok"] .vs-col { padding: 40px 24px; }
body[data-preset="tiktok"] .vs-name { font-size: 46px; }
body[data-preset="tiktok"] .vs-big { font-size: 66px; }
body[data-preset="tiktok"] .vs-sub { font-size: 32px; }
body[data-preset="tiktok"] .spec-row { padding: 26px 28px; }
body[data-preset="tiktok"] .spec-a, body[data-preset="tiktok"] .spec-b { font-size: 40px; }
body[data-preset="tiktok"] .spec-label { font-size: 26px; }

/* ---------- Animations (keyframe-based, seekable) ---------- */
@keyframes fadeUp   { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
@keyframes fadeLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: none; } }
@keyframes pop      { from { opacity: 0; transform: scale(.6); } 70% { transform: scale(1.05); } to { opacity: 1; transform: scale(1); } }

.anim-up, .anim-left, .anim-pop { opacity: 0; }
.anim-up   { animation: fadeUp   .7s cubic-bezier(.2,.7,.3,1) forwards; }
.anim-left { animation: fadeLeft .7s cubic-bezier(.2,.7,.3,1) forwards; }
.anim-pop  { animation: pop      .8s cubic-bezier(.2,.7,.3,1) forwards; }

.delay-1 { animation-delay: .18s; }
.delay-2 { animation-delay: .36s; }
.delay-3 { animation-delay: .54s; }
`;
