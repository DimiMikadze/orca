# API for Create Social Network using Node, GraphQL and MongoDB

To start the API separately `cd` into `api` folder and run `npm start` or `yarn start`. That will run the development server, which will reload automatically if you make changes to the code.

After running the server, you can navigate to `http://localhost:4000/graphql` where you can test the API using [GraphQL Playground](https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/)

## API deployment to Heroku

- Create NodeJS app using [Heroku CLI](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- Add [environment variables](https://devcenter.heroku.com/articles/config-vars) to Heroku from `api/.env` file.
  Replace `FRONTEND_URL=http://localhost:3000` with the deployed frontend url e.g. `FRONTEND_URL=https://csn-demo.netlify.com` that is required because API responds only to that url.
- Finally run `npm run deploy:api` or `yarn run deploy:api` from `root` folder to deploy the API.
