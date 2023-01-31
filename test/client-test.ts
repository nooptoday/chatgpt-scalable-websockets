import {startClient} from "./websocket-client";

// Ideally this can be the load balancer url
const initalServer = 'node1';
const numberOfClients = 6000;

async function bootstrap() {
    await new Promise(res => {
        setTimeout(res, 2000);
    })

    for (let i = 0; i < numberOfClients; i++) {
        startClient(initalServer, i.toString())
    }
}

bootstrap();


