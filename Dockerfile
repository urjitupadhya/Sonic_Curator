FROM node:20-alpine

WORKDIR /app

# 1. Install dependencies first (for faster builds)
COPY package*.json ./
RUN npm install

# 2. COPY THE ACTUAL CODE (This was being skipped or misplaced!)
COPY . .

# 3. Environment settings
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 4. Build the app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
