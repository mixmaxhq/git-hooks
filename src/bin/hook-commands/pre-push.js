import { commitlintOrExit } from '../commitlint';
import { expectEnabled, getMode } from '../config';
import { once } from 'lodash';
import { git } from '../git-utils';

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

async function getDefaultBranch({ remote = true } = {}) {
  const branch = await git('symbolic-ref', '--short', `refs/remotes/${await getRemote()}/HEAD`);
  return remote ? branch : branch.slice(branch.indexOf('/') + 1);
}

export default {
  command: 'pre-push',
  description: 'Check the commits on the branch before pushing',
  async handler() {
    if (!(await expectEnabled('pre-push'))) return;

    const mode: string | null = await getMode('pre-push');
    switch (mode) {
      case 'unpushed': {
        const [localBranch, remoteBranch] = await Promise.all([
          git('branch', '--show-current'),
          getRemoteBranch(),
        ]);

        if (remoteBranch) {
          // TODO: what if history has diverged?
          await commitlintOrExit('--from', remoteBranch, '--to', localBranch);
          break;
        }
      } // fallthrough

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
