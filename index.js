const rewritePath = require('./rewrite')
const { fetch } = global

module.exports = fresource

/**
 * fresource gives access to rest apis in an idiomatic way.
 * @param {String} path URL or path to the resource.
 * @param {Object} options Options to be passed to fetch.
 * @returns {Object} resource
 * @example
 * var freseource = require('fresource')
 * var Users = fresource('/api/users/:id')
 * Users.get()                             // will initiate request: `GET /api/users`
 * Users.get({ id: 1 })                    // will initiate request: `GET /api/users/1`
 * Users.save({ name: 'Jason' })           // will initiate request: `POST { name: 'Jason' } /api/users/`
 * Users.update({ id: 1, name: 'Tyrell' }) // will initiate request: `PUT { name: 'Tyrell' } /api/users/1`
 * Users.delete({ id: 1 })                 // will initiate request: `DELETE /api/users/1`
 */
function fresource (path, options) {
  return {
    get (params, opts) {
      return fetch(rewritePath(path, params), Object.assign({}, options, opts))
    },
    save (params, opts) {
      return fetch(rewritePath(path, params), Object.assign({}, options, opts, { method: 'POST', body: JSON.stringify(params) }))
    },
    update (params, opts) {
      return fetch(rewritePath(path, params), Object.assign({}, options, opts, { method: 'PUT', body: JSON.stringify(params) }))
    },
    delete (params, opts) {
      return fetch(rewritePath(path, params), Object.assign({}, options, opts, { method: 'DELETE' }))
    }
  }
}
