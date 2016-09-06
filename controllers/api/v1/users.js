var ctrl = module.exports = {};

ctrl.index = function(req, resp, params) {
  console.log('routing api/v1/users#index with', params);
};

ctrl.create = function(req, resp, params) {
  console.log('routing api/v1/users#create with', params);
};

ctrl.show = function(req, resp, params) {
  console.log('routing api/v1/users#show with', params);
};

ctrl.update = function(req, resp, params) {
  console.log('routing api/v1/users#update with', params);
};

ctrl.delete = function(req, resp, params) {
  console.log('routing api/v1/users#delete with', params);
};

ctrl.bar = function(req, resp, params) {
  console.log('routing api/v1/users#bar with', params);
};
