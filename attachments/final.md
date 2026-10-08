# Master Creative & Technical Guidelines: Seamless 3D WebGL Integration

## Core Vision & Architectural Philosophy

This document serves as the final directive for the coding agent building the **\$1,000 High-Converting 3D Artisan Gelato & Ice Cream Experience**.

The core objective is to create an **immersive, floating 3D canvas layer** integrated directly into the DOM structure. **DO NOT** place 3D GLB models inside an enclosed viewer box, bounded simulation container, or standard `<canvas>` rectangular card with interactive "drag-and-drop" or explicit user orbit controls. 

Instead, treatment of 3D models must emulate world-class digital ads and interactive WebGL experiences (e.g., Apple, Nike, high-end design agency sites):
- **Integrated Scroll Dynamics:** 3D GLB models (artisan cones, floating gelato scoops, dripping toppings) exist as unconfined, borderless elements floating across the entire viewport.
- **Scroll & Kinetic Motion:** Models transition, rotate 360 degrees, scale, and move seamlessly alongside page scrolling (driven by Lenis + GSAP ScrollTrigger).
- **Abstracted Specifications:** Technical model specs, polygon counts, shader nodes, and bounding boxes must be completely abstracted away from the UI. Users experience pure visual craftsmanship—smooth lighting, sub-surface cream dispersion, and liquid dynamic motion.
- **Seamless Layering:** HTML content (typography, glassmorphic cards, call-to-action buttons) sits directly on top of or behind the floating 3D elements using z-index layering and transparent WebGL viewports.

---

## Design System & Reference Standards

### Official Google Labs Design Specification Reference
Incorporate design system principles, motion parameters, and spatial UI layout rules from the official Google Labs repository:
- **Repository Reference:** `https://github.com/google-labs-code/design.md.git`

### Primary Palette & Visual Direction
* **Vanilla Cream (`#FFF5E1`):** Main DOM canvas background for warm, appetizing appeal.
* **Pastel Strawberry (`#FFB7B2`) & Mint Sundae (`#B5EAD7`):** Secondary UI cards, soft glowing highlights, and hover states.
* **Deep Chocolate (`#2B1B17`):** Bold, high-contrast serif typography for maximum legibility.
* **Electric Berry (`#FF3366`):** High-intensity accent reserved for CTAs and post-processing Bloom targets.

---

## Technical Stack & Configuration Blueprint

```json
{
  "$schema": "[https://json-schema.org/draft/2020-12/schema](https://json-schema.org/draft/2020-12/schema)",
  "name": "grok-viral-3d-artisan-gelato-mcp-suite",
  "version": "4.2.0",
  "target_market_value": "$1000 USD High-Converting WebGL Artisan Gelato Experience",
  "description": "Production-ready master MCP client configuration and creative developer instruction set for Grok to architect, generate, and animate ultra-viral 3D Ice Cream Store websites using React Three Fiber, GLSL melting cream shaders, Pexels API media integration, Motion Anything repository bindings, and GLB model transformations with open-source fallbacks.",

  "mcpServers": {
    "pexels-media-engine": {
      "command": "npx",
      "args": ["-y", "mcp-pexels"],
      "env": {
        "PEXELS_API_KEY": "wNw2FWSSVyJMjjzuV2s9BRkqdyKJBaK7JycHOUUuNyA78Ksftx06FVzt"
      },
      "description": "Exposes tool endpoints for searching and loading 4K ice cream photography, macro dessert videos, and vibrant background clips into R3F canvas planes using the integrated API key."
    },
    "motion-anything-engine": {
      "command": "npx",
      "args": ["-y", "mcp-git-runner"],
      "env": {
        "GIT_REPOSITORY_URL": "[https://github.com/nexu-io/motion-anything.git](https://github.com/nexu-io/motion-anything.git)"
      },
      "description": "Integrates the nexu-io Motion Anything pipeline to auto-generate dynamic motion vector fields, automated object animations, and generative particle motions."
    },
    "google-design-md-spec": {
      "command": "npx",
      "args": ["-y", "mcp-git-runner"],
      "env": {
        "GIT_REPOSITORY_URL": "[https://github.com/google-labs-code/design.md.git](https://github.com/google-labs-code/design.md.git)"
      },
      "description": "Parses layout specifications, motion constraints, and spatial design principles directly into UI and WebGL camera behaviors."
    },
    "open-source-media-engine": {
      "command": "npx",
      "args": ["-y", "@mcp/open-media-assets"],
      "description": "Provides local & open-source public CDN assets for loading backup gourmet ice cream visuals and looping video elements directly when offline or bypassing external API limits."
    },
    "r3f-declarative-builder": {
      "command": "npx",
      "args": ["-y", "@mcp/react-three-fiber-server"],
      "description": "Generates declaratively structured R3F canvas scenes, perspective camera rigs, soft warm lighting, and responsive viewports."
    },
    "gltf-to-jsx-pipeline": {
      "command": "npx",
      "args": ["-y", "gltfjsx-mcp-server"],
      "description": "Parses 3D ice cream GLB models into optimized R3F JSX components with subsurface scattering and transmission materials."
    },
    "glsl-fluid-melt-synthesizer": {
      "command": "npx",
      "args": ["-y", "glsl-shader-mcp"],
      "description": "Compiles and injects custom liquid swirl/melt vertex and fragment shaders, cream distortion planes, and interactive fluid mouse ripples."
    },
    "motion-design-bridge": {
      "command": "npx",
      "args": ["-y", "webgl-motion-mcp"],
      "description": "Manages animated soft-sprinkle HUD overlays, kinetic typography badges, floating ingredient particles, and elastic spring UI interactions."
    },
    "gltf-draco-optimizer": {
      "command": "npx",
      "args": ["-y", "@gltf-transform/mcp-server"],
      "description": "Executes local headless Draco compression, mesh simplification, and Basis Universal texture encoding on GLB models to maintain 60FPS performance."
    }
  },

  "core_tech_stack": {
    "framework": "React 18 / Next.js App Router or Vite + React",
    "3d_renderer": "React Three Fiber (@react-three/fiber)",
    "3d_abstractions": "@react-three/drei",
    "post_processing": "@react-three/postprocessing",
    "smooth_scroll": "Lenis Smooth Scroll (@studio-freight/lenis)",
    "animation_engine": "Motion Anything + GSAP (ScrollTrigger, quickTo) + Framer Motion 3D",
    "design_guidelines": "Google Design MD ([https://github.com/google-labs-code/design.md.git](https://github.com/google-labs-code/design.md.git))",
    "styling": "Tailwind CSS (Theme: Warm Cream / Pastel Pink / Soft Mint / Dark Cocoa)",
    "texture_engine": "Pexels API Video/Photo Textures + Procedural GLSL Shaders"
  }
}