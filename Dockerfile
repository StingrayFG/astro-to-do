FROM node:lts-alpine AS base
WORKDIR /app

COPY . .

RUN npm install
RUN npx prisma generate
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=4422
ENV DATABASE_URL="file:./sqlite-data/dev.db"
EXPOSE 4422
CMD npx prisma migrate deploy | node ./dist/server/entry.mjs