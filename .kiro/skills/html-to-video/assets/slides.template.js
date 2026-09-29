// Nội dung các slide hướng dẫn sử dụng Kiro app.
// Mỗi slide có: thời lượng (giây), và hàm render HTML.
// Bạn có thể chỉnh sửa text ở đây để đổi nội dung video.

module.exports = [
  {
    id: "intro",
    duration: 3.5,
    html: `
      <div class="slide slide-center gradient-bg">
        <div class="logo-badge anim-pop">◆</div>
        <h1 class="anim-up">Bắt đầu với <span class="accent">Kiro</span></h1>
        <p class="subtitle anim-up delay-1">Trợ lý lập trình AI — Hướng dẫn sử dụng cơ bản</p>
      </div>`,
  },
  {
    id: "step1",
    duration: 4,
    html: `
      <div class="slide dark-bg">
        <div class="step-tag anim-left">Bước 1</div>
        <h2 class="anim-up">Tạo phiên làm việc mới</h2>
        <p class="body anim-up delay-1">Mở Kiro và bắt đầu một session mới. Chọn chế độ phù hợp:</p>
        <div class="cards">
          <div class="card anim-up delay-2">
            <div class="card-icon">💬</div>
            <div class="card-title">Vibe</div>
            <div class="card-desc">Phát triển tương tác, cộng tác từng bước cùng Kiro.</div>
          </div>
          <div class="card anim-up delay-3">
            <div class="card-icon">⚡</div>
            <div class="card-title">Autonomous</div>
            <div class="card-desc">Kiro tự động giải quyết task từ đầu đến cuối.</div>
          </div>
        </div>
      </div>`,
  },
  {
    id: "step2",
    duration: 4,
    html: `
      <div class="slide dark-bg">
        <div class="step-tag anim-left">Bước 2</div>
        <h2 class="anim-up">Trò chuyện với Kiro</h2>
        <p class="body anim-up delay-1">Mô tả điều bạn muốn bằng ngôn ngữ tự nhiên.</p>
        <div class="chat anim-up delay-2">
          <div class="msg user">Tạo cho tôi một API đăng nhập bằng Node.js</div>
          <div class="msg bot">Được! Mình sẽ tạo route <code>/login</code> với xác thực JWT...</div>
        </div>
      </div>`,
  },
  {
    id: "step3",
    duration: 4,
    html: `
      <div class="slide dark-bg">
        <div class="step-tag anim-left">Bước 3</div>
        <h2 class="anim-up">Dùng Spec cho tính năng lớn</h2>
        <p class="body anim-up delay-1">Chia nhỏ tính năng phức tạp qua 3 giai đoạn:</p>
        <div class="pipeline">
          <div class="pipe-item anim-up delay-1"><span class="num">1</span>Requirements</div>
          <div class="pipe-arrow anim-up delay-2">→</div>
          <div class="pipe-item anim-up delay-2"><span class="num">2</span>Design</div>
          <div class="pipe-arrow anim-up delay-3">→</div>
          <div class="pipe-item anim-up delay-3"><span class="num">3</span>Tasks</div>
        </div>
      </div>`,
  },
  {
    id: "step4",
    duration: 4,
    html: `
      <div class="slide dark-bg">
        <div class="step-tag anim-left">Bước 4</div>
        <h2 class="anim-up">Steering — Ghi nhớ quy tắc</h2>
        <p class="body anim-up delay-1">Đặt file trong <code>.kiro/steering/</code> để Kiro luôn tuân theo chuẩn của bạn.</p>
        <div class="code-block anim-up delay-2">
<span class="c-com"># .kiro/steering/style.md</span>
<span class="c-key">-</span> Dùng TypeScript strict mode
<span class="c-key">-</span> Format bằng Prettier
<span class="c-key">-</span> Đặt tên biến kiểu camelCase
        </div>
      </div>`,
  },
  {
    id: "outro",
    duration: 3.5,
    html: `
      <div class="slide slide-center gradient-bg">
        <div class="logo-badge anim-pop">◆</div>
        <h1 class="anim-up">Sẵn sàng bắt đầu!</h1>
        <p class="subtitle anim-up delay-1">Hãy để Kiro lo phần code — bạn tập trung vào ý tưởng.</p>
      </div>`,
  },
];
