const tape = require('tape')
const sinon = require('sinon')
const { URLSearchParams } = require('url')
// expose modules to global
global.URLSearchParams = URLSearchParams

const fetch = sinon.fake.resolves()
global.fetch = fetch

// require module
const fresource = require('./')

const Users = fresource('/users/:id?sort=:orderBy')

tape('should call fetch correctly', t => {
  Users.get()
  t.true(fetch.calledWithExactly('/users', {}), 'get request')

  let params = { name: 'Ismail' }
  Users.save(params)
  t.true(fetch.calledWithExactly('/users', { method: 'POST', body: JSON.stringify(params) }), 'post request')

  params = { name: 'Ismail', id: 1 }
  Users.update(params)
  t.true(fetch.calledWithExactly('/users/1', { method: 'PUT', body: JSON.stringify(params) }), 'put request')

  Users.delete({ id: 1 })
  t.true(fetch.calledWithExactly('/users/1', { method: 'DELETE' }), 'delete request')
  t.end()
})

tape('should work without query params', t => {
  const path = '/books/:id'
  const Books = fresource(path)
  Books.get()
  t.true(fetch.calledWithExactly('/books', {}), 'get request')
  t.end()
})

tape('should work without any variable', t => {
  const path = '/books'
  const Books = fresource(path)
  Books.get()
  t.equal(fetch.lastCall.args[0], '/books', 'get request')
  t.end()
})

tape('should work with custom headers', t => {
  const path = '/books'
  const options = { headers: { authorization: 'bearer secret' } }
  const Books = fresource(path, options)
  Books.get()
  t.equal(JSON.stringify(fetch.lastCall.lastArg), JSON.stringify(options), 'Expect headers to be present')

  const Notes = fresource('/notes')
  Notes.get(null, options)
  t.equal(JSON.stringify(fetch.lastCall.lastArg), JSON.stringify(options), 'Expect to work with headers on method arguments')
  t.end()
})
