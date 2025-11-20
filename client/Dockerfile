FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Variables de entorno para Vite (build time)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
# Instalar serve globalmente para servir archivos estáticos
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
# Serve sirve los archivos estáticos y maneja las rutas SPA automáticamente
CMD ["serve", "-s", "dist", "-l", "3000"]

