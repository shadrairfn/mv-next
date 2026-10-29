FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
# Docker overrides HOSTNAME at runtime, so compose.yaml sets it again.
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
# Needed by `node scripts/check-smtp.ts` (docker compose exec web ...). The app itself has nodemailer
# bundled into the server build, so the standalone output does not ship the package.
COPY --from=deps --chown=node:node /app/node_modules/nodemailer ./node_modules/nodemailer
COPY --chown=node:node scripts ./scripts
COPY --chown=node:node lib/smtp-diagnostic.ts ./lib/smtp-diagnostic.ts
USER node
EXPOSE 3000
CMD ["node", "server.js"]
