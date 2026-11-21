/**
 * Live2D Cubism Web SDK Initializer and Lifecycle Bridge
 * Inspects browser WebGL capability, probes exported Live2D model assets,
 * verifies Live2D Cubism Core runtime, and manages graceful fallback.
 */

import { Live2DRuntimeStatus } from "./types";

declare global {
  interface Window {
    Live2DCubismCore?: {
      Version: {
        cmo3Version?: string;
      };
    };
  }
}

export const DEFAULT_MODEL_PATH = "/character/model/character.model3.json";
export const DEFAULT_ARTWORK_PATH = "/character.jpg";

/**
 * Checks whether WebGL / WebGL2 rendering is supported in the current browser.
 */
export function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * Probes for model assets and Live2D Cubism Web SDK.
 */
export async function probeLive2DRuntime(modelPath: string = DEFAULT_MODEL_PATH): Promise<Live2DRuntimeStatus> {
  const isClient = typeof window !== "undefined";
  const webGLSupported = isClient ? checkWebGLSupport() : false;
  const sdkCoreAvailable = isClient ? Boolean(window.Live2DCubismCore) : false;
  const reducedMotion = isClient ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;

  const missingRequirements: string[] = [];

  if (!webGLSupported) {
    missingRequirements.push("WebGL 1.0 or 2.0 graphic context is unavailable in this environment.");
  }

  if (!sdkCoreAvailable) {
    missingRequirements.push(
      "Live2D Cubism Core library (live2dcubismcore.min.js) is not loaded. Sourced under Live2D Software License."
    );
  }

  let modelManifestFound = false;
  let artworkSourceFound = false;

  if (isClient) {
    // 1. Check if the exported model manifest exists
    try {
      const modelRes = await fetch(modelPath, { method: "HEAD" });
      modelManifestFound = modelRes.ok;
    } catch {
      modelManifestFound = false;
    }

    if (!modelManifestFound) {
      missingRequirements.push(
        `Live2D model manifest not found at '${modelPath}'. Requires layered PSD rigging & Cubism export (.model3.json, .moc3, textures).`
      );
    }

    // 2. Check if the original supplied character artwork is present
    try {
      const artRes = await fetch(DEFAULT_ARTWORK_PATH, { method: "HEAD" });
      artworkSourceFound = artRes.ok;
    } catch {
      artworkSourceFound = false;
    }

    if (!artworkSourceFound) {
      missingRequirements.push(`Supplied character artwork missing at '${DEFAULT_ARTWORK_PATH}'.`);
    }
  }

  const isLiveReady = webGLSupported && sdkCoreAvailable && modelManifestFound;

  let message = "";
  let status: Live2DRuntimeStatus["status"] = "fallback_static";

  if (isLiveReady) {
    status = "live2d_ready";
    message = "Live2D Cubism runtime and model assets are fully verified and ready.";
  } else if (!webGLSupported) {
    status = "error";
    message = "Hardware acceleration / WebGL is unsupported. Displaying static portfolio hero.";
  } else {
    status = "fallback_static";
    message =
      "Awaiting Live2D rigging & Web SDK deliverables. Displaying high-fidelity static illustration with active mathematical pointer tracking telemetry.";
  }

  return {
    status,
    webGLSupported,
    sdkCoreAvailable,
    modelManifestFound,
    modelPath,
    artworkSourceFound,
    reducedMotion,
    message,
    missingRequirements,
  };
}
