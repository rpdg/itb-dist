define('pages/content/activity/UserManage.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  var lng = Languages_1.Languages.package;
  var isInvitedHash = {
      '-1': '',
      0: lng.isInvitedHash[0],
      1: lng.isInvitedHash[1],
  };
  var isAcceptedHash = {
      '-1': '',
      0: lng.isAcceptedHash[0],
      1: lng.isAcceptedHash[1],
  };
  var page = '/itb-dist/pc/pages/content/activity/addUser.html?__=c468ea0';
  var UserManage = /** @class */ (function () {
      function UserManage(subjectId) {
          var _this = this;
          opg_1.default.api({
              getUser: 'activity/QueryActivityContentUsers',
              'addUser!post': 'activity/AddActivityContentUser',
              'delUser!post': 'activity/DelActivityContentUser',
          });
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
                      { id: 'btnAdd', className: 'btn-create', html: "<i class=\"ico ico-create\"></i> " + lng.add },
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
                      render: function (invite) { return isInvitedHash[invite]; },
                  },
                  {
                      text: lng.isAccepted,
                      src: 'accept',
                      render: function (accept) { return isAcceptedHash[accept]; },
                  },
                  {
                      text: lng.process,
                      src: 'user_id',
                      width: 100,
                      render: function (id) { return "<button data-id=\"" + id + "\" class=\"btn-mini btn-danger btnDel\">" + lng.del + "</button>"; },
                  },
              ],
              pagination: true,
          });
          //add
          $('#btnAdd').click(function () {
              _this.addUser();
          });
          //delete
          this.tb.tbody.on('click', '.btnDel', function (e) {
              var btn = $(e.target), id = ~~btn.data('id');
              _this.deleteUser(id);
          });
      }
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
  //# sourceMappingURL=/itb-dist/pc/pages/content/activity/UserManage.js.map?__=
  

});
