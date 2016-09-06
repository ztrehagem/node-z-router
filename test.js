var Router = require('./z-router.js');
var ns = Router.namespace;

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
        ':id': [{GET: 'show', PUT: 'update', DELETE: 'delete'}, ns('hobbies', {
          '': {GET: 'index', POST: 'create'},
          ':hobbyId': {DELETE: 'delete'}
        })],
        ':id/bar': 'bar'
      })
    ])
  ])
]);
var router = Router(routes);
console.log(router.routesToString());

function Issue(method, pathname) {
  this.method = method;
  this.pathname = pathname;
}

var issues = [
  new Issue(   'GET', '/'),
  new Issue(   'GET', '/info'),
  new Issue(   'GET', '/contact'),
  new Issue(  'POST', '/contact'),
  new Issue(   'GET', '/articles'),
  new Issue(   'GET', '/articles/2000/10/15/2'),
  new Issue(   'GET', '/api/v1/users'),
  new Issue(  'POST', '/api/v1/users'),
  new Issue(   'GET', '/api/v1/users/foo'),
  new Issue(   'PUT', '/api/v1/users/foo'),
  new Issue('DELETE', '/api/v1/users/foo'),
  new Issue(   'GET', '/api/v1/users/foo/bar'),
  new Issue(   'GET', '/api/v1/users/123/hobbies'),
  new Issue(  'POST', '/api/v1/users/123/hobbies'),
  new Issue('DELETE', '/api/v1/users/123/hobbies/234')
];

issues.forEach((issue)=> {
  console.log('>', issue.method, issue.pathname);
  var route = router.route(issue.method, issue.pathname);
  if( !route || typeof route.controller != 'function' ) return console.log('undefined route or controller');
  route.controller(null, null, route.params);
});
