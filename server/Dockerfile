# Production stage
FROM node:18-alpine AS production
WORKDIR /app
ARG NODE_ENV=production
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]

# Development stage
FROM node:18-alpine AS development
WORKDIR /app
ARG NODE_ENV=development
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]