FROM mcr.microsoft.com/playwright:v1.53.1-jammy

WORKDIR /src

# Install dependencies
COPY ["package.json", "."]
COPY ["package-lock.json", "."]
# RUN ["npm", "config", "set", "strict-ssl", "false"]
RUN ["npm", "ci"]

# Copy test files
COPY ["models/", "models/"]
COPY ["tests/", "tests/"]
COPY ["playwright.config.ts", "."]

# Run UI tests
CMD ["npm", "run", "docker:ui"]