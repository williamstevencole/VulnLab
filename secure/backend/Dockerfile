FROM node:18-slim

# Install OpenSSL and CA certificates for Prisma
RUN apt-get update -y && apt-get install -y openssl ca-certificates

WORKDIR /usr/src/app

COPY package*.json ./
# Install all dependencies including devDependencies (prisma)
RUN npm install

# Copy all files (including prisma folder)
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 8080
CMD ["node", "server.js"]
