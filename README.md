# Mixmax's git hooks

This repository contains the git hooks for Mixmax's development workflow. We use `commitlint` to
reduce friction when using `semantic-release`, and desire to tighten the feedback cycle to further
reduce friction.

## Install

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
