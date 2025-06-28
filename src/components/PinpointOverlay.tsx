import React, { useState, useCallback, useRef } from "react";
import { useOverlay } from "../core/OverlayProvider";
import { useDOMHighlighter } from "./DOMHighlighter";
import { HighlightBox } from "./DOMHighlighter";
import { ElementPopover } from "./ElementPopover";
import { Button } from "@/components/ui/button";
import { getRecentConsoleLogs } from "../core/consoleLogStore";
import { getRecentDomEvents } from "../core/domEventStore";
import { captureAndShowScreenshot, captureScreenshot } from "@/core/screenshot";

export const PinpointOverlay: React.FC = () => {
  const { isOpen, toggleOverlay } = useOverlay();
  const [popoverAnchor, setPopoverAnchor] = useState<Omit<
    HighlightBox,
    "element"
  > | null>(null);
  const [comment, setComment] = useState("");

  const popoverRef = useRef<HTMLDivElement | null>(null);

  // Use the new hook for DOM highlighting
  const { lastHovered, selectedElement } = useDOMHighlighter({
    enabled: isOpen,
    onElementSelect: useCallback(
      (el: HTMLElement, box: Omit<HighlightBox, "element">) => {
        if (popoverRef.current && popoverRef.current.contains(el)) {
          return;
        }
        setPopoverAnchor(box);
      },
      []
    ),

    popoverRef,
  });

  const handleSubmit = async () => {
    setPopoverAnchor(null);

    if (selectedElement.current) {
      console.log(
        "%c[Pinpoint] Submitting bug report:",
        "color: #0ea5e9; font-weight: bold"
      );
      console.log("%c[Pinpoint] Description:", "color: #0ea5e9", comment);
      console.log(
        "%c[Pinpoint] Selected element:",
        "color: #0ea5e9",
        selectedElement.current
      );
      // Screenshot

      const screenshot = await captureAndShowScreenshot(
        selectedElement.current
      );

      const logs = getRecentConsoleLogs();
      console.log("%c[Pinpoint] Recent console logs:", "color: #0ea5e9", logs);
      const errors = logs.filter((l) => l.type === "error");
      if (errors.length) {
        console.error(
          "%c[Pinpoint] Recent console errors:",
          "color: #ef4444",
          errors
        );
      }
      // DOM events
      const domEvents = getRecentDomEvents();
      console.log(
        "%c[Pinpoint] Recent DOM events:",
        "color: #0ea5e9",
        domEvents
      );
    } else {
      console.log("%c[Pinpoint] No element selected.", "color: #ef4444");
      console.log("%c[Pinpoint] Description:", "color: #0ea5e9", comment);
    }
    setComment("");
  };

  return (
    <>
      <ElementPopover
        anchor={popoverAnchor}
        open={!!popoverAnchor}
        onClose={() => setPopoverAnchor(null)}
        ref={popoverRef}
      >
        <div className="mb-2 text-sm font-semibold">Add Comment</div>
        <textarea
          className="w-full min-h-[60px] border rounded p-2 text-sm"
          placeholder="Describe the issue or feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={() => setPopoverAnchor(null)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </ElementPopover>
    </>
  );
};
