import { rewritePath } from './rewrite';

type Params = { [key: string]: string };

/**
 * fresource gives access to rest apis in an idiomatic way.
 * @param {String} path URL or path to the resource.
 * @param {Object} options Options to be passed to fetch.
 * @example
 * var freseource = require('fresource')
 * var Users = fresource('/api/users/:id')
 * Users.get()                             // will initiate request: `GET /api/users`
 * Users.get({ id: 1 })                    // will initiate request: `GET /api/users/1`
 * Users.save({ name: 'Jason' })           // will initiate request: `POST { name: 'Jason' } /api/users/`
 * Users.update({ id: 1, name: 'Tyrell' }) // will initiate request: `PUT { name: 'Tyrell' } /api/users/1`
 * Users.delete({ id: 1 })                 // will initiate request: `DELETE /api/users/1`
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
