import { Router } from "express";

import express, { Request, Response } from 'express';

import { getAllDronesWithRecentLocation, getDrones } from "../controller/drone.controller";

const router = express.Router();

router.get("/", getDrones);
router.get("/recents", getAllDronesWithRecentLocation);

export default router;
