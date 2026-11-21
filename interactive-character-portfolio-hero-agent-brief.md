# Interactive Character Portfolio Hero --- Production Brief & AI Agent Instructions

## 1. Project objective

Build a distinctive, production-quality portfolio website hero featuring
the supplied illustrated female character. The defining interaction is
that the character responds naturally to the visitor's pointer:

-   Her eyes/pupils follow the cursor.
-   Her facial expression changes subtly in response to proximity or
    interaction.
-   She blinks naturally.
-   Her head can make small, believable adjustments.
-   Her hair, clothing and body have restrained secondary/idle motion.
-   The experience works responsively, with an appropriate touch-based
    behaviour on mobile.
-   The character must feel like part of the portfolio's visual
    identity, not a generic animation pasted into the page.

The intended result is an elegant, polished, interactive character
experience. Avoid exaggerated cartoon movement, excessive motion,
gimmicks, or anything that damages the original illustration's painterly
style.

## 2. Supplied artwork and known constraints

The user supplied a single flattened illustration of a woman:

-   Full-body character, standing in a three-quarter pose.
-   Curly dark hair, detailed face, reddish/pink dress, shoulder bag and
    burgundy background.
-   Painterly / semi-realistic illustration style.
-   Current supplied image dimensions: **311 × 700 pixels**.
-   The artwork is a single flattened raster image. It does not contain
    independently editable layers for the eyes, face, hair, body, dress,
    bag or background.
-   The character's face is relatively small in the full-body
    composition.
-   The character already has a particular head angle and sideways gaze.
    Preserve this pose and original visual identity.

### Critical constraints

1.  Do not assume the flattened image can be directly imported into a
    character-rigging tool and automatically become a professional rig.
2.  Do not use automatic background removal or automatic layer
    separation as the final artwork-preparation process without careful
    manual inspection and reconstruction.
3.  Moving an eye, pupil, arm, hair section or clothing part exposes
    areas that were hidden in the original flattened image. Those areas
    must be reconstructed/painted.
4.  The 311 × 700 image is not a suitable final production source for a
    large desktop hero with detailed facial animation. Obtain a
    high-resolution original or commission a faithful high-resolution
    reconstruction.
5.  Confirm that the user has permission to modify and commercially
    display the artwork. Do not assume that uploading or possessing an
    image grants usage rights.
6.  Do not claim that an asset, PSD, rig or animation has been created
    unless it actually exists and has been inspected.

## 3. Recommended technical direction

### Primary recommendation: Live2D Cubism + Cubism SDK for Web

Use **Live2D Cubism Editor** to rig the prepared layered illustration
and the **official Live2D Cubism SDK for Web** to render and control it
in the portfolio.

Why this direction:

-   The central requirement is a 2D illustrated character with
    separately controllable facial features.
-   Eye tracking, blinking, facial expressions, head angle and subtle
    secondary motion map naturally to a parameter-driven 2D rig.
-   The character should retain the original painterly illustration
    style.
-   The website needs to control character parameters in response to
    pointer input at runtime.

Do not substitute a CSS-only animation or a video for the interactive
character rig.

### Role of Google Flow

Google Flow / Veo may be used as an **optional visual exploration and
reference-generation tool**. It can help explore possible idle motion,
hair movement, blinking, breathing, or cinematic movement from the
supplied artwork.

It is not the runtime solution:

-   A generated video does not provide live cursor-following.
-   A video does not expose independent eye, eyebrow, mouth, head and
    body parameters to React.
-   Do not use a Flow-generated video as a substitute for the Live2D
    model.
-   If Flow is used, treat the result as a visual reference only. Review
    output for character consistency, anatomy, clothing changes and
    unwanted motion.

### Other tools

-   **Photoshop**: professional reconstruction, masking, layer
    separation and painting.
-   **Krita**: free digital-painting alternative.
-   **Clip Studio Paint**: illustration and character-art preparation.
-   **Live2D Cubism Editor**: mesh creation, deformers, parameter setup,
    rigging and physics.
-   **Next.js + React + TypeScript**: portfolio and runtime integration.
-   **Canvas/WebGL**: character rendering through the official SDK.

