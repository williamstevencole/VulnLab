FROM node:18-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Copy the rest of the files AFTER npm install
COPY . .

EXPOSE 8000
CMD ["npm", "run", "dev", "--", "--host"]
