## Instructions

1. Install node and install nvm. Go to the root folder and run

```bash
nvm use
```

then,

```bash
npm install
```

2. Install mongodb to your system and start the service

3. Create .env file in the root folder

```.env
PORT
MONGODB_URI = mongodb://<localhost-or-container-name>:27017/<db-name>
CLIENT_URL = http://localhost:<PORT>
```

4. Start the node server

```bash
npm start
```

5. Instead you can run all the services with docker, install docker and docker-compose, and then,

```bash
docker-compose up --build
```

### Or run your docker services separately,

References,

```
d = runs a detached container
rm = removes the container when the respective server is stopped
v = volume
p = port
t = tag
```

```bash
docker run --name <mongo-container-name> --network <my-net> -p 27017:27017 -v /path/to/the/database:/data/db -d --rm mongo
```

then ,

To run the server first run,

```
docker build -t <image-name>
```

then,

```bash
docker run --name <server-container-name> --network <my-net> -p 8000:8000 -v /path/to/the/project:/home/apps/library -v node_modules:/home/apps/library/node_modules -d --rm <built-image-name>
```
