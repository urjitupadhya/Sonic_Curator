FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Environment variables will be provided by Railway
# DATABASE_URL, GEMINI_API_KEY, BETTER_AUTH_SECRET, etc.

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
