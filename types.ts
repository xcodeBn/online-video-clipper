
export class VideoProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VideoProcessingError";
  }
}

// You can add more shared types here if needed
// For example:
// export interface UserProfile {
//   id: string;
//   username: string;
// }
