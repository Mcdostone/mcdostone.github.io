/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-case-declarations */
import { LitElement, html } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { customElement, state } from 'lit/decorators.js'
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js'
import { parse } from 'tldts'

enum CookieAttributeKind {
  Domain = 'Domain',
  Path = 'Path',
  Expires = 'Expires',
  MaxAge = 'Max-Age',
  SameSite = 'SameSite',
  Secure = 'Secure',
  HttpOnly = 'HttpOnly',
}

class Domain {
  includeSubdomains: boolean

  constructor(readonly value) {
    this.includeSubdomains = false
  }

  withSubdomains(v: boolean) {
    this.includeSubdomains = v
    return this
  }

  toString() {
    return this.value === undefined ? '' : `${this.includeSubdomains ? '.' : ''}${this.value}`
  }
}

enum SameSite {
  Empty = '',
  Strict = 'Strict',
  Lax = 'Lax',
  None = 'None',
}

enum CookiePersistance {
  Permanent = 'permanent',
  Session = 'session',
}

class Cookie {
  name: string
  value: string
  domain: CookieAttribute<Domain>
  path: CookieAttribute<string | undefined>
  expires: CookieAttribute<Date | undefined>
  maxAge: CookieAttribute<number | undefined>
  secure: CookieAttribute<boolean>
  httpOnly: CookieAttribute<boolean>
  sameSite: CookieAttribute<SameSite | undefined>

  public constructor(name: string, value: string) {
    this.name = name
    this.value = value
    this.domain = new CookieAttribute(CookieAttributeKind.Domain, new Domain(''))
    this.path = new CookieAttribute(CookieAttributeKind.Path, undefined)
    this.expires = new CookieAttribute(CookieAttributeKind.Expires, undefined)
    this.sameSite = new CookieAttribute(CookieAttributeKind.SameSite, undefined)
    this.maxAge = new CookieAttribute(CookieAttributeKind.MaxAge, undefined)
    this.httpOnly = new CookieAttribute(CookieAttributeKind.HttpOnly, false)
    this.secure = new CookieAttribute(CookieAttributeKind.Secure, false)
  }

  get persistance(): CookiePersistance {
    if (this.expires.value === undefined && this.maxAge.value === undefined) {
      return CookiePersistance.Session
    }
    return CookiePersistance.Permanent
  }

  get HostCookiePrefix() {
    return this.name.startsWith('__Host-')
  }

  get SecureCookiePrefix() {
    return this.name.startsWith('__Secure-')
  }

  browserCookie(currentUrl: string): Cookie {
    const cookie = new Cookie(this.name, this.value)
    const url = new URL(currentUrl)
    cookie.domain.value = this.domain.value.value === undefined ? new Domain(`${url.hostname}`) : new Domain(`${this.domain.value}`).withSubdomains(true)
    cookie.path.value = this.path.value
    if (this.path.value === undefined) {
      cookie.path.value = url.pathname === '/' ? '/' : url.pathname.replace(/\/?$/, '')
    }
    cookie.sameSite.value = this.sameSite.value || SameSite.Lax
    cookie.expires = this.expires
    cookie.maxAge = this.maxAge
    cookie.httpOnly.value = this.httpOnly.value
    cookie.secure.value = this.secure.value
    return cookie
  }

  lifetime() {
    if (this.maxAge.value !== undefined && this.maxAge.value !== undefined) {
      return this.maxAge
    }
    return this.maxAge.value !== undefined ? this.maxAge : this.expires
  }

  toString() {
    const attributes = [this.domain, this.path, this.lifetime(), this.httpOnly, this.secure, this.sameSite]
    return [`${this.name}=${this.value}`, ...attributes.map((a) => a.toString()).filter((a) => a !== '')].join('; ')
  }
}

enum TypeRequest {
  Image,
  Link,
}

class CookieAttribute<T> {
  constructor(public attribute: CookieAttributeKind, public value: T) {}

  toString() {
    switch (this.attribute) {
      case CookieAttributeKind.Domain:
        const domain = this.value as unknown as Domain
        return domain.value ? `${this.attribute}=${domain.toString()}` : ''
      case CookieAttributeKind.Expires:
        const date = this.value as unknown as Date
        return date ? `${this.attribute}=${date.toUTCString()}` : ''
      case CookieAttributeKind.Path:
      case CookieAttributeKind.MaxAge:
      case CookieAttributeKind.SameSite:
        return this.value !== undefined ? `${this.attribute}=${this.value}` : ''
      case CookieAttributeKind.Secure:
      case CookieAttributeKind.HttpOnly:
        return this.value ? this.attribute : ''
    }
  }

