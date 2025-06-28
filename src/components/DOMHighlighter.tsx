import { useEffect, useRef } from 'react';

export interface HighlightBox {
  top: number;
  left: number;
  width: number;
  height: number;
  element: HTMLElement | null;
}

export interface OnElementSelect {
  (el: HTMLElement, box: Omit<HighlightBox, 'element'>): void;
}

export function useDOMHighlighter({
  enabled,
  onElementSelect,
  popoverRef,
}: {
  enabled: boolean;
  onElementSelect: OnElementSelect;
  popoverRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
}) {
  const lastHovered = useRef<HTMLElement | null>(null);
  const selectedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) {
      // Clean up any outlines
      if (lastHovered.current) {
        lastHovered.current.classList.remove('pinpoint-outline');
        lastHovered.current = null;
      }
      if (selectedElement.current) {
        selectedElement.current.classList.remove('pinpoint-outline-selected');
        selectedElement.current = null;
      }
      return;
    }
    
    const onMove = (e: MouseEvent) => {
      // Ignore overlays/popovers if needed
      let el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (!el || el === document.body || el === document.documentElement) {
        if (lastHovered.current) {
          lastHovered.current.classList.remove('pinpoint-outline');
          lastHovered.current = null;
        }
        return;
      }
      // Ignore popover and its children
      if (popoverRef && popoverRef.current && popoverRef.current.contains(el)) {
        if (lastHovered.current) {
          lastHovered.current.classList.remove('pinpoint-outline');
          lastHovered.current = null;
        }
        return;
      }
      if (lastHovered.current && lastHovered.current !== el) {
        lastHovered.current.classList.remove('pinpoint-outline');
      }
      // Don't add hover outline if it's the selected element
      if (selectedElement.current !== el) {
        el.classList.add('pinpoint-outline');
        lastHovered.current = el;
      } else {
        if (lastHovered.current) {
          lastHovered.current.classList.remove('pinpoint-outline');
          lastHovered.current = null;
        }
      }
      const rect = el.getBoundingClientRect();
      const hoverBoxObj = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      };
    };
    window.addEventListener('mousemove', onMove);

    // Combined click handler: handles selection and prevents default except inside popover
    const onDocumentClick = (e: MouseEvent) => {
      // If click is inside the popover, allow it
      if (popoverRef && popoverRef.current && popoverRef.current.contains(e.target as Node)) {
        return;
      }
      // Otherwise, prevent default and stop propagation
      e.preventDefault();
      e.stopPropagation();
      // Handle element selection
      let el = lastHovered.current;
      if (el) {
        // Remove previous selected outline
        if (selectedElement.current && selectedElement.current !== el) {
          selectedElement.current.classList.remove('pinpoint-outline-selected');
        }
        // Remove hover outline
        el.classList.remove('pinpoint-outline');
        // Add selected outline
        el.classList.add('pinpoint-outline-selected');
        selectedElement.current = el;
        const rect = el.getBoundingClientRect();
        onElementSelect(el, {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      }
    };
    document.addEventListener('click', onDocumentClick, true);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (lastHovered.current) {
        lastHovered.current.classList.remove('pinpoint-outline');
        lastHovered.current = null;
      }
      document.removeEventListener('click', onDocumentClick, true);
    };
  }, [enabled, popoverRef, onElementSelect]);

  return { lastHovered, selectedElement };
}
