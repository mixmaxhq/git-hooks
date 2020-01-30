const hookNames = ['commit-msg', 'pre-push'];

export function getHooks(bin: string) {
  const hooks = {};
  for (const hook of hookNames) {
    hooks[hook] = `${bin} ${hook}`;
  }
  return { hooks };
}

export const hooks = getHooks('mixmax-git-hooks');
