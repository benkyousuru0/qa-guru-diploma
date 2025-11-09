FROM mcr.microsoft.com/playwright:v1.56.1-noble

COPY . .

RUN npm i
RUN npx playwright install --with-deps
CMD ["npm", "run", "test"]