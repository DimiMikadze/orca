# Create Social Network ![npm](https://img.shields.io/npm/dm/create-social-network) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)

Create Social Network is a educational project. Its main idea is to demonstrate how one can build large scalable project with React, Node, GraphQL, MongoDB and related technologies. However you get the core functionality of social network by running one command and then you can build more on top of that. 

```sh
npx create-social-network my-network
cd my-network
npm start
```

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher, see [instructions for older npm versions](https://gist.github.com/DimiMikadze/142aba2c0a898843d765b3e4870870ce))_

After installation open [http://localhost:3000/](http://localhost:3000/) to see your app.

<p align='center'>
<img src='https://res.cloudinary.com/dkkf9iqnd/image/upload/v1569913692/screencast_abbvuz.gif' alt='npm start'>
</p>

## Screenshots of some pages

|                                          Home                                          |                                          Profile                                          |                                          Explore                                          |
| :------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------: |
| ![](https://res.cloudinary.com/dkkf9iqnd/image/upload/v1570092963/home-min_owba13.png) | ![](https://res.cloudinary.com/dkkf9iqnd/image/upload/v1570092963/profile-min_ifoino.png) | ![](https://res.cloudinary.com/dkkf9iqnd/image/upload/v1570092963/explore-min_rplwu5.png) |

## Demo

https://worldexplorer.netlify.com/

## Features

- **News Feed** Fresh posts from people you are following.
- **Explore** New Posts and People.
- **Follow** a particular user and get notified for their activity.
- **Personalize Profile** With profile/cover photo and personal posts.
- **Notifications** Get notified when someone follows you or likes/comments on your post.
- **Authentication & authorization** with Password reset functionality.

## Requirements and Configuration

You’ll need to have Node 8.16.0 or Node 10.16.0 or later version on your local development machine

App by default uses MongoDB hosted on [mLab](https://mlab.com/) and [Cloudinary](https://cloudinary.com/) CDN for hosting images. We have created demo user for mLab and Cloudinary so you can run app locally without adding Mongo URL and Cloudinary API Key, however when you start developing your application it is recommended to replace those information with your ones, so everybody has its own Database and CDN.

> Note demo database is being deleted and populated with demo data daily

### Replacing Mongo URL

Replace `MONGO_URL` value in `api/.env` file with your `mLab` database url or with local one.

### Replacing Cloudinary API Key

Grab `Cloud name` `API Key` and `API Secret` from Cloudinary dashboard and replace corresponding values inside `api/.env` file.

### Mail Provider

For password reset functionality you will need to replace Email Provider values also in `api/.env` file.

## Creating an App

To create a new app, you may choose one of the following methods:

### npx

```sh
npx create-social-network my-network
```

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher, see [instructions for older npm versions](https://gist.github.com/DimiMikadze/142aba2c0a898843d765b3e4870870ce))_

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

Please read our [CONTRIBUTING.md](https://github.com/udilia/create-social-network/blob/master/CONTRIBUTING.md) before submitting a Pull Request to the project.

## Credits

Many ideas for CLI tool and Readme file are taken from [Create React App](https://github.com/facebook/create-react-app) project.

## License

[MIT License](https://github.com/udilia/create-social-network/blob/master/LICENSE.md) Copyright (c) 2019 [udilia](https://udilia.com/)
