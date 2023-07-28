import { rewritePath } from './rewrite';

type Params = { [key: string]: string };

/**
 * fresource gives access to rest apis in an idiomatic way.
 * @param {String} path URL or path to the resource.
 * @param {Object} options Options to be passed to fetch.
 * @example
 * var freseource = require('fresource')
 * var Users = fresource('/api/users/:id')
 * Users.get()                   // will initiate a get request to `/api/users`
 * Users.get({ id: 1 })          // will initiate a get request to `/api/users/1`
 * Users.save({ name: 'Jason' }) // will post { name: 'Jason' } to `/api/users/`
 */
export function fresource(path: string, options: RequestInit = {}) {
  return {
    get(params?: Params | null, opts?: RequestInit) {
      return fetch(rewritePath(path, params), Object.assign({}, options, opts))
    },
    save(params?: Params | null, opts?: RequestInit) {
      return fetch(rewritePath(path, params), Object.assign({}, options, opts, { method: 'POST', body: JSON.stringify(params) }))
    },
    update(params?: Params | null, opts?: RequestInit) {
      return fetch(rewritePath(path, params), Object.assign({}, options, opts, { method: 'PUT', body: JSON.stringify(params) }))
    },
    delete(params?: Params | null, opts?: RequestInit) {
      return fetch(rewritePath(path, params), Object.assign({}, options, opts, { method: 'DELETE' }))
    }
  }
}
