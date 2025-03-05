import { WebSocketServer, WebSocket } from "ws";
import { addDroneLocation, createDrone } from "../src/controller/drone.controller";
import { create } from "domain";

const wss = new WebSocketServer({ port: 8080 });

const broadcast = (message: any) => {
    const data = JSON.stringify(message);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.on("connection", (ws: WebSocket) => {
    console.log("Nou client connectat");

    ws.on("ping", () => {
        ws.pong();
    });

    ws.on("message", async (message: string) => {
        try {
            const parsedMessage = JSON.parse(message);
            console.log(`Dron rebuda: ${message}`);
            console.log(`Dades: ${JSON.stringify(parsedMessage.droneLocation)}`);
            console.log(`SN: ${JSON.stringify(parsedMessage.sn)}`);

            if (!parsedMessage.sn || !parsedMessage.droneLocation) {
                throw new Error("Falten dades necessàries al missatge");
            }

            console.log("Actualitzant el dron...");
            const result = await addDroneLocation(parsedMessage.sn, parsedMessage.droneLocation);

            if (result && result.data) {
                broadcast({ type: 'update', message: 'Dron actualitzat correctament', data: result.data });
            } else {
                console.log("Dron no trobat, creant un de nou...");
                const create = await createDrone(parsedMessage);

                if (create.error === 'true') {
                    throw new Error("Error creant el dron");
                }

                console.log("Dron creat correctament");
                broadcast({ type: 'create', message: 'Dron creat correctament', data: create.data });
            }

        } catch (error) {
            console.error("Error en processar el missatge:", error);
            broadcast({ type: 'error', message: 'Error intern del servidor' });
        }
    });


    ws.on("close", () => {
        console.log("Client desconnectat");
    });
});

export { wss };
