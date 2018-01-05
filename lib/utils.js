function checkDomain(host, domain) {
  const hostReg = new RegExp(`^${host.replace(/\./g, '\\.').replace(/^\\./, '.*\\.')}$`);
  return hostReg.test(domain);
}

function checkPath(cpath, path) {
  return new RegExp(`^${cpath}.*`).test(path);
}

function isDate(v) {
  return (
    (v instanceof Date && !Number.isNaN(+v)) ||
    !Number.isNaN(+new Date(v))
  );
}

export {
  checkDomain,
  checkPath,
  isDate,
};

