import { useRef, useEffect, useState } from 'react';
import './App.css'; // Make sure you have the styles here
import usePoseDetection from './utils/usePoseDetection';
import Video from './Video';

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false); // Track video readiness

  // Only pass videoRef to usePoseDetection if the video is ready
  const { indexFingerPosition } = usePoseDetection(isVideoReady ? videoRef : null);

  // Wait for the video element to load
  useEffect(() => {
    if (videoRef.current) {
      const handleLoadedData = () => setIsVideoReady(true);
      videoRef.current.addEventListener('loadeddata', handleLoadedData);

      return () => {
        videoRef.current!.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, []);

  useEffect(() => {
    if (!isVideoReady || !indexFingerPosition) return;

    const canvas = canvasRef.current;
    const context = canvas!.getContext('2d');

    // Draw a circle at the index finger position
    if (indexFingerPosition.x && indexFingerPosition.y) {
      context!.beginPath();
      context!.arc(indexFingerPosition.x, indexFingerPosition.y, 3, 0, 2 * Math.PI);
      context!.fillStyle = 'red';
      context!.fill();
    }
  }, [isVideoReady, indexFingerPosition]);

  return (
    <div className="video-container">
      <Video ref={videoRef} />
      <canvas ref={canvasRef} width={340} height={340} />
    </div>
  );
}

export default App;
