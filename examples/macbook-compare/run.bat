@echo off
REM ==========================================================================
REM  run.bat - chay toan bo pipeline tao video tren MAY LOCAL (Windows)
REM
REM  Dung:
REM    run.bat                     : cai deps + tao nhac + render ca 2 preset
REM    run.bat --preset youtube    : chi YouTube
REM    run.bat --preset tiktok     : chi TikTok
REM    run.bat --frames-only       : chi render + LUU frame (khong ghep video)
REM    run.bat --video-only        : chi ghep video tu frame da luu
REM    run.bat --reuse-frames      : dung lai frame co san neu du
REM
REM  Moi tham so truyen vao se duoc chuyen thang cho render.js.
REM ==========================================================================
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ==^> Kiem tra Node.js...
where node >nul 2>nul
if errorlevel 1 (
  echo LOI: chua cai Node.js. Cai tai https://nodejs.org ^(^>= 18^) roi chay lai.
  exit /b 1
)
node -v

echo ==^> Cai dependencies (puppeteer, ffmpeg-static)...
if not exist node_modules (
  call npm install
) else (
  echo     node_modules da co - bo qua.
)

echo ==^> Tao nhac nen (music.wav)...
if not exist music.wav (
  node make-music.js
) else (
  echo     music.wav da co - bo qua.
)

REM Neu khong co --preset thi mac dinh render ca hai
set ARGS=%*
echo %* | findstr /C:"--preset" >nul
if errorlevel 1 (
  set ARGS=%* --preset all
)

echo ==^> Render: node render.js !ARGS!
node render.js !ARGS!

echo ==^> Xong. Cac file video:
dir /b kiro-tutorial-*.mp4 2>nul

endlocal
