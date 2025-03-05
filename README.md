# ASDT | MERN Real-Time Drone Flight Tracking Project

This project consists of three main components: the backend, the frontend, and the simulator.

## Prerequisites

Ensure you have the following installed on your system:
- Node.js
- npm
- Python 3
- MongoDB

## Project Structure

```
ASDT/
├── backend/
├── frontend/
├── simulator/
└── README.md
```

## Backend
The backend is responsible for handling the server-side logic, API endpoints, and the initialization of the WebSocket server.

### Initialization

To initialize the backend, navigate to the backend directory and run the following command:

```bash
cd backend
npm i
npm run dev
```
Before running the backend, ensure you have a .env file in the root of the project with the following variables:
``` bash
MONGO_URI=mongodb://localhost:27017/dronDB
NODE_ENV=development
PORT=3000
```

## Frontend

The frontend is responsible for the client-side interface and user interactions, displaying drones in real time on the map.

### Initialization

To initialize the frontend, navigate to the frontend directory and run the following command:

```bash
cd frontend
npm i
npm run dev
```
and the server will be running at this address:
http://localhost:5173/

## Simulator

The simulator is used to simulate specific scenarios or data for the project.

### Initialization

To initialize the simulator, navigate to the simulator directory and run the following command:

```bash
cd simulator
pip install -r requirements.txt
python3 simulator.py
```
