define('ts/app.cfg.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var store_1 = require("ts/util/store.ts");
  var cfg = {
      apiServer: (window.CONFIG && window.CONFIG.apiServer) ? window.CONFIG.apiServer : (store_1.store.get('apiServer') || null),
      ajaxTimeOut: 1800000,
      loginPage: (window.CONFIG && window.CONFIG.loginPage) ? window.CONFIG.loginPage : (store_1.store.get('loginPage') || '../login/index.html'),
      version: '1.0.3_20180411',
  };
  cfg.onUnauthorizedError = function () {
      var param = '', url = cfg.loginPage;
      if (top.window.location.hash) {
          param = '?ReturnUrl=' + encodeURIComponent(top.window.location.hash);
          url += param;
      }
      top.window.location.href = url;
  };
  var globalErrorCodes = {
      'exception': '服务器内部错误',
      'delete_failure': '删除失败',
      'add_failure': '新增失败',
      'update_failure': '更新失败',
      'query_failure': '查询失败',
      'max_length': '输入超出最大长度',
      'token_exception': 'token验证失败',
  };
  cfg.onServerError = function (code, errorMsg, callback) {
      if (errorMsg === void 0) { errorMsg = 'unknown error'; }
      if (code === 401 && location.pathname != cfg.loginPage) {
          cfg.onUnauthorizedError();
      }
      else {
          //top.opg.err(`api.${this.name} error ${code} (${errorMsg})`);
          top.opg.err("api." + this.name + " error (" + errorMsg + ")");
      }
  };
  exports.default = cfg;
  //# sourceMappingURL=/itb-dist/pc/ts/app.cfg.js.map?__=1552033897847
  

});
