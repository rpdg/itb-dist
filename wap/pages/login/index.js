define('pages/login/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var util_1 = require("js/util.ts");
  var api_1 = require("js/api.ts");
  util_1.Store.remove('Authorization');
  api_1.api({
      'login!post': 'user/login',
  });
  var rememberedUserNameKey = 'login-userParam';
  var rememberedUser = util_1.Store.get(rememberedUserNameKey);
  if (rememberedUser) {
      $('#username').val(rememberedUser.username);
      $('#password').val(rememberedUser.password);
      $('#remPassword').prop('checked', true);
  }
  /*chkRemember.on('change' , function () {
      if(this.checked){
          Store.get(rememberedUserNameKey);
      }
  });*/
  document.getElementById('btnLogin').addEventListener('tap', function () {
      var param = $('#form1').fieldsToJson();
      if (!param.username) {
          return mui.alert("" + util_1.Languages.package['require'] + util_1.Languages.package['userName'], util_1.Languages.package['tip'], util_1.Languages.package['ok']);
      }
      if (!param.password) {
          return mui.alert("" + util_1.Languages.package['require'] + util_1.Languages.package['password'], util_1.Languages.package['tip'], util_1.Languages.package['ok']);
      }
      if (param.remPassword) {
          delete param.remPassword;
          util_1.Store.set(rememberedUserNameKey, param);
      }
      else {
          util_1.Store.remove(rememberedUserNameKey);
      }
      Login(param);
  });
  document.getElementById('guestLogin').addEventListener('tap', function () {
      var param = { "username": "guest", "password": "123456" };
      Login(param);
  });
  function Login(param) {
      api_1.api.login(param, function (token) {
          console.log(token);
          util_1.Store.set('Authorization', token);
          util_1.Store.set('userName', param.username);
          location.href = '../dashboard/index.html';
      });
  }
  var lgnSwitcher = document.getElementById('swLgn');
  lgnSwitcher.addEventListener('toggle', function (event) {
      // 不能用Store，避开Store的自动序列化
      localStorage.setItem(util_1.Languages.configKeyName, util_1.Languages.names[event.detail.isActive ? 'en' : 'cn']);
      setTimeout(function () {
          location.href = './index.html?t=' + (new Date()).getTime();
      }, 300);
  });
  //# sourceMappingURL=/itb-dist/wap/pages/login/index.js.map?__=
  

});
