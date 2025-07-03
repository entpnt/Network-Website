import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Polygon, Marker, Popup } from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useContent } from "../lib/contentLoader";

// Fix for default markers in React-Leaflet
if (typeof window !== "undefined") {
  delete (Icon.Default.prototype as any)._getIconUrl;
  Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

interface MapSectionProps {
  address?: string;
}

const MapSection: React.FC<MapSectionProps> = ({ address }) => {
  const { content } = useContent();
  const [userMarker, setUserMarker] = useState<LatLngExpression | null>(null);
  const mapRef = useRef<any>(null);

  // Default center for Orangeburg, SC (can be made dynamic per deployment)
  const defaultCenter: LatLngExpression = [33.4918, -80.8556];
  const defaultZoom = 12;

  // Sample service zones (in a real implementation, these would come from KML/GeoJSON)
  const serviceZones = [
    {
      id: "available-zone-1",
      name: "Downtown Area",
      status: "available",
      coordinates: [
        [33.5018, -80.8656],
        [33.5018, -80.8456],
        [33.4818, -80.8456],
        [33.4818, -80.8656],
      ] as LatLngExpression[],
      color: "#10B981", // Green for available
    },
    {
      id: "coming-soon-zone-1",
      name: "North Residential",
      status: "coming-soon",
      coordinates: [
        [33.5118, -80.8656],
        [33.5118, -80.8456],
        [33.5018, -80.8456],
        [33.5018, -80.8656],
      ] as LatLngExpression[],
      color: "#F59E0B", // Yellow for coming soon
    },
    {
      id: "available-zone-2",
      name: "South Commercial",
      status: "available",
      coordinates: [
        [33.4818, -80.8656],
        [33.4818, -80.8456],
        [33.4618, -80.8456],
        [33.4618, -80.8656],
      ] as LatLngExpression[],
      color: "#10B981", // Green for available
    },
  ];

  // Simulate geocoding (in a real implementation, use a geocoding service)
  const geocodeAddress = async (
    addressString: string,
  ): Promise<LatLngExpression | null> => {
    if (!addressString.trim()) return null;

    // Simulate geocoding with random coordinates within the service area
    const lat = 33.4918 + (Math.random() - 0.5) * 0.1;
    const lng = -80.8556 + (Math.random() - 0.5) * 0.1;
    return [lat, lng];
  };

  useEffect(() => {
    if (address) {
      geocodeAddress(address).then((coords) => {
        if (coords) {
          setUserMarker(coords);
          // Center map on the new marker
          if (mapRef.current) {
            mapRef.current.setView(coords, 14);
          }
        }
      });
    }
  }, [address]);

  return (
    <div className="relative">
      <div className="bg-white dark:bg-dark-bg-card rounded-lg shadow-lg overflow-hidden border dark:border-dark-border">
        {/* Map Container */}
        <div className="h-96 md:h-[500px] relative">
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Service Zone Polygons */}
            {serviceZones.map((zone) => (
              <Polygon
                key={zone.id}
                positions={zone.coordinates}
                pathOptions={{
                  color: zone.color,
                  fillColor: zone.color,
                  fillOpacity: 0.3,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold">{zone.name}</h3>
                    <p className="text-sm">
                      Status:{" "}
                      {zone.status === "available"
                        ? "Available Now"
                        : "Coming Soon"}
                    </p>
                    {zone.status === "available" && (
                      <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                        View Plans
                      </button>
                    )}
                  </div>
                </Popup>
              </Polygon>
            ))}

            {/* User Address Marker */}
            {userMarker && (
              <Marker position={userMarker}>
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold">Your Location</h3>
                    <p className="text-sm">{address}</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          {/* Map Legend */}
          <div className="absolute top-4 right-4 bg-white dark:bg-dark-bg-card p-3 rounded-lg shadow-lg border dark:border-dark-border z-[1000]">
            <h4 className="font-semibold text-sm mb-2 text-foreground dark:text-dark-text-primary">
              Service Areas
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-foreground dark:text-dark-text-primary">
                  Available Now
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-foreground dark:text-dark-text-primary">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Footer */}
        <div className="p-4 bg-gray-50 dark:bg-dark-bg-secondary border-t dark:border-dark-border">
          <p className="text-sm text-muted-foreground dark:text-dark-text-secondary text-center">
            <strong>Note:</strong> Replace with actual service boundary for{" "}
            {content.plans_page.city_name}. Service areas are illustrative and
            subject to change.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
