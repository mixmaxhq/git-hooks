import execa from 'execa';
export class LintError extends Error {
  constructor() {
    super('Check the commit');
  }
}

export default async function commitlint(...args: string[]): Promise<void> {
  let cliImportPath;

  try {
    cliImportPath = require.resolve('@commitlint/cli', {
      paths: [process.cwd()],
    });
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      throw new Error('@commitlint/cli was not found in the working directory');
    }

    throw err;
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cliPath = require(cliImportPath);

  try {
    await execa.node(cliPath, args, {
      stdio: 'inherit',
    });
  } catch (err) {
    if (err.exitCode !== 1) {
      throw err;
    }

    console.error('check \x1b[95m.git/COMMIT_EDITMSG\x1b[m to recover your commit message\n');
    throw new LintError();
  }
}

export async function commitlintOrExit(...args: string[]): Promise<void> {
  return commitlint(...args).catch((err) => {
    if (err instanceof LintError) {
      process.exit(1);
    }

    throw err;
  });
}
