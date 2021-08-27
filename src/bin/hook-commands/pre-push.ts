import { once } from 'lodash';

import { commitlintOrExit } from '../commitlint';
import { expectEnabled, getMode } from '../config';
import { getCurrentBranch, git } from '../git-utils';
const getRemoteBranch = once(async function getRemoteBranch() {
  const headRef = await git('symbolic-ref', '-q', 'HEAD');
  return git('for-each-ref', '--format=%(upstream:short)', headRef);
});

async function getRemote() {
  const remoteBranch = await getRemoteBranch();
  if (remoteBranch) return remoteBranch.slice(0, remoteBranch.indexOf('/'));
  const remotes = (await git('remote')).split(/\s+/);
  if (remotes.includes('origin')) return 'origin';
  if (remotes.length === 1) return remotes[0];
  throw new Error('cannot determine appropriate remote - please set upstream');
}

// Matches output from ls-remote like:
//
// $ git ls-remote --symref <url> HEAD
// ref: refs/heads/master  HEAD
// 6de4c9de8426252658f103e505e8f15ad710486c  HEAD
const extractRef = /^ref:[ \t]+refs\/heads\/(\S+)[ \t]+HEAD\n\S+[ \t]+HEAD$/;

async function getDefaultBranchFromRef(remote) {
  return git('symbolic-ref', '--short', `refs/remotes/${remote}/HEAD`);
}

async function getDefaultBranchFromRemote(remote) {
  const remoteUrl = await git('config', '--get', `remote.${remote}.url`);
  const headRefs = await git('ls-remote', '--symref', remoteUrl, 'HEAD');
  const match = extractRef.exec(headRefs);

  if (!match) {
    throw new Error('unable to interpret ls-remote output');
  }

  return match[1];
}

async function maybeGetDefaultBranchFromRemote(err, remote) {
  if (
    !err.exitCode ||
    typeof err.stderr !== 'string' ||
    !err.stderr.includes('not a symbolic ref')
  ) {
    throw err;
  }

  console.warn();
  console.warn('  please set the default branch for the repository:');
  console.warn(
    '  git symbolic-ref refs/remotes/origin/HEAD refs/heads/origin/\x1b[95m<default-branch>\x1b[m'
  );
  console.warn();
  return getDefaultBranchFromRemote(remote);
}

async function getDefaultBranch({ includeRemote = true } = {}) {
  const remote = await getRemote(),
    branch = await getDefaultBranchFromRef(remote).catch((err) =>
      maybeGetDefaultBranchFromRemote(err, remote)
    );
  return includeRemote ? branch : branch.slice(branch.indexOf('/') + 1);
}

export default {
  command: 'pre-push',
  description: 'Check the commits on the branch before pushing',

  async handler(): Promise<void> {
    if (!(await expectEnabled('pre-push'))) return;
    const mode: string | null = await getMode('pre-push');

    switch (mode) {
      case 'unpushed': {
        const [localBranch, remoteBranch] = await Promise.all([
          getCurrentBranch(),
          getRemoteBranch(),
        ]);

        if (remoteBranch) {
          // TODO: what if history has diverged?
          await commitlintOrExit('--from', remoteBranch, '--to', localBranch);
          break;
        }
      }

      // fallthrough
      case 'all': {
        const defaultBranch = await getDefaultBranch();
        await commitlintOrExit('--from', defaultBranch);
        break;
      }

      default:
        console.warn('  unknown pre-push mode');
        console.warn(
          '  check the pre_push_mode field in the git.hooks section of ~/.config/mixmax/config'
        );
        console.warn(`  valid values: "all", "unpushed" (got ${String(mode)})`);
        console.warn('');
        process.exit(1);
    }
  },
};
