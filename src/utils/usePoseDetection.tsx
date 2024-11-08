import { useEffect, useState } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

type Position = {
  x: number | null,
  y: number | null
}

const usePoseDetection = (videoRef) => {
  const [indexFingerPosition, setIndexFingerPosition] = useState<Position>({ x: null, y: null });

  useEffect(() => {
    const loadModel = async () => {
      await tf.setBackend('webgl');
      await tf.ready();

      const detector = await handPoseDetection.createDetector(
        handPoseDetection.SupportedModels.MediaPipeHands,
        {
          runtime: 'mediapipe',
          solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
        }
      );

      const detectHand = async () => {
        if (videoRef.current) {
          const hands = await detector.estimateHands(videoRef.current);
          if (hands.length > 0) {
            const indexFinger = hands[0].keypoints.find(point => point.name === 'index_finger_tip');
            if (indexFinger) {
              setIndexFingerPosition({ x: indexFinger.x, y: indexFinger.y });
            }
          }

          requestAnimationFrame(detectHand);
        }
      };

      detectHand();
      return () => detector.dispose();
    };

    loadModel();
  }, [videoRef]);

  return { indexFingerPosition };
};

export default usePoseDetection;