Use the official SDK and documentation for the currently supported SDK
version and licensing terms. Do not assume that an unofficial React
wrapper is necessary or preferable.

## 4. Required end-user experience

### Desktop pointer behaviour

The hero should respond to the pointer while the pointer is within the
hero region.

1.  **Initial / idle**
    -   Character rests in the original pose and gaze.
    -   Natural occasional blinking.
    -   Very subtle breathing.
    -   Very subtle hair movement.
    -   No conspicuous continuous body wobble.
2.  **Pointer moves left or right**
    -   Pupils track the pointer within anatomically believable limits.
    -   Eye movement should be the most noticeable response.
    -   Head may make a small secondary adjustment.
    -   Preserve the original three-quarter head pose and sideways gaze
        as the neutral baseline.
3.  **Pointer moves up or down**
    -   Pupils follow vertically within natural limits.
    -   Avoid unnatural eye rotation or visible eye whites stretching.
4.  **Pointer approaches the face**
    -   Optionally trigger a restrained curious/attentive expression.
    -   Use only subtle eyebrow and mouth changes.
    -   Do not make the character look startled or exaggerated unless
        explicitly designed.
5.  **Pointer leaves the hero**
    -   Smoothly return eye/head parameters to their neutral/idle
        values.
    -   Do not snap abruptly.
6.  **Idle over time**
    -   Occasional non-synchronised natural blinks.
    -   Gentle breathing and restrained secondary motion.
    -   Avoid repetitive, obviously mechanical loops.

### Mobile / touch behaviour

There is no mouse cursor on touch devices. Do not leave the character
frozen or broken.

-   Keep a polished idle animation.
-   Optionally use pointer/touch position within the hero to influence
    gaze while the user touches or drags.
-   Do not require touch interaction for the page to work.
-   Avoid persistent tracking that interferes with scrolling.
-   Respect reduced-motion preferences.

### Motion and visual quality

-   Use smooth interpolation/easing, not direct raw pointer jumps.
-   Clamp all parameter values to safe ranges.
-   Keep the eyes anatomically constrained.
-   The face and body must not distort or detach at the mesh boundaries.
-   Secondary motion should be restrained and physically plausible.
-   Preserve the original artwork's colour, texture, lighting, pose,
    proportions and style.
-   Avoid changing the character's identity or outfit.

## 5. Artwork preparation --- mandatory production phase

This is the largest non-code dependency. A professional illustrator /
Live2D artist may be required.

### Step 5.1 --- Source resolution and rights

First: - Ask the user to provide the original high-resolution image or
source artwork if available. - If no better source exists, commission a
faithful high-resolution reconstruction based on the supplied image. -
Target a source large enough for the intended hero composition. A
working target of approximately 2000--3000 px in character height may be
appropriate, subject to the artist's workflow and final display size. -
Confirm usage and modification rights before production.

Do not simply upscale the 311 × 700 image and call it production-ready.
Upscaling may help previewing but cannot restore missing facial detail.

### Step 5.2 --- Layered PSD deliverable

Prepare an animation-ready layered PSD. The following is a suggested
logical hierarchy; the artist may split or combine layers where
technically appropriate.

#### 01 --- Background

-   Burgundy background.
-   Background texture.
-   Background shadows / ambient elements, if present.

#### 02 --- Hair

-   Back hair.
-   Left and right side curls.
-   Front hair / bangs.
-   Loose strands and flyaways.
-   Any hair sections that overlap the face or shoulders must be
    separated appropriately.

#### 03 --- Head and face

-   Face base and skin shading.
-   Ears and neck, as appropriate.
-   Left and right eye whites.
-   Left and right irises.
-   Left and right pupils.
-   Upper and lower eyelids.
-   Eyebrows, separately where needed.
-   Nose and facial shading.
-   Mouth and lips.
-   Blush and highlights.

#### 04 --- Upper body

-   Neck and shoulders.
-   Torso / dress bodice.
-   Left and right sleeves.
-   Left and right upper arms and forearms as needed.
-   Hands and fingers as needed for movement.

#### 05 --- Lower body

-   Back skirt.
-   Front skirt.
-   Skirt folds / panels where useful for movement.
-   Legs / visible skin areas as needed.

#### 06 --- Accessories

