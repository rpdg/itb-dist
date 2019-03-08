define('pages/msgBox/msgBox.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({
      getUnreadList: 'message/GetMessageByCurrentUser',
      getReadList: 'message/GetMessageByCurrentUser',
      setRead: 'message/UpMessageStatusByMsgId?status=1',
      reply: 'activity/AllowOrDenyActivityContentForUser',
      replySchedule: 'schedule/AllowOrDenyScheduleForUser',
  });
  var curLng = util_1.Store.get('lngPkg');
  api_1.api.replySchedule.set('onError', function (code, error, callback) {
      if (code === 200 && (error === 'AllowOrDenyScheduleForUser_Error01' || error === 'AllowOrDenyScheduleForUser_Error02' || error === 'AllowOrDenyScheduleForUser_Error03')) {
          var errorMsg = util_1.Languages.package['tips'];
          mui.alert("" + errorMsg, util_1.Languages.package['tipsTitle'], util_1.Languages.package['okb']);
      }
  });
  var customParse = function (msg) {
      var msgObj = JSON.parse(msg);
      if (curLng == 'cn') {
          return util_1.Languages.package['scheduleMsgTpl']
              .replace('{company}', msgObj.fromCompanyCn ? msgObj.fromCompanyCn + "\u516C\u53F8" : '')
              .replace('{title}', msgObj.fromTitleCn ? "" + msgObj.fromTitleCn : '')
              .replace('{name}', msgObj.fromNameCn)
              .replace('{time}', msgObj.date);
      }
      else {
          return util_1.Languages.package['scheduleMsgTpl']
              .replace('{company}', msgObj.fromCompany ? msgObj.fromCompany + " Company " : '')
              .replace('{title}', msgObj.fromTitle ? "" + msgObj.fromTitle : '')
              .replace('{name}', msgObj.fromName)
              .replace('{time}', msgObj.date);
      }
  };
  var customParse2 = function (msg) {
      var msgObj = JSON.parse(msg);
      console.log(msgObj);
      return msgObj.message ? "" + msgObj.message : '';
  };
  template.defaults.imports.customParse = customParse;
  template.defaults.imports.customParse2 = customParse2;
  var htmlFormat = function (msg) {
      var msgarray = msg.split("|");
      return msgarray;
  };
  template.defaults.imports.htmlFormat = htmlFormat;
  var render = template.compile(document.getElementById('tpl-msg').innerHTML);
  var ulUnread = document.getElementById('ulUnread');
  var ulRead = document.getElementById('ulRead');
  var getUnreadList = function () {
      api_1.api.getUnreadList({ status: 0 }, function (data) {
          var json = {
              data: data,
              lpg: util_1.Languages.package
          };
          ulUnread.innerHTML = render(json);
      });
  };
  getUnreadList();
  $(ulUnread).add(ulRead).on('click', '.btnAgree,.btnDeny', function () {
      var btn = $(this), activityContentId = ~~btn.data('acid'), accept = ~~btn.data('accept'), type = ~~btn.data('type');
      if (type == 3) {
          api_1.api.replySchedule({ id: activityContentId, accept: accept }, function (data) {
              btn.parent().replaceWith($("<div class=\"acceptTxt\">" + (accept == 1 ? util_1.Languages.package.agreed : util_1.Languages.package.denied) + "</div>"));
          });
      }
      else {
          api_1.api.reply({ activityContentId: activityContentId, accept: accept }, function (data) {
              btn.parent().replaceWith($("<div class=\"acceptTxt\">" + (accept == 1 ? util_1.Languages.package.agreed : util_1.Languages.package.denied) + "</div>"));
          });
      }
  });
  var getReadList = function () {
      api_1.api.getReadList({ status: -1 }, function (data) {
          var json = {
              data: data,
              lpg: util_1.Languages.package
          };
          ulRead.innerHTML = render(json);
      });
  };
  getReadList();
  $('#msgWhole').on('tap', '.unread', function () {
      var sender = this;
      api_1.api.setRead({ msgId: this.getAttribute('data-id') }, function (data) {
          sender.className = 'mui-navigate-right';
      });
  });
  mui("#segmentedControl").on('tap', '.mui-control-item', function () {
      var href = this.getAttribute("href");
      if (href == '#divUnread') {
          getUnreadList();
      }
      else if (href == '#divRead') {
          getReadList();
      }
  });
  //# sourceMappingURL=/itb-dist/wap/pages/msgBox/msgBox.js.map?__=1552030651276
  

});
