FROM node:18-alpine

WORKDIR /usr/gamiacad-api
COPY . .
RUN yarn install \
    && yarn build \
    && rm -rf node_modules \
    && yarn install --production
CMD ["yarn", "start"]