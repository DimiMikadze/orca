# React Frontend for Create Social Network

To start the frontend separately `cd` into `frontend` folder and run `npm start` or `yarn start`. That will run the development server, which will reload automatically if you make changes to the code.

After running the server, you can navigate to `http://localhost:3000`

## Frontend deployment to Netlify

- Push repository on Github, Gitlab or on Bitbucket.
- Create new site on [Netlify](https://www.netlify.com/) and connect that repository to it.
- You don't need to add build options in Netlify's UI as we have already created and configured `netlify.toml` file in the root of repository.
- Add environment variables to Netlify based on `frontend/.env` file, make sure to replace API and Frontend URLs, e.g. `REACT_APP_API_URL=https://csn-api.heroku.com/graphql` and `REACT_APP_FRONTEND_URL=https://csn-demo.netlify.com`
- Finally after every changes to the master branch Netlify will build and deploy frontend automatically.
