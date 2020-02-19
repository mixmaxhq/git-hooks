import commitlint, { LintError } from '../commitlint';
import { expectEnabled } from '../config';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

export default {
  command: '$0',
  description: 'Check the commit message',
  async handler() {
    if (!(await expectEnabled('commit-msg'))) return;

    if (!process.env.HUSKY_GIT_PARAMS) {
      console.error('missing git parameter HUSKY_GIT_PARAMS');
      process.exit(1);
    }

    // This will be handled by git itself.
    if (/^(?:\n*#.*)*\n*$/.test(await readFile(process.env.HUSKY_GIT_PARAMS, 'utf-8'))) return;

    try {
      await commitlint('-E', 'HUSKY_GIT_PARAMS');
    } catch (err) {
      if (err instanceof LintError) {
        // Already written to the output.
        process.exit(1);
      }
      throw err;
    }
  },
};
