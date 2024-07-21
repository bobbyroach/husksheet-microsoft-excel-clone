#Ownership: Arnav Sawant
# react-app/Dockerfile
FROM node:16-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN npm install axios

RUN npm i --save-dev @types/jest

RUN npm i --save-dev @testing-library/jest-dom

RUN npm i --save-dev @types/react-virtualized

COPY . .

RUN npm run build

#To run tests
RUN npm i --save-dev jest-environment-jsdom

RUN npm i axios-mock-adapter

# Serve the build output with a simple Node.js server
FROM node:16-alpine

WORKDIR /app

COPY --from=build /app/build ./build

# Create a simple server to serve the React app
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build"]
