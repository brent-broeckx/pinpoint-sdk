// Simple in-memory console log store for Pinpoint SDK
export type ConsoleLogEntry = {
  type: 'log' | 'warn' | 'error' | 'info';
  args: any[];
  timestamp: number;
};

const logBuffer: ConsoleLogEntry[] = [];
const MAX_LOGS = 100;

['log', 'warn', 'error', 'info'].forEach((type) => {
  const orig = (console[type as keyof Console] as (...args: any[]) => void);
  console[type as keyof Console] = function (...args: any[]) {
    logBuffer.push({ type: type as any, args, timestamp: Date.now() });
    if (logBuffer.length > MAX_LOGS) logBuffer.shift();
    orig(...args);
  } as any;
});

export function getRecentConsoleLogs(): ConsoleLogEntry[] {
  return [...logBuffer];
}
