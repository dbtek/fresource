var tape = require('tape')
var sinon = require('sinon')
var { URLSearchParams } = require('url')
// expose modules to global
global.URLSearchParams = URLSearchParams

var fetch = sinon.fake()
global.fetch = fetch

// require module
var rewrite = require('./rewrite')
var fresource = require('./')

var path = '/users/:id?sort=:orderBy'
var Users = fresource(path)

tape('should rewrite path variables', t => {  
  var result = '/users/1'
  t.equal(rewrite(path, { id: 1 }), result, 'rewrite')
  t.end()
})

tape('should remove unused variables', t => {  
  var result = '/users'
  t.equal(rewrite(path), result, 'rewrite w/o params')
  t.equal(rewrite(path, {}), result, 'rewrite w/ params')
  t.end()
})

tape('should rewrite query params', t => {  
  var result = '/users?sort=name'
  t.equal(rewrite(path, { orderBy: 'name' }), result, 'rewrite')
  t.end()
})

tape('should call fetch correctly', t => {
  Users.get()
  t.true(fetch.calledWithMatch('/users'), 'get request')
  
  var params = { name: 'Ismail' }
  Users.save(params)
  t.true(fetch.calledWithMatch('/users', { method: 'POST', body: JSON.stringify(params) }), 'post request')
  
  var params = { name: 'Ismail', id: 1 }
  Users.update(params)
  t.true(fetch.calledWithMatch('/users/1', { method: 'PUT', body: JSON.stringify({ name: 'Ismail' }) }), 'put request')

  Users.delete({ id: 1 })
  t.true(fetch.calledWithMatch('/users/1', { method: 'DELETE' }), 'delete request')
  t.end()
})
