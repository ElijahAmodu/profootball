"use client";

import { useSocket } from "@/context/SocketContext";
import { Wifi, WifiOff } from "lucide-react";

export function ConnectionStatus() {
  const { isConnected } = useSocket();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg ${
          isConnected
            ? "bg-emerald-900/90 text-emerald-100"
            : "bg-red-900/90 text-red-100"
        }`}
      >
        {isConnected ? (
          <>
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Connected</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">Disconnected</span>
          </>
        )}
      </div>
    </div>
  );
}
