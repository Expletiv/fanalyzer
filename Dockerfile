FROM node:22 AS prod_builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build:prod

FROM node:22 AS app_dev

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
CMD ["npm", "run", "start"]

FROM caddy:latest AS app_prod

COPY Caddyfile /etc/caddy/Caddyfile
RUN rm -rf /usr/share/caddy/*
COPY --from=prod_builder /app/dist/satisfactory-tools-frontend /usr/share/caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]

