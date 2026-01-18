# Changelog

All notable changes to **Image3D Studio** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-01-18
### Mobile Redesign & Deployment Stabilization

Significant improvements to the mobile experience with a new "Avant-Garde" floating dock and simplified interaction model, alongside critical deployment fixes for GitHub Pages.

### 🚀 Added
- **Mobile Glass Dock**: A floating, pill-shaped navigation dock for mobile devices, replacing the squashed sidebar.
- **Tight Layout System**: Optimized spacing for mobile settings panels with zero-gap headers and integrated content.
- **Defensive DOM Restoration**: Robust logic in `BottomSheet` to preventing crashes when toggling views.
- **GitHub Pages Support**: Configured `package.json` (`homepage`) and webpack (`publicPath: 'auto'`) for subdirectory deployment.

### 💅 Polished
- **Status Indicator**: Relaxed FPS monitoring thresholds (Green > 15 FPS) to prevent false alarms.
- **Text Rendering**: Fixed blurry text on glass panels by moving backdrop filters to pseudo-elements.
- **Actions Panel**: Added "OPERATIONS" header to mobile view for better navigation clarity.

### 🐛 Fixed
- **Mobile Interactions**: Resolved `pointer-events` issue that made mobile buttons unclickable.
- **Service Worker**: Added "Kill Switch" logic to clear stale workers causing cache loops.
- **Asset Loading**: Fixed relative path resolution for `manifest.json` and icons in production builds.

---

## [1.0.1] - 2026-01-18
### "Soft Orbital" Update & PWA Support

A massive overhaul of the user interface and core infrastructure, transforming the prototype into a polished, installable application.

### 🚀 Added
- **PWA Support**: Full progressive web app capabilities.
    - `manifest.json` for standalone installation.
    - Service Worker (`v3`) with network-first strategy for offline support.
    - Adaptive icon set.
- **Settings Persistence**: User preferences (Material, Camera, Visuals) now save automatically to `localStorage`.
- **Global Error Handling**:
    - Centralized `NotificationSystem` for non-intrusive toast alerts.
    - Global trap for `window.onerror` and `unhandledrejection` to prevent silent crashes.
- **New UI Components**:
    - `BottomSheet` for mobile-native interactions.
    - Animated Accordion menus for "Actions", "Materials", and "Advanced" panels.
    - "Eye" visibility toggle to hide UI for clean screenshots.

### 💅 Changed
- **Visual Overhaul**: Moved to the **"Soft Orbital"** design system.
    - Deep space black background (`#050505`).
    - Glassmorphism panels with `backdrop-filter: blur`.
    - Neon Cyan (`#00f0ff`) accent integration.
    - **Typography**: Switched to `Share Tech Mono` for a technical, sci-fi feel.
- **Infrastructure**:
    - Migrated codebase to **TypeScript** strict mode.
    - Implemented `UIManager` class to decouple logic from the DOM.
    - Added `SettingsManager` for state persistence.
    - Replaced hardcoded CSS toggles with physics-based CSS transitions (`max-height`).

### 🐛 Fixed
- **Refresh Loop**: Resolved an issue where the Service Worker cached the app shell too aggressively in development.
- **UI Glitches**:
    - Fixed "Minimize" panel logic to properly collapse accordion states.
    - Corrected "Visibility Toggle" icon disappearing due to SVG replacement.
    - Fixed Zoom button alignment in the HUD.

---

## [1.0.0] - 2026-01-01
### Initial Release

- Basic 3D Scene with Three.js.
- Primitive Rendering (Cube, Sphere, Capsule, Torus).
- Texture Upload System.
- Basic Turntable Camera.
- Initial Webpack Configuration.
