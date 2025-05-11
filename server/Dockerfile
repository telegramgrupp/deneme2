FROM node:18-alpine

WORKDIR /app

# Install OpenSSL and other required dependencies
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 4001

ENV NODE_ENV=development
ENV PORT=4001

CMD ["npm", "run", "dev"]