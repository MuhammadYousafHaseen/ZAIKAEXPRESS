"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Marker icon fix:
// Fix default icon paths using new URL (instead of require)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

interface IUser {
  lat: number;
  lng: number;
}

export default function ParcelMap({ owner, user }: { owner: IUser; user: IUser }) {
  const center: LatLngTuple = owner.lat ? [owner.lat, owner.lng] : [user.lat, user.lng];

  return (
    <MapContainer center={center} zoom={13} className="h-full w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[user.lat, user.lng]}>
        <Popup>Your Location</Popup>
      </Marker>
      <Marker position={[owner.lat, owner.lng]}>
        <Popup>Owner Delivery Location</Popup>
      </Marker>
    </MapContainer>
  );
}
