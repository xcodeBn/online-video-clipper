
# Online Video Clipper

[![GitHub](https://img.shields.io/badge/GitHub-xcodebn/video--clipper-blue?logo=github)](https://github.com/xcodebn/video-clipper) <!-- Replace with your actual repository link -->
<!-- Add a deployment badge here if you deploy it, e.g., to GitHub Pages: -->
<!-- [Live Demo](https://xcodebn.github.io/video-clipper/) -->

A web-based video clipping tool built with React, TypeScript, and Tailwind CSS. This application allows users to upload video files, select a specific segment using intuitive sliders, and download the trimmed portion directly in their browser.

Developed for **xcodebn**.

## Features

*   **Upload Local Video Files:** Easily upload videos from your device.
*   **Drag & Drop Support:** Conveniently drag and drop video files for uploading.
*   **Interactive Timeline Sliders:** Precisely select the start and end points for your video clip.
*   **Real-time Playback & Preview:**
    *   View the current playback time of the video.
    *   See the calculated duration of your selected clip in real-time.
*   **Visual Clip Range Indicator:** A progress bar visually represents the selected portion relative to the entire video duration.
*   **Download Clipped Video:** Download the processed segment. The current version uses the `MediaRecorder` API, which typically outputs files in `.webm` format.
*   **Responsive Design:** Optimized for a seamless experience on various screen sizes, from desktop to mobile.
*   **Error Handling:** Provides user-friendly feedback for invalid file types or issues encountered during the clipping process.
*   **Modern UI:** Clean and intuitive interface styled with Tailwind CSS.

## Technologies Used

*   **React 19:** A JavaScript library for building user interfaces.
*   **TypeScript:** Adds static typing to JavaScript, enhancing code quality and maintainability.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **HTML5 Video API:** Used for native video playback and control.
*   **MediaRecorder API:** Leveraged for capturing and clipping the video stream directly in the browser.
*   **ES Modules & Import Maps:** Enables modern JavaScript module handling directly in the browser without a complex build step for development.

## How to Use

### Prerequisites

*   A modern web browser that supports:
    *   ES Modules (Standard in current versions of Chrome, Firefox, Edge, Safari).
    *   The `MediaRecorder` API.

### Running Locally

1.  **Clone the repository (or download the files):**
    ```bash
    git clone https://github.com/xcodebn/video-clipper.git # Replace with your actual repository URL
    cd video-clipper
    ```

2.  **Open `index.html` in your browser:**
    *   No compilation or build steps are required to run the application locally. Simply open the `index.html` file in your web browser.

### Using the Application

1.  **Upload Video:**
    *   Drag and drop your video file onto the designated upload area.
    *   Alternatively, click the "Browse Files" button (or the upload area itself) to open a file dialog and select your video.
2.  **Select Clip Range:**
    *   Once the video is loaded, its metadata (duration) will be displayed.
    *   Use the "Start Time" and "End Time" sliders to define the segment you want to clip.
    *   The time displays and the visual range indicator will update as you adjust the sliders.
3.  **Clip Video:**
    *   Click the "Clip Video" button.
    *   The application will process the video in real-time. You'll see a "Clipping..." indicator.
    *   *Note: The clipping duration will be equal to the length of the selected segment due to the real-time nature of `MediaRecorder`.*
4.  **Download Clip:**
    *   Once clipping is complete, a preview of the clipped video will appear.
    *   Click the "Download Clipped Video" button to save the `.webm` file to your device.

## Project Structure

```
.
├── components/             # Contains reusable React components
│   ├── ClipControls.tsx    # UI for start/end time sliders and time display
│   ├── FileUploader.tsx    # Component for video file input (drag & drop, browse)
│   ├── Footer.tsx          # Application footer
│   ├── Header.tsx          # Application header
│   └── icons.tsx           # SVG icon components
├── index.html              # Main HTML entry point, includes Tailwind CSS and import maps
├── index.tsx               # React application root, mounts the App component
├── App.tsx                 # Core application logic, state management, and layout
├── types.ts                # Shared TypeScript type definitions (e.g., custom errors)
├── metadata.json           # Application metadata (name, description)
├── Readme.md               # This documentation file
└── LICENSE                 # Project's license information
```

## Future Enhancements

*   **Faster Clipping with FFmpeg.wasm:** Integrate FFmpeg (compiled to WebAssembly) for significantly faster, non-real-time clipping. This would also allow for:
    *   More robust handling of various video codecs and containers.
    *   Potential for server-less video conversion/transcoding features.
*   **Selectable Output Formats:** Allow users to choose the output format for the clipped video (e.g., MP4), which would likely require FFmpeg.wasm.
*   **Improved Progress Indication:** More detailed progress feedback, especially if FFmpeg.wasm is integrated.
*   **Keyboard Shortcuts:** Implement keyboard controls for adjusting sliders and playback for better accessibility and efficiency.
*   **Direct Video URL Input:** Allow users to paste a video URL for clipping (would require handling CORS and fetching).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Developed for and by **xcodebn**. Feel free to contribute or suggest improvements!
