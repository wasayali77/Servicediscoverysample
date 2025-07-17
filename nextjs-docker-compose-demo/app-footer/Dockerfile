# Use Node.js base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port (Next.js default)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
