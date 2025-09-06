FROM node:iron-trixie-slim
WORKDIR /app
COPY deploy/ .
USER node
EXPOSE 3000
CMD ["node", "server.js"]