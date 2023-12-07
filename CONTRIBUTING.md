# Contribution Guidelines

## Prerequisites

The development is enclosed in a container, you'll only need [podman](https://podman.io/) to be installed. Everything will be run calling the `dev.sh` script, which will take care of building the container and providing a standardized environment for every need.

## Run a development environment

You can start Storybook:

```bash
./dev.sh
```

This will build the image (if not already built), install `node_modules` and run the UI in development mode. You'll find it served at http://localhost:6006. The UI will be hot-reloaded on any change.

### Accessing the container

To access the container's shell, run

```bash
./dev.sh bash
```

With `bash` you can replace any command you want to run inside the container, bash since it's an interactive command will keep the container open. The only special command is `build`, which will rebuild the container even if it already exists.

## IDE support

Due to the usage of podman, you need to configure the IDE to use `podman` instead of `docker` as container runtime.

Following instructions are for VSCode, which is the recommended IDE. You need to install the [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension and configure it to use `podman` as container runtime.

You can do this by going to `File > Preferences > Settings`, search `dev containers docker path` and type `podman` as `Docker path`.

This will provide the same environment as it's been called through `./dev.sh`.

## Quality Standards

### Code Style

Code style is enforced by [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/). You can run the linter with:

```bash
./dev.sh npm run lint
```

and to format the code:

```bash
./dev.sh npm run format
```

During PRs the linter will be run automatically and report any error.

### Commit messages

Commit messages MUST follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. During development on a branch you can avoid this format IF you plan to squash the commits before merging the PR, in this case the final commit message MUST follow the specification.

## Building the library

To ensure that the build is agnostic to the environment, it's run inside a container. You can build the components with:

```bash
./build.sh dist
```

the result will be put in the `dist` folder.

## Building the storybook

To build the storybook, run:

```bash
./build.sh storybook
```

the result will be put in the `storybook-static` folder, which can be served with any web server.

## Publishing the library

To publish the library, a GitHub action in provided in `.github/workflows/publish.yml`, when you're ready to publish, just manually trigger the action, this will open a PR with the following changes:

- Changelog
- Package version automatically bumped based off the commit messages

Once the PR is merged, the action will automatically generate the release, tag the new version and publish the package to NPM.

### Manual publishing

To publish the library manually, you'll need to have a NPM account with write access to the package. You'll need to follow this procedure:

- write a changelog entry in `CHANGELOG.md`
- bump the version in `package.json` and `package-lock.json`
- build the library using the command provided in [Building the library](#building-the-library)

Finally, publish the library with:

```bash
npm publish
```