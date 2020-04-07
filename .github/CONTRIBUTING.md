# @intlify/vue-i18n-loader Contributing Guide

- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)
- [Contributing Tests](#contributing-tests)
- [Financial Contribution](#financial-contribution)

## Issue Reporting Guidelines

- The issue list of this repo is **exclusively** for bug reports and feature requests. Non-conforming issues will be closed immediately.

- Try to search for your issue, it may have already been answered or even fixed in the master branch.

- Check if the issue is reproducible with the latest stable version of `intlify/vue-i18n-loader`. If you are using a pre-release, please indicate the specific version you are using.

- It is **required** that you clearly describe the steps necessary to reproduce the issue you are running into. Issues with no clear repro steps will not be triaged. If an issue labeled `Status: Need More Info` receives no further input from the issue author for more than 5 days, it will be closed.

- For bugs that involves build setups, you can create a reproduction repository with steps in the README.

- If your issue is resolved but still open, don’t hesitate to close it. In case you found a solution by yourself, it could be helpful to explain how you fixed it.

## Pull Request Guidelines

- Checkout a topic branch from the `v1.x` branch.

- It's OK to have multiple small commits as you work on the PR - we will let GitHub automatically squash it before merging.

- Make sure `npm test` passes. (see [development setup](#development-setup))

- If adding new feature:
  - Add accompanying test case.
  - Provide convincing reason to add this feature. Ideally you should open a suggestion issue first and have it greenlighted before working on it.

- If fixing a bug:
  - Provide detailed description of the bug in the PR.
  - Add appropriate test coverage if applicable.

### Work Step Example
- Fork the repository from [`intlify/vue-i18n-loader`](https://github.com/intlify/vue-i18n-loader) !
- Create your topic branch from `v1.x`: `git branch my-new-topic origin/master`
- Add codes and pass tests !
- Commit your changes: `git commit -am 'Add some topic'`
- Push to the branch: `git push origin my-new-topic`
- Submit a pull request to `v1.x` branch of `intlify/vue-i18n-loader` repository !

## Development Setup

You will need [Node.js](http://nodejs.org) **version 10+**, and [Yarn](https://yarnpkg.com/en/docs/install).

After cloning the repo, run:

```bash
$ yarn # install the dependencies of the project
```


A high level overview of tools used:

- [TypeScript](https://www.typescriptlang.org/) as the development language
- [Rollup](https://rollupjs.org) for bundling
- [Jest](https://jestjs.io/) for unit testing
- [Puppeteer](https://pptr.dev/) for e2e testing
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io/) for code formatting

## Scripts

### `yarn build`

The `build` script builds transpile to CommonJS module file.

### `yarn test`

The `yarn test` script simply calls the `jest` binary, so all [Jest CLI Options](https://jestjs.io/docs/en/cli) can be used. Some examples:

```bash
# run all tests
$ yarn test

# run unit tests
$ yarn test:unit

# run unit test coverages
$ yarn test:coverage

# run unit tests in watch mode
$ yarn test:watch

# run e2e tests
$ yarn test:e2e
```

## Contributing Tests

Unit tests are collocated with directories named `test`. Consult the [Jest docs](https://jestjs.io/docs/en/using-matchers) and existing test cases for how to write new test specs. Here are some additional guidelines:

Use the minimal API needed for a test case. For example, if a test can be written without involving the reactivity system ra component, it should be written so. This limits the test's exposure to changes in unrelated parts and makes it more stable.

## Financial Contribution

As a pure community-driven project without major corporate backing, we also welcome financial contributions via GitHub Sponsors and Patreon

- [Become a backer or sponsor on GitHub Sponsors](https://github.com/sponsors/kazupon)
- [Become a backer or sponsor on Patreon](https://www.patreon.com/evanyou)

Funds donated via GitHub Sponsors and Patreon go to support kazuya kawaguchi full-time work on Intlify.

## Credits

Thank you to all the people who have already contributed to Intlify project and my OSS work !
