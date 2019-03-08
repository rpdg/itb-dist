define('pages/login/91b332fb641e43de9709332565af93da.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var store_ts_1 = require("ts/util/store.ts");
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  console.log(Languages_1.Languages);
  store_ts_1.store.set('apiServer', window.CONFIG.apiServer);
  store_ts_1.store.set('loginPage', window.CONFIG.loginPage);
  var rememberedUserNameKey = 'login-userParam';
  var dontneedtoinputagain = 'dontneedtoinputagain';
  opg_ts_1.default.api({
      //'login!post': 'user/login',
      //'login!post': 'user/backendlogin'
      'login!post': 'user/Tobackendlogin'
      // 'forgetPwd': 'user/ForgetPwd',
      // 'ToRegistrationFindPwd!post':'user/ToRegistrationFindPwd'
  });
  // $('#switcher').on('click', '.s', function () {
  //     // 不能用Store，避开Store的自动序列化
  //     localStorage.setItem(Languages.configKeyName,
  //         Languages.current === Languages.names.cn ? Languages.names.en : Languages.names.cn);
  //     setTimeout(function () {
  //         let param = form.fieldsToJson({
  //             username: {},
  //             password: {},
  //         });
  //         store.set(dontneedtoinputagain, param);
  //     }, 300);
  //     setTimeout(function () {
  //         location.reload(true);
  //     }, 500);
  // });
  var form = $('#loginForm');
  var u = utils_1.request['u'];
  var p = utils_1.request['p'];
  $("#loginName").val(u);
  $("#password").val(p);
  var dont = store_ts_1.store.get(dontneedtoinputagain);
  if (dont) {
      setTimeout(function () {
          form.jsonToFields(dont);
      }, 200);
      store_ts_1.store.remove(dontneedtoinputagain);
  }
  var remed = store_ts_1.store.get(rememberedUserNameKey);
  if (remed) {
      setTimeout(function () {
          form.jsonToFields(remed);
      }, 200);
      $('#remPassword').prop('checked', true);
  }
  // document.getElementById('guestLogin').addEventListener('click', function () {
  //     let param: userParam = {"username": "guest", "password": "123456"};
  //     Login(param);
  // });
  // $(document).keypress(function (e) {
  //     // 回车键事件
  //     if (e.which == 13) {
  //         $('#btnLogin').trigger('click');
  //     }
  // });
  function Login(param) {
      opg_ts_1.default.api.login(param, function (data) {
          var url = '/itb-dist/pc/pages/login/main.html?__=1552033897847';
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
              name: Languages_1.Languages.package.loginName
          },
          password: {
              name: Languages_1.Languages.package.password
          }
      });
      console.log;
      if (param) {
          console.log(param);
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
  setTimeout(function () {
      $("#btnLogin").trigger('click');
  }, 1000);
  // $('#forgetPwd').click(function () {
  //     let param={};
  //     if ($.trim($("#loginName").val())!="") {
  //         opg.api.ToRegistrationFindPwd(param, function (data) {
  //             //console.log(data);
  //             location.href=data[0].address + "/Pages/web/ResetPasswordSelect.shtml?language=" + Languages.current + "&email=" + $("#loginName").val() + "&_=" + Date.parse(new Date());
  //         });
  //     }
  //     else {
  //         opg.warn(Languages.package.forgetPwdTipWarn);
  //     }
  //     //http://localhost:12575/
  //     //http://reg.itb-china.com
  //     // let param = form.fieldsToJson({
  //     //     username: {
  //     //         name: Languages.package.loginName,
  //     //         require: true,
  //     //     }
  //     // });
  //     // if (param) {
  //     //     opg.api.forgetPwd({email: param.username}, (data) => {
  //     //         opg.ok(Languages.package.forgetPwdTipOk);
  //     //         console.log(data);
  //     //     });
  //     // }
  // });
  //# sourceMappingURL=/itb-dist/pc/pages/login/91b332fb641e43de9709332565af93da.js.map?__=1552033897847
  

});
