# Mixmax's git hooks

This repository contains the git hooks for Mixmax's development workflow. We use `commitlint` to
reduce friction when using `semantic-release`, and desire to tighten the feedback cycle to further
reduce friction.

## Install

Note that if you're in a `mixmaxhq` GitHub repository that uses `semantic-release`, these packages
should already be installed. You might need to `git pull` and `npm ci`, and if you're still not seeing hooks in `.git/hooks`, double-check that you're running a version `npm` >= 6.13.4.

```sh
$ npm i -D @mixmaxhq/git-hooks @commitlint/cli
```

## Configure

The git hooks are opt-in using the global mixmax configuration file `~/.config/mixmax/config`:

```toml
[git.hooks]
commit_msg = true # default: false
pre_push = true # default: false
# Valid values: "all", "unpushed"
pre_push_mode = "all" # required if pre_push is enabled
```

(The syntax here is [TOML](https://github.com/toml-lang/toml).)

### `commit_msg`

This flag determines whether commitlint will run on commit messages before the commit is created.

### `pre_push`

This flag determines whether commitlint will run on the commit messages being pushed to the remote repository. It has two modes (`pre_push_mode`): `all` and `unpushed`. The `all` option lists the commits on the current branch since it diverged from the default branch and lints all of them. The `unpushed` option lists the commits on the current branch that aren't on the remote's copy of the branch and lints all of them.

## How to use

Copy this to a `.huskyrc.js` file adjacent to the `.git` and `node_modules` directories of a
project:

```js
module.exports = require('@mixmaxhq/git-hooks');

// Husky explicitly greps for the hook itself to determine whether to run the hook. Here are the
// hooks, to bypass this check:
//
// - pre-push
// - commit-msg
```

## Building

`npm run build`

Outputs a commonjs-compatible bundle to `dist/index.js`.

## Running tests

`npm test`

## Publishing

Merging to master will automatically publish the package if commits with non-trivial changes have
been introduced (per [commit conventions](https://www.conventionalcommits.org)).
