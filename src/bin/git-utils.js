import execa from 'execa';

export const git = (...args) => execa('git', args).then(({ stdout }) => stdout);