  setValue(value: T): CookieAttribute<T> {
    this.value = value
    return this
  }
}

interface InputChangedEvent<T extends EventTarget> extends Event {
  target: T
}

@customElement('my-cookies')
export class Tt extends LitElement {
  @state()
  origin: string
  @state()
  url: string
  @state()
  cookie: Cookie
  urlsToTests = []

  constructor() {
    super()

    const u = new URL(window.location.toString())
    u.search = ''
    u.pathname = ''
    this.origin = u.toString()
    this.url = u.toString()
    this.cookie = new Cookie('my-cookie', 'my-value')
    this.cookie.domain.value = new Domain(undefined)
    this.cookie.path.value = '/'
    this.cookie.expires.value = undefined
    this.cookie.sameSite.value = undefined
    this.cookie.maxAge.value = undefined
    this.cookie.httpOnly.value = false
    this.cookie.secure.value = false
    this.setLifetime = this.setLifetime.bind(this)
  }

  setName(name: string) {
    this.cookie.name = name
    this.requestUpdate()
  }

  setValue(value: string) {
    this.cookie.value = value
    this.requestUpdate()
  }

  setCookieAttribute<T>(attribute: CookieAttribute<T>, value: T) {
    attribute.value = value
    this.requestUpdate()
  }

  setLifetime(event: InputChangedEvent<HTMLInputElement>) {
    if (event.target === this.querySelector('#expires')) {
      this.cookie.expires.value = event.target.value === '' ? undefined : event.target.valueAsDate || undefined
    } else {
      this.cookie.maxAge.value = Number.isNaN(event.target.valueAsNumber) ? undefined : event.target.valueAsNumber
    }
    this.requestUpdate()
  }

  checkUrl(expected: string, defaultUrl: string) {
    try {
      return new URL(expected).toString()
      // eslint-disable-next-line no-empty
    } catch {}
    return defaultUrl
  }

