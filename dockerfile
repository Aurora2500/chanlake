FROM node:alpine

WORKDIR /app
COPY package.json /app
COPY prisma/schema.prisma /app/prisma/schema.prisma
RUN npm install
RUN npx prisma generate
COPY . /app
RUN npm run build

CMD ["npm", "start"]