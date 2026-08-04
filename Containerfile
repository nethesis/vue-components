FROM docker.io/library/node:22.23.2 as base
WORKDIR /app

FROM base as dev
CMD exec /bin/bash -c "npm install && npm run storybook"

FROM base as app
COPY package.json .
COPY package-lock.json .
RUN npm ci --ignore-scripts
COPY src src
COPY tsconfig.app.json .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY vite.config.ts .

FROM app as build
RUN npm run build
# Declaration emit can fail silently (see the "noEmit" note in tsconfig.app.json).
# Never ship a package without types.
RUN test -f dist/main.d.ts

FROM app as build-storybook
COPY .storybook .storybook
COPY stories stories
RUN npm run build-storybook

FROM scratch as dist
COPY --from=build /app/dist /

FROM scratch as storybook
COPY --from=build-storybook /app/storybook-static /