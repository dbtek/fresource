var rewritePath = require('./rewrite')
var { fetch } = global

module.exports = fresource

/**
 * fresource gives access to rest apis in an idiomatic way.
 * @param {String} path URL or path to the resource.
 * @param {Object} options Options to be passed to fetch.
 * @returns {Object} resource
 * @example
 * var freseource = require('fresource')
 * var Users = fresource('/api/users/:id')
 * Users.get()                   // will initiate a get request to `/api/users`
 * Users.get({ id: 1 })          // will initiate a get request to `/api/users/1`
 * Users.save({ name: 'Jason' }) // will post { name: 'Jason' } to `/api/users/`
 */
function fresource (path, options) {
  return {
    get (params, opts) {
      return fetch(rewritePath(path, params), { ...options, ...opts })
    },
    save (params, opts) {
      return fetch(rewritePath(path, params), { ...options, ...opts, method: 'POST', body: JSON.stringify(params) })
    },
    update (params, opts) {
      return fetch(rewritePath(path, params), { ...options, ...opts, method: 'PUT', body: JSON.stringify(params) })
    },
    delete (params, opts) {
      return fetch(rewritePath(path, params), { ...options, ...opts, method: 'DELETE' })
    }
  }
}
