FROM node:20.5.1-alpine AS build
# Below RUN line is included to avoid missing libc requirements which are not included in alpine linux
RUN apk add --no-cache libc6-compat gcompat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20.5.1-alpine
RUN apk update && apk upgrade
RUN adduser -D user
# Below RUN line is included to give application a lightweight "systemd" in operation
RUN apk add dumb-init
WORKDIR /app
COPY --from=build --chown=user:user /app/public ./public
COPY --from=build --chown=user:user /app/.next/standalone ./
COPY --from=build --chown=user:user /app/.next/static ./.next/static
USER user

# Mitigation due to issues with next-auth and ECS
RUN sed -i 's|const errorUrl = new URL(`${basePath}${errorPage}`, origin);|const errorUrl = new URL(`${basePath}${errorPage}`, process.env.NEXTAUTH_URL + ":" + process.env.NEXTAUTH_PORT);|g' .next/server/src/middleware.js 
RUN sed -i 's|const signInUrl = new URL(`${basePath}${signInPage}`, origin);|const signInUrl = new URL(`${basePath}${signInPage}`, process.env.NEXTAUTH_URL + ":" + process.env.NEXTAUTH_PORT);|g' .next/server/src/middleware.js 

ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXTAUTH_SECRET=
ENV NEXTAUTH_URL=localhost
ENV NEXT_PUBLIC_NEXTAUTH_URL=
ENV EMAIL_SERVER_SERVICE=
ENV EMAIL_SERVER_PORT=
ENV EMAIL_SERVER_HOST=
ENV EMAIL_SERVER_USER=
ENV EMAIL_SERVER_PASSWORD=
ENV EMAIL_FROM=noreply@service.com
ENV EMAIL_SUBJECT=
#ENV NEXTAUTH_PORT=URL
#ENV NEXTAUTH_URL_INTERNAL=localhost:$PORT
#ENV DB_URI=URI
#ENV DB_NAME=name

EXPOSE $PORT

# Start node process with "systemd"
CMD ["dumb-init","node","server.js"]