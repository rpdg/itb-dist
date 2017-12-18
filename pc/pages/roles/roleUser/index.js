define('pages/roles/roleUser/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var store_1 = require("ts/util/store.ts");
  opg_ts_1.default.api({
      getAllRole: 'role/GetAllRole',
      'getRoleUserList!post': 'user/SearchUsersByRoleAndUserNameKeyword',
      delRoleUser: 'user/DelUserRoleByUserIdAndRoleId',
  });
  var lpg = Languages_1.Languages.package;
  var moduleName = lpg.moduleName;
  var form = $('#tbSearch');
  var panel = opg_ts_1.default.wrapPanel('#tbSearch', {
      title: "" + moduleName,
      btnSearchText: "<i class=\"ico-find\"></i> " + lpg.search,
      btnSearchClick: function () {
          var param = form.fieldsToJson();
          param.pageIndex = 0;
          tb.update(param);
      },
  });
  var selRole = opg_ts_1.default('#roleId').listBox({
      api: opg_ts_1.default.api.getAllRole,
      autoPrependBlank: false,
  });
  $.when(selRole.createdPromise).then(function () {
      panel.btnSearch.trigger('click');
  });
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.getRoleUserList,
      lazy: true,
      titleBar: {
          title: "" + moduleName + lpg.list,
          buttons: [{ id: 'btnAdd', className: 'btn-create', html: "<i class=\"ico ico-create\"></i> " + lpg.add }],
      },
      columns: [
          {
              text: "ID", width: 100,
              src: 'user_id',
          },
          {
              text: "" + lpg.userName,
              src: 'username',
          },
          {
              text: "" + lpg.realName,
              src: 'firstname',
              render: function (fn, i, row) { return (fn || '') + " " + (row.lastname || ''); }
          },
          {
              text: "" + lpg.roleName,
              src: 'name',
          },
          {
              text: "" + lpg.process,
              src: 'user_id',
              width: 100,
              render: function (id, i, row) {
                  //console.log(arr);
                  return "\n\t\t\t\t\t\t<button class=\"btn-mini btn-danger\" data-id=\"" + id + "\" data-title=\"" + row.username + "\">" + lpg.del + "</button>\n\t\t\t\t";
              },
          },
      ],
      pagination: true,
  });
  var cache = store_1.Cache.getInstance();
  var infoPage = '/itb-dist/pc/pages/roles/roleUser/info.html?__=df3f991'.split('?')[0];
  //Add
  $('#btnAdd').click(function () {
      var pop = top.opg.confirm("<iframe src=\"" + infoPage + "?roleId=" + selRole.getValue() + "\" />", function (i, ifr) {
          return ifr.doSave(pop, tb);
      }, {
          title: "" + lpg.add + moduleName,
          btnMax: true,
          width: 700,
          height: 550,
          buttons: {
              ok: "" + lpg.save + moduleName,
              cancel: lpg.cancel,
          },
      });
  });
  //del
  tb.tbody.on('click', '.btn-danger', function () {
      var btn = $(this), title = btn.data('title'), roleId = btn.data('id');
      opg_ts_1.default.danger(lpg.del + " [<b>" + title + "</b>] ? ", function () {
          opg_ts_1.default.api.delRoleUser({ roleId: roleId }, function () { return tb.update(); });
      }, {
          title: "" + lpg.please + lpg.confirm,
      });
  });
  //# sourceMappingURL=/itb-dist/pc/pages/roles/roleUser/index.js.map?__=
  

});
