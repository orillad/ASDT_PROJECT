export interface ILocation {
    lat: number;
    lon: number;
    distance: number;
  }
  
  export interface IDrone {
    driverLocation: ILocation;
    droneLocation: [ILocation];
    flightID: string;
    flightPurpose: string;
    homeLocation: ILocation;
    mac: string;
    name: string;
    operatorId: string;
    pitch: number;
    productId: number;
    productType: string;
    reliability: number;
    roll: number;
    signalPower: number;
    signalType: number;
    sn: string; 
    uid: string;
    vendor: string;
    vx: number;
    vy: number;
    vz: number;
    createdAt: string;
    updatedAt: string;
  }
  

  export interface WebSocketData {
    type: string;
    data: {
      droneLocation: ILocation[];
      sn: string; 
    };
  }