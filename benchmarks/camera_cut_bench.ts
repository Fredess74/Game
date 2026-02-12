/* eslint-disable @typescript-eslint/no-unused-vars */

// benchmarks/camera_cut_bench.ts

const numCuts = 1000;
const numFrames = 600; // 10 seconds at 60fps

// Simulate camera cut object
interface CameraCut {
  id: string;
  time: number;
  cameraId: string;
}

const cameraCuts: CameraCut[] = [];
for (let i = 0; i < numCuts; i++) {
  cameraCuts.push({
    id: `cut-${i}`,
    time: Math.random() * 10, // random times
    cameraId: `cam-${i}`
  });
}

function testCurrent() {
  const startTime = performance.now();
  let dummy = 0;

  for (let f = 0; f < numFrames; f++) {
    const currentTime = (f / 60) * 10;

    // Simulate current code
    // sort every frame
    const sortedCuts = [...cameraCuts].sort((a, b) => a.time - b.time);
    let active = null;
    for (const cut of sortedCuts) {
        if (cut.time <= currentTime) {
            active = cut;
        } else {
            break;
        }
    }
    if (active) dummy++;
  }

  const endTime = performance.now();
  return endTime - startTime;
}

function testOptimized() {
  const startTime = performance.now();
  let dummy = 0;

  // Simulate optimized code
  // sort once
  const sortedCuts = [...cameraCuts].sort((a, b) => a.time - b.time);

  for (let f = 0; f < numFrames; f++) {
    const currentTime = (f / 60) * 10;

    // iterate only
    let active = null;
    for (const cut of sortedCuts) {
        if (cut.time <= currentTime) {
            active = cut;
        } else {
            break;
        }
    }
    if (active) dummy++;
  }

  const endTime = performance.now();
  return endTime - startTime;
}

console.log(`Running benchmark with ${numCuts} cuts and ${numFrames} frames...`);

const currentMs = testCurrent();
console.log(`Current approach (sort every frame): ${currentMs.toFixed(2)} ms`);

const optimizedMs = testOptimized();
console.log(`Optimized approach (sort once): ${optimizedMs.toFixed(2)} ms`);

const improvement = ((currentMs - optimizedMs) / currentMs) * 100;
console.log(`Improvement: ${improvement.toFixed(2)}%`);
