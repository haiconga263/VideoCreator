// Tự sinh nhạc nền (không vướng bản quyền) và xuất file WAV.
// Phong cách: ambient/lo-fi nhẹ nhàng — vòng hợp âm arpeggio + pad + kick nhẹ.
// Không dùng thư viện ngoài, tự ghi PCM WAV.

const fs = require("fs");
const path = require("path");

const SAMPLE_RATE = 44100;
// Tự tính độ dài nhạc = tổng thời lượng các slide (khớp video) + 0.3s đệm.
let DURATION = 23;
try {
  const slides = require("./slides");
  DURATION = Math.ceil(slides.reduce((n, s) => n + s.duration, 0) + 0.3);
} catch (e) {}
const N = SAMPLE_RATE * DURATION;

// Tần số nốt (Hz)
const NOTE = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99,
};

// Vòng hợp âm 4 ô nhịp (mỗi ô ~2.875s để 8 ô = 23s), kiểu I–V–vi–IV dịu
const chords = [
  ["C3", "E4", "G4", "C5"], // C
  ["G3", "D4", "G4", "B4"], // G
  ["A3", "E4", "A4", "C5"], // Am
  ["F3", "C4", "F4", "A4"], // F
  ["C3", "E4", "G4", "C5"],
  ["G3", "D4", "G4", "B4"],
  ["A3", "E4", "A4", "C5"],
  ["F3", "C4", "F4", "A4"],
];
const barDur = DURATION / chords.length;

function softClip(x) {
  return Math.tanh(x * 1.2);
}

// Sóng "mềm": trộn sine + chút harmonic để dày tiếng
function voice(freq, t, phase = 0) {
  const w = 2 * Math.PI * freq * t + phase;
  return (
    Math.sin(w) * 0.6 +
    Math.sin(2 * w) * 0.18 +
    Math.sin(3 * w) * 0.08
  );
}

const buf = new Float32Array(N);

for (let i = 0; i < N; i++) {
  const t = i / SAMPLE_RATE;
  const bar = Math.min(chords.length - 1, Math.floor(t / barDur));
  const tInBar = t - bar * barDur;
  const chord = chords[bar];

  let s = 0;

  // 1) Pad: giữ hợp âm, âm lượng nhẹ, có vibrato rất chậm
  const padEnv = Math.min(1, tInBar / 0.4) * Math.min(1, (barDur - tInBar) / 0.5 + 0.5);
  for (const n of chord) {
    const f = NOTE[n];
    s += voice(f, t, Math.sin(t * 0.7) * 0.3) * 0.10 * padEnv;
  }

  // 2) Arpeggio: chạy các nốt của hợp âm, mỗi nốt ~ barDur/4
  const stepDur = barDur / 4;
  const step = Math.floor(tInBar / stepDur) % chord.length;
  const noteFreq = NOTE[chord[(step + 1) % chord.length]] * 2; // cao 1 quãng tám
  const tInStep = tInBar - step * stepDur;
  const arpEnv = Math.exp(-tInStep * 4) * Math.min(1, tInStep / 0.01);
  s += voice(noteFreq, t) * 0.14 * arpEnv;

  // 3) Bass: nốt gốc hợp âm
  const bassEnv = Math.min(1, tInBar / 0.05) * Math.exp(-tInBar * 0.6);
  s += Math.sin(2 * Math.PI * NOTE[chord[0]] * 0.5 * t) * 0.16 * bassEnv;

  // 4) Kick nhẹ ở đầu mỗi nửa ô nhịp
  const beat = tInBar % (barDur / 2);
  if (beat < 0.12) {
    const kEnv = Math.exp(-beat * 40);
    const kFreq = 120 * Math.exp(-beat * 30) + 45;
    s += Math.sin(2 * Math.PI * kFreq * beat) * 0.35 * kEnv;
  }

  // Fade in toàn bài (1s) và fade out (1.5s cuối)
  const gIn = Math.min(1, t / 1.0);
  const gOut = Math.min(1, (DURATION - t) / 1.5);
  s *= gIn * gOut * 0.7;

  buf[i] = softClip(s);
}

// Ghi ra WAV 16-bit mono
const bytesPerSample = 2;
const dataSize = N * bytesPerSample;
const out = Buffer.alloc(44 + dataSize);
out.write("RIFF", 0);
out.writeUInt32LE(36 + dataSize, 4);
out.write("WAVE", 8);
out.write("fmt ", 12);
out.writeUInt32LE(16, 16);
out.writeUInt16LE(1, 20); // PCM
out.writeUInt16LE(1, 22); // mono
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
console.log("Đã tạo nhạc nền:", file, `(${DURATION}s)`);
