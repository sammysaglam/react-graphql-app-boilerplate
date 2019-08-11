FROM circleci/node:12.2.0-browsers
USER node

# create & use workdir
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app

# set permissions
RUN chown -R node:node /home/node
RUN chmod -R 755 /home/node

# copy package.json & install
COPY package.json ./
COPY yarn.lock ./
COPY .solidarity ./
RUN yarn install --frozen-lockfile

# bundle app source
COPY --chown=node . .

# build app
RUN npm run build

# serve
EXPOSE 3000
CMD npm run serve
