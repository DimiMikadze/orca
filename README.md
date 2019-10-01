# Create Social Network ![npm](https://img.shields.io/npm/dm/create-social-network) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)

Create Social Network is a tool for building Social Network applications using React, Node, GraphQL and MongoDB. You can set up local Social Network by running one command.

```sh
npx create-social-network my-network
cd my-network
npm start
```

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher, for older npm versions run `npm install -g create-social-network` and then run `create-social-network my-app`)_

After installation open [http://localhost:3000/](http://localhost:3000/) to see your app.

<p align='center'>
<img src='https://res.cloudinary.com/dkkf9iqnd/image/upload/v1569913692/screencast_abbvuz.gif' alt='npm start'>
</p>

**Demo**: https://csn-demo.netlify.com/

## Features

- **News Feed** Fresh posts from people you are following.
- **Explore** New Posts and People.
- **Follow** a particular user and get notified for their activity.
- **Personalize Profile** With profile/cover photo and personal posts.
- **Notifications** Get notified when someone follows you or likes/comments on your post.
- **Authentication & authorization** with Password reset functionality.

## Requirements and Configuration

App by default uses MongoDB hosted on [mLab](https://mlab.com/) and [Cloudinary](https://cloudinary.com/) CDN for hosting images. We have created demo user for mLab and Cloudinary so you can run app locally without adding Mongo URL and Cloudinary API Key, however when you start developing your application it is recommended to replace those information with your ones, so everybody has its own Database and CDN.

### Replacing Mongo URL

Replace `MONGO_URL` value in `api/.env` file with your `mLab` database url or with local one.

### Replacing Cloudinary API Key

Grab `Cloud name` `API Key` and `API Secret` from Cloudinary dashboard and replace corresponding values inside `api/.env` file.

### Mail Provider

For password reset functionality you will need to replace Email Provider values also in `api/.env` file.

## Creating an App

**You’ll need to have Node 8.16.0 or Node 10.16.0 or later version on your local development machine**

To create a new app, you may choose one of the following methods:

### npx

```sh
npx create-social-network my-network
```

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher, for older npm versions run `npm install -g create-social-network` and then run `create-social-network my-app`)_

### npm

```sh
npm init social-network my-network
```

_`npm init <initializer>` is available in npm 6+_

### Yarn

```sh
yarn create social-network my-network
```

_`yarn create` is available in Yarn 0.25+_

It will create a directory called `my-network` inside the current folder.
Inside that directory, it will generate the initial project structure and install dependencies.

```
my-network
├── api
├── frontend
├── node_modules
├── .gitignore
├── netlify.toml
├── package.json
├── README.md
```

The app is organized as [Monorepo](https://en.wikipedia.org/wiki/Monorepo) using [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/)

Once the installation is done, you can open your project folder:

```sh
cd my-network
```

And start the application with `npm start` or `yarn start` that will run the app in development mode.
Open [http://localhost:3000/](http://localhost:3000/) to view it in the browser.

The page will automatically reload if you make changes to the code.

## Deployment

In development mode we are starting `api` and `frontend` servers with one command, but we need to deploy them separately.

[API Deployment](https://github.com/udilia/create-social-network/tree/master/api#api-deployment-to-heroku)

[Frontend Deployment](https://github.com/udilia/create-social-network/tree/master/frontend#frontend-deployment-to-netlify)

## Contributing

We'd love to have your helping hand on create-social-network! See [CONTRIBUTING.md](https://github.com/udilia/create-social-network/blob/master/CONTRIBUTING.md) for more information on what we're looking for and how to get started.

## Credits

Many ideas for CLI tool and Readme file are taken from [Create React App](https://github.com/facebook/create-react-app) project.

## License

[MIT License](https://github.com/udilia/create-social-network/blob/master/LICENSE.md) Copyright (c) 2019 [udilia](https://udilia.com/)
