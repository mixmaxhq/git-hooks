declare type Pojo = { [string]: mixed };

// Workaround for https://github.com/facebook/flow/pull/8275.
declare var require: {
  (id: string): any,
  resolve: (id: string, options?: { paths?: string[] }) => string,
  cache: any,
  main: typeof module,
  ...
};
