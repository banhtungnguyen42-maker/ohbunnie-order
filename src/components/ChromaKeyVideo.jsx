import React, { useRef, useEffect } from 'react';

export default function ChromaKeyVideo({ src, className }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let animationFrameId;

    const processFrame = () => {
      if (video.paused || video.ended) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = frame.data;

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];
        let maxRB = Math.max(r, b);
        if (g > maxRB && g > 75) {
          let diff = g - maxRB;
          if (diff > 40) {
            data[i + 3] = 0;
          } else {
            data[i + 3] = 255 - (diff * 6);
            data[i + 1] = maxRB;
          }
        }
      }
      ctx.putImageData(frame, 0, 0);
      animationFrameId = requestAnimationFrame(processFrame);
    };

    video.addEventListener('play', () => { animationFrameId = requestAnimationFrame(processFrame); });
    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    });
    video.play().catch(() => {});

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <>
      <video ref={videoRef} src={src} autoPlay loop muted playsInline crossOrigin="anonymous" style={{ display: 'none' }} />
      <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom' }} />
    </>
  );
}
