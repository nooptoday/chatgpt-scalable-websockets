// https://sharegpt.com/c/JsHsvY8

const os = require('os');

function getIPAddress() {
    const networkInterfaces = os.networkInterfaces();

    for (const name of Object.keys(networkInterfaces)) {
        for (const intf of networkInterfaces[name]) {
            if (intf.family === 'IPv4' && !intf.internal) {
                return intf.address;
            }
        }
    }

    return '127.0.0.1';
}

console.log(getIPAddress());
