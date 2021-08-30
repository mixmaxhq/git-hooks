#!/usr/bin/env node
import _ from 'lodash';
import yargs from 'yargs';

import commit_msg from './hook-commands/commit-msg';
import pre_push from './hook-commands/pre-push';
type Command = {
  command: string;
  desc?: string;
  description?: string;
  builder?: (arg0: yargs.Argv<unknown>) => yargs.Argv<unknown>;
  handler: (...args: unknown[]) => unknown | Promise<unknown>;
};

const addCommands = (yargs: yargs.Argv<unknown>, commands: Command[]) =>
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
