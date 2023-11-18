FROM node:lts-alpine AS migration
ARG DATABASE_URL
ENV DATABASE_URL $DATABASE_URL
ENV NODE_ENV production
ENV npm_config_yes true
WORKDIR /var/app
RUN mkdir src
COPY prisma prisma/
CMD npx prisma migrate deploy

FROM node:lts-alpine AS dependencies
WORKDIR /var/app
COPY package.json package-lock.* tsconfig.json ./
RUN npm install --frozen-lockfile

FROM node:lts-alpine AS build
ENV NODE_ENV production
WORKDIR /var/app
COPY --from=dependencies /var/app/node_modules node_modules/
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:lts-alpine AS prodDependencies
WORKDIR /var/app
COPY package.json package-lock.* ./
RUN npm install --production=true --frozen-lockfile

FROM node:lts-alpine AS package
ARG DATABASE_URL
ENV DATABASE_URL $DATABASE_URL
ENV NODE_ENV production
WORKDIR /var/app
RUN mkdir src
COPY --from=prodDependencies /var/app/package.json package.json
COPY --from=prodDependencies /var/app/node_modules node_modules/
COPY --from=build /var/app/build build/
COPY --from=build /var/app/prisma prisma/
RUN wget -O /var/app/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64 && \
  chmod -v +x /var/app/dumb-init
RUN npx pkg@5.5.2 . -o pkg_app
RUN chmod -v +x /var/app/pkg_app

FROM node:lts-alpine AS runtime
ENV NODE_ENV production
WORKDIR /var/app
USER node
# Do not remove the next two lines, if you do, an EACCES (permission denied) error will occur
COPY --chown=node:node --from=package /var/app/src /src/
COPY --chown=node:node --from=package /var/app/src src/
# :)
COPY --chown=node:node --from=package /var/app/dumb-init dumb-init
COPY --chown=node:node --from=package /var/app/pkg_app thrall
ENTRYPOINT ["/var/app/dumb-init", "--"]
CMD ["/var/app/thrall"]