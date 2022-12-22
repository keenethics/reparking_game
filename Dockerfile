FROM node:18
WORKDIR /app
COPY . .

RUN npm install

ENV NODE_ENV=production
ENV SERVER_PORT=8080

RUN echo "REACT_APP_SERVER_URL=reparking.fly.dev" >> .env.prod
RUN echo "REACT_APP_TELEGRAM_CHANNEL=https://t.me/+TZqpnwxf7EY1MGYy" >> .env.prod
RUN npm run build:prod-client

CMD ["npm", "run", "start:prod-server"]
EXPOSE 8080
