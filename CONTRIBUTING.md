# Contribution Guidelines

## Prerequisites

- [Node.js](https://nodejs.org/), at the exact version pinned in `.nvmrc`. It is the same version used by the CI and by the container builds (`Containerfile`), and Renovate keeps both up to date.
- [podman](https://podman.io/), only to build the library and the Storybook (see [Building the library](#building-the-library)).

### Node.js setup

The recommended way to get the right Node.js version is [nvm](https://github.com/nvm-sh/nvm):

1. Install nvm following its [installation instructions](https://github.com/nvm-sh/nvm#installing-and-updating), then open a new shell.
2. From the repository root, install the Node.js version pinned in `.nvmrc`:

   ```bash
   nvm install
   ```

   Without arguments, `nvm install` reads the version from `.nvmrc`, installs it and switches the current shell to it.

3. Check that the active version matches `.nvmrc`:

   ```bash
   node --version
   cat .nvmrc
   ```

`nvm` switches the version only in the current shell. In every new shell, run from the repository root:

```bash
nvm use
```

When `.nvmrc` changes (e.g. after pulling a Node.js update from Renovate), `nvm use` reports that the new version is not installed: run `nvm install` again. To switch version automatically when entering the repository, see nvm's [deeper shell integration](https://github.com/nvm-sh/nvm#deeper-shell-integration).

Use the npm version bundled with Node.js, don't upgrade it separately.

## Run a development environment

Install the dependencies:

```bash
npm ci
```

`npm ci` installs exactly the versions recorded in `package-lock.json`. Use `npm install` only to add or update a dependency.

Start Storybook:

```bash
npm run storybook
```

You'll find it served at http://localhost:6006. The UI will be hot-reloaded on any change.

### Playground

The playground is a lightweight Vite app (separate from Storybook) intended as a quick interactive testing ground for components. Use it to set up ad-hoc test scenarios, experiment with component configurations, and validate behavior. Unlike Storybook, features like `v-model` and other Vue instance features fully work in the playground.

To start it, run:

```bash
npm run playground
```

Edit `playground/App.vue` to add the components you want to test. The app will be hot-reloaded on any change.

## IDE support

[VS Code](https://code.visualstudio.com/) is the recommended IDE. When you open the repository, it suggests installing the recommended extensions listed in `.vscode/extensions.json`:

- [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## Quality Standards

### Code Style

Code style is enforced by [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/). You can run the linter with:

```bash
npm run lint
```

To check the formatting of the code:

```bash
npm run format
```

and to fix it:

```bash
npm run format-fix
```

During PRs the linter and the formatting check will be run automatically and report any error.

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

Releases are automated by [release-please](https://github.com/googleapis/release-please-action) in `.github/workflows/release-please.yml`: on every push to `main` it keeps a release PR up to date with

- Changelog
- Package version automatically bumped based off the commit messages

Once that PR is merged, release-please creates the GitHub release and tags the new version. The tag triggers `.github/workflows/release.yml`, which builds `dist` and publishes the package to NPM.

The publish job does not use any NPM token: it authenticates with [npm trusted publishing](https://docs.npmjs.com/trusted-publishers) through GitHub OIDC, which also attaches a provenance attestation to the published version. This requires the `id-token: write` permission on the job and npm >= 11.5.1 on the runner (provided by the Node version pinned in `.nvmrc`). The trusted publisher registered on npmjs.com points at the `release.yml` workflow filename, so renaming that file breaks publishing.

### Manual publishing

Manual publishing is a fallback only: it requires an NPM account with write access to the package, and the resulting version has no provenance attestation. You'll need to follow this procedure:

- write a changelog entry in `CHANGELOG.md`
- bump the version in `package.json` and `package-lock.json`
- build the library using the command provided in [Building the library](#building-the-library)

Finally, publish the library with:

```bash
npm publish
```