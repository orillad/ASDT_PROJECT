import express from 'express';
import { networkInterfaces } from 'os';
import dotenv from 'dotenv';
import connectDB from './config/db';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import "../services/websockets"

import droneRoutes from './routes/dron.routes';

dotenv.config();


const app = express();

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';


connectDB();

app.use(cors())
app.use(express.json());

// Routes
app.use('/api/drones', droneRoutes);


console.log("________________________________")
//server init
app.listen(PORT, () => {
  const interfaces = networkInterfaces();
  const addresses = Object.values(interfaces)
    .flat()
    .filter((iface) => iface.family === "IPv4" && !iface.internal)
    .map((iface) => iface.address);

  const localUrl = `http://localhost:${PORT}`;
  const networkUrl = `http://${addresses.length > 0 ? addresses[0] : "localhost"}:${PORT}`;
  
  console.log(`API running at:`);
  console.log(`- Local:   ${localUrl}`);
  console.log(`- Network: ${networkUrl}`);
  console.log("- Servidor WebSocket en funcionament al port 8080");
  console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`); 


});

