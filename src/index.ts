import {deregisterServiceInstance, registerServiceInstance} from "./server-discovery";
import {startWebsocketServer} from "./websocket-server";
import {SERVER_ADDRESS} from "./constants";

async function bootstrap() {
    const wss = await startWebsocketServer();
    await registerServiceInstance(SERVER_ADDRESS);

    setInterval(() => {
        console.log(`[${SERVER_ADDRESS}] - [client_size] -> [${wss.clients.size}]`)
    }, 3000);

    process.on('SIGINT', async () => {
        await deregisterServiceInstance(SERVER_ADDRESS);
        wss.close();
    });
    process.on('SIGTERM', async () => {
        await deregisterServiceInstance(SERVER_ADDRESS);
        wss.close();
    })
}

bootstrap();
