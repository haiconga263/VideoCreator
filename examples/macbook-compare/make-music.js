// Tự sinh nhạc nền (không vướng bản quyền) và xuất file WAV.
// Phong cách: UPBEAT / energetic — tempo ~124 BPM, beat trống rõ (kick+snare+hi-hat),
// bassline chạy nốt móc đơn, arpeggio nhanh + pluck. Sôi động, hợp video công nghệ.
// Không dùng thư viện ngoài, tự ghi PCM WAV.

const fs = require("fs");
const path = require("path");

const SAMPLE_RATE = 44100;
let DURATION = 23;
try {
  const slides = require("./slides");
  DURATION = Math.ceil(slides.reduce((n, s) => n + s.duration, 0) + 0.3);
} catch (e) {}
const N = SAMPLE_RATE * DURATION;

const NOTE = {
  E1: 41.2, G1: 49.0, A1: 55.0, C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.0, A2: 110.0,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0,
};

// ---- Nhịp điệu ----
const BPM = 124;
const beatDur = 60 / BPM;      // 1 phách (giây)
const barDur = beatDur * 4;    // 1 ô nhịp 4/4
const step16 = beatDur / 4;    // 1 nốt móc kép (1/16)

// Vòng hợp âm sôi động (Am–F–C–G, kiểu pop/EDM), lặp lại
const prog = [
  { root: "A2", notes: ["A3", "C4", "E4"] },  // Am
  { root: "F2", notes: ["F3", "A3", "C4"] },  // F
  { root: "C3", notes: ["C4", "E4", "G4"] },  // C
  { root: "G2", notes: ["G3", "B3", "D4"] },  // G
];

// Nốt arpeggio theo từng bước 1/16 (cao, tươi sáng)
function arpNote(chord, i16) {
  const seq = [chord.notes[0], chord.notes[1], chord.notes[2], chord.notes[1]];
  return NOTE[seq[i16 % 4]] * 2;
}

function softClip(x) { return Math.tanh(x * 1.1); }
function saw(w) { // xấp xỉ răng cưa bằng vài harmonic
  return (Math.sin(w) + Math.sin(2*w)/2 + Math.sin(3*w)/3 + Math.sin(4*w)/4) * 0.5;
}
function noise() { return Math.random() * 2 - 1; }

const buf = new Float32Array(N);

for (let i = 0; i < N; i++) {
  const t = i / SAMPLE_RATE;
  const barIdx = Math.floor(t / barDur);
  const chord = prog[barIdx % prog.length];
  const tInBar = t - barIdx * barDur;
  const beatInBar = Math.floor(tInBar / beatDur);   // 0..3
  const i16 = Math.floor(tInBar / step16);          // 0..15
  const tIn16 = tInBar - i16 * step16;
  const tInBeat = tInBar - beatInBar * beatDur;

  let s = 0;

  // 1) KICK: mỗi phách (4 on-the-floor) — mạnh, sôi động
  {
    const k = tInBeat;
    if (k < 0.14) {
      const env = Math.exp(-k * 32);
      const freq = 130 * Math.exp(-k * 28) + 48;
      s += Math.sin(2 * Math.PI * freq * k) * 0.9 * env;
    }
  }

  // 2) SNARE/CLAP: phách 2 và 4 (backbeat)
  if (beatInBar === 1 || beatInBar === 3) {
    const sn = tInBeat;
    if (sn < 0.14) {
      const env = Math.exp(-sn * 26);
      s += noise() * 0.30 * env;
      s += Math.sin(2 * Math.PI * 180 * sn) * 0.10 * env;
    }
  }

  // 3) HI-HAT: mỗi nốt móc kép (16th) — tạo cảm giác nhanh, năng lượng
  {
    const h = tIn16;
    const open = i16 % 4 === 2; // hé mở nhẹ
    const env = Math.exp(-h * (open ? 40 : 90));
    s += noise() * (open ? 0.10 : 0.06) * env;
  }

  // 4) BASS: chạy nốt móc đơn (8th) theo nốt gốc hợp âm — nảy, groovy
  {
    const b8 = Math.floor(tInBar / (beatDur / 2));
    const tIn8 = tInBar - b8 * (beatDur / 2);
    const env = Math.min(1, tIn8 / 0.008) * Math.exp(-tIn8 * 5);
    const bf = NOTE[chord.root];
    s += saw(2 * Math.PI * bf * t) * 0.28 * env;
  }

  // 5) ARP pluck nhanh (16th) — tươi sáng, dẫn dắt
  {
    const env = Math.min(1, tIn16 / 0.005) * Math.exp(-tIn16 * 9);
    const f = arpNote(chord, i16);
    s += saw(2 * Math.PI * f * t) * 0.12 * env;
  }

  // 6) PAD hợp âm nền (giữ nhẹ để dày tiếng, không làm đục beat)
  {
    let pad = 0;
    for (const n of chord.notes) pad += Math.sin(2 * Math.PI * NOTE[n] * t);
    s += pad * 0.035;
  }

  // Fade in (0.5s) / fade out (1.2s)
  const gIn = Math.min(1, t / 0.5);
  const gOut = Math.min(1, (DURATION - t) / 1.2);
  s *= gIn * gOut * 0.62;

  buf[i] = softClip(s);
}

// Ghi WAV 16-bit mono
const bytesPerSample = 2;
const dataSize = N * bytesPerSample;
const out = Buffer.alloc(44 + dataSize);
out.write("RIFF", 0);
out.writeUInt32LE(36 + dataSize, 4);
out.write("WAVE", 8);
out.write("fmt ", 12);
out.writeUInt32LE(16, 16);
out.writeUInt16LE(1, 20);
out.writeUInt16LE(1, 22);
out.writeUInt32LE(SAMPLE_RATE, 24);
out.writeUInt32LE(SAMPLE_RATE * bytesPerSample, 28);
out.writeUInt16LE(bytesPerSample, 32);
out.writeUInt16LE(16, 34);
out.write("data", 36);
out.writeUInt32LE(dataSize, 40);
for (let i = 0; i < N; i++) {
  let v = Math.max(-1, Math.min(1, buf[i]));
  out.writeInt16LE((v * 32767) | 0, 44 + i * 2);
}

const file = path.join(__dirname, "music.wav");
fs.writeFileSync(file, out);
console.log("Đã tạo nhạc nền (upbeat ~" + BPM + " BPM):", file, `(${DURATION}s)`);
