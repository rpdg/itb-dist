define('pages/meetings/detail.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  var util_2 = require("js/util.ts");
  api_1.api({
      getSub: 'activity/GetActivityContentInfoById',
      sendApply: 'activity/ApplyingActivityContent',
      sendApplyNoApproval: 'activity/ApplyingActivityContentNoApproval'
  });
  var id = util_1.request['id'], type = util_1.request['typeCode'];
  var comepage = util_1.request['comepage'];
  api_1.api.getSub({ id: id }, function (data) {
      var obj = data.activityContent[0];
      if (!obj)
          return mui.alert(util_1.Languages.package.notExistedError, util_1.Languages.package.tip, util_1.Languages.package.ok);
      obj.lng = util_1.Languages.package;
      obj.applyState = data.applyState;
      obj.activity = data.activity[0];
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
      $('.btnSingin').click(function () {
          var RoleName = util_2.Store.get('RoleName');
          if (RoleName === "staff")
              location.href = './result.html' + location.search;
          else
              location.href = './signin.html' + location.search;
      });
  });
  $('#turnbackto').click(function (e) {
      if (comepage === "schedule")
          location.href = '../schedule/mine.html';
      else if (comepage === "meeting")
          location.href = 'meeting.html';
      else
          location.href = 'activity.html';
  });
  //# sourceMappingURL=/itb-dist/wap/pages/meetings/detail.js.map?__=1552030651276
  

});
