define('pages/roles/role/info.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var store_1 = require("ts/util/store.ts");
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      getInfo: 'role/GetRoleUsersById?roleId={角色Id}',
      'add!post': 'role/addrole',
      'update!post': 'role/uprole',
  });
  var id = opg_ts_1.default.request['id'];
  var form = $('#tbSearch');
  if (id) {
      //debugger;
      var cache = store_1.Cache.getInstance();
      var roleData = cache.get('cur_data');
      form.jsonToFields(roleData);
  }
  window['doSave'] = function (popWin, table) {
      var param = form.fieldsToJson({
          name: {
              name: Languages_1.Languages.package.roleName,
              type: 'ns',
              require: true,
          },
      });
      if (!param)
          return true;
      var action;
      if (id) {
          action = 'update';
          param.id = id;
      }
      else {
          action = 'add';
      }
      return opg_ts_1.default.api[action](param, function () {
          popWin.close();
          table.update();
      });
  };
  //# sourceMappingURL=/itb-dist/pc/pages/roles/role/info.js.map?__=
  

});
