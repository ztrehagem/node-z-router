z-router
==

Most of web applications need to resolve a pair of **method** (`GET`, `POST` or...) and **pathname** (starts with `/`) into **controller path** and **action name** with **params**. (like the Ruby on Rails!)

For node http server, then, this "z-router" resolve them simply. ;)

## Installation
```sh
$ npm install z-router
```

## Usage

#### Initialize

```js
var ZRouter = require('z-router');
var router = ZRouter(routes, options);
```

`options`:
- ctrlDir
  - controllers directory path. default: `'./controllers'`


`routes`:

```js
var ns = ZRouter.namespace;
var routes = ns('root', {
  '': 'index',
  'info': 'info',
  'contact': {GET: 'form', POST: 'contact'}
}, [
  ns('articles', {
    '': 'index',
    ':year/:month/:day/:number': 'show'
  }),
  ns('api', [
    ns('v1', [
      ns('users', {
        '': {GET: 'index', POST: 'create'},
        ':id': [{GET: 'show', PUT: 'update', DELETE: 'delete'},
          ns('hobbies', {
            '': {GET: 'index', POST: 'create'},
            ':hobbyId': {DELETE: 'delete'}
          })
        ],
        ':id/bar': 'bar'
      })
    ])
  ])
]);
```

ZRouter.namespace(name [, actions] [, children])
  - name &lt;String&gt;
  - actions &lt;Array[String/Object[path:name]/namespaceObj]&gt; (option)
    - alse ok as not array
  - children &lt;Array[namespace]&gt; (option)

#### Make controller modules

```
- /
  |- package.json
  `- controllers/
     |- root.js
     |- articles.js
     `- api/
        `- v1/
           |- users.js
           `- users
              `- hobbies.js
```

ex) root.js:
```js
exports.index = function(request, response, params) {
  response.write('called: root#index');
};
exports.info = function(request, response, params) {
  response.write('called: root#info');
};
exports.form = function(request, response, params) {
  response.write('called: root#form');
};
exports.contact = function(request, response, params) {
  response.write('called: root#contact');
};
```

#### Routing

```js
var route = router.route('GET', '/info');
if( route && typeof route.controller == 'function' ) {
  route.controller(request, response, route.params);
}
```

`route` object has these properties:
- method (`'GET'`, `'POST'`...)
- pathname (`'/'`, `'/info'`, `'/api/v1/users/:id/edit'`...)
- ctrlPath
  - `/` or `/info` or `/contact` -> `'/root'`
  - `/articles` or `/articles/2000/10/15/2` -> `'/articles'`
  - `/api/v1/users` or `/api/v1/users/123` or... -> `'/api/v1/users'`
- actionName
  - `GET /` -> `'index'`
  - `GET /contact` -> `'form'`
  - `POST /contact` -> `'contact'`
  - `PUT /api/v1/users/123` -> `'update'`
- controller
  - controller function
- params
  - `/articles/2000/10/15/2` -> `{year: '2000', month: '10', day: '15', number: '2'}`
  - `/api/v1/users/123` -> `{id: '123'}`
  - `/api/v1/users/123/hobbies/foobar` -> `{id: '123', hobbyId: 'foobar'}`

#### Utils

check routes:

```js
console.log(router.routesToString());
```

## Links

- [node package](https://www.npmjs.com/package/z-router)
- [github repo](https://github.com/ztrehagem/node-z-router)
