import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampSplitPercent,
  computeAutomotiveCameraRig,
  stepSplitPercent,
} from './transform';

test('clampSplitPercent clamps out-of-range and non-finite inputs safely', () => {
  assert.equal(clampSplitPercent(NaN), 50);
  assert.equal(clampSplitPercent(-10), 4);
  assert.equal(clampSplitPercent(120), 96);
  assert.equal(clampSplitPercent(42.37), 42.4);
});

test('stepSplitPercent steps smoothly within bounds', () => {
  assert.equal(stepSplitPercent(50, -5), 45);
  assert.equal(stepSplitPercent(6, -10), 4);
  assert.equal(stepSplitPercent(94, 10), 96);
});

test('computeAutomotiveCameraRig sweeps azimuth and clamps elevation with scroll and pointer', () => {
  const start = computeAutomotiveCameraRig(0, 'hero', 0, 0);
  const mid = computeAutomotiveCameraRig(0.5, 'hero', 0, 0);
  const end = computeAutomotiveCameraRig(1, 'hero', 0, 0);

  assert.ok(mid.azimuth > start.azimuth);
  assert.ok(end.azimuth > mid.azimuth);
  assert.ok(mid.rimIntensity > start.rimIntensity);
  assert.ok(end.distance < start.distance);

  const extreme = computeAutomotiveCameraRig(2, 'aerial', 5, 5);
  assert.ok(extreme.elevation <= 1.15);
  assert.ok(extreme.elevation >= 0.12);
});
