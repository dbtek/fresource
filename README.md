<div align="center">
  <h1>f·resource</h1>
  <!-- Build Status -->
  <a href="https://travis-ci.org/dbtek/fresource">
    <img src="https://img.shields.io/travis/dbtek/fresource/master.svg?style=flat-square"
      alt="Build Status" />
  </a>
  <!-- Test Coverage -->
  <a href="https://codecov.io/github/dbtek/fresource">
    <img src="https://img.shields.io/codecov/c/github/dbtek/fresource/master.svg?style=flat-square"
      alt="Test Coverage" />
  </a>
  <!-- Standard -->
  <a href="https://standardjs.com">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square"
      alt="Standard" />
  </a>
</div>
<br/>
<div align="center">
  All in one client for your REST API under 1kB. 
</div>

## Install
With npm:
```bash
$ npm i fresource --save
```

Via CDN:
```html
<script src="https://unpkg.com/fresource/dist/fresource.js"></script>
```

## Usage
```js
var fresource = require('fresource')

var Users = fresource('/api/users/:id?sort=:sort')

Users.get({ sort: 'name' }) // will fetch /api/users?sort=name
  .then(result => {
    var users = result
  })

Users.get({ id: 1 }) // will fetch /api/users/1
  .then(result => {
    var user = result
  })
```

## API

**Collection = fresource(path)**  
Initialize a resource with a path / url. Path should include all path / query parameter variables like `:key`.

**Collection.get(params)**  
Fetches a `GET` request with given parameters.  
Returns promise.

**Collection.save(params)**  
Sends a `POST` request with given parameters. Residual parameters that are not used in url will be posted in body.  
Returns promise.

**Collection.update(params)**  
Sends a `PUT` request with given parameters. Residual parameters that are not used in url will be posted in body.  
Returns promise.

**Collection.delete(params)**  
Sends a `DELETE` request with given parameters.  
Returns promise.

## Author
Ismail Demirbilek [@dbtek](https://twitter.com/dbtek)

## License
MIT
