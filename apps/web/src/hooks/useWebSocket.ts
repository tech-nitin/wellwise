import { useState } from "react";

export type WebSocketStatus =
  | "DISCONNECTED"
  | "CONNECTING"
  | "CONNECTED"
  | "ERROR";

/**
 * Architectural foundation hook for real-time WITSML WebSocket subscriptions.
 * In this foundation stage, it manages ready states cleanly without premature socket mocking.
 */
export function useWebSocket(url?: string) {
  const [status] = useState<WebSocketStatus>("DISCONNECTED");

  return {
    status,
    isConnected: status === "CONNECTED",
    url: url || null,
  };
}
