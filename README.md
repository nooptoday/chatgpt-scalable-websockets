# chatgpt-scalable-websockets
An example repository for creating scalable websocket server using consistent hashing method. Code is generated with help from ChatGPT! More about this on https://nooptoday.com

You can find raw output codes in chatgpt-raw directory. Full conversations are linked at the top of each file.

src directory contains edited code. Full article here: 

### How to run locally?

- Create .env file and copy contents from env.example
- Run `docker-compose up`
- It creates 3 server instances with hostnames: node1, node2 and node3
- node_client container connects websockets to node1 server initially, and clients are redirected to correct servers.
- 