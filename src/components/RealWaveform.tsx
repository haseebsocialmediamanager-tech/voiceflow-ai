"use client";

import { useEffect, useRef } from "react";

interface Props {
  stream: MediaStream | null;
  isActive: boolean;
  color?: string;
  bars?: number;
}

export function RealWaveform({ stream, isActive, color = "#6366f1", bars = 40 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!isActive || !stream) {
      cancelAnimationFrame(animRef.current);
      // Draw flat idle line
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barW = canvas.width / bars;
      const idleH = 4;
      for (let i = 0; i < bars; i++) {
        const x = i * barW + barW * 0.15;
        const w = barW * 0.55;
        const y = (canvas.height - idleH) / 2;
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.beginPath();
        ctx.roundRect(x, y, w, idleH, 2);
        ctx.fill();
      }
      return;
    }

    // Setup audio context
    try {
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      ctxRef.current = audioCtx;
      analyserRef.current = analyser;
      sourceRef.current = source;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const drawFrame = () => {
        animRef.current = requestAnimationFrame(drawFrame);
        analyser.getByteFrequencyData(dataArray);

        ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

        const barW = canvas!.width / bars;
        const centerY = canvas!.height / 2;

        for (let i = 0; i < bars; i++) {
          const dataIndex = Math.floor((i / bars) * bufferLength);
          const value = dataArray[dataIndex] / 255;
          const minH = 4;
          const maxH = canvas!.height * 0.85;
          const barH = minH + value * (maxH - minH);

          const x = i * barW + barW * 0.15;
          const w = barW * 0.6;
          const y = centerY - barH / 2;

          const grad = ctx!.createLinearGradient(x, y + barH, x, y);
          grad.addColorStop(0, color + "40");
          grad.addColorStop(0.5, color + "cc");
          grad.addColorStop(1, color);

          ctx!.fillStyle = grad;
          ctx!.beginPath();
          ctx!.roundRect(x, y, w, barH, 3);
          ctx!.fill();
        }
      };

      drawFrame();
    } catch (err) {
      console.error("Audio ctx error:", err);
    }

    return () => {
      cancelAnimationFrame(animRef.current);
      sourceRef.current?.disconnect();
      ctxRef.current?.close().catch(() => {});
    };
  }, [isActive, stream, bars, color]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={72}
      className="w-full max-w-sm"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
