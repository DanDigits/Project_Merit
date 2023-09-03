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
#RUN grep -rl 'api/auth/signin' ./ |  xargs sed -i 's|api/auth/signin|login|g'
RUN grep -q 'signInUrl.searchParams.append("callbackUrl", `${basePath}${pathname}${search}`);' ./.next/server/src/middleware.js && sed -i '/signInUrl.searchParams.append("callbackUrl", `${basePath}${pathname}${search}`);/a \    console.log("Sign in URL is " + `${signInUrl}`);\n    console.log(process.env.NEXTAUTH_URL);' .next/server/src/middleware.js

ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXTAUTH_SECRET=SECRET
ENV NEXTAUTH_URL=URL
#ENV NEXTAUTH_URL_INTERNAL=127.0.0.1:3000
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV DB_URI=URI
#ENV DB_NAME=name

EXPOSE $PORT

# Start node process with "systemd"
CMD ["dumb-init","node","server.js"]