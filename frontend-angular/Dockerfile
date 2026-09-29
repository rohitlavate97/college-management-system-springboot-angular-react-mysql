# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install
COPY . .
RUN npm run build

# Runtime stage
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copying from standard Angular build path or browser path if Angular 17+
RUN mkdir -p /usr/share/nginx/html
COPY --from=builder /app/dist/frontend-angular/browser /usr/share/nginx/html/ || \
    COPY --from=builder /app/dist/frontend-angular /usr/share/nginx/html/ || \
    COPY --from=builder /app/dist /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
