# Stage 1: Build React Application
FROM node:latest AS build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .

RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:latest

# Install dnsutils for Debian/Ubuntu
RUN apt-get update && apt-get install -y dnsutils

# Copy NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built React application
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
# Command to run NGINX
CMD ["nginx", "-g", "daemon off;"]