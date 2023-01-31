const os = require('os');

export function getServerAddress() {
    return os.hostname();

    // You can use IP addresses, but for the sake of keeping things readable
    // I used hostnames from docker-compose.yml

    /* const networkInterfaces = os.networkInterfaces();

    for (const name of Object.keys(networkInterfaces)) {
        for (const intf of networkInterfaces[name]) {
            if (intf.family === 'IPv4' && !intf.internal) {
                return intf.address;
            }
        }
    }

    return '127.0.0.1';

    */
}