-   Bag strap.
-   Bag body.
-   Bag flap.
-   Buckle / clasp.
-   Bracelet and jewellery.

### Step 5.3 --- Reconstruction requirements

The artist must: - Repaint hidden areas behind movable elements. -
Reconstruct eye areas behind pupils and eyelids. - Reconstruct face
areas obscured by hair. - Reconstruct hair behind face/neck/shoulders
where needed. - Reconstruct arms behind sleeves and body. - Reconstruct
skirt sections that need to move independently. - Preserve texture,
brushwork, shading and light direction. - Avoid hard cut-out edges,
halos, seams and mismatched colour. - Ensure each movable component has
enough overlap for deformation. - Keep layer names clear and
organised. - Provide the editable PSD, not only flattened exports.

The PSD should be reviewed at the intended hero display size before
rigging begins.

## 6. Live2D rigging specification

Import the prepared PSD into Cubism and create meshes, ArtMeshes,
deformers and parameters appropriate to the artwork.

The values below are suggested design ranges, not mandatory Cubism
defaults. The rigger must tune them to the actual character and preserve
natural movement.

### Facial parameters

  Suggested parameter     Suggested range Purpose
  --------------------- ----------------- ---------------------------
  ParamAngleX                   -30 to 30 Head horizontal angle
  ParamAngleY                   -30 to 30 Head vertical angle
  ParamEyeBallX                   -1 to 1 Eye tracking horizontally
  ParamEyeBallY                   -1 to 1 Eye tracking vertically
  ParamEyeLOpen                    0 to 1 Left eye opening / blink
  ParamEyeROpen                    0 to 1 Right eye opening / blink
  ParamBrowLY                     -1 to 1 Left eyebrow expression
  ParamBrowRY                     -1 to 1 Right eyebrow expression
  ParamMouthOpenY                  0 to 1 Mouth opening
  ParamBodyAngleX               -10 to 10 Subtle body rotation

These are illustrative parameter names. Confirm naming and parameter
availability in the actual model and map the runtime controller to the
exported model's real parameter IDs.

### Rigging levels

#### Level 1 --- Face

-   Eye tracking.
-   Independent left/right eye control where appropriate.
-   Natural blinking.
-   Eyebrow movement.
-   Subtle mouth / smile variations.
-   Preserve the original face shape and gaze.

#### Level 2 --- Head

-   Small horizontal and vertical head-angle movement.
-   Natural facial and neck deformation.
-   Hairline and front-hair movement that does not detach from the head.
-   Avoid large head rotations that conflict with the original
    three-quarter pose.

#### Level 3 --- Upper body

-   Subtle breathing.
-   Restrained shoulder and torso movement.
-   Arms and sleeves should remain visually connected.
-   Avoid exaggerated body sway.

#### Level 4 --- Lower body and accessories

-   Gentle skirt movement.
-   Hair and loose-strand physics.
-   Minimal bag and strap movement.
-   Keep the bag attached naturally to the strap/body.
-   Avoid excessive cloth simulation or motion that changes the
    silhouette unnaturally.

### Physics

Use Live2D physics selectively: - Hair strands and curls. - Very subtle
skirt movement. - Small accessory movement if appropriate.

Do not apply physics indiscriminately to the whole character. Keep the
original pose stable.

### Expression states

Create a small, carefully designed set: - Neutral / idle. - Attentive /
curious. - Subtle smile.

Expressions should be subtle and compatible with the original
illustration. Do not invent dramatic expressions that require changing
the character's identity.

## 7. Live2D export deliverables

Export the model for Web SDK use. The exact file set depends on the
Cubism export and model configuration, but should include the required
model configuration, model data, textures, physics, expressions and
motions.

Expected asset types may include: - `.model3.json` - `.moc3` -
`.physics3.json` - `.exp3.json` expression files, if created - motion
files, if created - texture atlas files

Keep: - Original layered PSD. - Editable Cubism project. - Exported
runtime model. - A short asset manifest describing the model and its
parameter IDs.

Do not rename or relocate exported files without updating the model
configuration references.

## 8. Next.js integration requirements

Integrate into the existing portfolio repository. Do not rewrite the app
or introduce an unrelated architecture.

### Suggested application structure

