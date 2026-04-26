FROM node:20-alpine

WORKDIR /app

# 1. Install dependencies
COPY package*.json ./
RUN npm install

# 2. Copy source code
COPY . .

# 3. Provide dummy env vars so Next.js can build without real secrets.
#    These are ONLY used during "npm run build" and are overridden
#    at runtime by Railway/Docker environment variables.
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV GEMINI_API_KEY="dummy-build-key"
ENV BETTER_AUTH_SECRET="dummy-build-secret"
ENV BETTER_AUTH_URL="http://localhost:3000"
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 4. Build
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
