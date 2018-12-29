# use node
FROM node:11.4.0

# set working directory
WORKDIR /usr/src/app

# copy package.json
COPY package.json ./
COPY yarn.lock ./
COPY .flowconfig ./

# yarn install
RUN yarn install

# bundle app source
COPY . .

# build app
RUN npm run build

# expose port
EXPOSE 3000

# serve
CMD npm run serve
