FROM node:18-alpine

# Install pnpm using npm
RUN npm install -g pnpm

WORKDIR /app

# Copy env files first
COPY .env.local .env.local

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the code
COPY . .

# Set build-time environment variables with correct names
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Build the application
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"] 