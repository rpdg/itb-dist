define('pages/content/message/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var store_1 = require("ts/util/store.ts");
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      getAllRole: 'role/GetAllRole',
      'getRoleUserList!post': 'user/SearchUsersByRoleAndUserNameKeyword',
      'sendMessageToUsers!post': 'message/SendMessageToUsers',
      'sendMessageToAll!post': 'message/SendMessageToAllUsers',
  });
  var lpg = Languages_1.Languages.package;
  var form = $('#tbSearch');
  var panel = opg_ts_1.default.wrapPanel('#tbSearch', {
      title: "" + lpg.searchUser,
      btnSearchText: "<i class=\"ico-find\"></i> " + lpg.search,
      btnSearchClick: function () {
          var param = $('#tbSearch').fieldsToJson();
          param.pageIndex = 0;
          tb.update(param);
      },
  });
  var selRole = opg_ts_1.default('#roleId').listBox({
      api: opg_ts_1.default.api.getAllRole,
  });
  $.when(selRole.createdPromise).then(function () {
      panel.btnSearch.trigger('click');
  });
  var permission = store_1.store.get('permission');
  var tbButtons = [];
  if (permission) {
      if (permission['SendMessage']) {
          tbButtons.push({ id: 'btnBatchSend', className: 'btn-warning', html: "" + lpg.sendBatchMsg });
      }
  }
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.getRoleUserList,
      lazy: true,
      titleBar: {
          title: "" + lpg.list,
          buttons: tbButtons,
      },
      columns: [
          {
              text: 'ID', width: 60,
              src: 'user_id',
          },
          {
              text: "" + lpg.userName, width: 100,
              src: 'username',
          },
          {
              text: "" + lpg.roleName, width: 100,
              src: 'name',
          },
          {
              text: "" + lpg.email, width: 200,
              src: 'email',
          },
          {
              text: "" + lpg.barcode, width: 200,
              src: 'barcode',
          },
          {
              text: "" + lpg.qrcode,
              src: 'qrcode',
              render: function (qrcode) { return "<img src=\"" + qrcode + "\" />"; }
          },
          {
              text: lpg.process,
              src: 'user_id',
              width: 230,
              render: function (id, index, row) {
                  var html = '';
                  if (permission['SendMessage']) {
                      html += "<button data-id=\"" + id + "\" data-name=\"" + row.username + "\" class=\"btn-mini btn-warning sendOne\">" + lpg.sendMsg + "</button> ";
                  }
                  if (permission['QueryMessage']) {
                      html += "<button data-id=\"" + id + "\" data-name=\"" + row.username + "\" class=\"btn-mini btn-info\">" + lpg.viewThisUserAllMsg + "</button> ";
                  }
                  return html;
              },
          },
      ],
      pagination: true,
  });
  //view
  var infoPage = '/itb-dist/pc/pages/content/message/view.html?__='.split('?')[0];
  tb.tbody.on('click', '.btn-info', function () {
      var btn = $(this), id = btn.data('id'), name = btn.data('name');
      var pop = opg_ts_1.default.popTop("<iframe src=\"" + infoPage + "?id=" + id + "\" />", {
          title: lpg.viewThisUserAllMsg + ": " + name,
          btnMax: true,
          width: 900,
          height: 550,
          onClose: function () {
              tb.update();
          }
      });
  });
  var addPage = '/itb-dist/pc/pages/content/message/send.html?__=2255ea9';
  //send
  tb.tbody.on('click', '.btn-warning', function () {
      var btn = $(this), id = btn.data('id'), name = btn.data('name');
      var pop = opg_ts_1.default.popTop("<iframe src=\"" + addPage + "\" />", {
          title: lpg.sendMsg + ": " + name,
          width: 600,
          height: 420,
          buttons: {
              send: {
                  className: 'btn-success',
                  text: lpg.sendMsg,
                  onClick: function (i, ifr) {
                      console.log(id);
                      var msg = ifr.getMsg();
                      if (msg)
                          sendMsg([id], msg, pop);
                      return true;
                  }
              },
              cancel: lpg.cancel
          }
      });
  });
  //batch send
  $('#btnBatchSend').click(function () {
      var pop = opg_ts_1.default.popTop("<iframe src=\"" + addPage + "\" />", {
          title: "" + lpg.sendBatchMsg,
          width: 600,
          height: 420,
          buttons: {
              send: {
                  className: 'btn-warning',
                  text: lpg.sendMsgToThisPage,
                  onClick: function (i, ifr) {
                      var msg = ifr.getMsg();
                      if (msg) {
                          var ids_1 = [];
                          tb.data.map(function (user) {
                              ids_1.push(user.user_id);
                          });
                          sendMsg(ids_1, msg, pop);
                      }
                      return true;
                  }
              },
              sendAll: {
                  className: 'btn-success',
                  text: lpg.sendMsgToAll,
                  onClick: function (i, ifr) {
                      var msg = ifr.getMsg();
                      if (msg)
                          opg_ts_1.default.api.sendMessageToAll(msg, function () {
                              pop.close();
                          });
                      return true;
                  }
              },
              cancel: lpg.cancel
          }
      });
  });
  function sendMsg(userIds, message, pop) {
      opg_ts_1.default.api.sendMessageToUsers({ userIds: userIds, message: message }, function (data) {
          pop.close();
      });
  }
  //# sourceMappingURL=/itb-dist/pc/pages/content/message/index.js.map?__=
  

});
