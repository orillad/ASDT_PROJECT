import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import drone from "../assets/drone.png";
import L from "leaflet";
import { WebSocketData } from "../types/types";
import { getRecentDrones } from "../api/drone";

const customIcon = new L.Icon({
  iconUrl: drone,
  iconSize: [42, 42],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MapComponent = () => {
  const [position] = useState<[number, number]>([41.751389, 1.903056]);
  const [drones, setDrones] = useState<Map<string, [number, number]>>(new Map());
  const [dronePaths, setDronePaths] = useState<Map<string, [number, number][]>>(new Map());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRecentDrones();
      if (data.error === "true") {
        console.log("Error obtenint els drons");
        return;
      }
      updateDroneData(data);
    };

    fetchData();
    const ws = initializeWebSocket();

    return () => {
      ws.close();
    };
  }, []);

  const updateDroneData = (data: any) => {
    data.forEach((drone: any) => {
      const homeLocation: [number, number] = [drone.droneLocation[0].lat, drone.droneLocation[0].lon];
      const pathLocations: [number, number][] = drone.droneLocation.slice(1).map((loc: any) => [loc.lat, loc.lon]);

      setDrones(prevDrones => {
        const updatedDrones = new Map(prevDrones);
        updatedDrones.set(drone.sn, homeLocation);
        return updatedDrones;
      });

      setDronePaths(prevPaths => {
        const updatedPaths = new Map(prevPaths);
        updatedPaths.set(drone.sn, [homeLocation, ...pathLocations]);
        return updatedPaths;
      });
    });
  };

  const initializeWebSocket = () => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Connexió establerta');
      setIsConnected(true);
    };

    ws.onmessage = (event: MessageEvent) => {
      const drone: WebSocketData = JSON.parse(event.data);
      console.log('Missatge rebut:', drone);
      handleWebSocketMessage(drone);
    };

    ws.onclose = () => {
      console.log('Connexió tancada');
      setIsConnected(false);
    };

    return ws;
  };

  const handleWebSocketMessage = (drone: WebSocketData) => {
    if (drone.type === 'create') {
      handleCreateDrone(drone);
    } else {
      handleUpdateDroneLocation(drone);
    }
  };

  const handleCreateDrone = (drone: WebSocketData) => {
    const { droneLocation, sn } = drone.data;
    const homeLocation: [number, number] = [droneLocation[0].lat, droneLocation[0].lon];

    setDrones(prevDrones => {
      const updatedDrones = new Map(prevDrones);
      updatedDrones.set(sn, homeLocation);
      return updatedDrones;
    });

    setDronePaths(prevPaths => {
      const updatedPaths = new Map(prevPaths);
      updatedPaths.set(sn, [homeLocation]);
      return updatedPaths;
    });
  };

  const handleUpdateDroneLocation = (drone: WebSocketData) => {
    const { droneLocation, sn } = drone.data;
    const newDroneLocation: [number, number] = [droneLocation[droneLocation.length - 1].lat, droneLocation[droneLocation.length - 1].lon];

    setDrones(prevDrones => {
      const updatedDrones = new Map(prevDrones);
      updatedDrones.set(sn, newDroneLocation);
      return updatedDrones;
    });

    setDronePaths(prevPaths => {
      const updatedPaths = new Map(prevPaths);
      const currentPath = updatedPaths.get(sn) || [];
      updatedPaths.set(sn, [...currentPath, newDroneLocation]);
      return updatedPaths;
    });
  };

  return (
    <div>
      <MapContainer center={position} zoom={12} className="h-210 w-full rounded-lg shadow-md">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {Array.from(drones.entries()).map(([sn, dronePosition]) => (
          <Marker key={sn} position={dronePosition} icon={customIcon} />
        ))}
        {Array.from(dronePaths.entries()).map(([sn, path], index) => (
          <Polyline
            key={sn}
            positions={path}
            color={`hsl(${(index * 45) % 360}, 100%, 50%)`} 
            weight={3}
          />
        ))}
      </MapContainer>
      {isConnected ? (
        <p>Connexió WebSocket establerta!</p>
      ) : (
        <p>Esperant connexió...</p>
      )}
    </div>
  );
};

export default MapComponent;
