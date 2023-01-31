// https://sharegpt.com/c/pIc7amA

import * as WebSocket from 'ws';

let ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    console.log('Connected to WebSocket server');
});

ws.on('message', (data: string) => {
    const message = JSON.parse(data);
    if (message.type === 'redirect') {
        console.log(`Received redirect message. Disconnecting from current server and connecting to ${message.server}`);
        ws.close();
        ws = new WebSocket(`ws://${message.server}:8080`);
    } else {
        console.log(`Received message => ${data}`);
    }
});

ws.on('close', () => {
    console.log('Disconnected from WebSocket server');
});
