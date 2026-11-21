import test from 'node:test';
import assert from 'node:assert/strict';
import { canRevealHeroVideo, shouldAttemptHeroAutoPlay } from './heroMedia';

test('canRevealHeroVideo keeps poster visible before playback starts', () => {
  assert.equal(
    canRevealHeroVideo({ hasStartedPlaying: false, readyState: 4, videoFailed: false }),
    false
  );
  assert.equal(
    canRevealHeroVideo({ hasStartedPlaying: true, readyState: 1, videoFailed: false }),
    false
  );
});

test('canRevealHeroVideo reveals video once playback starts with buffered frame data', () => {
  assert.equal(
    canRevealHeroVideo({ hasStartedPlaying: true, readyState: 2, videoFailed: false }),
    true
  );
  assert.equal(
    canRevealHeroVideo({ hasStartedPlaying: true, readyState: 4, videoFailed: false }),
    true
  );
});

test('canRevealHeroVideo stays on poster if video failed', () => {
  assert.equal(
    canRevealHeroVideo({ hasStartedPlaying: true, readyState: 4, videoFailed: true }),
    false
  );
});

test('shouldAttemptHeroAutoPlay triggers silent playback from readyState >= 1 even with reduced motion', () => {
  assert.equal(
    shouldAttemptHeroAutoPlay({
      prefersReducedMotion: true,
      isPlaying: true,
      videoFailed: false,
      paused: true,
      readyState: 2,
    }),
    true
  );
  assert.equal(
    shouldAttemptHeroAutoPlay({
      prefersReducedMotion: false,
      isPlaying: false,
      videoFailed: false,
      paused: true,
      readyState: 4,
    }),
    false
  );
  assert.equal(
    shouldAttemptHeroAutoPlay({
      prefersReducedMotion: false,
      isPlaying: true,
      videoFailed: false,
      paused: true,
      readyState: 0,
    }),
    false
  );
  assert.equal(
    shouldAttemptHeroAutoPlay({
      prefersReducedMotion: false,
      isPlaying: true,
      videoFailed: false,
      paused: true,
      readyState: 1,
    }),
    true
  );
});
