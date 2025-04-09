"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import io from "socket.io-client";
import axios from "axios";
import { useParams } from "next/navigation";

// Dynamically import the MapContainer so it only renders on the client
const MapContainer = dynamic(() => import("@/components/MapContainer"), { ssr: false });

interface Location {
  lat: number;
  lng: number;
}

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, { autoConnect: true });

export default function TrackParcelPage() {
  const { userId } = useParams();

  // State for ownerId from localStorage (set once on mount)
  const [ownerId, setOwnerId] = useState<string | null>(null);
  // State for tracking the owner's live location
const [ownerLocation, setOwnerLocation] = useState<Location>({ lat: 0, lng: 0 });

  // State for the user's location
  const [userLocation, setUserLocation] = useState<Location>({ lat: 0, lng: 0 });

  // Retrieve ownerId from localStorage (runs only on client)
  useEffect(() => {
    const storedOwnerId = localStorage.getItem("ownerId");
    setOwnerId(storedOwnerId);
  }, []);

  // Use watchPosition to update user's location continuously
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("User location updated:", latitude, longitude);
          setUserLocation({ lat: latitude, lng: longitude });
          // Optionally, send the updated location to your server
          axios
            .post("/api/location/update", { userId, location: { lat: latitude, lng: longitude } })
            .catch((error) => console.error("Failed to update user location:", error));
        },
        (error) => {
          console.error("Error watching position:", error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [userId]);

  // Set up socket listener for owner's location updates
  useEffect(() => {
    if (!ownerId) return;

    // Listen for location updates from socket
    socket.on("location-update", (data: { ownerId: string; location: Location }) => {
      console.log("Received owner location update:", data);
      if (data.ownerId === ownerId) {
        setOwnerLocation(data.location);
      }
    });

    return () => {
      socket.off("location-update");
    };
  }, [ownerId]);

  return (
    <div className="w-full h-screen">
      <MapContainer owner={ownerLocation} user={userLocation} />
    </div>
  );
}
