import { checkDomain, checkPath, isDate } from './utils';

export default class Cookie {
  constructor(host, cookie) {
    this._cookie = cookie || '';

    [this.name, this.value] = this._cookie.split(';')[0].split('=');

    this.domain = this._match('Domain') || host;
    this.path = this._match('Path') || '/';

    const maxAge = this._match('Max-Age');
    if (/\d+/.test((maxAge))) {
      this.expires = Date.now() + Number(maxAge);
    } else {
      this.expires = this._match('Expires') || 'Session';
    }

    this.secure = /Secure/.test(this._cookie);
    this.httpOnly = /HttpOnly/.test(this._cookie);
  }

  _match(key) {
    const reg = new RegExp(`${key}=([^;]*)`);
    const m = this._cookie.match(reg);
    if (m) {
      return m[1];
    }
    return null;
  }

  isExpires() {
    if (this.expires === 'Session') {
      return false;
    }
    return isDate(this.expires) && Date.now() > new Date(this.expires);
  }

  replace(cookie) {
    if (cookie instanceof Cookie) {
      const diff = [];
      ['name', 'value', 'domain', 'path', 'expires', 'secure', 'httpOnly'].forEach((k) => {
        if (this[k] !== cookie[k]) {
          diff.push(k);
        }
      });

      if (diff.length === 1 && diff[0] !== 'name') {
        this[diff[0]] = cookie[diff[0]];
        return true;
      }
    }
    return false;
  }

  isMatchDomainPath(host, path) {
    return checkDomain(this.domain, host) && checkPath(this.path, path);
  }

  getEntity() {
    return `${this.name}=${this.value}`;
  }
}
