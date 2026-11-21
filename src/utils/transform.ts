/**
 * Clamps the Before/After comparison slider percentage to a safe interactive range.
 */
export function clampSplitPercent(value: number): number {
  if (!Number.isFinite(value)) return 50;
  return Math.min(96, Math.max(4, Math.round(value * 10) / 10));
}

/**
 * Computes the next slider split percentage from a keyboard step delta.
 */
export function stepSplitPercent(current: number, delta: number): number {
  return clampSplitPercent(current + delta);
}

export type CameraPresetId = 'hero' | 'profile' | 'rear' | 'aerial';

export interface CameraTargetRig {
  azimuth: number;
  elevation: number;
  distance: number;
  lookAtY: number;
  rimIntensity: number;
}

const PRESET_BASE: Record<CameraPresetId, Omit<CameraTargetRig, 'rimIntensity'>> = {
  hero: { azimuth: 0.68, elevation: 0.28, distance: 6.4, lookAtY: 0.45 },
  profile: { azimuth: Math.PI / 2, elevation: 0.16, distance: 6.8, lookAtY: 0.42 },
  rear: { azimuth: 2.55, elevation: 0.34, distance: 6.2, lookAtY: 0.48 },
  aerial: { azimuth: 0.9, elevation: 0.85, distance: 7.4, lookAtY: 0.25 },
};

/**
 * Computes the target 3D automotive camera rig from scroll progress [0..1],
 * selected preset, and subtle pointer offset [-1..1].
 */
export function computeAutomotiveCameraRig(
  scrollProgress: number,
  preset: CameraPresetId,
  pointerX = 0,
  pointerY = 0
): CameraTargetRig {
  const clampedScroll = Math.min(1, Math.max(0, Number.isFinite(scrollProgress) ? scrollProgress : 0));
  const base = PRESET_BASE[preset] ?? PRESET_BASE.hero;

  const scrollSweep = (clampedScroll - 0.5) * 0.85;
  const scrollLift = Math.sin(clampedScroll * Math.PI) * 0.14;
  const px = Math.min(1, Math.max(-1, pointerX)) * 0.16;
  const py = Math.min(1, Math.max(-1, pointerY)) * 0.08;

  return {
    azimuth: base.azimuth + scrollSweep + px,
    elevation: Math.max(0.12, Math.min(1.15, base.elevation + scrollLift + py)),
    distance: base.distance - clampedScroll * 0.35,
    lookAtY: base.lookAtY,
    rimIntensity: 2.6 + Math.sin(clampedScroll * Math.PI) * 1.4,
  };
}
