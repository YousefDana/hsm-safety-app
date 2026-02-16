import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Sub-component to handle auto-zoom
function AutoFitBounds({ sites }) {
    const map = useMap();

    useEffect(() => {
        if (sites && sites.length > 0) {
            const validSites = sites.filter(s => s.lat && s.lng && !isNaN(s.lat) && !isNaN(s.lng));
            if (validSites.length > 0) {
                const bounds = L.latLngBounds(validSites.map(s => [s.lat, s.lng]));
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
            }
        }
    }, [sites, map]);

    return null;
}

export function MapComponent({ sites, selectedSite, onSiteClick }) {
    const defaultCenter = [41.8781, -87.6298]; // Chicago
    const center = selectedSite
        ? [selectedSite.lat, selectedSite.lng]
        : (sites && sites.length > 0 ? [sites[0].lat, sites[0].lng] : defaultCenter);

    return (
        <MapContainer center={center} zoom={selectedSite ? 14 : 11} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            />
            {/* Overlay reference layer for street names */}
            <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
            />

            <AutoFitBounds sites={sites} />

            {sites && sites.map((site) => {
                // Determine color based on rank (1-10 red, 11-25 orange, else blue)
                let color = '#3b82f6';
                if (site.rank <= 10) color = '#ef4444';
                else if (site.rank <= 25) color = '#f59e0b';

                // Create a custom icon with the rank number
                const numberedIcon = L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${site.rank}</div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });

                return (
                    <Marker
                        key={site.id}
                        position={[site.lat, site.lng]}
                        icon={numberedIcon}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2 min-w-[200px]">
                                <h4 className="font-bold text-sm mb-1 text-primary">{site.displayName || site.name}</h4>
                                <div className="text-xs text-slate-500 mb-2 font-mono">Rank #{site.rank}</div>

                                <div className="space-y-1 text-xs text-slate-600 border-y border-slate-100 py-2 my-2">
                                    <div className="flex justify-between">
                                        <span>Total Crashes:</span>
                                        <span className="font-bold text-slate-800">{site.crashes || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Severe (K+A):</span>
                                        <span className="font-bold text-red-600">{site.severity ? (site.severity.k || 0) + (site.severity.a || 0) : 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Excess Pred:</span>
                                        <span className="font-bold text-amber-600">{site.excess ? `+${site.excess}` : 'N/A'}</span>
                                    </div>
                                </div>

                                <button
                                    className="w-full mt-2 bg-primary text-white text-xs py-1.5 rounded hover:bg-slate-700 transition"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent map click
                                        onSiteClick && onSiteClick(site);
                                    }}
                                >
                                    Analyze Location
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