``` text
src/
├── components/
│   └── hero/
│       ├── Hero.tsx
│       ├── CharacterCanvas.tsx
│       └── HeroContent.tsx
│
├── lib/
│   └── live2d/
│       ├── initialize.ts
│       ├── pointer-controller.ts
│       ├── parameter-controller.ts
│       └── types.ts
│
public/
└── character/
    └── model/
        ├── character.model3.json
        ├── character.moc3
        ├── character.physics3.json
        ├── character.motions/
        ├── character.expressions/
        └── textures/
```

This is a suggested structure, not a requirement to create empty files.
Adapt it to the existing repository conventions after inspecting the
project.

### Integration principles

1.  Use the official Cubism SDK for Web and its supported integration
    approach.
2.  First build and run the official SDK sample independently.
3.  Verify that the exported character model loads and renders correctly
    in the sample.
4.  Then integrate the working runtime into a client-only Next.js
    component.
5.  Avoid loading browser/WebGL-only code during server rendering.
6.  Initialize the runtime once per mounted character instance.
7.  Avoid React state updates on every pointer event.
8.  Use `requestAnimationFrame` for animation updates.
9.  Clean up animation loops, event listeners, SDK resources and WebGL
    resources on unmount.
10. Handle failed model loads and WebGL initialization gracefully.
11. Keep the hero content and character renderer separated.
12. Keep asset paths configurable and consistent with the exported model
    files.
13. Do not build a custom rendering engine if the official SDK already
    provides the required functionality.

### Pointer-controller behaviour

-   Track pointer coordinates relative to the hero or character
    interaction region, not the entire browser viewport.
-   Normalize X/Y coordinates to a stable range.
-   Map coordinates to the actual model parameter IDs.
-   Preserve the original neutral gaze as the baseline.
-   Clamp movement to the model's safe limits.
-   Use interpolation / easing to smooth movement.
-   Add a small dead zone if needed to prevent jitter.
-   Avoid abrupt parameter changes.
-   On pointer leave, smoothly return to idle values.
-   Use the same animation loop for pointer-driven and idle parameters
    where practical.
-   Keep pointer events lightweight.

### Suggested control architecture

``` text
Hero pointer event
       |
       v
Pointer controller
       |
       v
Normalize + clamp coordinates
       |
       v
Smooth / interpolate target values
       |
       v
Parameter controller
       |
       +--> Eye X / Y
       +--> Head angle X / Y
       +--> Expression parameters
       +--> Body parameters
       |
       v
Cubism SDK update / WebGL render
```

This is conceptual architecture. Implement against the actual SDK APIs
and exported model parameter IDs; do not invent SDK methods.

## 9. Performance, accessibility and responsive requirements

### Performance

-   Lazy-load the character runtime and model when appropriate.
-   Avoid loading large model assets before they are needed.
-   Avoid multiple animation loops.
-   Pause or reduce animation when the document is hidden.
-   Keep pointer calculations lightweight.
-   Avoid unnecessary React re-renders.
-   Test texture sizes, model complexity and WebGL memory usage.
-   Provide a static image fallback.
-   Measure actual performance rather than claiming optimisation without
    profiling.

### Accessibility

-   Respect `prefers-reduced-motion`.
-   Provide a reduced-motion mode with static or very limited animation.
-   Do not make essential portfolio content dependent on the character
    animation.
-   Ensure text contrast and readable typography.
-   Keep interactive navigation accessible independently of the canvas.
-   Do not trap keyboard or screen-reader users in the canvas.

### Responsive behaviour

-   Desktop: full pointer tracking and complete visual presentation.
-   Tablet: scale and position character appropriately; avoid clipping.
-   Mobile: maintain a good static/idle presentation and optional touch
    gaze interaction.
-   Touch interaction must not prevent normal page scrolling.
-   Ensure the character's face remains visible at relevant breakpoints.
-   Do not crop important parts of the character or hide hero content
    behind it.

## 10. Portfolio hero design direction

The character is the visual focal point. Build a portfolio hero around
it without overcrowding the composition.

