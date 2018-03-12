/* eslint-disable prefer-rest-params, no-param-reassign */

// refer to https://www.rfc-editor.org/rfc/rfc6265.txt

/**
 * Domain Matching
 *   At least one of the following conditions hold:
 *   - The domain string and the string are identical.
 *   - All of the following conditions hold:
 *     1. The domain string is a suffix of the string.
 *     2. The last character of the string that is not included in the
 *        domain string is a %x2E (".") character.
 *     3. The string is a host name (i.e., not an IP address).
 *
 * @param {string} domainStr
 * @param {string} str
 * @returns
 */
function domainMatch(domainStr, str) {
  return new RegExp(`^${
    domainStr
      .replace(/\./g, '\\.')
      .replace(/^\\./, '([^.]\\w*\\.)*')
  }$`).test(str);
}


/**
 * Path Matching
 *   At least one of the following conditions holds:
 *   - The cookie-path and the request-path are identical.
 *   - The cookie-path is a prefix of the request-path, and the last
 *     character of the cookie-path is %x2F ("/").
 *   - The cookie-path is a prefix of the request-path, and the first
 *     character of the request-path that is not included in the cookie-path
 *     is a %x2F ("/") character.
 *
 * @param {string} cookiesPath
 * @param {string} requestPath
 * @returns
 */
function pathMatch(cookiesPath, requestPath) {
  return new RegExp(`^${
    cookiesPath.replace(/\/$/, '')
  }(/[^/]*)*$`).test(requestPath);
}


function isDate(v) {
  return (
    (v instanceof Date && !Number.isNaN(+v)) ||
    !Number.isNaN(+new Date(v))
  );
}


function isExpire(date) {
  return Date.now() > date;
}


function parseAttribute(attributes, attrName, attrValue) {
  switch (attrName.toLowerCase()) {
    case 'expires':
      if (isDate(attrValue)) attributes.expire = new Date(attrValue);
      break;

    case 'max-age':
      if (/^-?\d+/.test(attrValue)) {
        const delta = parseInt(attrValue, 10);
        attributes.maxAge = new Date(Date.now() + delta);
      }
      break;

    case 'domain':
      if (attrValue !== '') {
        attributes.domain = attrValue.replace(/^\./, '').toLowerCase();
      }
      break;

    case 'path':
      if (attrValue[0] === '/') {
        attributes.path = attrValue;
      } else {
        attributes.path = '/';
      }
      break;

    case 'secure':
      attributes.secure = true;
      break;

    case 'httpOnly':
      attributes.httpOnly = true;
      break;

    default:
  }
}


module.exports = {
  domainMatch,
  pathMatch,
  parseAttribute,
  isDate,
  isExpire,
  MIN_DATE: new Date(0),
  MAX_DATE: new Date(8640000000000000),
};

