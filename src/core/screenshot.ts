import { toPng } from "html-to-image";

/**
 * Finds a suitable container for screenshot context by traversing up the DOM tree.
 * Stops at <body>, <html>, or after maxDepth parents.
 */
export function getScreenshotContainer(
  element: HTMLElement,
  maxDepth = 4
): HTMLElement {
  let container: HTMLElement = element;
  let depth = 0;
  while (container.parentElement && depth < maxDepth) {
    if (
      container.parentElement.tagName === "BODY" ||
      container.parentElement.tagName === "HTML"
    ) {
      return document.body;
    }
    container = container.parentElement;
    depth++;
  }
  return container;
}

/**
 * Hides elements by setting display:none, returns a restore function.
 */
function hideElementsTemporarily(elements: HTMLElement[]): () => void {
  const prevDisplays = elements.map((el) => el.style.display);
  elements.forEach((el) => (el.style.display = "none"));
  return () => {
    elements.forEach((el, i) => (el.style.display = prevDisplays[i]));
  };
}

/**
 * Captures a screenshot of a container with the target element highlighted, hiding specified elements and removing highlight from others.
 * @param element The DOM element to highlight in the screenshot.
 * @param options Optional: { hide?: HTMLElement[], removeHighlight?: HTMLElement[] }
 * @returns Promise<string> PNG data URL
 */
export async function captureScreenshot(
  element: HTMLElement,
  options?: { hide?: HTMLElement[] | null }
): Promise<string> {
  if (!element) throw new Error("No element provided for screenshot");
  const targetContainer = getScreenshotContainer(element);
  // Add highlight style to the element
  const prevBoxShadow = element.style.boxShadow;
  const prevZIndex = element.style.zIndex;
  element.style.boxShadow = "0 0 0 4px #ff0, 0 0 12px 4px #f80";
  element.style.zIndex = "9999";
  // Hide specified elements
  let restoreHidden = () => {};
  if (options?.hide?.length) {
    restoreHidden = hideElementsTemporarily(options.hide);
  }
  const dataUrl = await toPng(targetContainer, {
    filter: (node) => true,
  });
  // Restore previous styles and hidden elements
  element.style.boxShadow = prevBoxShadow;
  element.style.zIndex = prevZIndex;
  restoreHidden();
  return dataUrl;
}

/**
 * Captures a screenshot and renders it as an <img> in the DOM for debugging/demo purposes.
 * @param element The DOM element to highlight in the screenshot.
 * @param container Optional container to screenshot (defaults to document.body)
 * @param imgContainer Optional container to append the image to (defaults to document.body)
 */
export async function captureAndShowScreenshot(
  element: HTMLElement,
  options?: {
    hide?: HTMLElement[] | null;
  }
) {
  const dataUrl = await captureScreenshot(element, options);
  const img = document.createElement("img");
  img.src = dataUrl;
  img.alt = "Screenshot";
  img.style.maxWidth = "400px";
  img.style.border = "2px solid #888";
  document.body.appendChild(img);
  return img;
}
