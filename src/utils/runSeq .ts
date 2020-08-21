const runSeq = <T>(promises: (() => Promise<T>)[]) =>
  promises.reduce(
    (prev, curr) =>
      prev.then(result => curr().then(Array.prototype.concat.bind(result))),
    Promise.resolve([] as T[])
  );

export default runSeq