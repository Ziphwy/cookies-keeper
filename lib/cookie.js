const utils = require('./utils');

function Cookie(name, value, attributes) {
  this.name = name;
  this.value = value;

  if (attributes.maxAge) {
    this.persistent = true;
    this.expiryTime = attributes.maxAge;
  } else if (attributes.expire) {
    this.persistent = true;
    this.expiryTime = attributes.expire;
  } else {
    this.persistent = false;
    this.expiryTime = 'session';
  }

  this.domain = attributes.domain ? attributes.domain : '';
}

function getKeyValue(keyValueStr) {
  const matches = keyValueStr.match(/([^=]*)(=(.*))?/);
  return {
    key: (matches[1] || '').trim(),
    value: (matches[3] || '').trim(),
  };
}

Cookie.parse = function parse(setCookieString) {
  const cookiePair = setCookieString.split(';');

  const nameValuePair = getKeyValue(cookiePair[0]);

  // If the name string is empty, or lacks a %x3D ("=") character, ignore entirely.
  if (nameValuePair.key === '' || nameValuePair.value === undefined) {
    return null;
  }

  const attributes = {};

  for (let i = 1; i < cookiePair.length; i++) {
    const pairObj = getKeyValue(cookiePair[i]);

    if (/^Expires$/i.test(pairObj.key) && utils.isDate(new Date(pairObj.value))) {
      attributes.expires = new Date(pairObj.value);
    } else if (/^Max-Age$/i.test(pairObj.key)) {
      attributes.maxAge = new Date(Date.now() + pairObj.value);
    } else if (/^Domain$/i.test(pairObj.key)) {
      if (pairObj.value === undefined) {
        return null;
      }
      attributes.domain = pairObj.value.replace(/^\./, '').toLowerCase();
    } else if (/^Path$/i.test(pairObj.key)) {
      if (pairObj.value === undefined || /^[^/]/.test(pairObj.value)) {
        attributes.path = '/';
      } else {
        attributes.path = pairObj.value;
      }
    } else if (/^Secure$/i.test(pairObj.key)) {
      attributes.secure = true;
    } else if (/^HttpOnly$/i.test(pairObj.key)) {
      attributes.httpOnly = true;
    }
  }

  return new Cookie(nameValuePair.key, nameValuePair.value, attributes);
};
