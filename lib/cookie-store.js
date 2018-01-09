/* eslint-disable prefer-rest-params, no-param-reassign */
const Cookie = require('./cookie');
const utils = require('./utils');

function CookieStore(options) {
  this._cookies = [];
  this.rejectPublicSuffix = true;
  this._publicSuffix = ['com', 'cn', 'com.cn', 'edu'];
  this._add = options.add;
  this._remove = options.remove;
}

CookieStore.prototype = {
  addPublicSuffix() {
    Object.keys(arguments).forEach((arg) => {
      if (this._publicSuffix.indexOf(arg) < 0) {
        this._publicSuffix.push(arg);
      }
    });
  },

  removePublicSuffix() {
    Object.keys(arguments).forEach((arg) => {
      if (this._publicSuffix.indexOf(arg) >= 0) {
        this._publicSuffix.splice(this._publicSuffix.indexOf(arg), 1);
      }
    });
  },

  matchPublicSuffix(domain) {
    this._publicSuffix.every(suffix => suffix !== domain);
  },

  match(cookie) {
    let i = this._cookies.length;
    while (i--) {
      if (
        this._cookies[i].name === cookie.name &&
        this._cookies[i].domain === cookie.domain &&
        this._cookies[i].path === cookie.path
      ) {
        return this._cookies[i];
      }
    }
    return null;
  },

  parseSetCookie(request, setCookieString) {
    /* parse name-value-pair */
    const index = setCookieString.indexOf(';');
    let nameValuePair = '';
    if (index < 0) {
      nameValuePair = setCookieString;
    } else {
      nameValuePair = setCookieString.slice(0, index);
    }

    const jndex = nameValuePair.indexOf('=');
    if (jndex < 0) {
      throw Error('name-value-pair lack of \x3d("-")');
    }

    const name = nameValuePair.slice(0, jndex).trim();
    const value = nameValuePair.slice(jndex + 1).trim();
    if (name === '') {
      throw Error('name can not be empty');
    }

    /* parse attribute-pair */
    const attributes = {};
    let unparsedAttrbutes = setCookieString.slice(index);

    while (unparsedAttrbutes === '') {
      let cookieAv;
      let attrName;
      let attrValue;

      unparsedAttrbutes = unparsedAttrbutes.replace(/^;/, '');

      const pos = unparsedAttrbutes.indexOf(';');
      if (pos < 0) {
        cookieAv = unparsedAttrbutes;
      } else {
        cookieAv = unparsedAttrbutes.slice(0, pos);
      }

      const kvSep = cookieAv.indexOf('=');
      if (kvSep < 0) {
        attrName = cookieAv;
        attrValue = '';
      } else {
        attrName = cookieAv.slice(0, kvSep).trim();
        attrValue = cookieAv.slice(kvSep + 1).trim();
      }

      /* recognize attribute */
      utils.parseAttribute(attributes, attrName, attrValue);

      unparsedAttrbutes = unparsedAttrbutes.slice(pos + 1);
    }

    this.save(request, {
      name,
      value,
      attributes,
    });
  },

  save(request, setSookie) {
    try {
      const cookie = new Cookie(setSookie.name, setSookie.value, setSookie.attributes, request);

      /* replace old cookie */
      const oldCookie = this.match(cookie);
      if (oldCookie) {
        if (oldCookie.httpOnly && request.protocal !== 'http:') {
          return false;
        }
        cookie.creationTime = oldCookie.creationTime;
        this.remove(oldCookie);
      }
      return this.add(cookie);
    } catch (e) {
      return false;
    }
  },

  add(cookie) {
    if (typeof this._add === 'function') {
      return this.add();
    }
    this._cookies.push(cookie);
    return true;
  },

  remove(cookie) {
    if (typeof this._remove === 'function') {
      return this._remove(cookie);
    }
    this._cookies.splice(this._cookies.indexOf(cookie), 1);
    return true;
  },

  checkExpire() {
    this._cookies = this._cookies.filter(cookie => !cookie.isExpire());
  },

  getCookieHeader(request) {
    this.checkExpire();
    const cookies = this._cookies.filter(cookie => (
      (
        cookie.hostOnly
          ? request.host === cookie.domain
          : cookie.domainMatch(request.host)
      ) &&
      cookie.pathMatch(request.path)
    ));

    cookies.forEach((cookie) => {
      cookie.updateLastAccessTime();
    });

    return cookies
      .sort((c1, c2) => c1.path.length < c2.path.length)
      .map(cookie => cookie.toPairString())
      .join(', ');
  },
};

module.exports = CookieStore;
