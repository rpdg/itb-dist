define('pages/meetings/scan.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  var util_2 = require("js/util.ts");
  api_1.api({
      'signIn!post': 'userscore/SignActivityOrMeeting',
  });
  document.getElementById('btnTest').addEventListener('click', function () {
      var param = {
          sourcescore: 1000,
          type: 0,
      };
      /*test code*/
      var userName = util_1.Store.get('userName');
      if (userName === 'buyer') {
          param.userId = 1;
      }
      else {
          param.userId = 3;
      }
      /*end test code*/
      api_1.api.signIn(param, function (data) {
          if (data === 'ok')
              mui.alert(util_2.Languages.package.signSuccess, util_2.Languages.package.tip, util_2.Languages.package.okb);
          else {
              mui.alert(util_2.Languages.package.signNotOpen, util_2.Languages.package.tip, util_2.Languages.package.okb);
          }
      });
  });
  //# sourceMappingURL=/itb-dist/wap/pages/meetings/scan.js.map?__=1552030651276
  

});
