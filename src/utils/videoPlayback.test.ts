import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeViewportPlaybackAction,
  shouldMountLazyVideo,
} from './videoPlayback';

test('shouldMountLazyVideo mounts all valid showcase videos immediately on site entry', () => {
  assert.equal(
    shouldMountLazyVideo({
      hasVideoSource: true,
      videoFailed: false,
      isNearViewport: false,
      wasPreviouslyLoaded: false,
    }),
    true
  );
  assert.equal(
    shouldMountLazyVideo({
      hasVideoSource: false,
      videoFailed: false,
      isNearViewport: true,
      wasPreviouslyLoaded: false,
    }),
    false
  );
  assert.equal(
    shouldMountLazyVideo({
      hasVideoSource: true,
      videoFailed: true,
      isNearViewport: true,
      wasPreviouslyLoaded: true,
    }),
    false
  );
});

test('computeViewportPlaybackAction keeps loaded showcase videos playing unless user paused', () => {
  assert.equal(
    computeViewportPlaybackAction({
      isLoaded: true,
      isVisible: true,
      prefersReducedMotion: true,
      userPaused: false,
      videoFailed: false,
    }),
    'play'
  );
  assert.equal(
    computeViewportPlaybackAction({
      isLoaded: true,
      isVisible: false,
      prefersReducedMotion: false,
      userPaused: false,
      videoFailed: false,
    }),
    'play'
  );
  assert.equal(
    computeViewportPlaybackAction({
      isLoaded: true,
      isVisible: true,
      prefersReducedMotion: false,
      userPaused: true,
      videoFailed: false,
    }),
    'pause'
  );
  assert.equal(
    computeViewportPlaybackAction({
      isLoaded: false,
      isVisible: true,
      prefersReducedMotion: false,
      userPaused: false,
      videoFailed: false,
    }),
    'idle'
  );
});
