/**
 * Live2D and Interactive Character Types
 * Based on the specification in interactive-character-portfolio-hero-agent-brief.md
 */

export interface NormalizedCoordinates {
  /** Normalized horizontal position: -1 (left) to 1 (right) */
  x: number;
  /** Normalized vertical position: -1 (bottom) to 1 (top) */
  y: number;
}

export interface PointerState {
  /** Raw coordinates relative to interaction target */
  rawX: number;
  rawY: number;
  /** Normalized coordinates (-1 to 1) */
  normalizedX: number;
  normalizedY: number;
  /** Smoothed coordinates after interpolation / damping */
  smoothedX: number;
  smoothedY: number;
  /** Proximity to the face region (0 to 1, where 1 is directly over the face) */
  proximityToFace: number;
  /** Whether the pointer is currently within the active hero region */
  isInside: boolean;
  /** Whether the active input source is touch */
  isTouch: boolean;
  /** Timestamp of the last pointer interaction */
  lastUpdated: number;
}

export interface Live2DParameterValues {
  /** Head horizontal angle: -30 to 30 */
  ParamAngleX: number;
  /** Head vertical angle: -30 to 30 */
  ParamAngleY: number;
  /** Head roll angle: -30 to 30 */
  ParamAngleZ: number;
  /** Eye gaze horizontal tracking: -1 to 1 */
  ParamEyeBallX: number;
  /** Eye gaze vertical tracking: -1 to 1 */
  ParamEyeBallY: number;
  /** Left eye open / blink: 0 (closed) to 1 (open) */
  ParamEyeLOpen: number;
  /** Right eye open / blink: 0 (closed) to 1 (open) */
  ParamEyeROpen: number;
  /** Left eyebrow vertical expression: -1 to 1 */
  ParamBrowLY: number;
  /** Right eyebrow vertical expression: -1 to 1 */
  ParamBrowRY: number;
  /** Mouth opening: 0 to 1 */
  ParamMouthOpenY: number;
  /** Body horizontal rotation: -10 to 10 */
  ParamBodyAngleX: number;
  /** Breathing parameter: 0 to 1 */
  ParamBreath: number;
}

export interface PointerControllerOptions {
  /** Lerp smoothing factor: 0.05 (heavy damping) to 0.3 (fast response). Default 0.12 */
  damping?: number;
  /** Dead zone radius around baseline to prevent micro-jitter. Default 0.02 */
  deadZone?: number;
  /** Duration in ms to smoothly return to baseline when pointer leaves. Default 650 */
  returnDuration?: number;
  /** Neutral baseline gaze matching the character's original sideways pose. Default { x: 0.15, y: -0.05 } */
  baseline?: NormalizedCoordinates;
  /** Max clamp boundaries for normalized coordinates */
  clamp?: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  /** Callback fired whenever smoothed pointer state updates */
  onUpdate?: (state: PointerState) => void;
}

export type RuntimeStatusType = "probing" | "live2d_ready" | "fallback_static" | "error";

export interface Live2DRuntimeStatus {
  status: RuntimeStatusType;
  webGLSupported: boolean;
  sdkCoreAvailable: boolean;
  modelManifestFound: boolean;
  modelPath: string;
  artworkSourceFound: boolean;
  reducedMotion: boolean;
  message: string;
  missingRequirements: string[];
}
