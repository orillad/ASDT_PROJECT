import { Request, Response } from "express";
import Drone from "../models/drone.model";
import { log } from "console";


export const getDrones = async (req: Request, res: Response) => {
    try {
        const drones = await Drone.find();
        res.json(drones);
    } catch (err) {
        res.status(500).json({ error: "Error obtenint els drons" });
    }
};


export const createDrone = async (droneData: any) => {
    try {
        const nouDron = new Drone(droneData);

        await nouDron.save();

        return { type: "create", message: "Dron creat correctament", data: nouDron };
    } catch (err) {
        console.error(err);
        return { error: "true", message: "Error creant el dron", details: err.message };
    }
};


export const getRecentDrones = async (req: Request, res: Response) => {
    try {
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000); // Fa 2 minuts

        const recentDrones = await Drone.find({
            createdAt: { $gte: twoMinutesAgo }
        });

        res.json(recentDrones);
    } catch (err) {
        res.status(500).json({ error: "Error obtenint els drons recents" });
    }
};


export const addDroneLocation = async (sn: string, newLocation: any) => {
    try {
        const updateDrone = await Drone.findOneAndUpdate(
            { sn },
            { $push: { droneLocation: newLocation } },
            { new: true, runValidators: true }
        );
        if (!updateDrone) {
            return { error: "true", message: "Dron no trobat" };
        }
        return { message: "Dron actualitzat", data: updateDrone };
    } catch (err) {
        return { error: "Error actualitzant el dron", details: err.message };
    }
}


export const getAllDronesWithRecentLocation = async (req: Request, res: Response) => {
    try {
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

        const drones = await Drone.aggregate([
            {
                $addFields: {
                    lastLocation: {
                        $arrayElemAt: ["$droneLocation", -1] 
                    }
                }
            },
            {
                $match: {
                    "lastLocation.timestamp": { $gte: twoMinutesAgo }
                }
            }
        ]);
        if (drones.length === 0) {
            res.json({ error: "true", message: "No hi ha drons amb localització recent" });
        } else {

            res.json(drones);
        }

    } catch (err) {
        res.status(500).json({ error: "true", message: "Error obtenint els drons recents" });
    }
}
