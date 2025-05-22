
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FileUploader } from './components/FileUploader';
import { ClipControls } from './components/ClipControls';
import { SpinnerIcon, DownloadIcon } from './components/icons';
import { VideoProcessingError } from './types';

const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const [isClipping, setIsClipping] = useState<boolean>(false);
  const [clippedVideoUrl, setClippedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>('my-video.mp4');

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.floor((timeInSeconds * 1000) % 1000);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('Invalid file type. Please upload a video file.');
        setVideoFile(null);
        setVideoSrc(null);
        return;
      }
      setError(null);
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setClippedVideoUrl(null); // Reset any previous clip
      setFilename(file.name);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      setDuration(videoDuration);
      setStartTime(0); // Default start time
      setEndTime(videoDuration); // Default end time
      setCurrentTime(0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleClipVideo = useCallback(async () => {
    if (!videoRef.current || !videoFile) {
      setError('No video loaded to clip.');
      return;
    }

    if (startTime >= endTime) {
      setError('Start time must be before end time.');
      return;
    }

    setIsClipping(true);
    setError(null);
    setClippedVideoUrl(null);
    recordedChunksRef.current = [];

    // Fix: Moved originalMutedState declaration out of try block to make it accessible in the catch block.
    // videoRef.current is guaranteed to be non-null due to earlier checks.
    const originalMutedState = videoRef.current.muted;

    try {
      // Ensure video is at the start time for recording
      videoRef.current.currentTime = startTime;
      // Mute the main player during recording to avoid echo if controls are used
      videoRef.current.muted = true;

      // Attempt to get a stream and create MediaRecorder
      // Fallback for browsers that might not support captureStream on a muted element as readily.
      // Or ensure it's unmuted briefly if captureStream requires it (browser dependent).
      // For simplicity, assuming captureStream works on a programmatically controlled video element.
      
      let stream: MediaStream;
      if (typeof (videoRef.current as any).captureStream === 'function') {
         stream = (videoRef.current as any).captureStream();
      } else if (typeof (videoRef.current as any).mozCaptureStream === 'function') {
         stream = (videoRef.current as any).mozCaptureStream();
      } else {
        throw new VideoProcessingError("Video stream capture is not supported by your browser.");
      }


      let mimeType = 'video/webm; codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm; codecs=vp8,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
          if(!MediaRecorder.isTypeSupported(mimeType)) {
            throw new VideoProcessingError("WebM video recording is not supported by your browser.");
          }
        }
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const clippedBlob = new Blob(recordedChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(clippedBlob);
        setClippedVideoUrl(url);
        setIsClipping(false);
        if (videoRef.current) { // Check if videoRef.current is still valid
             videoRef.current.muted = originalMutedState; // Restore muted state
        }
      };
      
      mediaRecorderRef.current.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setError('An error occurred during video clipping. Check console for details.');
        setIsClipping(false);
        if (videoRef.current) { // Check if videoRef.current is still valid
            videoRef.current.muted = originalMutedState;
        }
      };

      mediaRecorderRef.current.start();
      videoRef.current.play(); // Start playing from startTime

      // Monitor playback to stop recording at endTime
      const checkTime = () => {
        if (videoRef.current && mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          if (videoRef.current.currentTime >= endTime) {
            mediaRecorderRef.current.stop();
            videoRef.current.pause(); 
          } else {
            requestAnimationFrame(checkTime);
          }
        }
      };
      requestAnimationFrame(checkTime);

    } catch (e) {
      console.error("Clipping error:", e);
      let message = 'Failed to clip video.';
      if (e instanceof VideoProcessingError || (e instanceof Error && e.message)) {
        message = e.message;
      }
      setError(message);
      setIsClipping(false);
      if(videoRef.current) { // Check if videoRef.current is still valid
        videoRef.current.muted = originalMutedState;
      }
    }
  }, [videoFile, startTime, endTime]);

  useEffect(() => {
    // Cleanup object URLs
    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
      if (clippedVideoUrl) {
        URL.revokeObjectURL(clippedVideoUrl);
      }
    };
  }, [videoSrc, clippedVideoUrl]);


  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center">
        {!videoSrc ? (
          <FileUploader onFileSelected={handleFileChange} />
        ) : (
          <div className="w-full max-w-3xl bg-gray-800 p-4 sm:p-6 rounded-lg shadow-2xl">
            <video
              ref={videoRef}
              src={videoSrc}
              controls
              className="w-full rounded-md aspect-video"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
            ></video>
            
            {duration > 0 && (
              <ClipControls
                duration={duration}
                startTime={startTime}
                endTime={endTime}
                currentTime={currentTime}
                onStartTimeChange={setStartTime}
                onEndTimeChange={setEndTime}
                formatTime={formatTime}
              />
            )}

            <div className="mt-6 text-center">
              <button
                onClick={handleClipVideo}
                disabled={isClipping || duration === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-full sm:w-auto"
              >
                {isClipping ? (
                  <>
                    <SpinnerIcon className="animate-spin h-5 w-5 mr-3" />
                    Clipping...
                  </>
                ) : (
                  'Clip Video'
                )}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 w-full max-w-3xl bg-red-700 text-white p-4 rounded-lg shadow-md text-center">
            <p>{error}</p>
          </div>
        )}

        {clippedVideoUrl && (
          <div className="mt-8 w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-2xl text-center">
            <h3 className="text-2xl font-semibold mb-4 text-green-400">Clip Ready!</h3>
            <video src={clippedVideoUrl} controls className="w-full rounded-md aspect-video mb-4"></video>
            <a
              href={clippedVideoUrl}
              download={`clipped-${filename}.webm`} // MediaRecorder often outputs webm
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-150 ease-in-out inline-flex items-center"
            >
              <DownloadIcon className="h-5 w-5 mr-2" />
              Download Clipped Video (.webm)
            </a>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;