FROM node:20-alpine

WORKDIR /app

# Install dependencies separately for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
