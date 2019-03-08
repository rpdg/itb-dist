define('pages/itb/events/detail.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var opg_1 = require("ts/opg.ts");
  var utils_1 = require("ts/util/utils.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  api_1.api({
      getSub: 'activity/GetActivityContentInfoById',
      sendApply: 'activity/ApplyingActivityContent'
  });
  var id = utils_1.request['id'];
  api_1.api.getSub({ id: id }, function (data) {
      console.log(data);
      var obj2 = data.activity[0];
      var obj = data.activityContent[0];
      if (!obj)
          return opg_1.default.alert(Languages_1.Languages.package.notExistedError, Languages_1.Languages.package.tip, Languages_1.Languages.package.ok);
      obj.lng = Languages_1.Languages.package;
      obj.applyState = data.applyState;
      if (obj2.coverpicture != "" && obj2.coverpicture != undefined && obj2.coverpicture != null) {
          obj.coverpicture = obj2.coverpicture;
      }
      else
          obj.coverpicture = '/itb-dist/pc/pages/itb/events/assets/363-213.png?__=14182f1';
      document.getElementById('main').innerHTML = template('tpl', obj);
      $('.btnSendApply').click(function (e) {
          var scope = e.target.getAttribute("data-scope");
          if (scope == "0") {
              api_1.api.sendApply({ id: id }, function (data) {
                  location.reload(true);
              });
          }
          else if (scope == "1") {
              api_1.api.sendApplyNoApproval({ id: id }, function (data) {
                  location.reload(true);
              });
          }
      });
  });
  //# sourceMappingURL=/itb-dist/pc/pages/itb/events/detail.js.map?__=1552033897847
  

});
