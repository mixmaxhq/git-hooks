// Shebang added in rollup.config.js.

import yargs from 'yargs';
import commit_msg from './hook-commands/commit-msg';
import pre_push from './hook-commands/pre-push';
import _ from 'lodash';

type Command = {
  command: string,
  desc?: string,
  description?: string,
  builder?: (yargs) => yargs,
  handler: (args: Pojo) => mixed | Promise<mixed>,
};

const addCommands = (yargs, commands: Command[]) =>
  commands.reduce(
    (yargs, cmd) =>
      yargs.command(
        cmd.command,
        cmd.desc || cmd.description,
        cmd.builder || _.identity,
        cmd.handler
      ),
    yargs
  );

addCommands(yargs.usage('usage: $0 <hook> [options]'), [commit_msg, pre_push])
  .demandCommand()
  .strict()
  .help().argv;
