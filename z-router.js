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
    method: route.method,
    pathname: route.pathname,
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
Router.prototype.routesToString = function() {
  var strbuf = [];
  var max = {
    method: 0,
    pathname: 0
  };
  this.routes.forEach(function(route) {
    max.method = max.method < route.method.length ? route.method.length : max.method;
    max.pathname = max.pathname < route.pathname.length ? route.pathname.length : max.pathname;
  });
  this.routes.forEach(function(route) {
    strbuf.push(
      ' '.repeat(max.method - route.method.length) + route.method,
      ' ',
      route.pathname + ' '.repeat(max.pathname - route.pathname.length),
      ' -> ',
      route.ctrlPath.substring(1) + '#' + route.actionName,
      '\n'
    );
  });
  return strbuf.join('');
};

function Route(method, pathname, ctrlPath, actionName) {
  this.method = method.toUpperCase();
  this.pathname = pathname;
  this.ctrlPath = ctrlPath;
  this.actionName = actionName;
  this.regexp = new RegExp('^' + this.pathname.replace(/:[^/]+/g, '([^/]+)').replace(/\//g, '\\/') + '$');
  this.paramKeys = this.pathname.split('/').filter(function(path) {
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
