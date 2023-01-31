import Redis from 'ioredis';
import {SERVER_ADDRESS, WEBSOCKET_SERVICE} from "./constants";
import {updateHashring} from "./hashring";

const redis = new Redis({host: process.env.REDIS_HOST! || 'localhost', port: +process.env.REDIS_PORT! || 6379});
const updateInterval = 5; // in seconds
const heartbeatInterval = 10; // in seconds

const serviceList: Set<string> = new Set();
const heartbeatIntervals: { [instance: string]: NodeJS.Timeout } = {};

export async function registerServiceInstance(instance: string) {
    console.log(`[${SERVER_ADDRESS}] -> [${WEBSOCKET_SERVICE}] -> Registering: [${instance}] `)
    await redis.sadd(WEBSOCKET_SERVICE, instance);
    await redis.set(instance, 'alive', 'EX', heartbeatInterval * 2);
    heartbeatIntervals[instance] = setInterval(() => {
        console.log(`[${SERVER_ADDRESS}] -> [${WEBSOCKET_SERVICE}] -> Heartbeat sent: [${instance}] `)
        redis.set(instance, 'alive', 'EX', heartbeatInterval * 2);
    }, heartbeatInterval * 1000);
}

export async function deregisterServiceInstance(instance: string) {
    console.log(`[${SERVER_ADDRESS}] -> [${WEBSOCKET_SERVICE}] -> Deregistering: [${instance}] `)
    await redis.srem(WEBSOCKET_SERVICE, instance);
    await redis.del(instance);
    clearInterval(heartbeatIntervals[instance]);
    delete heartbeatIntervals[instance];
}

async function removeStaleServiceInstances() {
    const instances = await redis.smembers(WEBSOCKET_SERVICE);
    for (const instance of instances) {
        const ttl = await redis.ttl(instance);
        if (ttl === -2 || ttl === -1) {
            console.log(`[${SERVER_ADDRESS}] -> [${WEBSOCKET_SERVICE}] -> Removing stale service: [${instance}] `)
            await redis.srem(WEBSOCKET_SERVICE, instance);
        }
    }
}

async function updateServiceList() {
    const instances = await redis.smembers(WEBSOCKET_SERVICE);
    console.log(`[${SERVER_ADDRESS}] -> [${WEBSOCKET_SERVICE}] -> Active services: [${instances}] `)
    if(JSON.stringify([...serviceList]) === JSON.stringify(instances)){
        return;
    }

    serviceList.clear();
    for (const instance of instances) {
        serviceList.add(instance);
    }
    updateHashring([...serviceList]);
}

setInterval(removeStaleServiceInstances, updateInterval * 1000);
setInterval(updateServiceList, updateInterval * 1000);