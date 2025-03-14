FROM node:22 AS prod_builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build:prod

FROM caddy:builder AS caddy_builder

RUN xcaddy build --with github.com/caddyserver/cache-handler

FROM caddy:latest AS caddy_dev

COPY --from=caddy_builder /usr/bin/caddy /usr/bin/caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]

FROM node:22 AS app_dev

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
CMD ["npm", "run", "start"]

FROM caddy:latest AS caddy_prod

COPY --from=caddy_builder /usr/bin/caddy /usr/bin/caddy
RUN rm -rf /usr/share/caddy/*
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]

FROM node:22 AS app_prod

WORKDIR /app
COPY --from=prod_builder /app/dist/fanalyzer /dist
CMD ["node", "/dist/server/server.mjs"]
