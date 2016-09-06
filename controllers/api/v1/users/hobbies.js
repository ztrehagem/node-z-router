var ctrl = module.exports = {};

ctrl.index = function(req, resp, params) {
  console.log('routing api/v1/users/hobbies#index with', params);
};

ctrl.create = function(req, resp, params) {
  console.log('routing api/v1/users/hobbies#create with', params);
};

ctrl.delete = function(req, resp, params) {
  console.log('routing api/v1/users/hobbies#delete with', params);
};
