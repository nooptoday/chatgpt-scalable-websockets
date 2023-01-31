import * as WebSocket from 'ws';

export function startClient(initialServer: string, userId: string) {
    const options = { headers: { ['x-user-id']: userId } }

    let ws = new WebSocket.WebSocket(`ws://${initialServer}:8080`, options);

    ws.onopen = () => {
        // console.log(`[${userId}] - [connect] -> [${ws.url}]`);
    };

    ws.onclose = () => {
        // console.log(`[${userId}] -[disconnect] -> [${ws.url}]`);
    };

    ws.onmessage = (event: WebSocket.MessageEvent) => {
        if(typeof event.data !== 'string'){
            return;
        }
        const message = JSON.parse(event.data);
        if (message.type === 'redirect') {
            // console.log(`[${userId}] -[redirect] -> [${message.server}]`);
            ws.close();
            ws.onclose = () => {
                ws = startClient(message.server, userId);
            }
        } else {
            // console.log(`[${userId}] -[message_recv] -> [${event.data}]`);
        }
    };

    return ws;
}

