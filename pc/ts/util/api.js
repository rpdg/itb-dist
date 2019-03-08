define('ts/util/api.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var app_cfg_1 = require("ts/app.cfg.ts");
  var store_1 = require("ts/util/store.ts");
  var utils_1 = require("ts/util/utils.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  //noinspection TypeScriptUnresolvedVariable
  //cfg.apiServer = window.apiServer ;
  if (!app_cfg_1.default.apiServer) {
      app_cfg_1.default.onUnauthorizedError();
  }
  var onServerError = app_cfg_1.default.onServerError || function (code, errorMsg, callback) {
      alert(code + 'error: ' + errorMsg);
  };
  var loading = {
      dom: $('#opgAjaxLoading'),
      handlers: 0,
      timer: 0,
      show: function () {
          loading.dom.stop(true, true).fadeIn();
      },
      hide: function () {
          if (!loading.handlers)
              loading.dom.stop(true, true).fadeOut();
      },
  };
  var xToken = (function () {
      var token = store_1.store.get('Authorization');
      if (token) {
          return {
              Authorization: 'Bearer ' + token,
              lng: Languages_1.Languages.current,
          };
      }
      else {
          if (window.location.pathname != app_cfg_1.default.loginPage) {
              app_cfg_1.default.onUnauthorizedError();
          }
          return {
              lng: Languages_1.Languages.current,
          };
      }
  })();
  var defaultErrorMsg = { message: 'Server echoes without meta data' };
  var ServerFn = /** @class */ (function () {
      function ServerFn(url, name, method, restful) {
          if (method === void 0) { method = 'GET'; }
          if (restful === void 0) { restful = true; }
          this.name = name;
          this.method = method;
          this.restful = restful;
          this.timeOut = app_cfg_1.default.ajaxTimeOut;
          if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0)
              this.url = url;
          else
              this.url = app_cfg_1.default.apiServer + url.replace(/^\//, '');
          this.unlimited = false;
          this.accessible = true;
      }
      ServerFn.prototype.handleError = function (code, error, callback) {
          if (typeof this.onError === 'function')
              return this.onError.call(this, code, error, callback);
          else
              return onServerError.call(this, code, error, callback);
      };
      ServerFn.prototype.invoke = function (data, callback) {
          var that = this;
          if (this.accessible || this.unlimited) {
              this.accessible = false;
              //return $[this.method].apply(this, makeParam.call(this, data, callback, type || 'json'));
              if ($.isFunction(data)) {
                  callback = data;
                  data = null;
              }
              var url = this.url, method = this.method;
              var contentType = 'application/json';
              var processData = true;
              if (method === 'UPLOAD') {
                  contentType = false;
                  processData = false;
                  method = 'POST';
              }
              else {
                  if (data) {
                      if (!this.restful && this.method != 'GET') {
                          data = JSON.stringify(data);
                      }
                      else if (this.restful) {
                          url = utils_1.format.json(url, data);
                          data = null;
                      }
                  }
              }
              return $.ajax({
                  headers: xToken,
                  contentType: contentType,
                  processData: processData,
                  dataType: 'json',
                  url: url,
                  data: data,
                  method: method,
                  cache: false,
                  timeout: that.timeOut,
                  beforeSend: function (jqXHR, settings) {
                      loading.handlers++;
                      if (loading.timer)
                          clearTimeout(loading.timer);
                      loading.timer = 0;
                      loading.show();
                  },
                  complete: function () {
                      loading.handlers--;
                      loading.timer = setTimeout(loading.hide, 1000);
                      that.accessible = true;
                      that = null;
                      return data;
                  },
                  error: function (jqXHR, textStatus, errorThrown) {
                      var code = jqXHR.status;
                      if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
                          that.handleError.call(that, code, jqXHR.responseJSON.error, callback);
                      }
                      else {
                          if (!errorThrown)
                              errorThrown = 'server connection lost';
                          that.handleError.call(that, code, errorThrown, callback);
                      }
                  },
                  success: function (json, textStatus, jqXHR) {
                      var error = json.error;
                      if (error) {
                          that.handleError.call(that, 200, error, callback);
                      }
                      else {
                          if (callback && typeof callback === 'function')
                              callback.call(that, json.data === undefined ? {} : json.data, textStatus, jqXHR);
                      }
                  },
              });
          }
          else {
              throw new Error('Server function [' + this.name + '] unusable now.');
          }
      };
      return ServerFn;
  }());
  var api = function (apiSet) {
      for (var key in apiSet) {
          var uArr = key.split('!');
          var pName = uArr[0];
          var pMethod = uArr[1] ? uArr[1].toString().toUpperCase() : 'GET';
          var restful = (!(uArr[2] === undefined)) || (apiSet[key].indexOf('${') > -1);
          if (!api[pName]) {
              api[pName] = (function (srvFn) {
                  var fn = function (data, callback) {
                      return srvFn.invoke.call(srvFn, data, callback);
                  };
                  fn.set = function (k, v) {
                      srvFn[k] = v;
                      return fn;
                  };
                  fn.get = function (k) { return srvFn[k]; };
                  fn.toString = function () { return srvFn.url; };
                  /*fn.post = (data , cb)=>{
                   fn.set('method' , 'POST') ;
                   return fn(data , cb);
                   };*/
                  return fn;
              })(new ServerFn(apiSet[key], pName, pMethod, restful));
          }
          else {
              //throw new Error('api [' + pName + '] duplicate definition');
              console.error("api [" + pName + "] duplicate definition");
          }
      }
      return api;
  };
  exports.api = api;
  //# sourceMappingURL=/itb-dist/pc/ts/util/api.js.map?__=1552033897847
  

});
