var PATH = require('path');

module.exports = function(routes, options) {
  return new Router(routes, options);
};

module.exports.namespace = function(name, paths, children) {
  if( Array.isArray(paths) ) {
    children = paths;
    paths = null;
  }
  return new Namespace(name, paths, children);
};

function Namespace(name, paths, children) {
  this.name = name;
  this.paths = paths;
  this.children = children;
}

function Router(routes, options) {
  this.routes = [];
  this.options = options || {};
  this.options.ctrlDir = this.options.ctrlDir || './controllers';
  createRoutes(this.routes, '/', '/', routes, this.options, true);
}
Router.prototype.route = function(method, pathname) {
  var matches;
  var route = this.routes.find((route)=> {
    return route.method == method.toUpperCase() &&
      (matches = route.regexp.exec(pathname));
  });
  return route && {
    method: route.method,
    pathname: route.pathname,
    ctrlPath: route.ctrlPath,
    actionName: route.actionName,
    controller: route.controller,
    params: route.convertParams(matches.slice(1))
  };
};
function createRoutes(routes, namespace, pathname, nsObj, options, isRoot) {
  var name = nsObj.name;
  if( !isRoot ) namespace = PATH.resolve(namespace, name);
  if( !isRoot ) pathname = PATH.resolve(pathname, name);
  var ctrlPath = namespace + (isRoot ? name : '');

  forObj(nsObj.paths || {}, (path, actions)=> {
    var childPath = PATH.resolve(pathname, path);

    wrapArray(actions).forEach((obj)=> {
      if( typeof obj == 'string' ) obj = {GET: obj};

      if( !(obj instanceof Namespace) ) {
        forObj(obj, (method, actionname)=> {
          routes.push(new Route(method, childPath, ctrlPath, actionname, options));
        });
      } else createRoutes(routes, namespace, childPath, obj, options);
    });
  });

  (nsObj.children || []).forEach((nsObj)=> {
    createRoutes(routes, namespace, pathname, nsObj, options);
  });
}
Router.prototype.routesToString = function() {
  var max = {
    method: Math.max.apply(null, this.routes.map((route)=> {return route.method.length;})),
    pathname: Math.max.apply(null, this.routes.map((route)=> {return route.pathname.length;}))
  };
  var strbuf = [];
  this.routes.forEach((route)=> {
    strbuf.push(
      ' '.repeat(max.method - route.method.length) + route.method,
      ' ',
      route.pathname + ' '.repeat(max.pathname - route.pathname.length),
      ' -> ',
      route.ctrlPath.substring(1) + '#' + route.actionName,
      route.controller ? '' : ' (undefined)',
      '\n'
    );
  });
  return strbuf.join('');
};

function Route(method, pathname, ctrlPath, actionName, options) {
  this.method = method.toUpperCase();
  this.pathname = pathname;
  this.ctrlPath = ctrlPath;
  this.actionName = actionName;
  this.regexp = new RegExp('^' + this.pathname.replace(/:[^/]+/g, '([^/]+)').replace(/\//g, '\\/') + '$');
  this.paramKeys = this.pathname.split('/').filter((path)=> {
    return path.startsWith(':');
  }).map((path)=> {
    return path.substring(1);
  });
  try {
    this.controller = require(PATH.resolve(options.ctrlDir) + ctrlPath)[actionName];
  } catch(e) {}
}
Route.prototype.convertParams = function(rowParams) {
  var params = {};
  for( var i = 0; i < this.paramKeys.length; i++ ) {
    params[this.paramKeys[i]] = rowParams[i];
  }
  return params;
};

function forObj(obj, fn) {
  Object.keys(obj).forEach((key)=> {
    fn(key, obj[key]);
  });
}

function wrapArray(target) {
  return Array.isArray(target) ? target : [target];
}
