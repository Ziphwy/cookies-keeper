const utils = require('./utils');

function Cookie(name, value, attributes) {
  this.name = name;
  this.value = value;
}

// function parseAttribute(key, value) {
//   if (/Expires/i.test(key)) {
//     attributes.expires = value;
//   }

//   if (/Max-Age/i.test(key)) {
//     attributes.expires = value;
//   }

//   if (/Domain/i.test(key)) {
//     attributes.domain = value;
//   }

//   if (/Path/i.test(key)) {
//     attributes.path = value;
//   }

//   if (/Secure/i.test(key)) {
//     attributes.secure = true;
//   }

//   if (/HttpOnly/i.test(key)) {
//     attributes.httpOnly = true;
//   }
// }

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

  // If the name string is empty, ignore entirely.
  if (nameValuePair.name === '') {
    return null;
  }

  // if lacks a %x3D ("=") character, value will be undefined
  // so ignore entirely.
  if (nameValuePair.value === undefined) {
    return null;
  }

  const attributes = {};


  return new Cookie(nameValuePair.name, nameValuePair.value, attributes);
};
