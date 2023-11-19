FROM node:lts-alpine AS dependencies
WORKDIR /var/app
COPY package.json package-lock.* tsconfig.json ./
RUN npm install --frozen-lockfile

FROM node:lts-alpine AS build
ENV NODE_ENV production
WORKDIR /var/app

RUN wget -O /var/app/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64 && \
  chmod -v +x /var/app/dumb-init

COPY --from=dependencies /var/app/node_modules node_modules/
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:lts-alpine AS prodDependencies
WORKDIR /var/app
COPY package.json package-lock.* ./
RUN npm install --omit=dev --frozen-lockfile


FROM node:lts-alpine AS runtime

WORKDIR /var/app
ENV NODE_ENV production
ENV PORT 8080

USER node

COPY --from=prodDependencies --chown=node:node /var/app/package.json package.json
COPY --from=prodDependencies --chown=node:node /var/app/node_modules node_modules/
COPY --from=build --chown=node:node /var/app/dumb-init dumb-init
COPY --from=build --chown=node:node /var/app/build build/
COPY --from=build --chown=node:node /var/app/prisma prisma/
RUN npx prisma generate

ENTRYPOINT ["/var/app/dumb-init", "--"]
CMD ["node", "build/src/main"]