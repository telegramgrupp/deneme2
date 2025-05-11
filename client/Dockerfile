FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

ENV VITE_API_URL=http://localhost:4001
ENV VITE_SOCKET_URL=http://localhost:4001
ENV VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

CMD ["npm", "run", "dev", "--", "--host"]