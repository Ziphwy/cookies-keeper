import Cookie from './cookie';
import { checkDomain } from './utils';

export default class CookiesKeeper {
  constructor() {
    this._cookies = [];
  }

  _tryReplace(cookie) {
    for (let i = 0; i < this._cookies.length; i++) {
      if (this._cookies[i].replace(cookie)) {
        return;
      }
    }
    this._cookies.push(cookie);
  }

  saveCookies({ hostname }, cookies = []) {
    cookies.map(c => new Cookie(hostname, c)).forEach((newCookie) => {
      if (checkDomain(newCookie.domain, hostname)) {
        this._tryReplace(newCookie);
      }
    });
  }

  getCookies({ hostname, path }) {
    return this._cookies
      .filter(c => !c.isExpires() && c.isMatchDomainPath(hostname, path))
      .sort((a, b) => b.path.length - a.path.length)
      .map(c => c.getEntity());
  }
}