Design goals: - Strong visual hierarchy. - Character large enough to
read, especially the face. - Text and navigation remain legible. -
Preserve the illustration's original burgundy/red palette unless the
overall portfolio design requires a carefully considered complementary
palette. - Avoid excessive gradients, glassmorphism, floating cards,
decorative elements or unrelated effects. - Use restrained transitions
and polished typography. - Ensure the hero still looks intentional when
the character is static or loading.

The exact headline, name, role, links, portfolio content and overall
site design have not been supplied in this brief. Do not invent personal
facts or final copy. Inspect the existing portfolio content and preserve
it unless the user asks for changes.

## 11. Google Flow --- optional exploration workflow

If the user has access to Google Flow: 1. Use the supplied character
image as a visual reference. 2. Experiment with subtle idle movement,
natural blinking, gentle breathing and slight hair/dress motion. 3. Keep
prompts focused on preserving the same character, outfit, pose, face and
illustration style. 4. Review generated clips for facial drift, identity
changes, anatomy changes, clothing changes, flicker and inconsistent
details. 5. Use selected clips as visual references for the
illustrator/rigger. 6. Do not use the generated video as the live
interactive website character.

Example exploration prompt:

> Preserve the exact illustrated woman, her face, hairstyle, reddish
> dress, shoulder bag, three-quarter pose, proportions, painterly
> texture, lighting and burgundy background. Create a very subtle idle
> animation: one natural blink, gentle breathing, a barely perceptible
> movement in a few loose hair strands and slight fabric movement. Keep
> the camera fixed. Do not change her identity, facial structure,
> outfit, body proportions, pose, background or art style. No camera
> cuts, no zoom, no new objects, no exaggerated movement.

This is a reference-generation prompt, not a guaranteed production
asset.

## 12. Copyright and licensing checks

Before deployment: - Confirm the user has permission to use and modify
the supplied illustration. - Confirm any commissioned reconstruction
includes the rights needed for portfolio and commercial display. -
Review the current Live2D Cubism Editor plan and publication terms. -
Review the current Cubism SDK for Web license and publication
requirements. - Do not assume free development use means unrestricted
commercial publication. - Record the chosen license and any relevant
restrictions in project documentation.

## 13. Milestones and acceptance criteria

### M0 --- Repository and feasibility audit

Deliver: - Existing framework, version and structure summary. - Current
hero implementation and design-system conventions. - Assessment of where
the character component belongs. - Dependency and licensing review. -
List of missing external assets.

Acceptance: - No code changes before understanding the repository. - No
unnecessary architecture rewrite. - Clear separation between work the
coding agent can do and artwork/rigging work requiring external tools or
a human artist.

### M1 --- Artwork readiness

Deliver: - High-resolution source or commissioned reconstruction. -
Layered PSD with hidden areas reconstructed. - Clear layer names and
grouping. - Preview at target hero size.

Acceptance: - No visible gaps or cut-out edges. - Facial features are
sufficiently detailed. - Original pose and visual style are preserved. -
Artist confirms the PSD is suitable for Cubism import.

### M2 --- Facial rig prototype

Deliver: - Imported Cubism project. - Working eye tracking. - Natural
blinking. - Subtle expressions. - Small head movement. - Test render or
video.

Acceptance: - Pupils follow both horizontal and vertical target
positions naturally. - Eyes remain inside their intended boundaries. -
Blinking looks natural. - Neutral pose preserves the original gaze. - No
visible mesh tearing or gaps.

### M3 --- Full-body rig

Deliver: - Hair physics. - Breathing and subtle torso movement. -
Restrained arm, dress and skirt movement where supported by the
artwork. - Bag/strap stability. - Updated editable Cubism project.

Acceptance: - No detached accessories. - No unnatural body distortion. -
Motion is subtle and consistent with the original pose. - No exposed
unpainted areas.

### M4 --- Web SDK proof of concept

Deliver: - Official SDK sample running with the exported model. -
Verified parameter IDs. - Working pointer-to-eye mapping. - Idle
animation. - Basic error handling.

Acceptance: - Model loads reliably. - Pointer interaction works. - No
invented or undocumented SDK API usage. - Model assets and references
resolve correctly.

### M5 --- Next.js integration

Deliver: - CharacterCanvas component. - Pointer and parameter
controllers. - Hero integration. - Loading and static fallback states. -
Cleanup and reduced-motion support.

