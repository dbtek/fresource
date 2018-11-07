
f·resource
￼

￼

￼

All in one client for your REST API under 1kB.

Install

With npm:

$ npm i fresource --save



Via CDN:

<script src="https://unpkg.com/fresource/dist/fresource.js"></script>



Usage

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



API

resource = fresource(path)
Initialize a resource with a path / url.

resource.get(params)
Fires a GET request with given parameters. Rewrites all path / query variables (like: :key ) with properties of params object.

resource.save(params)
Fires a POST request with given parameters. Rewrite applies here too. Object with residual properties will be posted as body.

resource.update(params)
Fires a PUT request with given parameters. Rewrite applies here too. Object with residual properties will be posted as body.

resource.delete(params)
Fires a DELETE request with given parameters. Rewrite applies here too.

Author

Ismail Demirbilek @dbtek

License

MIT