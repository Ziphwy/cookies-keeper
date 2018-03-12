
const utils = require('./utils');
const crypto = require('crypto');

function Cookie(name, value, attributes, request) {
  this.id = crypto.createHash('md5').update(Math.random().toString()).digest('hex');
  this.name = name;
  this.value = value;
  this.creationTime = new Date();
  this.lastAccessTime = new Date();

  /* persistent & expriyTime */
  if (attributes.maxAge) {
    this.persistent = true;
    this.expiryTime = attributes.maxAge;
  } else if (attributes.expire) {
    this.persistent = true;
    this.expiryTime = attributes.expire;
  } else {
    this.persistent = false;
    this.expiryTime = utils.MAX_DATE;
  }

  /* domain & hostOnly */
  this.domain = attributes.domain ? attributes.domain : '';

  if (this.rejectPublicSuffix && this.matchPublicSuffix(this.domain)) {
    // if (true) {
    //   this.domain = '';
    // } else {
    //   return;
    // }
  }

  if (this.domain !== '') {
    if (utils.domainMatch(this.domain, request.host)) {
      this.hostOnly = false;
    } else {
      return;
    }
  } else {
    this.hostOnly = true;
    this.domain = request.host;
  }

  /* path */
  this.path = attributes.path ? attributes.path : '/';

  /* secure */
  this.secure = attributes.secure || false;

  /* httpOnly */
  this.httpOnly = attributes.httpOnly || false;
}

this.prototype = {
  domainMatch(host) {
    return utils.domainMatch(this.domain, host);
  },

  pathMatch(path) {
    return utils.pathMatch(this.path, path);
  },

  updateLastAccessTime() {
    this.lastAccessTime = new Date();
    return this.lastAccessTime;
  },

  toPairString() {
    return `${this.name}=${this.value}`;
  },

  isExpire() {
    return utils.isExpire(this.expiryTime);
  },
};

module.exports = Cookie;