  connectedCallback(): void {
    super.connectedCallback()
    const urlSearchParameters = new URLSearchParams(window.location.search)
    if (urlSearchParameters.has('origin')) {
      this.origin = this.checkUrl(urlSearchParameters.get('origin')!, this.origin)
    }
    if (urlSearchParameters.has('url')) {
      this.url = this.checkUrl(urlSearchParameters.get('url')!, this.url)
    }
    if (urlSearchParameters.has('cookie')) {
      this.cookie.expires.value = undefined
      this.cookie.path.value = undefined
      this.cookie.domain.value = new Domain('')
      this.cookie.sameSite.value = undefined
      const parts = urlSearchParameters.get('cookie')?.split(';')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const part of parts!) {
        let [key, value] = part.split('=')
        key = key.trim()
        value = value.trim()
        switch (key.toLocaleLowerCase()) {
          case CookieAttributeKind.Domain.toLocaleLowerCase():
            this.cookie.domain.value = new Domain(value)
            break
          case CookieAttributeKind.Path.toLocaleLowerCase():
            this.cookie.path.value = value
            break
          case CookieAttributeKind.Expires.toLocaleLowerCase():
            this.cookie.expires.value = new Date(value)
            break
          case CookieAttributeKind.MaxAge.toLocaleLowerCase():
            this.cookie.maxAge.value = Number(value)
            break
          case CookieAttributeKind.SameSite.toLocaleLowerCase():
            this.cookie.sameSite.value = value as SameSite
            break
          default:
            this.cookie.name = key
            this.cookie.value = value
        }
      }
    }
  }

  createRenderRoot() {
    return this
  }

  CookieHeader() {
    return `Set-Cookie: ${this.cookie.toString()}`
  }

  CookieInBrowser() {
    return `document.cookie = "${this.cookie.browserCookie(this.origin).toString()}"`
  }

  getStories() {
    const cookie = this.cookie.browserCookie(this.origin)
    let url = new URL(this.url || this.origin)
    url.pathname = '/'
    url = new URL(this.url)
    url.hostname = `subdomain.${url.hostname}`
    const withSubdomain = url.toString()
    url = new URL(this.origin)
    url.pathname = '/cookie.png'
    const image = url.toString()
    url = new URL(this.origin)
    url.pathname = '/cookie.html'
    const link = url.toString()
    const requests = [
      { src: this.origin, dest: this.url, description: '', result: undefined },
      { src: this.origin, dest: withSubdomain, description: '', result: undefined },
      { src: this.url, dest: image, description: `${this.url}<br />GET ${image}`, type: TypeRequest.Image },

      { src: this.url, dest: link, description: `${this.url}<br />Click on ${link}`, type: TypeRequest.Link },
    ]
    return requests.map(({ src, dest, description, type }) => {
      const { ok, ...extra } = check(new URL(src || this.origin), new URL(dest), cookie, type)
      return html`
        <div class="story request ${classMap({ sent: ok, rejected: !ok })}">
          <div>
            <span class="cookie-icon browser">${Math.random() < 0.5 ? '👨‍💻' : '👩‍💻'}</span>
            <p>${description ? unsafeHTML(description) : src}</p>
          </div>
          <div>
            <span class="cookie-icon cookie">${ok ? '🍪' : '⛔'}</span>
            <p>${extra.error}</p>
          </div>
          <div>
            <span class="cookie-icon website">🌐</span>
            <p>${dest}</p>
          </div>
        </div>
      `
    })
  }

  render() {
    return html`
      <form>
        <fieldset>
          <label for="name">Name</label>
          <input type="text" required id="name" name="name" .value="${this.cookie.name}" @input=${(event: InputChangedEvent<HTMLInputElement>) =>
      this.setName(event.target.value)}><br>
        </fieldset>
        <fieldset>
          <label for="value">Value</label>
          <input type="text" required id="value" name="value" @input=${(event: InputChangedEvent<HTMLInputElement>) =>
            this.setValue(event.target.value)} .value="${this.cookie.value}"><br>
        </fieldset>
        <fieldset>
          <label for="domain">Domain</label>
          <input type="text" id="domain" name="domain" @input=${(event: InputChangedEvent<HTMLInputElement>) =>
            this.setCookieAttribute(this.cookie.domain, new Domain(event.target.value || undefined))} .value="${this.cookie.domain.value.value || ''}">
        </fieldset>
        <fieldset>
          <label for="path">Path</label>
          <input type="text" id="path" name="path" @input=${(event: InputChangedEvent<HTMLInputElement>) =>
            this.setCookieAttribute(this.cookie.path, event.target.value || undefined)} .value="${this.cookie.path.value || ''}">
        </fieldset>
        <fieldset>
          <label for="expires">Expires</label>
          <input id="expires" name="expire" @input=${this.setLifetime} type="datetime-local"
            .value="${this.cookie.expires.value === undefined ? '' : this.cookie.expires.value.toISOString().split('.')[0]}">
        </fieldset>
        <fieldset>
          <label for="max-age">Max-Age</label>
          <input type="number" id="max-age" @input=${this.setLifetime} name="max-age"
            .value="${this.cookie.maxAge.value?.toString() ?? ''}">
        </fieldset>
        </fieldset>
        <fieldset>
          <label for="sameSite">SameSite</label>
          <select name="sameSite" id="sameSite" @input=${(event: InputChangedEvent<HTMLInputElement>) =>
            this.setCookieAttribute(this.cookie.sameSite, (event.target.value as SameSite) || undefined)}>
            ${Object.values(SameSite).map((value) => html` <option .selected=${value === this.cookie.sameSite.value} value="${value}">${value}</option> `)}
          </select>
        </fieldset>
        <fieldset>
          <label for="http-only">HTTPOnly</label>
          <input type="checkbox" id="http-only" name="httpOnly" @input=${() => this.setCookieAttribute(this.cookie.httpOnly, !this.cookie.httpOnly.value)}
          .checked="${this.cookie.httpOnly.value || false}">
          <label for="http-only">Enable to prevent access to cookie values via JavaScript.</label>
          <label for="secure">Secure</label>
          <input type="checkbox" id="secure" name="secure" @input=${() => this.setCookieAttribute(this.cookie.secure, !this.cookie.secure.value)}
          .checked="${this.cookie.secure.value || false}">
          <label for="secure">Enable to only be transmitted over secure protocol as HTTPS.</label>
        </fieldset>
        <div>
        </div>
      </form>

      <div class="stories">
        <fieldset>
          <label for="origin">Current URL</label>
          <input type="url" required id="origin" name="origin" .value="${this.origin}" @input=${(event: InputChangedEvent<HTMLInputElement>) =>
      (this.origin = event.target.value)}><br>
        </fieldset>
        <fieldset>
          <label for="url">Request URL</label>
          <input type="url" required id="url" name="url" .value="${this.url}" @input=${(event: InputChangedEvent<HTMLInputElement>) =>
      (this.url = event.target.value)}><br>
        </fieldset>

        <h2>Initial state</h2>
        <div class="story initial">
            <div>
              <span class="cookie-icon browser">${Math.random() < 0.5 ? '👨‍💻' : '👩‍💻'}</span>
              <p>${this.origin}<br />${this.CookieInBrowser()}</p>
            </div>

            <div>
              <span class="cookie-icon website">🌐</span>
              <p>${this.CookieHeader()}</p>
            </div>
          </div>
        <h2>Stories</h2>
        ${this.getStories()}
      </div>
    `
  }
}

