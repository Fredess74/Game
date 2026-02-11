# Movie Maker Engine

A web-based 3D animation engine inspired by "The Movies" game. Create scenes, animate actors, keyframe movement, and export your masterpiece as a video.

## Features

*   **3D Viewport**: Full 3D scene editing with Orbit Controls.
*   **Asset Library**: Drag and drop (click to add) Actors (Robots), Props (Crates, Balls), Lights, and Sound Emitters.
*   **Timeline & Animation**:
    *   Keyframe system for Position, Rotation, and Scale.
    *   Real-time playback.
    *   Interactive Timeline UI.
*   **Camera System**:
    *   Switch between "Editor View" (Orbit) and "Camera View" (Cinematic).
    *   Animate the Main Camera just like any other actor.
*   **Audio Engine**:
    *   Spatial audio support using Tone.js.
    *   Place "Speaker" objects to emit sound.
*   **Environment Control**:
    *   Customize background color.
    *   Toggle grid visibility.
*   **Export**:
    *   Save/Load projects (JSON).
    *   Export video (.webm) directly from the browser.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## How to Use

1.  **Add Objects**: Click items in the Left Sidebar (Library).
2.  **Select & Move**: Click an object in the scene or the timeline list. Use the Gizmo to move it.
3.  **Keyframing**:
    *   Move the playhead to a time.
    *   Move the object to desired position.
    *   Click the **KEY** button (top-left of timeline) to record position/rotation.
    *   Move playhead, move object, key again.
    *   Hit **Play** to see it animate!
4.  **Camera**:
    *   Select "Main Camera" from the list (or click its representation in Editor View).
    *   Animate it like any other object.
    *   Click "EDITOR VIEW" button (top-left overlay) to switch to "REC VIEW" to see through the camera.
5.  **Export**:
    *   Click "EXPORT VIDEO" in the header.
    *   The engine will reset to 0, play the whole movie, and download a `.webm` file.

## Tech Stack

*   React + TypeScript
*   Three.js + React Three Fiber
*   Zustand (State Management)
*   Tone.js (Audio)
*   Tailwind CSS (UI)
