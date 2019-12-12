# Contributing to Create Social Network

Our main responsibility is to be up to date with used technologies, keep core features of social network and don't add tailored ones for specific users.

All efforts to contribute are highly appreciated, we recommend you talk to a maintainer prior to spending a lot of time making a pull request that may not align with the project roadmap.

## Submitting a Pull Request

Good pull requests, such as patches, improvements, and new features, are a fantastic help. They should remain focused in scope and avoid containing unrelated commits.

Please ask first if somebody else is already working on this or the core developers think your feature is in-scope for Create Social Network. Generally always have a related issue with discussions for whatever you are including.

## Folder Structure

create-social-network is a monorepo, meaning it is divided into independent sub-packages. Overview of directory structure:

```
api
frontend
lib
```

#### [api](https://github.com/dimimikadze/create-social-network/tree/master/api)

This package contains API for Create Social Network using Node, GraphQL and MongoDB.

#### [frontend](https://github.com/dimimikadze/create-social-network/tree/master/frontend)

Is a React frontend for Create Social Network.

#### [lib](https://github.com/dimimikadze/create-social-network/tree/master/lib)

This package includes Node.js command line script that is published to NPM as a `create-social-network` that helps users to install the app with one command.

## Development Workflow

1. Clone the repo with git clone `https://github.com/dimimikadze/create-social-network.git`
2. Run `yarn` in the root folder to install dependencies.
3. and then run `yarn start`

## Reporting an issue

Before submitting an issue you need to make sure:

- You have already searched for related [issues](https://github.com/dimimikadze/create-social-network/issues), and found none open (if you found a related closed issue, please link to it from your post).
- Your issue title is concise and on-topic.
- You can and do provide steps to reproduce your issue.
- Make sure the [issue template](https://github.com/dimimikadze/create-social-network/tree/master/.github/ISSUE_TEMPLATE) is respected.
- Make sure your issue body is readable and [well formated](https://guides.github.com/features/mastering-markdown/).
