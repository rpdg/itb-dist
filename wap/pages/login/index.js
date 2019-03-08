define('pages/login/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var util_1 = require("js/util.ts");
  var api_1 = require("js/api.ts");
  util_1.Store.remove('Authorization');
  api_1.api({
      'login!post': 'user/login',
      'saveAppClientinfo!post': 'AppRemote/SaveAppClientinfo',
      'saveWeChatClientinfo!post': 'AppRemote/SaveWeChatClientinfo',
      'forgetPwd': 'user/ForgetPwd',
      'ToRegistrationFindPwd!post': 'user/ToRegistrationFindPwd'
  });
  var rememberedUserNameKey = 'login-userParam';
  var dontneedtoinputagain = 'dontneedtoinputagain';
  var time = util_1.request['time'];
  var sessionStore = window['sessionStorage'];
  sessionStore.removeItem('iswishlistback');
  var dont = util_1.Store.get(dontneedtoinputagain);
  if (dont) {
      setTimeout(function () {
          $('#form1').jsonToFields(dont);
      }, 200);
      util_1.Store.remove(dontneedtoinputagain);
  }
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
  var infoid = util_1.request['infoid'];
  var token = util_1.request['token'];
  var clientid = util_1.request['clientid'];
  var appid = util_1.request['appid'];
  var appkey = util_1.request['appkey'];
  var OpenID = util_1.request['OpenID'];
  var lng = util_1.Languages.package;
  var clng = 'en';
  if (localStorage.getItem('lngPkg') != null || localStorage.getItem('lngPkg') != undefined) {
      var currentlng = localStorage.getItem('lngPkg');
      clng = currentlng.replace(/["""]/g, '');
  }
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
  document.getElementById('forgetPwd').addEventListener('tap', function () {
      var param = $('#form1').fieldsToJson();
      if (!param.username) {
          return mui.alert("" + util_1.Languages.package['require'] + util_1.Languages.package['userName'], util_1.Languages.package['tip'], util_1.Languages.package['ok']);
      }
      api_1.api.forgetPwd({ email: param.username }, function (data) {
          mui.alert("" + util_1.Languages.package.forgetPwdTipOk, util_1.Languages.package['tip'], util_1.Languages.package['ok']);
          console.log(data);
      });
  });
  function Login(param) {
      //console.log(param);
      var param2 = {};
      var param3 = {};
      if (appid != "" && appid != undefined && appid != null) {
          util_1.Store.set('userDevice', 'app');
          param2.infoid = infoid;
          param2.token = token;
          param2.clientid = clientid;
          param2.appid = appid;
          param2.appkey = appkey;
          param2.username = param.username;
          api_1.api.login(param, function (token) {
              util_1.Store.set('Authorization', token);
              util_1.Store.set('userName', param.username);
              util_1.Store.set('locationsearch', location.search);
              api_1.api.saveAppClientinfo(param2, function () {
                  setTimeout(function () {
                      location.href = '../dashboard/index.html';
                  }, 1000);
              });
          });
      }
      else if (OpenID != "" && OpenID != undefined && OpenID != null) {
          util_1.Store.set('userDevice', 'wechat');
          param3.OpenID = OpenID;
          param3.username = param.username;
          api_1.api.login(param, function (token) {
              util_1.Store.set('Authorization', token);
              util_1.Store.set('userName', param.username);
              util_1.Store.set('locationsearch', location.search);
              api_1.api.saveWeChatClientinfo(param3, function () {
                  setTimeout(function () {
                      location.href = '../dashboard/index.html';
                  }, 1000);
              });
          });
      }
      else {
          util_1.Store.set('userDevice', 'browser');
          api_1.api.login(param, function (token) {
              util_1.Store.set('Authorization', token);
              util_1.Store.set('userName', param.username);
              util_1.Store.set('locationsearch', location.search);
              location.href = '../dashboard/index.html';
          });
      }
  }
  var lgnSwitcher = document.getElementById('swLgn');
  lgnSwitcher.addEventListener('toggle', function (event) {
      // 不能用Store，避开Store的自动序列化
      localStorage.setItem(util_1.Languages.configKeyName, util_1.Languages.names[event.detail.isActive ? 'cn' : 'en']);
      setTimeout(function () {
          var param = $('#form1').fieldsToJson({
              username: {},
              password: {},
          });
          util_1.Store.set(dontneedtoinputagain, param);
      }, 300);
      if (time == "" || time == undefined || time == null) {
          setTimeout(function () {
              if (location.search != "")
                  location.href = './index.html' + location.search + '&time=' + ((new Date()).getTime());
              else
                  location.href = './index.html' + location.search + '?time=' + ((new Date()).getTime());
          }, 300);
      }
      else {
          setTimeout(function () {
              location.href = './index.html' + location.search;
          }, 300);
      }
  });
  if (clng != "cn" && util_1.Store.get('wechatlanguagechange') != "1" && (OpenID != "" && OpenID != undefined && OpenID != null)) {
      util_1.Store.set('wechatlanguagechange', '1');
      mui("#swLgn").switch().toggle();
  }
  //# sourceMappingURL=/itb-dist/wap/pages/login/index.js.map?__=1552030651276
  

});
