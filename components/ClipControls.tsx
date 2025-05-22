
import React from 'react';

interface ClipControlsProps {
  duration: number;
  startTime: number;
  endTime: number;
  currentTime: number;
  onStartTimeChange: (time: number) => void;
  onEndTimeChange: (time: number) => void;
  formatTime: (time: number) => string;
}

export const ClipControls: React.FC<ClipControlsProps> = ({
  duration,
  startTime,
  endTime,
  currentTime,
  onStartTimeChange,
  onEndTimeChange,
  formatTime,
}) => {
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = parseFloat(e.target.value);
    if (newStartTime < endTime) {
      onStartTimeChange(newStartTime);
    } else {
      onStartTimeChange(endTime); // Or some small value less than endTime
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = parseFloat(e.target.value);
    if (newEndTime > startTime) {
      onEndTimeChange(newEndTime);
    } else {
      onEndTimeChange(startTime); // Or some small value greater than startTime
    }
  };

  const sliderProgress = (100 * (endTime - startTime)) / duration;
  const sliderOffset = (100 * startTime) / duration;


  return (
    <div className="mt-6 space-y-4">
      <div className="text-center text-lg font-medium text-gray-300 mb-2">
        Current Playback Time: {formatTime(currentTime)}
      </div>
      
      {/* Sliders Section */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Start Time: {formatTime(startTime)}</span>
            <span>Total Duration: {formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration}
            step="0.01"
            value={startTime}
            onChange={handleStartTimeChange}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            aria-label="Start time"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>End Time: {formatTime(endTime)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration}
            step="0.01"
            value={endTime}
            onChange={handleEndTimeChange}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
            aria-label="End time"
          />
        </div>
      </div>

      {/* Visual representation of selected clip range */}
      <div className="mt-3 h-4 w-full bg-gray-700 rounded overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-pink-500"
          style={{
            width: `${sliderProgress}%`,
            marginLeft: `${sliderOffset}%`,
          }}
        ></div>
      </div>
      <div className="text-center text-sm text-gray-400">
          Selected Clip Duration: {formatTime(endTime - startTime)}
      </div>
    </div>
  );
};
