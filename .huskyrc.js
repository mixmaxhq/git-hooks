module.exports = require('./').getHooks('node dist/bin');

// Husky explicitly greps for the hook itself to determine whether to run the hook. Here are all the
// hooks, to bypass this check:
//
// - applypatch-msg
// - post-applypatch
// - post-commit
// - post-receive
// - post-update
// - pre-auto-gc
// - pre-merge-commit
// - pre-push
// - pre-receive
// - sendemail-validate
// - commit-msg
// - post-checkout
// - post-merge
// - post-rewrite
// - pre-applypatch
// - pre-commit
// - prepare-commit-msg
// - pre-rebase
// - push-to-checkout
// - update
