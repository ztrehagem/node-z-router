var Router = require('./z-router.js');
var ns = Router.namespace;
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
var router = Router(routes);
console.log(router.routesToString());

var issues = [
  {method: 'GET', pathname: '/'},
  {method: 'GET', pathname: '/info'},
  {method: 'GET', pathname: '/contact'},
  {method: 'POST', pathname: '/contact'},
  {method: 'GET', pathname: '/articles'},
  {method: 'GET', pathname: '/articles/2000/10/15/2'},
  {method: 'GET', pathname: '/api/v1/users'},
  {method: 'POST', pathname: '/api/v1/users'},
  {method: 'GET', pathname: '/api/v1/users/foo'},
  {method: 'GET', pathname: '/api/v1/users/foo/edit'},
  {method: 'UPDATE', pathname: '/api/v1/users/foo/edit'},
  {method: 'DELETE', pathname: '/api/v1/users/foo/delete'}
];

issues.forEach(function(issue){
  console.log('request', issue.method, issue.pathname);
  var route = router.route(issue.method, issue.pathname);
  if( !route || typeof route.controller != 'function' ) return;
  route.controller(null, null, route.params);
  console.log();
});
