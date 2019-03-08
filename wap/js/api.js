define('js/api.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var util_1 = require("js/util.ts");
  //noinspection TypeScriptUnresolvedVariable
  //cfg.apiServer = window.apiServer ;
  var apiServer = window['CONFIG'].apiServer || '/api/';
  var loginPage = '/itb-dist/wap/pages/login/index.html?__=1552030651276';
  var onServerError = function (code, errorMsg, callback) {
      if (code === 401 && location.pathname != loginPage) {
          location.href = loginPage;
      }
      else {
          //mui.alert(`api.${this.name} error ${code} (${errorMsg})`, 'error: ', 'OK');
          mui.alert("api." + this.name + " error (" + errorMsg + ")", 'error: ', 'OK');
      }
  };
  var loading = {
      dom: $('#opgAjaxLoading').hide(),
      handlers: 0,
      timer: 0,
      show: function () {
          loading.dom.stop(true, true).fadeIn();
      },
      hide: function () {
          if (!loading.handlers)
              loading.dom.stop(true, true).fadeOut();
      }
  };
  var xToken = (function () {
      var token = util_1.Store.get('Authorization');
      if (token) {
          return {
              Authorization: 'Bearer ' + token,
              lng: util_1.Languages.current
          };
      }
      else {
          return {
              lng: util_1.Languages.current
          };
      }
  })();
  //console.log(xToken);
  var ServerFn = /** @class */ (function () {
      function ServerFn(url, name, method, restful) {
          if (method === void 0) { method = 'GET'; }
          if (restful === void 0) { restful = true; }
          this.name = name;
          this.method = method;
          this.restful = restful;
          this.timeOut = 30000;
          if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0)
              this.url = url;
          else
              this.url = apiServer + url.replace(/^\//, '');
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
                      if (this.method != 'GET') {
                          data = JSON.stringify(data);
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
                      if (loading.timer)
                          clearTimeout(loading.timer);
                      loading.timer = setTimeout(loading.hide, 100);
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
                  }
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
  //# sourceMappingURL=/itb-dist/wap/js/api.js.map?__=1552030651276
  

});
