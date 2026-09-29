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

.dark-bg {
  background: radial-gradient(1200px 800px at 80% -10%, #1e2a4a 0%, #0d1220 55%);
  color: #e8ecf5;
}
.gradient-bg {
  background: linear-gradient(135deg, #5b6cff 0%, #8b3bff 50%, #d63aff 100%);
  color: #fff;
}

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
