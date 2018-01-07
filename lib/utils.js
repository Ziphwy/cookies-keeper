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
  if (/^.?com$/.test(domainStr)) {
    return false;
  }
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
  return new RegExp(`^${cookiesPath.replace(/\/$/, '')}(/[^/]*)*$`).test(requestPath);
}


function isDate(v) {
  return (
    (v instanceof Date && !Number.isNaN(+v)) ||
    !Number.isNaN(+new Date(v))
  );
}


module.exports = {
  domainMatch,
  pathMatch,
  isDate,
};

