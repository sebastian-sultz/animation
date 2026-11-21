/**
 * Parameter Controller
 * Maps smoothed pointer coordinates to Live2D Cubism model parameter IDs.
 * Generates restrained procedural idle animations: natural Poisson blinks,
 * subtle breathing cycle, and micro-movements.
 */

import { Live2DParameterValues, PointerState } from "./types";

export class ParameterController {
  private values: Live2DParameterValues;
  private nextBlinkTime = 0;
  private blinkStartTime = 0;
  private blinkDuration = 180; // ms
  private isBlinking = false;
  private breathPhase = 0;

  constructor() {
    this.values = {
      ParamAngleX: 3.5, // Subtle baseline angle preserving 3/4 pose
      ParamAngleY: -1.0,
      ParamAngleZ: 0.0,
      ParamEyeBallX: 0.12, // Sideways baseline gaze
      ParamEyeBallY: -0.04,
      ParamEyeLOpen: 1.0,
      ParamEyeROpen: 1.0,
      ParamBrowLY: 0.0,
      ParamBrowRY: 0.0,
      ParamMouthOpenY: 0.0,
      ParamBodyAngleX: 1.0,
      ParamBreath: 0.5,
    };

    this.scheduleNextBlink(performance.now() + 1500);
  }

  /**
   * Updates all Live2D parameters based on smoothed pointer state and elapsed time.
   */
  public update(pointerState: PointerState, now: number, reducedMotion = false): Live2DParameterValues {
    if (reducedMotion) {
      // In reduced motion mode, maintain calm, static baseline parameters
      this.values.ParamAngleX = 3.5;
      this.values.ParamAngleY = -1.0;
      this.values.ParamEyeBallX = 0.12;
      this.values.ParamEyeBallY = -0.04;
      this.values.ParamEyeLOpen = 1.0;
      this.values.ParamEyeROpen = 1.0;
      this.values.ParamBreath = 0.5;
      return { ...this.values };
    }

    // 1. Map Eye Ball Tracking (Primary interaction)
    // Range: -1 to 1.
    // Gaze follows smoothed pointer with anatomical damping
    this.values.ParamEyeBallX = Math.max(-0.9, Math.min(0.9, pointerState.smoothedX * 0.95));
    this.values.ParamEyeBallY = Math.max(-0.8, Math.min(0.8, pointerState.smoothedY * 0.85));

    // 2. Map Head Angles (Secondary, restrained motion preserving 3/4 pose)
    // ParamAngleX range: -30 to 30 deg. We constrain hero head tracking to [-12, +12] deg
    // to preserve her three-quarter silhouette without breaking facial anatomy.
    const headXContribution = pointerState.smoothedX * 10;
    const headYContribution = pointerState.smoothedY * 8;
    this.values.ParamAngleX = Math.max(-12, Math.min(12, 3.0 + headXContribution));
    this.values.ParamAngleY = Math.max(-10, Math.min(10, -1.0 + headYContribution));
    this.values.ParamAngleZ = pointerState.smoothedX * -2.5;

    // 3. Map Upper Body Rotation
    // Range: -10 to 10 deg. Restrained to [-3, +3] deg
    this.values.ParamBodyAngleX = Math.max(-3.5, Math.min(3.5, 1.0 + pointerState.smoothedX * 2.2));

    // 4. Subtle Proximity Expression (Attentive curiosity when pointer nears the face)
    if (pointerState.proximityToFace > 0) {
      const p = pointerState.proximityToFace;
      // Slight eyebrow raise (attentive, not startled)
      this.values.ParamBrowLY = p * 0.18;
      this.values.ParamBrowRY = p * 0.14;
      // Slight gentle smile curve
      this.values.ParamMouthOpenY = p * 0.08;
    } else {
      this.values.ParamBrowLY = 0;
      this.values.ParamBrowRY = 0;
      this.values.ParamMouthOpenY = 0;
    }

    // 5. Procedural Breathing (Period ~ 4.2 seconds)
    this.breathPhase = (now / 4200) * Math.PI * 2;
    const breathSin = (Math.sin(this.breathPhase) + 1) * 0.5; // 0 to 1
    this.values.ParamBreath = breathSin;

    // Breathing adds a micro vertical shift to head and chest
    this.values.ParamAngleY += (breathSin - 0.5) * 0.6;

    // 6. Natural Procedural Blinking
    this.updateBlinking(now);

    return { ...this.values };
  }

  public getParameters(): Live2DParameterValues {
    return { ...this.values };
  }

  private scheduleNextBlink(afterTime: number): void {
    // Human blinks occur roughly every 3 to 6 seconds with natural Poisson-like variation
    const interval = 3200 + Math.random() * 3000;
    this.nextBlinkTime = afterTime + interval;
    this.blinkDuration = 160 + Math.random() * 50; // 160ms - 210ms
  }

  private updateBlinking(now: number): void {
    if (!this.isBlinking && now >= this.nextBlinkTime) {
      this.isBlinking = true;
      this.blinkStartTime = now;
    }

    if (this.isBlinking) {
      const elapsed = now - this.blinkStartTime;
      const progress = elapsed / this.blinkDuration;

      if (progress >= 1.0) {
        // Blink finished
        this.isBlinking = false;
        this.values.ParamEyeLOpen = 1.0;
        this.values.ParamEyeROpen = 1.0;
        this.scheduleNextBlink(now);
      } else {
        // Curve: eye closes fast (first 40%), opens smoothly (remaining 60%)
        let eyeOpen: number;
        if (progress < 0.4) {
          const t = progress / 0.4;
          eyeOpen = 1.0 - Math.sin(t * (Math.PI / 2));
        } else {
          const t = (progress - 0.4) / 0.6;
          eyeOpen = Math.sin(t * (Math.PI / 2));
        }

        // Left and right eye have slight natural micro-asymmetry
        this.values.ParamEyeLOpen = Math.max(0, Math.min(1, eyeOpen));
        this.values.ParamEyeROpen = Math.max(0, Math.min(1, eyeOpen * 0.98));
      }
    } else {
      this.values.ParamEyeLOpen = 1.0;
      this.values.ParamEyeROpen = 1.0;
    }
  }
}
