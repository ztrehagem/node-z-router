var ctrl = module.exports = {};

ctrl.index = function(req, resp, params) {
  console.log('routing articles#index with', params);
};

ctrl.show = function(req, resp, params) {
  console.log('routing articles#show with', params);
};
