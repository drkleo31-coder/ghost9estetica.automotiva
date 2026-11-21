export interface HeroVideoTransitionInput {
  hasStartedPlaying: boolean;
  readyState: number;
  videoFailed: boolean;
}

export interface HeroAutoPlayInput {
  prefersReducedMotion?: boolean;
  isPlaying: boolean;
  videoFailed: boolean;
  paused: boolean;
  readyState: number;
}

/**
 * Transitions from the real Frame-0 poster overlay to the active video layer
 * once playback has started with decoded frame data and no playback error.
 */
export function canRevealHeroVideo({
  hasStartedPlaying,
  readyState,
  videoFailed,
}: HeroVideoTransitionInput): boolean {
  if (videoFailed) return false;
  return hasStartedPlaying && readyState >= 2;
}

/**
 * Determines whether the hero video should programmatically trigger silent autoplay
 * as soon as metadata/frames begin arriving (independent of OS reduced-motion settings,
 * since showcase video is primary content).
 */
export function shouldAttemptHeroAutoPlay({
  isPlaying,
  videoFailed,
  paused,
  readyState,
}: HeroAutoPlayInput): boolean {
  if (!isPlaying || videoFailed) return false;
  return paused && readyState >= 1;
}
