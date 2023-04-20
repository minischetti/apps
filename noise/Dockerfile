# https://learn.microsoft.com/en-us/visualstudio/docker/tutorials/docker-tutorial?WT.mc_id=vscode_docker_aka_helppanel
# https://docs.docker.com/engine/reference/builder/
# https://www.docker.com/blog/9-tips-for-containerizing-your-node-js-application/
FROM node:16

# TODO: Install python
# RUN apt-get update && apt-get install -y python3

# RUN apk add --no-cache python2

# Create app directory
WORKDIR /usr/src/app
COPY . .
RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

EXPOSE 8080

CMD [ "node", "/app/src/server.js" ]