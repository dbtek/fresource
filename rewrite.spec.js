const tape = require('tape')
// expose modules to global
global.URLSearchParams = URLSearchParams

// require module
const rewrite = require('./rewrite')

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

tape('should rewrite array query params', t => {
  t.equal(rewrite('/users/:id?sort=:orderBy', { orderBy: ['name', 'id'] }), '/users?sort=name&sort=id', 'rewrite')
  t.end()
})
