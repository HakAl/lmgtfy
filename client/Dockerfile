# Build stage
FROM node:22.12.0 AS builder
ARG NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# Development stage
FROM node:22.12.0 AS development
WORKDIR /app

COPY package*.json ./
RUN npm install

# Set environment variables for hot reload
ENV HOST=0.0.0.0
ENV CHOKIDAR_USEPOLLING=true
ENV CHOKIDAR_INTERVAL=1000

# Copy source code
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]