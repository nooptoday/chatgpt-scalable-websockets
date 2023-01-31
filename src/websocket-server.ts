import * as WebSocket from 'ws';
import {getServer} from "./hashring";
import {SERVER_ADDRESS} from "./constants";

export function startWebsocketServer() {
    const wss = new WebSocket.Server({port: +process.env.SERVER_PORT! || 8080, host: SERVER_ADDRESS});
    wss.on('connection', (ws: WebSocket, req) => {
        const clientIdentifier = <string>req.headers['x-user-id'] || '#no-user-id';
        const correctServer = getServer(clientIdentifier);

        if (SERVER_ADDRESS !== correctServer) {
            // console.log(`[${SERVER_ADDRESS}] -> [${clientIdentifier}] -> Redirecting connection to [${correctServer}] `)
            const message = {
                type: 'redirect',
                server: correctServer,
            };
            ws.send(JSON.stringify(message));
        } else {
            // console.log(`[${SERVER_ADDRESS}] -> [${clientIdentifier}] -> Successful connection `)
            ws.on('message', (message: string) => {
                // console.log(`[${SERVER_ADDRESS}] -> [${clientIdentifier}] -> [${message}] `)
            });
        }

        const interval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                if (SERVER_ADDRESS !== getServer(clientIdentifier)) {
                    // console.log(`[${SERVER_ADDRESS}] -> [${clientIdentifier}] -> Redirecting client to [${correctServer}] `)
                    const message = {
                        type: 'redirect',
                        server: correctServer,
                    };
                    ws.send(JSON.stringify(message));
                    clearInterval(interval)
                } else {
                    // console.log(`[${SERVER_ADDRESS}] -> [${clientIdentifier}] is on correct server`)
                }
            } else {
                clearInterval(interval);
            }
        }, 1000);
    });
    return wss;
}

