# ---------- client/Dockerfile ----------
# Build stage (root OK here—only builds)
FROM node:22.12.0 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ----------  production stage  ----------
FROM nginx:alpine AS production

# create user & fix perms while still root
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup && \
    mkdir -p /var/cache/nginx /var/log/nginx /run && \
    chown -R appuser:appgroup /var/cache/nginx /var/log/nginx /run /usr/share/nginx/html /etc/nginx/conf.d

# move pid file somewhere appuser can write
RUN sed -i '/^pid\s/c\pid /run/nginx.pid;' /etc/nginx/nginx.conf

# switch to non-root
USER appuser

# copy site & config with correct ownership
COPY --from=builder --chown=appuser:appgroup /app/dist /usr/share/nginx/html
COPY --chown=appuser:appgroup nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Development stage
FROM node:22.12.0 AS development
WORKDIR /app
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup
COPY package*.json ./
RUN npm ci && chown -R appuser:appgroup /app
USER appuser
ENV HOST=0.0.0.0 \
    CHOKIDAR_USEPOLLING=true \
    CHOKIDAR_INTERVAL=1000
COPY --chown=appuser:appgroup . .
EXPOSE 5173
CMD ["npm", "run", "dev"]