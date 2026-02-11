import { useFrame } from '@react-three/fiber';
import { useStore } from '../store/useStore';

export const PlaybackController = () => {
  // We do NOT subscribe to store updates here to avoid re-renders.
  // We access state directly inside the loop.

  useFrame((_, delta) => {
    const { isPlaying, currentTime, setTime, duration } = useStore.getState();

    if (isPlaying) {
      let newTime = currentTime + delta;

      if (newTime >= duration) {
        newTime = 0; // Loop
      }

      setTime(newTime);
    }
  });

  return null;
};
