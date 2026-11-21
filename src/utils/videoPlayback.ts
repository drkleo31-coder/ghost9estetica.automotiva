export interface LazyVideoMountInput {
  hasVideoSource: boolean;
  videoFailed: boolean;
  isNearViewport?: boolean;
  wasPreviouslyLoaded?: boolean;
}

export interface ViewportPlaybackActionInput {
  isLoaded: boolean;
  isVisible?: boolean;
  prefersReducedMotion?: boolean;
  userPaused: boolean;
  videoFailed: boolean;
}

/**
 * Determines whether a showcase video should attach its media source.
 * All showcase videos mount and preload immediately upon entering the site.
 */
export function shouldMountLazyVideo({
  hasVideoSource,
  videoFailed,
}: LazyVideoMountInput): boolean {
  return hasVideoSource && !videoFailed;
}

/**
 * Computes whether a showcase video should currently play or pause.
 * Keeps all loaded showcase videos actively playing unless paused by the user.
 */
export function computeViewportPlaybackAction({
  isLoaded,
  userPaused,
  videoFailed,
}: ViewportPlaybackActionInput): 'play' | 'pause' | 'idle' {
  if (!isLoaded || videoFailed) return 'idle';
  if (userPaused) return 'pause';
  return 'play';
}
