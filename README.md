# 📦 Pinpoint SDK (`pinpointly`)

The **Pinpoint SDK** is a framework-agnostic, React-based overlay and bug reporting toolkit. It enables seamless UI annotation, DOM event tracking, screenshot capture, and contextual bug reporting directly from any web application. This SDK is designed to be injected into client apps or loaded into the Pinpoint webapp via iframe, powering the core user experience for contextual bug reporting and feedback.

---

## ✨ Features

- **DOM Element Selection & Highlighting**: Select and highlight UI components for precise feedback.
- **Overlay UI**: Floating toolbar, highlighter, and comment modal for contextual bug reporting.
- **Screenshot Capture**: Capture annotated screenshots of selected elements using `html2canvas`.
- **DOM Event Logging**: Track recent user interactions (clicks, inputs, etc.) for reproducible bug reports.
- **Console Log Capture**: Collect browser logs to aid debugging.
- **Hotkey Toggle**: Activate overlay with for ex. `Ctrl+Alt+C` (TBD).
- **API Integrations**: Pinpoint backend API creates tickets of your choice on any supported integration (Azure DevOps, Jira, and more to come).
- **Configurable**: Custom Hotkey configuration.
- **AI-Enhanced**: (Planned) Generate bug descriptions and repro steps using OpenAI/Azure OpenAI.
- **User Tagging**: (Planned) Tag users via Entra ID for notifications and assignment.

---

## 🚀 Quick Start (NOT YET RELEASED)

### 1. Install

```bash
npm install @pinpointly/sdk
```

### 2. Initialize SDK

```js
import { initPinpoint } from '@pinpointly/sdk';

initPinpoint();
```

### 3. Usage
- Press ex. `Ctrl+Alt+C` (TBD) to toggle the overlay.
- Select UI elements, add comments, and submit story / bug reports.
- Reports are sent to your chosen platform via the Pinpoint backend API.

---

## 🧩 Core Modules

- `/components` — Overlay, highlighter, comment modal components
- `/core` — DOM tracking, event logging, screenshot logic
- `/api` — API client for sending data to backend
- `index.ts` — Public SDK entry point

---

## 🛠️ API Reference

### `initPinpoint(options)`
Initializes the SDK overlay and event tracking.

**Options:**
- `hotkey` (string, optional): Overlay toggle hotkey (default: `Ctrl+Alt+C`)
- ...more coming soon

---

## 🌐 Backend Integration

The SDK communicates with the Pinpoint backend API to:
- Submit bug and story reports with screenshots, logs, and DOM Reproduce steps
- Integrate with Azure DevOps, Microsoft Teams (Notifications), and AI services (future)
- Tagging project users to notify them (future)

---

## 🏗️ Project Structure

```
/packages/sdk
  /src
    /ui              # Overlay, highlighter, comment components
    /core            # DOM tracking, logging, screenshot logic
    /api             # Send to backend
    index.ts         # Public SDK entry
  tailwind.config.js
  postcss.config.mjs
  tsconfig.json
  tsup.config.ts
  package.json
```

---

## 🗺️ Roadmap Highlights
- [ ] DOM selection, overlay, and comment modal
- [ ] Screenshot and log capture
- [ ] API integration for bug reporting
- [ ] AI-generated bug descriptions and repro steps
- [ ] User tagging and Teams notifications
- [ ] UMD/ESM bundle export
