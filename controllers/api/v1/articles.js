var ctrl = module.exports = {};

ctrl.index = function(req, resp, params) {
  console.log('routing api/v1/articles#index with', params);
};

ctrl.create = function(req, resp, params) {
  console.log('routing api/v1/articles#create with', params);
};

ctrl.show = function(req, resp, params) {
  console.log('routing api/v1/articles#show with', params);
};

ctrl.edit = function(req, resp, params) {
  console.log('routing api/v1/articles#edit with', params);
};

ctrl.update = function(req, resp, params) {
  console.log('routing api/v1/articles#update with', params);
};

ctrl.delete = function(req, resp, params) {
  console.log('routing api/v1/articles#delete with', params);
};
