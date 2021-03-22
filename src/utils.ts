const cloneObject = function (obj: unknown): unknown {
  return JSON.parse(JSON.stringify(obj));
};

export { cloneObject };
