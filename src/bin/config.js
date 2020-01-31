import fs from 'fs';
import { promisify } from 'util';
import * as toml from 'toml';
import _ from 'lodash';

const readFile = promisify(fs.readFile);

let config;

const keys: Map<string, string> = new Map([
  ['commit-msg', 'commit_msg'],
  ['pre-push', 'pre_push'],
]);

function getHookKey(hook) {
  const hookKey = keys.get(hook);
  if (!hookKey) {
    throw new Error('please configure hook key in config.js');
  }
  return hookKey;
}

export async function expectEnabled(hook: string) {
  if (!(await isEnabled(hook))) {
    if (process.stdin.isTTY) {
      console.warn('the commit-msg commit hook is not enabled');
      console.warn('please enable it in your ~/.config/mixmax/config file');
      console.warn('see https://github.com/mixmaxhq/git-hooks');
    }
    return false;
  }
  return true;
}

export async function isEnabled(hook: string): Promise<boolean> {
  if (config === undefined) await loadConfig();
  if (!config) return false;

  return !!_.get(config, getHookKey(hook), false);
}

export async function getMode(hook: string): Promise<string | null> {
  if (config === undefined) await loadConfig();
  if (!config) return null;

  const modeKey = `${getHookKey(hook)}_mode`;
  return _.get(config, modeKey, null);
}

async function loadConfig() {
  if (!process.env.HOME) {
    throw new Error('cannot locate home directory with $HOME');
  }

  const rawConfig = await readFile(`${process.env.HOME}/.config/mixmax/config`);
  config = _.get(toml.parse(rawConfig), 'git.hooks') || null;
}
