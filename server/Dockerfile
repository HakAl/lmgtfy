# Production stage
FROM node:18-alpine AS production
WORKDIR /app
ARG NODE_ENV=production
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup
COPY package*.json ./
RUN npm install --production && chown -R appuser:appgroup /app
USER appuser
COPY --chown=appuser:appgroup . .
EXPOSE 3000
CMD ["node", "index.js"]

# Development stage
FROM node:18-alpine AS development
WORKDIR /app
ARG NODE_ENV=development
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup
COPY package*.json ./
RUN npm install && chown -R appuser:appgroup /app
USER appuser
COPY --chown=appuser:appgroup . .
EXPOSE 3000
CMD ["npm", "run", "dev"]