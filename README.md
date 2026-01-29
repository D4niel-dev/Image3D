<div align="center">
  <img src="assets/icons/app_banner.png" alt="Image3D Banner" width="100%" />

  # 3D Image Studio
  
  **Interactive 3D Texture Visualizer & Generator**
  
  [![License](https://img.shields.io/badge/License-MIT-00f0ff)](LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=rounded-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Three.js](https://img.shields.io/badge/Three.js-r171-white?style=rounded-square&logo=three.js)](https://threejs.org/)
  [![PWA](https://img.shields.io/badge/PWA-Ready-purple?style=rounded-square&logo=pwa)](https://web.dev/progressive-web-apps/)
  ![Build](https://img.shields.io/badge/Build-1.1.0-blue)
  ![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Web%20%7C%20Mobile-lightgrey)

  <p align="center">
    A premium, <strong>Soft Orbital</strong> workstation for visualizing textures on 3D primitives.<br>
    Built with glassmorphism, physics-based animations, and a deep space aesthetic.
  </p>
</div>

---

## 🌌 Overview

**3D Image Studio** is a high-performance web application designed for artists and developers to instantly visualize texture maps on various 3D geometry. 

Beyond a simple viewer, it features a robust **"Soft Orbital" UI**—a translucent, glass-like interface that floats above a digital horizon. It includes advanced camera controls, real-time material editing, and is fully installable as a **Progressive Web App (PWA)** for offline creativity.

## ✨ Key Features

### 🎨 Visual & UI
- **Soft Orbital Theme**: Deep space backdrops, neon cyan accents (#00f0ff), and frosted glass panels (`backdrop-filter: blur`).
- **Smooth Animations**: Physics-based accordion menus and panel transitions.
- **Mobile-First Design**: Dedicated "Floating Glass Dock" interface for mobile, featuring touch-optimized bottom sheets and compact HUD.

### 🛠 Technical Core
- **Real-time Rendering**: Powered by **Three.js** with optimized geometry and shader materials.
- **Universal Deployment**: CI/CD ready for **GitHub Pages** (subdirectory support) and traditional hosts.
- **PWA Support**: Offline-first capability with Service Worker caching and standalone installability.
- **State Persistence**: Settings (camera, material, visuals) are saved automatically to local storage.
- **Error Handling**: integrated global error trapping with a neon-toast notification system.

### 🎛 Controls
- **Material Editor**: Live tweak Roughness, Metalness, Color, and Wireframe modes.
- **Camera Suite**: Auto-rotation, Turntable/Static modes, and locked angles.
- **Export**: Generate GIFs or take Snapshots of your scene instantly.
- **Drag & Drop**: Upload custom textures directly onto the model.

## 🚀 Getting Started

### Prerequisites 📝
- Node.js (v16+)
- npm or yarn (Recommended npm)

### Installation 📥

```bash
# Clone the repository
git clone https://github.com/d4niel-dev/Image3D.git

# Enter directory
cd Image3D

# Install dependencies
npm install
```

### Development 🖥

```bash
# Run dev server with Hot Module Replacement
npm run dev

# OR use the PowerShell automation script
./dev.ps1
```

### Production Build ⚙️

```bash
# Build for production (outputs to /dist)
npm run build
```

## 🏗 Architecture

- **`src/main.ts`**: Entry point, bootstraps `App` and global error handling.
- **`src/app.ts`**: Core orchestrator connecting Scene and UI.
- **`src/scene/`**: Three.js logic (`SceneManager`, `Lighting`, `Geometry`).
- **`src/ui/`**: UI components (`UIManager`, `NotificationSystem`, `BottomSheet`).
- **`src/utils/`**: Helpers (`SettingsManager`, `DeviceUtils`, `StatsMonitor`).
- **`src/styles/`**:
    - `main.css`: Core "Soft Orbital" theme and desktop layout.
    - `mobile.css`: Mobile-specific overrides, Floating Dock, and Bottom Sheet styles.

## 📦 Progressive Web App

Image3D Studio meets all PWA criteria:
- **Manifest**: Full metadata for standalone installation.
- **Service Worker**: Network-first strategy for reliable offline access and instant loading.
- **Icons**: Adaptive icon set for all devices.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.



## 📃 Feedback & Issues

If you have feedback/suggestions or issues with the app, please make a **Pull Request** in this repo.

---

<div align="center">
  <sub>Designed & Engineered with the <i>"Soft Orbital"</i> Design System.</sub>
</div>
