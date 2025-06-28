import React from "react";
import "../styles.css";
import { createRoot } from "react-dom/client";
import { App } from "components/App";

let isInitialized = false;

export function initPinpoint(config?: any) {
  if (isInitialized || document.getElementById("pinpoint-root")) {
    isInitialized = true;
    return;
  }

  isInitialized = true;

  requestAnimationFrame(() => {
    if (document.getElementById("pinpoint-root")) return;

    const el = document.createElement("div");
    el.id = "pinpoint-root";
    document.body.appendChild(el);

    const root = createRoot(el);
    root.render(<App config={config} />);
  });
}
