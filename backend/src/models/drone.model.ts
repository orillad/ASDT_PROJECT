import mongoose, { Schema, Document } from "mongoose";

interface ILocation {
    lat: number;
    lon: number;
    distance: number;
    timestamp: Date;
}

interface IDrone extends Document {
    driverLocation: ILocation;
    droneLocation: ILocation[]; 
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
}

const LocationSchema = new Schema<ILocation>({
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    distance: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

const DroneLocationSchema = new Schema<ILocation>({
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    distance: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

const DroneSchema = new Schema<IDrone>(
    {
        driverLocation: { type: LocationSchema, required: true },
        droneLocation: { type: [DroneLocationSchema], required: true }, 
        homeLocation: { type: LocationSchema, required: true },
        flightID: { type: String, default: "" },
        flightPurpose: { type: String, default: "" },
        mac: { type: String, default: "" },
        name: { type: String, required: true },
        operatorId: { type: String, default: "" },
        pitch: { type: Number, required: true },
        productId: { type: Number, required: true },
        productType: { type: String, default: "" },
        reliability: { type: Number, required: true },
        roll: { type: Number, required: true },
        signalPower: { type: Number, required: true },
        signalType: { type: Number, required: true },
        sn: { type: String, required: true, unique: true },
        uid: { type: String, required: true, unique: true },
        vendor: { type: String, default: "" },
        vx: { type: Number, required: true },
        vy: { type: Number, required: true },
        vz: { type: Number, required: true },
    },
    { timestamps: true, collection: "vols" }
);

const Drone = mongoose.model<IDrone>('Drone', DroneSchema);

export default Drone;