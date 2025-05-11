FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 4001

ENV NODE_ENV=development
ENV PORT=4001

CMD ["npm", "run", "dev"]