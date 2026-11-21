/**
 * Pointer Controller
 * Handles pointer math, coordinate normalization, aspect ratio compensation,
 * smooth spring/lerp interpolation, and idle baseline return.
 */

import { NormalizedCoordinates, PointerControllerOptions, PointerState } from "./types";

export class PointerController {
  private container: HTMLElement | null = null;
  private options: Required<PointerControllerOptions>;
  private state: PointerState;
  private targetCoords: NormalizedCoordinates;
  private animFrameId: number | null = null;
  private isDestroyed = false;
  private isHovered = false;
  private leaveStartTime: number | null = null;
  private leaveStartCoords: NormalizedCoordinates = { x: 0, y: 0 };

  constructor(options: PointerControllerOptions = {}) {
    const defaultBaseline: NormalizedCoordinates = { x: 0.12, y: -0.04 };
    this.options = {
      damping: options.damping ?? 0.14,
      deadZone: options.deadZone ?? 0.015,
      returnDuration: options.returnDuration ?? 700,
      baseline: options.baseline ?? defaultBaseline,
      clamp: options.clamp ?? { minX: -0.85, maxX: 0.85, minY: -0.75, maxY: 0.75 },
      onUpdate: options.onUpdate ?? (() => {}),
    };

    this.targetCoords = { ...this.options.baseline };
    this.state = {
      rawX: 0,
      rawY: 0,
      normalizedX: this.options.baseline.x,
      normalizedY: this.options.baseline.y,
      smoothedX: this.options.baseline.x,
      smoothedY: this.options.baseline.y,
      proximityToFace: 0,
      isInside: false,
      isTouch: false,
      lastUpdated: Date.now(),
    };
  }

  public attach(container: HTMLElement): void {
    if (this.container) {
      this.detach();
    }
    this.container = container;
    this.isDestroyed = false;

    container.addEventListener("pointermove", this.handlePointerMove, { passive: true });
    container.addEventListener("pointerenter", this.handlePointerEnter, { passive: true });
    container.addEventListener("pointerleave", this.handlePointerLeave, { passive: true });
    container.addEventListener("touchstart", this.handleTouchStart, { passive: true });
    container.addEventListener("touchmove", this.handleTouchMove, { passive: true });
    container.addEventListener("touchend", this.handleTouchEnd, { passive: true });
    container.addEventListener("touchcancel", this.handleTouchEnd, { passive: true });

    this.startLoop();
  }

  public detach(): void {
    if (this.container) {
      this.container.removeEventListener("pointermove", this.handlePointerMove);
      this.container.removeEventListener("pointerenter", this.handlePointerEnter);
      this.container.removeEventListener("pointerleave", this.handlePointerLeave);
      this.container.removeEventListener("touchstart", this.handleTouchStart);
      this.container.removeEventListener("touchmove", this.handleTouchMove);
      this.container.removeEventListener("touchend", this.handleTouchEnd);
      this.container.removeEventListener("touchcancel", this.handleTouchEnd);
      this.container = null;
    }
    this.stopLoop();
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.detach();
  }

  public getState(): PointerState {
    return { ...this.state };
  }

  public setBaseline(baseline: NormalizedCoordinates): void {
    this.options.baseline = { ...baseline };
    if (!this.isHovered) {
      this.targetCoords = { ...baseline };
    }
  }

  private handlePointerMove = (e: PointerEvent): void => {
    if (!this.container) return;
    this.updateFromClientCoords(e.clientX, e.clientY, e.pointerType === "touch");
  };

  private handlePointerEnter = (e: PointerEvent): void => {
    this.isHovered = true;
    this.leaveStartTime = null;
    this.state.isInside = true;
    this.handlePointerMove(e);
  };

  private handlePointerLeave = (): void => {
    this.isHovered = false;
    this.state.isInside = false;
    this.leaveStartTime = performance.now();
    this.leaveStartCoords = { x: this.state.smoothedX, y: this.state.smoothedY };
  };

  private handleTouchStart = (e: TouchEvent): void => {
    if (e.touches.length > 0) {
      this.isHovered = true;
      this.leaveStartTime = null;
      this.state.isInside = true;
      const touch = e.touches[0];
      this.updateFromClientCoords(touch.clientX, touch.clientY, true);
    }
  };

  private handleTouchMove = (e: TouchEvent): void => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.updateFromClientCoords(touch.clientX, touch.clientY, true);
    }
  };

  private handleTouchEnd = (): void => {
    this.handlePointerLeave();
  };

  private updateFromClientCoords(clientX: number, clientY: number, isTouch: boolean): void {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const rawX = clientX - rect.left;
    const rawY = clientY - rect.top;

    // Normalize coordinates: center is (0, 0), left: -1, right: +1, top: +1, bottom: -1
    let nx = ((rawX / rect.width) * 2) - 1;
    let ny = -(((rawY / rect.height) * 2) - 1);

    // Dead zone check around baseline
    const dx = nx - this.options.baseline.x;
    const dy = ny - this.options.baseline.y;
    const distFromBaseline = Math.sqrt(dx * dx + dy * dy);

    if (distFromBaseline < this.options.deadZone) {
      nx = this.options.baseline.x;
      ny = this.options.baseline.y;
    }

    // Clamp to safe limits
    nx = Math.max(this.options.clamp.minX, Math.min(this.options.clamp.maxX, nx));
    ny = Math.max(this.options.clamp.minY, Math.min(this.options.clamp.maxY, ny));

    this.targetCoords = { x: nx, y: ny };
    this.state.rawX = rawX;
    this.state.rawY = rawY;
    this.state.normalizedX = nx;
    this.state.normalizedY = ny;
    this.state.isTouch = isTouch;
    this.state.lastUpdated = Date.now();

    // Approximate proximity to face region:
    // In our 311x700 illustration, the face is in upper-third roughly centered horizontally:
    // nx around 0.05, ny around 0.55
    const faceDx = nx - 0.05;
    const faceDy = ny - 0.52;
    const distToFace = Math.sqrt(faceDx * faceDx + faceDy * faceDy);
    // Smooth falloff radius: 0.4
    this.state.proximityToFace = Math.max(0, Math.min(1, 1 - distToFace / 0.45));
  }

  private startLoop(): void {
    if (this.animFrameId !== null) return;
    const tick = (now: number) => {
      if (this.isDestroyed) return;
      this.updateFrame(now);
      this.animFrameId = requestAnimationFrame(tick);
    };
    this.animFrameId = requestAnimationFrame(tick);
  }

  private stopLoop(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private updateFrame(now: number): void {
    if (!this.isHovered && this.leaveStartTime !== null) {
      // Smoothly ease back to baseline using smoothstep over returnDuration
      const elapsed = now - this.leaveStartTime;
      const progress = Math.min(1, elapsed / this.options.returnDuration);
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);

      this.targetCoords.x = this.leaveStartCoords.x + (this.options.baseline.x - this.leaveStartCoords.x) * ease;
      this.targetCoords.y = this.leaveStartCoords.y + (this.options.baseline.y - this.leaveStartCoords.y) * ease;

      if (progress >= 1) {
        this.leaveStartTime = null;
        this.targetCoords = { ...this.options.baseline };
      }
    }

    // Lerp smoothing towards target
    const damping = this.options.damping;
    this.state.smoothedX += (this.targetCoords.x - this.state.smoothedX) * damping;
    this.state.smoothedY += (this.targetCoords.y - this.state.smoothedY) * damping;

    this.options.onUpdate(this.state);
  }
}
