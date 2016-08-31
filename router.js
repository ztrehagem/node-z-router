module.exports = function(routes, options) {
  return new Router(routes, options);
};

module.exports.namespace = function(name, paths, children) {
  if( typeof name != 'string' ) {
    children = paths;
    paths = name;
    name = null;
  }
  if( Array.isArray(paths) ) {
    children = paths;
    paths = null;
  }
  return {
    name: name,
    paths: paths,
    children: children
  };
};

function Router(routes, options) {
  this.routes = [];
  this.options = options;
  createRoutes(this.routes, '', routes, this.options, true);
}
Router.prototype.route = function(method, pathname) {
  var matches;
  var route = this.routes.find(function(route) {
    return route.method == method.toUpperCase() &&
      (matches = route.regexp.exec(pathname));
  });
  return route && {
    uri: route.uri,
    ctrlPath: route.ctrlPath,
    actionName: route.actionName,
    params: route.convertParams(matches.slice(1))
  };
};
function createRoutes(routes, stack, obj, options, isRoot) {
  var name = obj.name;
  var currentStack = stack + (isRoot ? '' : name);
  forObj(obj.paths || {}, function(path, actions) {
    if( typeof actions == 'string' ) {
      actions = {'get': actions};
    }
    forObj(actions, function(method, actionName) {
      routes.push(new Route(method, currentStack + path, stack + (isRoot ? '/' : '') + name, actionName));
    });
  });
  (obj.children || []).forEach(function(child) {
    createRoutes(routes, currentStack + '/', child, options);
  });
}
Router.prototype.logRoutes = function() {
  console.log('------ routes ------');
  var max = {
    method: 0,
    uri: 0
  };
  this.routes.forEach(function(route) {
    max.method = max.method < route.method.length ? route.method.length : max.method;
    max.uri = max.uri < route.uri.length ? route.uri.length : max.uri;
  });
  this.routes.forEach(function(route) {
    console.log(' '.repeat(max.method - route.method.length) + route.method,
      route.uri + ' '.repeat(max.uri - route.uri.length),
      ' -> ',
      route.ctrlPath.substring(1) + '#' + route.actionName
    );
  });
  console.log('--------------------');
};

function Route(method, uri, ctrlPath, actionName) {
  this.method = method.toUpperCase();
  this.uri = uri;
  this.ctrlPath = ctrlPath;
  this.actionName = actionName;
  this.regexp = new RegExp('^' + this.uri.replace(/:[^/]+/g, '([^/]+)').replace(/\//g, '\\/') + '$');
  this.paramKeys = this.uri.split('/').filter(function(path) {
    return path.startsWith(':');
  }).map(function(path) {
    return path.substring(1);
  });
}
Route.prototype.convertParams = function(rowParams) {
  var params = {};
  for( var i = 0; i < this.paramKeys.length; i++ ) {
    params[this.paramKeys[i]] = rowParams[i];
  }
  return params;
};

function forObj(obj, fn) {
  Object.keys(obj).forEach(function(key) {
    fn(key, obj[key]);
  });
}
