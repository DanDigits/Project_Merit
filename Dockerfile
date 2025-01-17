# NEXTAUTH_URL and NEXT_PUBLIC_NEXTAUTH_URL *MUST* be present at runtime/as environment variables, even if using localhost, otherwise you will have noticable issues
# Dont forget to add DB_URI and NEXTAUTH_SECRET!

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

# Mitigation due to issues with next-auth and ECS, may be unnecessary in the future
RUN sed -i 's|const errorUrl = new URL(`${basePath}${errorPage}`, origin);|const errorUrl = new URL(`${basePath}${errorPage}`, process.env.NEXTAUTH_URL + ":" + process.env.NEXTAUTH_PORT);|g' .next/server/src/middleware.js 
RUN sed -i 's|const signInUrl = new URL(`${basePath}${signInPage}`, origin);|const signInUrl = new URL(`${basePath}${signInPage}`, process.env.NEXTAUTH_URL + ":" + process.env.NEXTAUTH_PORT);|g' .next/server/src/middleware.js 

# All Environment variables -----------------------------
# Network
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# NextJS/NextAuth
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_PUBLIC_NEXTAUTH_URL=http://localhost
ENV NEXTAUTH_URL=http://localhost
ENV NEXTAUTH_SECRET=
ENV NEXTAUTH_PORT=3000

# MongoDB Database
ENV DB_URI=

# Email
ENV EMAIL_SERVER_USER=
ENV EMAIL_SERVER_PASSWORD=
ENV EMAIL_SERVER_SERVICE=gmail
ENV EMAIL_SERVER_PORT=465
ENV EMAIL_SERVER_HOST=smtp.gmail.com
ENV EMAIL_FROM=noreply@service.com
ENV EMAIL_SUBJECT="Message from Merit"

EXPOSE $PORT

# Start node process with "systemd"
CMD ["dumb-init","node","server.js"]