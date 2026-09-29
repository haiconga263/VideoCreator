// Video so sánh MacBook Pro 14" M2 (M2 Pro/Max, đầu 2023) vs M3 (M3/Pro/Max, cuối 2023).
// Nguồn: apple.com newsroom + tech specs, macworld/9to5mac/techradar/rtings (2023).
// Điểm mấu chốt: thiết kế bên ngoài gần như y hệt; nâng cấp nằm ở chip 3nm, độ sáng
// màn hình, pin, RAM tối đa (96GB -> 128GB), thêm màu Space Black và bản M3 cơ bản.

module.exports = [
  {
    id: "intro",
    duration: 4,
    html: `
      <div class="slide slide-center gradient-bg">
        <div class="logo-badge anim-pop">💻</div>
        <h1 class="anim-up">MacBook Pro 14"<br>M2 <span class="accent">vs</span> M3</h1>
        <p class="subtitle anim-up delay-1">So sánh nhanh: chip, màn hình, pin & RAM</p>
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
            <div class="laptop"><div class="lid"><div class="notch"></div><div class="display"></div></div><div class="base"></div></div>
            <div class="vs-name">MacBook Pro 14" M2</div>
            <div class="vs-year">Đầu 2023</div>
            <div class="vs-big">5nm</div>
            <div class="vs-sub">M2 Pro / M2 Max<br>Bạc &amp; Xám không gian</div>
          </div>
          <div class="vs-mid anim-up delay-2">VS</div>
          <div class="vs-col hot anim-up delay-3">
            <div class="laptop black"><div class="lid"><div class="notch"></div><div class="display"></div></div><div class="base"></div></div>
            <div class="vs-name">MacBook Pro 14" M3</div>
            <div class="vs-year">Cuối 2023</div>
            <div class="vs-big blue">3nm</div>
            <div class="vs-sub">M3 / M3 Pro / M3 Max<br>Thêm màu Space Black</div>
            <div class="vs-badge">Mới hơn</div>
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
        <h2 class="anim-up">Chip — bước nhảy lên 3nm</h2>
        <div style="margin-top:20px">
          <div class="spec-row anim-up delay-1">
            <div class="spec-a">Tiến trình 5nm</div>
            <div class="spec-label">Kiến trúc</div>
            <div class="spec-b win">Tiến trình 3nm</div>
          </div>
          <div class="spec-row anim-up delay-2">
            <div class="spec-a">M2 Pro / M2 Max</div>
            <div class="spec-label">Tùy chọn chip</div>
            <div class="spec-b win">Thêm bản M3 cơ bản + Pro/Max</div>
          </div>
          <div class="spec-row anim-up delay-3">
            <div class="spec-a">GPU mạnh</div>
            <div class="spec-label">Đồ họa</div>
            <div class="spec-b win">GPU mới: Dynamic Caching, ray tracing</div>
          </div>
        </div>
      </div>`,
  },
  {
    id: "display",
    duration: 5,
    html: `
      <div class="slide dark-bg">
        <div class="step-tag anim-left">Màn hình & pin</div>
        <h2 class="anim-up">Hiển thị & thời lượng</h2>
        <div style="margin-top:20px">
          <div class="spec-row anim-up delay-1">
            <div class="spec-a">14.2" Liquid Retina XDR</div>
            <div class="spec-label">Tấm nền</div>
            <div class="spec-b">14.2" Liquid Retina XDR</div>
          </div>
          <div class="spec-row anim-up delay-2">
            <div class="spec-a">~500 nits SDR</div>
            <div class="spec-label">Độ sáng</div>
            <div class="spec-b win">Sáng hơn (~600 nits SDR)</div>
          </div>
          <div class="spec-row anim-up delay-3">
            <div class="spec-a">Pin cả ngày</div>
            <div class="spec-label">Pin</div>
            <div class="spec-b win">Lâu hơn nhờ 3nm tiết kiệm điện</div>
          </div>
        </div>
      </div>`,
  },
  {
    id: "memory",
    duration: 5,
    html: `
      <div class="slide dark-bg">
        <div class="step-tag anim-left">Bộ nhớ</div>
        <h2 class="anim-up">RAM tối đa cao hơn</h2>
        <div class="bars">
          <div class="bar-group anim-up delay-1">
            <div class="bar b17" style="height:216px">96GB</div>
            <div class="bar-label">M2 (Max)<br><span class="bar-cap">RAM tối đa</span></div>
          </div>
          <div class="bar-group anim-up delay-2">
            <div class="bar b18" style="height:288px">128GB</div>
            <div class="bar-label">M3 (Max)<br><span class="bar-cap">RAM tối đa</span></div>
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
            <div class="vs-name">MacBook Pro M2</div>
            <div class="vs-sub">Vẫn rất mạnh, thường có giá tốt hơn.<br>Hợp nếu bắt được deal / hàng cũ.</div>
          </div>
          <div class="vs-col hot anim-up delay-2">
            <div class="vs-name">MacBook Pro M3</div>
            <div class="vs-sub">3nm hiệu quả hơn, màn sáng hơn, RAM tới 128GB,<br>thêm Space Black. Đáng cho người mua mới.</div>
          </div>
        </div>
      </div>`,
  },
  {
    id: "outro",
    duration: 3.5,
    html: `
      <div class="slide slide-center gradient-bg">
        <div class="logo-badge anim-pop">💻</div>
        <h1 class="anim-up">Bạn chọn máy nào?</h1>
        <p class="subtitle anim-up delay-1">Để lại bình luận bên dưới nhé!</p>
      </div>`,
  },
];
