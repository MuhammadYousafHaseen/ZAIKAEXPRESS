"use client";

import { useEffect, useMemo } from "react";
import io, { Socket } from "socket.io-client";

// Custom hook to initialize and manage the socket connection
function useSocket(url?: string): Socket {
  // Create a memoized socket instance to prevent duplicate connections
  const socket = useMemo(() => {
    return io(url, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
  }, [url]);

  // Setup basic event listeners and cleanup on unmount
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected with id:", socket.id);
    });

    // Cleanup on unmount by disconnecting the socket
    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, [socket]);

  return socket;
}

interface OwnerLocationSenderProps {
  ownerId: string;
}

export default function OwnerLocationSender({ ownerId }: OwnerLocationSenderProps) {
  // Use our custom hook to get the socket instance
  const socket = useSocket(process.env.NEXT_PUBLIC_SOCKET_URL);

  useEffect(() => {
    let watchId: number | undefined;

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const location = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          // Emit the location update along with the ownerId
          socket.emit("send-location", { ownerId, location });
          console.log("Owner live location sent:", location);
        },
        (err) => {
          console.error("Error watching owner location:", err);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    // Clean up the geolocation watcher on unmount
    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [ownerId, socket]);

  // This component doesn't render any UI.
  return null;
}

