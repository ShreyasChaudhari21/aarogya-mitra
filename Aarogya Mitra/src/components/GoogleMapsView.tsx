import { useState, useEffect, useRef } from 'react';
import { useJsApiLoader, GoogleMap, Marker, DirectionsRenderer, TrafficLayer, Polyline, Autocomplete } from '@react-google-maps/api';
import { Target, Car, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const libraries: ("places")[] = ["places"];

// Generic fallback for center of India if GPS is unavailable
const genericCenter = {
  lat: 20.5937,
  lng: 78.9629
};

interface MapProps {
  location?: { lat: number; lng: number };
  initialCenter?: { lat: number; lng: number };
  markers?: Array<{ lat: number; lng: number, id?: string }>;
  label?: string;
  routeTo?: { lat: number; lng: number };
  enableSearch?: boolean;
  onLocationSelect?: (address: string, lat: number, lng: number) => void;
}

export const GoogleMapsView = ({ location, initialCenter, markers, label, routeTo, enableSearch, onLocationSelect }: MapProps) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY";
  const hasValidKey = apiKey && apiKey !== "YOUR_GOOGLE_MAPS_API_KEY";
  
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const watchId = useRef<number | null>(null);
  
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [searchMarker, setSearchMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: hasValidKey ? apiKey : "",
    libraries
  });

  // START LIVE TRACKING ON MOUNT
  useEffect(() => {
    if (navigator.geolocation) {
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserPos(pos);
          
          // Auto-center on first acquisition if no specific tracking point is set
          if (map && !initialCenter && !location) {
             // We don't pan every update to avoid fighting with user dragging, 
             // but we ensure the initial center is accurate.
          }
        },
        (error) => {
          console.warn("Geolocation watch error:", error.message);
          // Only show error toast once or if specifically requested
        },
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
      );
    }

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [map]);

  // Handle Routing when userPos and routeTo are available
  useEffect(() => {
    if (routeTo && userPos && isLoaded && map && hasValidKey) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: userPos,
          destination: routeTo,
          travelMode: google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(Date.now()), // For traffic data
            trafficModel: google.maps.TrafficModel.BEST_GUESS
          }
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirectionsResponse(result);
            setDistance(result.routes[0].legs[0].distance?.text || '');
            setDuration(result.routes[0].legs[0].duration_in_traffic?.text || result.routes[0].legs[0].duration?.text || '');
          } else {
            console.error(`Error fetching directions ${status}`);
          }
        }
      );
    } else {
      setDirectionsResponse(null);
      setDistance('');
      setDuration('');
    }
  }, [routeTo, userPos, isLoaded, map, hasValidKey]);

  const handleLocate = () => {
    if (initialCenter && map) {
      map.panTo(initialCenter);
      map.setZoom(16);
      toast.success("Focusing on Active Emergency Location");
      return;
    }

    if (userPos && map) {
      map.panTo(userPos);
      map.setZoom(16);
      toast.success("Focusing on your live location");
    } else if (navigator.geolocation) {
       toast.loading("Fetching exact coordinates...");
       navigator.geolocation.getCurrentPosition((p) => {
          const pos = { lat: p.coords.latitude, lng: p.coords.longitude };
          setUserPos(pos);
          if (map) map.panTo(pos);
          toast.dismiss();
          toast.success("Location Synced");
       });
    }
  };

  // Focus on the patient's location when clicked
  useEffect(() => {
    if (map && routeTo) {
      map.panTo(routeTo);
      map.setZoom(16);
    }
  }, [map, routeTo]);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const newPos = { lat, lng };
        map?.panTo(newPos);
        map?.setZoom(16);
        setSearchMarker(newPos);
        if (onLocationSelect && place.formatted_address) {
          onLocationSelect(place.formatted_address, lat, lng);
          if (searchInputRef.current) searchInputRef.current.value = place.formatted_address;
        } else if (onLocationSelect && place.name) {
          onLocationSelect(place.name, lat, lng);
          if (searchInputRef.current) searchInputRef.current.value = place.name;
        }
      } else if (place.name) {
        toast.error(`No exact coordinates found for '${place.name}'`);
      }
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!enableSearch || !e.latLng) return;
    
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const newPos = { lat, lng };
    
    setSearchMarker(newPos);
    map?.panTo(newPos);
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: newPos }, (results, status) => {
      const displayStr = (status === 'OK' && results && results[0]) 
        ? results[0].formatted_address 
        : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        
      if (searchInputRef.current) {
        searchInputRef.current.value = displayStr;
      }
      
      if (onLocationSelect) {
        onLocationSelect(displayStr, lat, lng);
      }
      
      toast.success("Target Pin Dropped");
    });
  };

  const currentCenter = searchMarker || routeTo || initialCenter || userPos || location || (markers && markers.length > 0 ? markers[0] : genericCenter);

  if (!hasValidKey) {
    let srcUrl = '';
    if (routeTo && userPos) {
       srcUrl = `https://maps.google.com/maps?saddr=${userPos.lat},${userPos.lng}&daddr=${routeTo.lat},${routeTo.lng}&output=embed`;
    } else {
       const q = `${currentCenter.lat},${currentCenter.lng}`;
       srcUrl = `https://maps.google.com/maps?q=${q}&t=&z=16&ie=UTF8&iwloc=B&output=embed`;
    }
    return (
      <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl relative bg-slate-900">
        <iframe 
          key={srcUrl}
          width="100%" 
          height="100%" 
          style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2) hue-rotate(180deg)' }}
          src={srcUrl}
        />
        <div className="absolute top-4 left-4 bg-primary/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-primary/20 text-[10px] text-primary font-black uppercase tracking-widest z-10 flex items-center gap-2">
           <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
           {label || (userPos ? "Your Live Terminal" : "Emergency Node")}
        </div>
        <button 
          onClick={handleLocate}
          className="absolute top-4 right-4 p-2 bg-slate-900/90 backdrop-blur-md rounded-lg border border-white/10 text-white hover:text-primary transition-all shadow-xl z-20"
          title="Go to Live Location"
        >
          <Target className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return isLoaded ? (
    <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
      <GoogleMap
        onLoad={(m) => {
          setMap(m);
          // On map load, focus on best available center
          m.panTo(currentCenter);
        }}
        onClick={handleMapClick}
        mapContainerStyle={containerStyle}
        center={currentCenter}
        zoom={16}
        options={{
          styles: darkMapStyle,
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {location && <Marker position={location} />}
        {userPos && (
          <Marker 
            position={userPos} 
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#3b82f6",
              fillOpacity: 1,
              strokeWeight: 3,
              strokeColor: "#ffffff",
            }}
            title="Your Exact Location"
          />
        )}
        {markers && markers.map(m => (
          <Marker key={m.id || `${m.lat}-${m.lng}`} position={{ lat: m.lat, lng: m.lng }} />
        ))}
        {searchMarker && (
          <Marker 
            position={searchMarker}
            icon={{
              path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 6,
              fillColor: "#ef4444",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#ffffff",
            }}
          />
        )}
        {hasValidKey && <TrafficLayer />}
        {directionsResponse && (
          <>
            <DirectionsRenderer 
              directions={directionsResponse} 
              options={{
                preserveViewport: true,
                suppressMarkers: false,
                suppressPolylines: true // Suppress the default traffic-colored line
              }}
            />
            <Polyline
              path={directionsResponse.routes[0].overview_path}
              options={{
                strokeColor: "#3b82f6", // Solid Blue
                strokeWeight: 6,
                strokeOpacity: 0.9,
                zIndex: 50
              }}
            />
          </>
        )}
      </GoogleMap>
      
      {enableSearch && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-20">
          <Autocomplete
            onLoad={(ac) => setAutocomplete(ac)}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              ref={searchInputRef}
              type="text"
              placeholder="SEARCH OR CLICK ON MAP TO DROP PIN..."
              className="w-full bg-slate-900/90 backdrop-blur-md border border-white/20 text-white rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/50 transition-all shadow-2xl"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
            />
          </Autocomplete>
        </div>
      )}

      {!enableSearch && (
        <div className="absolute top-4 left-4 bg-primary/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-primary/20 text-[10px] text-primary font-black uppercase tracking-widest z-10 flex items-center gap-2">
             <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
             {label || (userPos ? "Your Live Terminal" : "Emergency Node")}
        </div>
      )}
      
      {/* Route Info Overlay */}
      {directionsResponse && distance && duration && (
        <div className="absolute top-16 left-4 bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-white shadow-xl z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2">
             <Car className="w-4 h-4 text-emerald-400" />
             <span className="text-xs font-black uppercase tracking-wider">{distance}</span>
          </div>
          <div className="flex items-center gap-2">
             <Clock className="w-4 h-4 text-amber-400" />
             <span className="text-xs font-black uppercase tracking-wider">ETA: {duration} (Traffic logic applied)</span>
          </div>
        </div>
      )}

      <button 
        onClick={handleLocate}
        className="absolute top-4 right-4 p-2 bg-slate-900/90 backdrop-blur-md rounded-lg border border-white/10 text-white hover:text-primary transition-all shadow-xl z-20"
        title="Go to Live Location"
      >
        <Target className="w-5 h-5" />
      </button>
    </div>
  ) : (
    <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center text-slate-500 text-xs font-black uppercase tracking-widest">
      Establishing Satellite Link...
    </div>
  );
};

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
];
