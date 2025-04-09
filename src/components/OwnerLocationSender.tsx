"use client";

import { useEffect } from "react";
import io from "socket.io-client";

// Initialize socket connection
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

export default function OwnerLocationSender({ ownerId }: { ownerId: string }) {
  useEffect(() => {
    let watchId: number;

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const location = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
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

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [ownerId]);

  return null;
}
