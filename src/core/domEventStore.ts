// Track recent DOM events (click, input, change, etc.)
export type DomEventEntry = {
  type: string;
  selector: string;
  value?: string;
  timestamp: number;
};

const eventBuffer: DomEventEntry[] = [];
const MAX_EVENTS = 100;

function getSelector(el: Element): string {
  if (!el) return '';
  if (el.id) return `#${el.id}`;
  if (el.className && typeof el.className === 'string') return `${el.tagName.toLowerCase()}.${el.className.split(' ').join('.')}`;
  return el.tagName.toLowerCase();
}

['click', 'input', 'change'].forEach((eventType) => {
  window.addEventListener(eventType, (e) => {
    const target = e.target as HTMLElement;
    eventBuffer.push({
      type: eventType,
      selector: getSelector(target),
      value: (target as HTMLInputElement).value,
      timestamp: Date.now(),
    });
    if (eventBuffer.length > MAX_EVENTS) eventBuffer.shift();
  }, true);
});

export function getRecentDomEvents(): DomEventEntry[] {
  return [...eventBuffer];
}
