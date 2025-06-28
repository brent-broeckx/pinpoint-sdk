import React, { useRef, useEffect } from "react";

interface PopoverProps {
  anchor: { top: number; left: number; width: number; height: number } | null;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ref: React.RefObject<HTMLDivElement | null>;
}

export const ElementPopover: React.FC<PopoverProps> = ({
  anchor,
  open,
  onClose,
  children,
  ref,
}) => {
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  if (!open || !anchor) return null;
  return (
    <div
      ref={ref}
      className="fixed z-[2147483647] bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-[220px]"
      style={{
        top: anchor.top + anchor.height + 8,
        left: anchor.left,
      }}
    >
      {children}
    </div>
  );
};
