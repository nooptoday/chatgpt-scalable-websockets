// https://sharegpt.com/c/bGUAItM

import Redis from 'ioredis';

const redis = new Redis({ host: '127.0.0.1' });
const updateInterval = 5; // in seconds
const heartbeatInterval = 10; // in seconds

const serviceList: Set<string> = new Set();
const heartbeatIntervals: { [instance: string]: NodeJS.Timeout } = {};

async function registerServiceInstance(instance: string) {
    await redis.sadd('service-name', instance);
    await redis.set(instance, 'alive', 'EX', heartbeatInterval * 2);
    heartbeatIntervals[instance] = setInterval(() => {
        redis.set(instance, 'alive', 'EX', heartbeatInterval * 2);
    }, heartbeatInterval * 1000);
}

async function deregisterServiceInstance(instance: string) {
    await redis.srem('service-name', instance);
    await redis.del(instance);
    clearInterval(heartbeatIntervals[instance]);
    delete heartbeatIntervals[instance];
}

async function removeStaleServiceInstances() {
    const instances = await redis.smembers('service-name');
    for (const instance of instances) {
        const ttl = await redis.ttl(instance);
        if (ttl === -2 || ttl === -1) {
            await redis.srem('service-name', instance);
        }
    }
}

async function updateServiceList() {
    const instances = await redis.smembers('service-name');
    serviceList.clear();
    for (const instance of instances) {
        serviceList.add(instance);
    }
}

setInterval(removeStaleServiceInstances, updateInterval * 1000);
setInterval(updateServiceList, updateInterval * 1000);
