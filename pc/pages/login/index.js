define('pages/login/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var store_ts_1 = require("ts/util/store.ts");
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  console.log(Languages_1.Languages);
  store_ts_1.store.set('apiServer', window.CONFIG.apiServer);
  store_ts_1.store.set('loginPage', window.CONFIG.loginPage);
  var rememberedUserNameKey = 'login-userParam';
  opg_ts_1.default.api({
      'login!post': 'user/login',
  });
  $('#switcher').on('click', '.s', function () {
      // 不能用Store，避开Store的自动序列化
      localStorage.setItem(Languages_1.Languages.configKeyName, Languages_1.Languages.current === Languages_1.Languages.names.cn ? Languages_1.Languages.names.en : Languages_1.Languages.names.cn);
      location.reload(true);
  });
  var form = $('#loginForm');
  var remed = store_ts_1.store.get(rememberedUserNameKey);
  if (remed) {
      setTimeout(function () {
          form.jsonToFields(remed);
      }, 200);
      $('#remPassword').prop('checked', true);
  }
  document.getElementById('guestLogin').addEventListener('click', function () {
      var param = { "username": "guest", "password": "123456" };
      Login(param);
  });
  function Login(param) {
      opg_ts_1.default.api.login(param, function (data) {
          var url = '/itb-dist/pc/pages/login/main.html?__=576816f';
          var previousLoginName = store_ts_1.store.get('user');
          //debugger;
          if (previousLoginName && previousLoginName === param.username) {
              var hash = opg_ts_1.default.request['ReturnUrl'];
              if (hash) {
                  url += hash;
              }
          }
          store_ts_1.store.set('Authorization', data);
          store_ts_1.store.set('user', param.username);
          window.location.replace(url);
      });
  }
  $('#btnLogin').click(function () {
      var param = form.fieldsToJson({
          username: {
              name: Languages_1.Languages.package.loginName,
              require: true,
          },
          password: {
              name: Languages_1.Languages.package.password,
              require: true,
          },
      });
      if (param) {
          Login(param);
          if ($('#remPassword').prop('checked')) {
              delete param.remPassword;
              store_ts_1.store.set(rememberedUserNameKey, param);
          }
          else {
              store_ts_1.store.remove(rememberedUserNameKey);
          }
      }
  });
  $('#guestLogin').on('click', function () {
      var param = { username: "guest", password: "123456" };
      Login(param);
  });
  //# sourceMappingURL=/itb-dist/pc/pages/login/index.js.map?__=
  

});
