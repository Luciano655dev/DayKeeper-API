# Use Node.js base image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Only copy package.json files first
COPY package*.json ./

# Install fresh dependencies INSIDE the container
RUN npm install

# Now copy the rest of the code
COPY . .

# Expose port from container to host
EXPOSE 3001

# Start server
RUN npm install -g nodemon
CMD ["nodemon", "app.js"]
