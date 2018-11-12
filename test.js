var tape = require('tape')
var sinon = require('sinon')
var { URLSearchParams } = require('url')
// expose modules to global
global.URLSearchParams = URLSearchParams

var fetch = sinon.fake.resolves()
global.fetch = fetch

// require module
var rewrite = require('./rewrite')
var fresource = require('./')

var Users = fresource('/users/:id?sort=:orderBy')

tape('should rewrite path variables', t => {
  t.equal(rewrite('/users/:id?sort=:orderBy', { id: 1 }), '/users/1', 'rewrite')
  t.end()
})

tape('should remove unused variables', t => {
  t.equal(rewrite('/users/:id?sort=:orderBy'), '/users', 'rewrite w/o params')
  t.equal(rewrite('/users/:id?sort=:orderBy', {}), '/users', 'rewrite w/ params')
  t.end()
})

tape('should rewrite query params', t => {
  t.equal(rewrite('/users/:id?sort=:orderBy', { orderBy: 'name' }), '/users?sort=name', 'rewrite')
  t.end()
})

tape('should call fetch correctly', t => {
  Users.get()
  t.true(fetch.calledWithExactly('/users'), 'get request')

  var params = { name: 'Ismail' }
  Users.save(params)
  t.true(fetch.calledWithExactly('/users', { method: 'POST', body: JSON.stringify(params) }), 'post request')

  params = { name: 'Ismail', id: 1 }
  Users.update(params)
  t.true(fetch.calledWithExactly('/users/1', { method: 'PUT', body: JSON.stringify({ name: 'Ismail' }) }), 'put request')

  Users.delete({ id: 1 })
  t.true(fetch.calledWithExactly('/users/1', { method: 'DELETE' }), 'delete request')
  t.end()
})