Acceptance: - No server-side access to browser-only APIs. - No repeated
runtime initialization. - No React re-render on every pointer event. -
No leaked listeners or animation loops. - Existing site architecture and
UI are preserved.

### M6 --- Production QA

Test: - Current desktop browsers. - Mobile Safari and Chrome. - Touch
behaviour. - Reduced-motion mode. - WebGL unavailable or failed. - Slow
network / model load failure. - Tab visibility changes. - Responsive
layouts. - Performance and memory usage.

Acceptance: - Hero remains usable if animation fails. - Navigation and
content remain accessible. - No layout shift caused by model loading. -
No severe frame drops or memory leaks on target devices.

## 14. AI coding agent instructions

You are acting as a senior frontend engineer and technical lead
responsible for delivering this interactive portfolio hero.

### First: inspect, do not immediately code

1.  Inspect the existing repository, framework, package manager,
    scripts, component conventions, styling system, route structure and
    current hero implementation.
2.  Identify the existing design tokens, typography, responsive
    conventions and dependencies.
3.  Check the current official Live2D Cubism SDK documentation and
    sample for the supported version and actual APIs.
4.  Check licensing requirements before proposing deployment.
5.  Inspect the supplied artwork if it is available to you. Confirm its
    dimensions and flattened nature.
6.  Identify whether a layered PSD, high-resolution source and exported
    Cubism model are available.
7.  Produce a concise feasibility report and implementation plan before
    making architectural changes.

### Then: implement what is actually possible

If the layered artwork and exported Live2D model are not available: - Do
not pretend to create a fully rigged character from the flattened
image. - Do not fake eye tracking by moving the entire image. - Do not
create a video and call it interactive. - Do not invent model files or
SDK methods. - Build only the parts that can be implemented and tested
honestly. - If useful, implement the hero shell, character loading
boundary, typed controller interfaces and static fallback, but do not
claim the live character is complete. - Clearly list the exact external
assets and artist deliverables blocking full integration.

If a valid exported model is available: - First prove it works in the
official SDK sample. - Then integrate it into the existing Next.js
project. - Use actual exported parameter IDs and supported SDK APIs. -
Implement the pointer and idle behaviours in this brief. - Test the
complete interaction.

### Code quality constraints

-   Follow the existing repository architecture and conventions.
-   Prefer minimal, focused changes.
-   Do not rewrite unrelated pages, routes, layouts or components.
-   Do not remove existing content or behaviour without explicit
    approval.
-   Avoid unnecessary dependencies and abstraction.
-   Use TypeScript types for the model/controller boundaries.
-   Keep the animation controller separate from presentation.
-   Clean up resources correctly.
-   Do not add arbitrary CSS hacks.
-   Do not claim tests passed unless they were run.
-   Report any SDK, license, asset or browser limitations accurately.

### Required final report from the agent

At completion, report: 1. What was inspected. 2. What was implemented.
3. Files created or changed. 4. Dependencies added and why. 5. How to
run and test the implementation. 6. Which interactions are genuinely
working. 7. Performance and responsive checks performed. 8. Any
remaining artwork, rigging or licensing blockers. 9. Exact next actions
needed to complete production.

## 15. Immediate next actions

The project should start with these actions, in order:

1.  Verify rights to use and modify the illustration.
2.  Search for the original high-resolution source.
3.  If unavailable, commission a high-resolution reconstruction and
    animation-ready layered PSD from an illustrator familiar with
    Live2D.
4.  Ask for the face rig prototype first.
5.  Approve eye tracking, blinking and subtle expressions.
6.  Commission/complete the full-body rig only after the face prototype
    is approved.
7.  Export the model for the official Cubism Web SDK.
8.  Validate the model in the official SDK sample.
9.  Integrate it into the existing Next.js portfolio.
10. Complete responsive, accessibility, performance and licensing
    checks.

**Definition of done:** The portfolio contains the supplied character,
faithfully reconstructed and rigged, whose eyes respond naturally to the
visitor's pointer, whose facial expressions and idle movement are subtle
and polished, and whose full-body secondary motion works without
distorting the original illustration. The experience is integrated into
the existing Next.js project, responsive, accessible, performant,
licensed appropriately and backed by real tested assets---not
placeholder claims.
