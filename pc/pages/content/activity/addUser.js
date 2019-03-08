define('pages/content/activity/addUser.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  opg_ts_1.default.api({
      getAllRole: 'role/GetAllRole',
      'getRoleUserList!post': 'user/SearchUsersByRoleAndUserNameKeyword',
      'addUsers!post': 'activity/BatchAddActivityContentUser',
  });
  var subjectId = ~~opg_ts_1.default.request['subjectId'];
  var lpg = Languages_1.Languages.package;
  var moduleName = lpg.addUser;
  var form = $('#tbSearch');
  var panel = opg_ts_1.default.wrapPanel('#tbSearch', {
      title: "" + moduleName,
      btnSearchText: "<i class=\"ico-find\"></i> " + lpg.search,
      btnSearchClick: function () {
          var param = form.fieldsToJson();
          param.pageIndex = 0;
          tbUsers.update(param);
      },
  });
  var selRole = opg_ts_1.default('#roleId').listBox({
      api: opg_ts_1.default.api.getAllRole,
      autoPrependBlank: false,
  });
  $.when(selRole.createdPromise).then(function () {
      panel.btnSearch.trigger('click');
  });
  var tbUsers = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.getRoleUserList,
      lazy: true,
      titleBar: {
          title: "" + moduleName + lpg.list,
      },
      columns: [
          {
              text: ' ',
              cmd: 'checkAll',
              src: 'user_id',
          },
          {
              text: "" + lpg.userLoginName,
              src: 'username',
          },
          {
              text: "" + lpg.realName,
              src: 'firstname',
              render: function (fn, i, row) { return (fn || '') + " " + (row.lastname || ''); },
          },
          {
              text: "" + lpg.roleName,
              src: 'name',
          },
      ],
      pagination: {
          pageSize: 5,
          customizable: [5, 10, 20],
      },
  });
  window['save'] = function (pop, tb) {
      var ids = tbUsers.getCheckedValue();
      if (!ids.length) {
          return opg_ts_1.default.warn(lpg.nullSelectWarn);
      }
      var activityContentUsers = [];
      ids.map(function (val) {
          activityContentUsers.push({
              'userId': ~~val,
              'isSendInvite': 0,
          });
      });
      var param = {
          id: subjectId,
          activityContentUsers: activityContentUsers,
      };
      opg_ts_1.default.api.addUsers(param, function () {
          tb.update();
          //pop.close();
      });
  };
  //# sourceMappingURL=/itb-dist/pc/pages/content/activity/addUser.js.map?__=1552033897847
  

});
