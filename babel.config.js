module.exports = {
  ...require('./babel.rollup.config.js'),
  plugins: ['@babel/plugin-transform-modules-commonjs'],
};
