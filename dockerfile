FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install express mongoose dotenv

COPY . .

EXPOSE 4000

CMD ["npm", "start"]