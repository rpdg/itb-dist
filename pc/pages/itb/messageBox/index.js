define('pages/itb/messageBox/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var store_ts_1 = require("ts/util/store.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var opg_1 = require("ts/opg.ts");
  api_1.api({
      getList: 'message/GetMessageByCurrentUser',
      setRead: 'message/UpMessageStatusByMsgId?status=1',
      reply: 'activity/AllowOrDenyActivityContentForUser',
      replySchedule: 'schedule/AllowOrDenyScheduleForUser' // 0是拒绝 1是同意
  });
  var lpg = Languages_1.Languages.package;
  var moduleName = lpg.moduleName;
  var currentState = -1;
  api_1.api.replySchedule.set('onError', function (code, error, callback) {
      if (code === 200 && (error === 'AllowOrDenyScheduleForUser_Error01' || error === 'AllowOrDenyScheduleForUser_Error02' || error === 'AllowOrDenyScheduleForUser_Error03')) {
          var errorMsg = lpg['tips'];
          top.opg.confirm("" + errorMsg, function () {
          });
      }
  });
  opg_1.default.wrapPanel('#tbSearch', {
      title: "" + moduleName,
      btnSearchId: null,
  });
  var selStatus = $('#status').on('change', function () {
      currentState = ~~selStatus.val();
      tb.update({ status: currentState });
  });
  var curLng = store_ts_1.store.get('lngPkg');
  var customParse = function (msg) {
      var msgObj = JSON.parse(msg);
      if (curLng == 'cn') {
          return Languages_1.Languages.package['scheduleMsgTpl']
              .replace('{company}', msgObj.fromCompanyCn ? msgObj.fromCompanyCn + "\u516C\u53F8" : '')
              .replace('{title}', msgObj.fromTitleCn ? "" + msgObj.fromTitleCn : '')
              .replace('{name}', msgObj.fromNameCn)
              .replace('{time}', msgObj.date);
      }
      else {
          return Languages_1.Languages.package['scheduleMsgTpl']
              .replace('{company}', msgObj.fromCompany ? msgObj.fromCompany + " Company " : '')
              .replace('{title}', msgObj.fromTitle ? "" + msgObj.fromTitle : '')
              .replace('{name}', msgObj.fromName)
              .replace('{time}', msgObj.date);
      }
  };
  var customParse2 = function (msg) {
      var msgObj = JSON.parse(msg);
      return msgObj.message ? "" + msgObj.message : '';
  };
  var htmlFormat = function (msg) {
      var msgarray = msg.split("|");
      return msgarray;
  };
  var tb = opg_1.default('#tb').table({
      api: opg_1.default.api.getList,
      param: { status: -1 },
      titleBar: {
          title: "" + moduleName + lpg.list,
      },
      columns: [
          {
              text: lpg.msgtitle,
              width: 300,
              src: 'msgtitle',
          },
          {
              text: "" + lpg.msgcontent,
              //src: 'msgcontent',
              render: function (id, i, row) {
                  var html = "";
                  if (row.msgtype == 3) {
                      html += "<div>" + customParse(row.msgcontent) + "</div>";
                  }
                  else if (row.msgtype == 1 || row.msgtype == 0) {
                      html += "<div>" + customParse2(row.msgcontent) + "</div>";
                  }
                  else if (row.msgtype == 2) {
                      var s = '';
                      for (var hf = 0, itemf; hf < htmlFormat(row.msgcontent).length, itemf = htmlFormat(row.msgcontent)[hf]; hf++) {
                          if (hf < htmlFormat(row.msgcontent).length - 1) {
                              s = s + itemf + '<br/>';
                          }
                      }
                      html += "<div>" + s + "</div>";
                  }
                  else {
                      var content = row.msgcontent.split("|");
                      html += "<div>" + content[0] + " Meeting with " + content[2] + " at booth:" + content[1] + ".（您与" + content[2] + "有一场会议，展位：" + content[1] + "。）" + "</div>";
                  }
                  return html;
              }
          },
          {
              text: "" + lpg.from,
              width: 150,
              src: 'firstname',
              render: function (fn, i, row) { return (fn || '') + " " + (row.lastname || ''); }
          },
          {
              text: "" + lpg.process,
              src: 'id',
              width: 250,
              render: function (id, i, item) {
                  //console.log(arr);
                  var html = (item.status === 0 ? "<button class=\"btn-mini btn-info btnSet\" data-id=\"" + id + "\">" + lpg.setRead + "</button> " : '');
                  if (item.msgtype == 2) {
                      if (item.accept == -1) {
                          html += "\n\t\t\t\t\t\t\t\t<button class=\"btn-mini btn-success btnAgree\" data-acid=\"" + item.activityContentId + "\" data-accept=\"1\">" + lpg.agree + "</button>\n\t\t\t\t\t\t\t\t<button class=\"btn-mini btn-danger btnDeny\" data-acid=\"" + item.activityContentId + "\" data-accept=\"0\">" + lpg.deny + "</button>\n\t\t\t\t\t\t\t";
                      }
                      else {
                          html += (item.accept == 1 ? lpg.agreed : lpg.denied);
                      }
                  }
                  else if (item.msgtype == 3) {
                      if (item.scheduleaccept == -1) {
                          html += "\n\t\t\t\t\t\t\t\t<button class=\"btn-mini btn-success btnAgreeSchedule\" data-acid=\"" + item.id + "\" data-accept=\"1\">" + lpg.agree + "</button>\n\t\t\t\t\t\t\t\t<button class=\"btn-mini btn-danger btnDenySchedule\" data-acid=\"" + item.id + "\" data-accept=\"0\">" + lpg.deny + "</button>\n\t\t\t\t\t\t\t";
                      }
                      else {
                          html += (item.scheduleaccept == 1 ? lpg.agreed : lpg.denied);
                      }
                  }
                  return html;
              },
          },
      ],
      pagination: false,
  });
  tb.tbody.on('click', '.btnSet', function () {
      api_1.api.setRead({ msgId: this.getAttribute('data-id') }, function (data) { return tb.update(); });
  });
  tb.tbody.on('click', '.btnAgree,.btnDeny', function () {
      var btn = $(this), activityContentId = ~~btn.data('acid'), accept = ~~btn.data('accept');
      api_1.api.reply({ activityContentId: activityContentId, accept: accept }, function (data) { return tb.update(); });
  });
  tb.tbody.on('click', '.btnAgreeSchedule,.btnDenySchedule', function () {
      var btn = $(this), id = ~~btn.data('acid'), accept = ~~btn.data('accept');
      api_1.api.replySchedule({ id: id, accept: accept }, function (data) { return tb.update(); });
  });
  //# sourceMappingURL=/itb-dist/pc/pages/itb/messageBox/index.js.map?__=1552033897847
  

});
