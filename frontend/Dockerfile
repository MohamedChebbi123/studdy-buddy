FROM node:22.16.0

WORKDIR /app

COPY package.json ./  
RUN npm install

COPY . .

RUN npm run build  -- --no-lint
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
