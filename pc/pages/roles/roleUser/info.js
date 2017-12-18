define('pages/roles/roleUser/info.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  opg_ts_1.default.api({
      getAllRole: 'role/GetAllRole',
      'getRoleUserList!post': 'user/SearchUsersByRoleAndUserNameKeyword',
      insertUserRole: 'user/InsertUserRole',
  });
  var lpg = Languages_1.Languages.package;
  var moduleName = lpg.moduleName;
  var form = $('#tbSearch');
  var panel = opg_ts_1.default.wrapPanel('#tbSearch', {
      title: "" + moduleName,
      btnSearchText: "<i class=\"ico-find\"></i> " + lpg.search,
      btnSearchClick: function () {
          var param = form.fieldsToJson();
          tb.update(param);
      },
  });
  opg_ts_1.default('#roleId').listBox({
      api: opg_ts_1.default.api.getAllRole,
  });
  var tb = opg_ts_1.default('#tbResult').table({
      api: opg_ts_1.default.api.getRoleUserList,
      //lazy: true,
      titleBar: {
          title: "" + moduleName + lpg.list,
      },
      columns: [
          {
              text: ' ',
              src: 'id', cmd: 'checkOne',
          },
          {
              text: "" + lpg.userName,
              src: 'username',
          },
          {
              text: "" + lpg.realName,
              src: 'firstname',
              render: function (fn, i, row) { return fn + " " + (row.lastname || ''); }
          },
          {
              text: "" + lpg.roleName,
              src: 'name',
          },
      ],
      pagination: true,
  });
  window['doSave'] = function (popWin, table) {
      var userId = tb.getCheckedValue();
      if (!userId) {
          opg_ts_1.default.warn("" + Languages_1.Languages.package.nullSelectWarn);
          return true;
      }
      return opg_ts_1.default.api.insertUserRole({ userId: userId, roleId: opg_ts_1.default.request['roleId'] }, function () {
          popWin.close();
          table.update();
      });
  };
  //# sourceMappingURL=/itb-dist/pc/pages/roles/roleUser/info.js.map?__=
  

});
