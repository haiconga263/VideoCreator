// Video so sánh iPhone 17 vs iPhone 18 Pro.
// Nguồn số liệu: apple.com newsroom + tech specs, macrumors (tháng 9/2026).
// Lưu ý: iPhone 18 bản thường dự kiến ra mùa xuân 2027; bản đã phát hành là
// iPhone 18 Pro / Pro Max (9/2026) — nên video so sánh iPhone 17 với iPhone 18 Pro.

module.exports = [
  {
    id: "intro",
    duration: 4,
    html: `
      <div class="slide slide-center gradient-bg">
        <div class="logo-badge anim-pop">📱</div>
        <h1 class="anim-up">iPhone 17 <span class="accent">vs</span> iPhone 18 Pro</h1>
        <p class="subtitle anim-up delay-1">So sánh nhanh: chip, màn hình, camera & pin</p>
      </div>`,
  },
  {
    id: "overview",
    duration: 5,
    html: `
      <div class="slide dark-bg">
        <div class="step-tag anim-left">Tổng quan</div>
        <div class="vs">
          <div class="vs-col anim-up delay-1">
            <div class="vs-name">iPhone 17</div>
            <div class="vs-year">Ra mắt 9/2025</div>
            <div class="vs-big">A19</div>
            <div class="vs-sub">6.3" OLED · 120Hz<br>Camera 48MP Fusion</div>
          </div>
          <div class="vs-mid anim-up delay-2">VS</div>
          <div class="vs-col hot anim-up delay-3">
            <div class="vs-name">iPhone 18 Pro</div>
            <div class="vs-year">Ra mắt 9/2026</div>
            <div class="vs-big blue">A20 Pro</div>
            <div class="vs-sub">Chip 2nm đầu tiên<br>Tản nhiệt buồng hơi</div>
            <div class="vs-badge">Mới nhất</div>
          </div>
        </div>
      </div>`,
  },
  {
    id: "chip",
    duration: 5,
    html: `
      <div class="slide dark-bg">
        <div class="step-tag anim-left">Hiệu năng</div>
        <h2 class="anim-up">Chip xử lý</h2>
        <div style="margin-top:20px">
          <div class="spec-row anim-up delay-1">
            <div class="spec-a">A19 · tiến trình cũ</div>
            <div class="spec-label">CPU</div>
            <div class="spec-b win">A20 Pro · nhanh hơn ~20%</div>
          </div>
          <div class="spec-row anim-up delay-2">
            <div class="spec-a">GPU 5 nhân</div>
            <div class="spec-label">Đồ họa</div>
            <div class="spec-b win">nhanh hơn ~40%</div>
          </div>
          <div class="spec-row anim-up delay-3">
            <div class="spec-a">Tản nhiệt tiêu chuẩn</div>
            <div class="spec-label">Nhiệt</div>
            <div class="spec-b win">Buồng hơi (vapor chamber)</div>
          </div>
        </div>
      </div>`,
  },
  {
    id: "display",
    duration: 5,
    html: `
      <div class="slide dark-bg">
        <div class="step-tag anim-left">Màn hình & thiết kế</div>
        <h2 class="anim-up">Hiển thị</h2>
        <div style="margin-top:20px">
          <div class="spec-row anim-up delay-1">
            <div class="spec-a">6.3" OLED · 120Hz</div>
            <div class="spec-label">Tấm nền</div>
            <div class="spec-b">6.3" OLED · 120Hz</div>
          </div>
          <div class="spec-row anim-up delay-2">
            <div class="spec-a">3000 nits ngoài trời</div>
            <div class="spec-label">Độ sáng</div>
            <div class="spec-b">3000 nits ngoài trời</div>
          </div>
          <div class="spec-row anim-up delay-3">
            <div class="spec-a">Dynamic Island</div>
            <div class="spec-label">Notch</div>
            <div class="spec-b win">Dynamic Island nhỏ hơn</div>
          </div>
        </div>
      </div>`,
  },
  {
    id: "camera",
    duration: 5,
    html: `
      <div class="slide dark-bg">
        <div class="step-tag anim-left">Camera & pin</div>
        <h2 class="anim-up">Chụp ảnh & thời lượng</h2>
        <div style="margin-top:20px">
          <div class="spec-row anim-up delay-1">
            <div class="spec-a">48MP Fusion</div>
            <div class="spec-label">Camera chính</div>
            <div class="spec-b win">48MP · khẩu độ thay đổi</div>
          </div>
          <div class="spec-row anim-up delay-2">
            <div class="spec-a">Tốt trong điều kiện đủ sáng</div>
            <div class="spec-label">Thiếu sáng</div>
            <div class="spec-b win">Cải thiện rõ</div>
          </div>
          <div class="spec-row anim-up delay-3">
            <div class="spec-a">Cả ngày</div>
            <div class="spec-label">Pin</div>
            <div class="spec-b win">Lâu hơn</div>
          </div>
        </div>
      </div>`,
  },
  {
    id: "verdict",
    duration: 5,
    html: `
      <div class="slide dark-bg">
        <div class="step-tag anim-left">Kết luận</div>
        <h2 class="anim-up">Nên chọn máy nào?</h2>
        <div class="vs" style="margin-top:24px">
          <div class="vs-col anim-up delay-1">
            <div class="vs-name">iPhone 17</div>
            <div class="vs-sub">Đủ mạnh cho hầu hết nhu cầu,<br>giá tốt hơn. Hợp người dùng phổ thông.</div>
          </div>
          <div class="vs-col hot anim-up delay-2">
            <div class="vs-name">iPhone 18 Pro</div>
            <div class="vs-sub">Chip 2nm, camera & tản nhiệt vượt trội.<br>Hợp người cần hiệu năng đỉnh.</div>
          </div>
        </div>
      </div>`,
  },
  {
    id: "outro",
    duration: 3.5,
    html: `
      <div class="slide slide-center gradient-bg">
        <div class="logo-badge anim-pop">📱</div>
        <h1 class="anim-up">Bạn chọn máy nào?</h1>
        <p class="subtitle anim-up delay-1">Để lại bình luận bên dưới nhé!</p>
      </div>`,
  },
];