type Result<T> = { ok: true; value: T; error: undefined } | { ok: false; value: undefined; error: string }
const Ok = <T>(data: T): Result<T> => {
  return { ok: true, value: data, error: undefined }
}

const Error_ = <E>(error: string): Result<never> => {
  return { ok: false, value: undefined, error }
}

const checkers = [checkSecure, checkPrefix, checkExpires, checkMaxAge, checkDomain, checkPath, checkSameSite]

function check(origin: URL, request: URL, cookie: Cookie, r: TypeRequest | undefined): Result<boolean> {
  for (const checker of checkers) {
    const result = checker(origin, request, cookie, r)
    if (!result.ok) {
      return result
    }
  }
  return Ok(true)
}

function checkPath(origin: URL, request: URL, cookie: Cookie, type: TypeRequest | undefined): Result<boolean> {
  if (request.pathname.startsWith(cookie.path.value || '')) {
    return Ok(true)
  }
  return Error_(`The path doesn't start with ${cookie.path.value}`)
}

function checkPrefix(origin: URL, request: URL, cookie: Cookie, type: TypeRequest | undefined): Result<boolean> {
  if (cookie.HostCookiePrefix) {
    if (!cookie.secure.value) {
      return Error_(`Prefix __Host requires 'Secure'`)
    }
    if (cookie.domain.value.includeSubdomains) {
      return Error_(`Only accessible by the same domain with the prefix __Host`)
    }
    if (cookie.path.value !== undefined && cookie.path.value !== '/') {
      return Error_(`__Host prefix must have path set to /`)
    }
  }
  if (cookie.SecureCookiePrefix) {
    return cookie.secure.value ? Ok(true) : Error_(`Prefix __Secure requires 'Secure'`)
  }
  return Ok(true)
}

function checkSameSite(origin: URL, request: URL, cookie: Cookie, type: TypeRequest | undefined): Result<boolean> {
  switch (cookie.sameSite.value) {
    case SameSite.Strict:
      return checkDomain(origin, request, cookie, type)
    case SameSite.Lax:
      const data1 = parse(origin.toString(), { allowPrivateDomains: true })
      const data2 = parse(request.toString(), { allowPrivateDomains: true })
      const sameDomain = data1.domain === data2.domain
      if (type !== undefined) {
        switch (type) {
          case TypeRequest.Image:
            return sameDomain ? Ok(true) : Error_('Cross-site image')
          case TypeRequest.Link:
            return Ok(true)
        }
      }
      return sameDomain ? Ok(true) : Error_('SameSite=Lax: cross-site subrequest')
    case SameSite.None:
      return cookie.secure.value ? Ok(true) : Error_("SameSite=None requires 'Secure'")
    default:
      return Error_('no lo sé')
  }
}

function checkMaxAge(origin: URL, request: URL, cookie: Cookie, type: TypeRequest | undefined): Result<boolean> {
  if (cookie.maxAge.value === undefined) {
    return Ok(true)
  }
  return cookie.maxAge.value >= 1 ? Ok(true) : Error_('Cookie has expired')
}

function checkExpires(_origin: URL, request: URL, cookie: Cookie, type: TypeRequest | undefined): Result<boolean> {
  if (cookie.expires.value === undefined) {
    return Ok(true)
  }
  return cookie.expires.value.getTime() >= Date.now() ? Ok(true) : Error_('Cookie has expired')
}

function checkDomain(origin: URL, request: URL, cookie: Cookie, type: TypeRequest | undefined): Result<boolean> {
  if (cookie.domain.value.includeSubdomains) {
    return request.hostname.endsWith(cookie.domain.value.value) ? Ok(true) : Error_('Domain is different')
  }
  return request.hostname === cookie.domain.value.value ? Ok(true) : Error_(`Only domain ${cookie.domain.value.value} is accepted`)
}

function checkSecure(origin: URL, request: URL, cookie: Cookie, type: TypeRequest | undefined): Result<boolean> {
  return !(cookie.secure.value === true && request.protocol !== 'https:') ? Ok(true) : Error_("Secure requires 'https:'")
}
