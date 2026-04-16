import React, { useRef, useEffect } from 'react';

export default function ChromaKeyVideo({ src, className, style }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let animationFrameId;

    const processFrame = () => {
      if (video.paused || video.ended) return;
      
      // Draw video to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = frame.data;
      
      // Chroma Key logic (Remove Green Screen)
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        let maxRB = Math.max(r, b);
        
        if (g > maxRB && g > 60) {
          let diff = g - maxRB;
          if (diff > 30) {
            // Pure green => completely transparent
            data[i + 3] = 0; 
          } else {
            // Edges (Anti-aliasing / Spill suppression)
            let alpha = 255 - (diff * 8);
            data[i + 3] = Math.max(0, Math.min(255, alpha));
            data[i + 1] = maxRB; // Remove green spill
          }
        }
      }
      
      ctx.putImageData(frame, 0, 0);
      animationFrameId = requestAnimationFrame(processFrame);
    };

    video.addEventListener('play', () => {
      animationFrameId = requestAnimationFrame(processFrame);
    });

    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    });

    // Force play in case autoplay gets blocked
    video.play().catch(() => {});

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={className} style={{ position: 'relative', ...style }}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        style={{ display: 'none' }}
      />
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
}
