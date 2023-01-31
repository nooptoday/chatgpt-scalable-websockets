import {createHash} from 'crypto';
import {SERVER_ADDRESS} from "./constants";

const REPLICAS = 100;

class HashRing {
    private nodes: string[];
    private ring: { [key: string]: string };
    private replicas: number;
    private sortedKeys: string[];

    constructor(nodes: string[], replicas: number) {
        this.nodes = nodes;
        this.replicas = replicas;
        this.ring = {};

        // Create a hash for each node and add it to the ring
        for (const node of nodes) {
            for (let i = 0; i < replicas; i++) {
                const hash = createHash('sha1')
                    .update(node + ':' + i)
                    .digest('hex');
                this.ring[hash] = node;
            }
        }

        // Sort the keys in the ring to ensure that they are in clockwise order
        this.sortedKeys = Object.keys(this.ring).sort((a, b) =>
            a.localeCompare(b, undefined, {numeric: true})
        );
    }

    // Get the node responsible for a given key
    getNode(key: string): string {
        const hash = createHash('sha1')
            .update(key)
            .digest('hex');
        const keys = this.sortedKeys;

        // Find the first node with a position greater than the hash
        let index = keys.findIndex((k) => k.localeCompare(hash, undefined, {numeric: true}) > 0);

        // If no such node is found, the key belongs on the first node
        if (index === -1) {
            index = 0;
        }

        return this.ring[keys[index]];
    }
}

// Initial hashring
let hashring = new HashRing([SERVER_ADDRESS], REPLICAS);

export function updateHashring(serverList: string[]) {
    const start = Date.now();
    hashring = new HashRing(serverList, REPLICAS);
    console.log(`[${SERVER_ADDRESS}] -> [hashring] -> Recreated at ${Date.now() - start} ms`);
}

export function getServer(clientIp: string) {
    return hashring.getNode(clientIp);
}