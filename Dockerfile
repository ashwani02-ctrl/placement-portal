# Use Node LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for caching)
COPY package.json package-lock.json* ./

RUN npm install

# Copy rest of the app
COPY . .

# Expose Next.js port
EXPOSE 3000

# Run dev server
CMD ["npm", "run", "dev"]