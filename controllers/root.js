var ctrl = module.exports = {};

ctrl.index = function(req, resp, params) {
  console.log('routing root#index with', params);
};

ctrl.info = function(req, resp, params) {
  console.log('routing root#info with', params);
};

ctrl.form = function(req, resp, params) {
  console.log('routing root#form with', params);
};

ctrl.contact = function(req, resp, params) {
  console.log('routing root#contact with', params);
};
