# Stage 1 - build react
FROM node:18-alpine as build
WORKDIR /app

ARG REACT_APP_API_URL
ARG API_BASE_FALLBACK
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV API_BASE_FALLBACK=${API_BASE_FALLBACK}

# faster reproducible install when lockfile exists:
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --silent; else npm install --silent; fi

COPY . .
RUN npm run build

# Stage 2 - nginx serve static files
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# copy nginx config into default conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy build output
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
