// https://sharegpt.com/c/pIc7amA

import * as WebSocket from 'ws';
import * as crypto from 'crypto';

let serverList = ['server1', 'server2', 'server3'];

function getServer(clientIp: string) {
    const hash = crypto.createHash('md5').update(clientIp).digest('hex');
    const index = parseInt(hash, 16) % serverList.length;
    return serverList[index];
}

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws: WebSocket, req) => {
    const clientIp = req.connection.remoteAddress;
    const correctServer = getServer(clientIp);

    if (req.headers.host !== correctServer) {
        const message = {
            type: 'redirect',
            server: correctServer,
        };
        ws.send(JSON.stringify(message));

        ws.on('message', () => {});
    } else {
        ws.on('message', (message: string) => {});
    }

    const interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            if (req.headers.host !== correctServer) {
                const message = {
                    type: 'redirect',
                    server: correctServer,
                };
                ws.send(JSON.stringify(message));
            }
        } else {
            clearInterval(interval);
        }
    }, 1000);
});
