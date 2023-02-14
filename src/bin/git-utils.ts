import execa from 'execa';
import * as semver from 'semver';
export const git = (...args: string[]): Promise<string> =>
  execa('git', args).then(({ stdout }) => stdout);

async function getGitVersion() {
  // This produces a string like "git version 2.25.0"
  const version = await git('version');
  return semver.coerce(version).version
}

export async function getCurrentBranch(): Promise<string> {
  if (semver.lt(await getGitVersion(), '2.22.0')) {
    throw new Error('please upgrade git to at least 2.22.0');
  }

  return git('branch', '--show-current');
}
