import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to center map
function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center && Array.isArray(center) && center.length === 2) {
            map.setView(center, 14);
        }
    }, [center[0], center[1], map]); // Compare values, not array reference
    return null;
}

export function MapComponent({ sites, selectedSite, onSiteClick }) {
    const defaultCenter = [40.7128, -74.0060];
    const center = selectedSite
        ? [selectedSite.lat, selectedSite.lng]
        : (sites && sites.length > 0 ? [sites[0].lat, sites[0].lng] : defaultCenter);

    return (
        <div className="h-full w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-900 relative isolate">
            <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ChangeView center={center} />
                {sites && sites.map(site => {
                    if (!site.lat || !site.lng) return null;
                    return (
                        <Marker
                            key={site.id}
                            position={[site.lat, site.lng]}
                            eventHandlers={{
                                click: () => onSiteClick && onSiteClick(site)
                            }}
                        >
                            <Popup>
                                <div className="text-slate-900">
                                    <strong>{site.name}</strong><br />
                                    Crashes: {site.crashes}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
