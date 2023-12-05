FROM docker.io/library/node:20.10.0 as base
WORKDIR /app

FROM base as dev
CMD exec /bin/bash -c "npm install && npm run storybook"

FROM base as build
COPY package.json .
COPY package-lock.json .
RUN npm ci --ignore-scripts
COPY src src
COPY postcss.config.js .
COPY tailwind.config.js .
COPY tsconfig.app.json .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY vite.config.ts .
RUN npm run build

FROM scratch as dist
COPY --from=build /app/dist /