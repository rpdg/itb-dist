define('pages/content/activity/UserManage.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  var lng = Languages_1.Languages.package;
  var isInvitedHash = {
      '-1': lng.isInvitedHash['-1'],
      0: lng.isInvitedHash[0],
      1: lng.isInvitedHash[1],
  };
  var isAcceptedHash = {
      '-1': lng.isAcceptedHash[-1],
      0: lng.isAcceptedHash[0],
      1: lng.isAcceptedHash[1],
  };
  opg_1.default.api({
      getUser: 'activity/QueryActivityContentUsers',
      'addUser!post': 'activity/AddActivityContentUser',
      'delUser!post': 'activity/DelActivityContentUser',
      'sendInvite!post': 'activity/SendActivityContentInivte',
      'sendBatchInvite!post': 'activity/SendBatchActivityContentInivte',
      reply: 'activity/AllowOrDenyActivityContentForUserInBack',
  });
  var page = '/itb-dist/pc/pages/content/activity/addUser.html?__=1552033897847';
  var msgForm = $("<form style=\"padding: 2em;\">\n<p><input type=\"text\" style=\"width: 100%;\"  placeholder=\"" + lng.msgTitle + "\"></p>\n<p><textarea  style=\"width: 100%;\" placeholder=\"" + lng.content + "\"></textarea></p>\n</form>");
  var UserManage = /** @class */ (function () {
      function UserManage(subjectId) {
          var _this = this;
          this.subjectId = subjectId;
          var $tb = $('<table></table>');
          $tb.appendTo('body');
          this.tb = opg_1.default($tb).table({
              api: opg_1.default.api.getUser,
              param: {
                  activityContentId: subjectId,
              },
              titleBar: {
                  title: lng.user,
                  buttons: [
                      { id: 'btnBatch', className: 'btn-create', html: "" + lng.sendBatchInvite },
                      { id: 'btnAdd', className: 'btn-create', html: "<i class=\"ico ico-create\"></i> " + lng.add }
                  ],
              },
              columns: [
                  {
                      text: lng.userName, width: 200,
                      src: 'firstname',
                      render: function (firstname, i, row) {
                          return (firstname || '') + " " + (row.lastname || '');
                      },
                  },
                  {
                      text: lng.userRole, width: 150,
                      src: 'rolename',
                  },
                  {
                      text: lng.userLoginName,
                      src: 'username',
                  },
                  {
                      text: lng.isInvited,
                      src: 'invite',
                      width: 160,
                      render: function (invite, i, row) {
                          return "" + isInvitedHash[invite];
                      }
                  },
                  {
                      text: lng.isAccepted,
                      src: 'accept',
                      width: 130,
                      render: function (accept, i, row) {
                          if (accept == -1) {
                              return "<button class=\"btn-mini btn-success btnAgree\" data-userid=\"" + row.user_id + "\"  data-accept=\"1\">" + lng.agree + "</button> \n\t\t\t\t\t\t\t\t\t<button class=\"btn-mini btn-warning btnDeny\" data-userid=\"" + row.user_id + "\"  data-accept=\"0\">" + lng.deny + "</button>";
                          }
                          else {
                              return lng.isAcceptedHash[accept];
                          }
                      }
                  },
                  {
                      text: lng.rateScore,
                      src: 'evalutegetscore',
                  },
                  {
                      text: lng.signInScore,
                      src: 'signgetscore',
                  },
                  {
                      text: lng.process,
                      src: 'user_id',
                      width: 180,
                      render: function (id) {
                          return "\n\t\t\t\t\t\t\t<button data-id=\"" + id + "\" class=\"btn-mini btn-danger btnDel\">" + lng.del + "</button>\n\t\t\t\t\t\t\t<button data-id=\"" + id + "\" class=\"btn-mini btn-primary btnMsg\">" + lng.sendInvite + "</button>\n\t\t\t\t\t\t";
                      }
                  },
              ],
              pagination: true,
          });
          var self = this;
          this.tb.tbody.on('click', '.btnAgree,.btnDeny', function () {
              var btn = $(this), userId = ~~btn.data('userid'), accept = ~~btn.data('accept');
              opg_1.default.api.reply({ activityContentId: subjectId, userId: userId, accept: accept }, function (data) {
                  self.tb.update();
              });
          });
          //add
          $('#btnAdd').click(function () {
              _this.addUser();
          });
          //send batch message
          $('#btnBatch').click(function () {
              _this.msgUserBatch();
          });
          //delete
          this.tb.tbody.on('click', '.btnDel', function (e) {
              var btn = $(e.target), id = ~~btn.data('id');
              _this.deleteUser(id);
          });
          //send message
          this.tb.tbody.on('click', '.btnMsg', function (e) {
              var btn = $(e.target), id = ~~btn.data('id');
              _this.msgUser(id);
          });
      }
      UserManage.prototype.msgUserBatch = function () {
          var that = this;
          var param = $('#tbMain').fieldsToJson({});
          msgForm.find('input').val(param.title);
          msgForm.find('textarea').val(param.begindate + " " + param.time0 + "-" + param.time1 + "|" + param.location + "|" + param.content + "|" + param.note + "|" + that.subjectId);
          setTimeout(function () {
              top.opg.confirm(msgForm, function () {
                  var obj = {
                      "activityContentId": that.subjectId,
                      "message": {
                          "msgtype": 2,
                          "msgtitle": msgForm.find('input').val(),
                          "msgcontent": msgForm.find('textarea').val()
                      }
                  };
                  opg_1.default.api.sendBatchInvite(obj, function (data) {
                      opg_1.default.ok(lng.sendBatchInvite);
                      that.tb.update();
                      msgForm[0].reset();
                  });
              });
          }, 1000);
      };
      UserManage.prototype.msgUser = function (userId) {
          var that = this;
          var param = $('#tbMain').fieldsToJson({});
          msgForm.find('input').val(param.title);
          msgForm.find('textarea').val(param.begindate + " " + param.time0 + "-" + param.time1 + "|" + param.location + "|" + param.content + "|" + param.note + "|" + that.subjectId);
          setTimeout(function () {
              top.opg.confirm(msgForm, function () {
                  var obj = {
                      "activityContentId": that.subjectId,
                      "userId": userId,
                      "message": {
                          "msgtype": 2,
                          "userId": userId,
                          "msgtitle": msgForm.find('input').val(),
                          "msgcontent": msgForm.find('textarea').val()
                      }
                  };
                  opg_1.default.api.sendInvite(obj, function (data) {
                      opg_1.default.ok(lng.sendInvite);
                      that.tb.update();
                      msgForm[0].reset();
                  });
              });
          }, 1000);
      };
      UserManage.prototype.addUser = function () {
          var that = this;
          var src = utils_1.url.setParam(page, { subjectId: this.subjectId });
          var pop = top.opg.confirm("<iframe src=\"" + src + "\"></iframe>", function (i, ifr) {
              ifr.save(pop, that.tb);
              return true;
          }, {
              title: lng.addUser,
              btnMax: true,
              width: 800,
              height: 530,
              buttons: {
                  ok: lng.okb,
                  cancel: lng.cancelb
              }
          });
      };
      UserManage.prototype.deleteUser = function (id) {
          var that = this;
          var pop = opg_1.default.confirm(lng.deleteGuestConfirm, function () {
              opg_1.default.api.delUser({ activityContentId: that.subjectId, userId: id }, function (data) {
                  that.tb.update();
                  pop.close();
              });
              return true;
          });
      };
      return UserManage;
  }());
  exports.default = UserManage;
  //# sourceMappingURL=/itb-dist/pc/pages/content/activity/UserManage.js.map?__=1552033897847
  

});
