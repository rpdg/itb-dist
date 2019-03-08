define('pages/content/message/view.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var store_ts_1 = require("ts/util/store.ts");
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      getMsg: 'message/GetMessageByUserId',
      delMsg: 'message/DelMessageByMsgId',
  });
  var userId = opg_ts_1.default.request['id'];
  var lpg = Languages_1.Languages.package;
  var msgTypes = {
      0: lpg.msg0,
      1: lpg.msg1,
      2: lpg.msg1,
  };
  var selStatus = $('#status').on('change', function () {
      tb.update({ status: selStatus.val() });
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
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.getMsg,
      param: {
          userId: userId,
          status: 0,
      },
      columns: [
          {
              text: lpg.msgSender,
              src: 'firstname',
              width: 100,
              render: function (firstname, i, row) {
                  return firstname + (row.lastname || '');
              },
          },
          {
              text: lpg.msgTitle,
              src: 'msgtitle',
              width: 200,
          },
          {
              text: lpg.msgType,
              src: 'msgtype',
              width: 100,
              render: function (type) { return msgTypes[type]; },
          },
          {
              text: lpg.msgContent,
              align: 'left',
              //src: 'msgcontent',
              render: function (id, index, row) {
                  if (row.msgtype == 3) {
                      return customParse(row.msgcontent);
                  }
                  else {
                      return row.msgcontent;
                  }
              }
          },
          {
              text: lpg.process,
              src: 'id',
              width: 80,
              render: function (id) {
                  return "<button data-id=\"" + id + "\" class=\"btn-mini btn-danger\">" + lpg.del + "</button> ";
              },
          },
      ],
  });
  //del
  tb.tbody.on('click', '.btn-danger', function () {
      var btn = $(this), msgId = btn.data('id');
      opg_ts_1.default.danger(lpg.del + " [<b>" + msgId + "</b>] ? ", function () {
          opg_ts_1.default.api.delMsg({ msgId: msgId }, function () { return tb.update(); });
      }, {
          title: "" + lpg.please + lpg.confirm,
      });
  });
  //# sourceMappingURL=/itb-dist/pc/pages/content/message/view.js.map?__=1552033897847
  

});
