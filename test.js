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

tape('should rewrite inline variables', t => {
  t.equal(rewrite('/users/user:id', { id: 1 }), '/users/user1', 'rewrite')
  t.end()
})

tape('should not rewrite without keys', t => {
  t.equal(rewrite('https://test/users', { }), 'https://test/users', 'rewrite')
  t.end()
})

tape('should not rewrite with port', t => {
  t.equal(rewrite('http://test:3030/users', { }), 'http://test:3030/users', 'rewrite')
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

tape('should work without query params', t => {
  var path = '/books/:id'
  var Books = fresource(path)
  Books.get()
  t.true(fetch.calledWithExactly('/books'), 'get request')
  t.end()
})

tape('should work without any variable', t => {
  var path = '/books'
  var Books = fresource(path)
  Books.get()
  t.true(fetch.lastCall.lastArg === '/books', 'get request')
  t.end()
})
