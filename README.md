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
// z-router provides a factory method
var router = ZRouter(routes, options);
```

notice: this version handles no property of `options`

#### Create routes object

```js
var ns = ZRouter.namespace;
var routes = ns('root', {
  '/': 'index',
  '/info': 'info',
  '/contact': {GET: 'form', POST: 'contact'}
}, [
  ns('articles', {
    '': 'index',
    '/:year/:month/:day/:number': 'show'
  }),
  ns('api', [
    ns('v1', [
      ns('users', {
        '': {GET: 'index', POST: 'create'},
        '/:id': {GET: 'show'},
        '/:id/edit': {GET: 'edit', UPDATE: 'update'},
        '/:id/delete': {DELETE: 'delete'}
      })
    ])
  ])
]);
```

#### Make controller modules

```
- /
  |- package.json
  `- controllers/
    |- root.js
    |- articles.js
    `- api/
      `- v1/
        `- users.js
```

#### Routing

```js
var route = router.route('GET', '/info');
```

`route` has these properties:
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
  - `UPDATE /api/v1/users/123/edit` -> `'update'`
- params
  - `/articles/2000/10/15/2` -> `{year: '2000', month: '10', day: '15', number: '2'}`
  - `/api/v1/users/123` -> `{id: '123'}`
  - `/api/v1/users/foobar` -> `{id: 'foobar'}`

#### Call controller method

controller module

```js
exports.index = function(request, response, params) {
  response.write('called: root#index');
};
```

and request handler

```js
var controllerModule = require('./controllers' + route.ctrlPath);
var controler = controllerModule[route.actionName];
controller(request, response, route.params);
```

#### Utils

check routes:

```js
console.log(router.routesToString());
```

## Links

- [node package](https://www.npmjs.com/package/z-router)
- [github repo](https://github.com/ztrehagem/node-z-router)
