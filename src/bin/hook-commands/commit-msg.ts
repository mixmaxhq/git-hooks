import fs from 'fs';
import { promisify } from 'util';

import commitlint, { LintError } from '../commitlint';
import { expectEnabled } from '../config';
const readFile = promisify(fs.readFile);
export default {
  command: 'commit-msg',
  description: 'Check the commit message',

  async handler() {
    if (!(await expectEnabled('commit-msg'))) return;

    if (!process.env.HUSKY_GIT_PARAMS) {
      console.error('missing git parameter HUSKY_GIT_PARAMS');
      process.exit(1);
    }

    // The empty case (just newlines and comments) will be handled by git itself.
    // See https://github.com/conventional-changelog/commitlint/issues/615
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
