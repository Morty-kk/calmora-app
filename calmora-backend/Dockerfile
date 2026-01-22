FROM node:20-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy prisma schema
COPY prisma ./prisma

# Copy source code
COPY src ./src

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 4000

# Start command
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
