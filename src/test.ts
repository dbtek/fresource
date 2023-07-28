import tape from 'tape';
import sinon from 'sinon';
import { rewritePath } from './rewrite';
import fresource from '.';

const fetch = sinon.fake.resolves(null);
global.fetch = fetch;

const Users = fresource('/users/:id?sort=:orderBy');

tape('should rewrite path variables', (t) => {
  t.equal(rewritePath('/users/:id?sort=:orderBy', { id: '1' }), '/users/1', 'rewrite');
  t.end();;
})

tape('should rewrite inline variables', (t) => {
  t.equal(rewritePath('/users/user:id', { id: '1' }), '/users/user1', 'rewrite');
  t.end();
})

tape('should not rewrite without keys', (t) => {
  t.equal(rewritePath('https://test/users', { }), 'https://test/users', 'rewrite');
  t.end();
})

tape('should not rewrite with port', (t) => {
  t.equal(rewritePath('http://test:3030/users', { }), 'http://test:3030/users', 'rewrite');
  t.end();
})

tape('should remove unused variables', (t) => {
  t.equal(rewritePath('/users/:id?sort=:orderBy'), '/users', 'rewrite w/o params');
  t.equal(rewritePath('/users/:id?sort=:orderBy', {}), '/users', 'rewrite w/ params');
  t.end();
})

tape('should rewrite query params', (t) => {
  t.equal(rewritePath('/users/:id?sort=:orderBy', { orderBy: 'name' }), '/users?sort=name', 'rewrite');
  t.end();
})

tape('should rewrite array query params', (t) => {
  t.equal(rewritePath('/users/:id?sort=:orderBy', { orderBy: ['name', 'id'] }), '/users?sort=name&sort=id', 'rewrite');
  t.end();
})

tape('should call fetch correctly', (t) => {
  Users.get();
  t.true(fetch.calledWithExactly('/users', {}), 'get request');

  let params: {[key: string]: string} = { name: 'Ismail' };
  Users.save(params);
  t.true(fetch.calledWithExactly('/users', { method: 'POST', body: JSON.stringify(params) }), 'post request');

  params = { name: 'Ismail', id: '1' };
  Users.update(params);
  t.true(fetch.calledWithExactly('/users/1', { method: 'PUT', body: JSON.stringify({ name: 'Ismail' }) }), 'put request');

  Users.delete({ id: '1' });
  t.true(fetch.calledWithExactly('/users/1', { method: 'DELETE' }), 'delete request');
  t.end();
})

tape('should work without query params', (t) => {
  const path = '/books/:id';
  const Books = fresource(path);
  Books.get();
  t.true(fetch.calledWithExactly('/books', {}), 'get request');
  t.end();
})

tape('should work without any variable', (t) => {
  const path = '/books';
  const Books = fresource(path);
  Books.get();
  t.equal(fetch.lastCall.args[0], '/books', 'get request');
  t.end();
})

tape('should work with custom headers', (t) => {
  const path = '/books';
  const options = { headers: { 'authorization': 'bearer secret' } };
  const Books = fresource(path, options);
  Books.get();
  t.equal(JSON.stringify(fetch.lastCall.lastArg), JSON.stringify(options), 'Expect headers to be present');

  const Notes = fresource('/notes');
  Notes.get(null, options);
  t.equal(JSON.stringify(fetch.lastCall.lastArg), JSON.stringify(options), 'Expect to work with headers on method arguments');
  t.end();
})
