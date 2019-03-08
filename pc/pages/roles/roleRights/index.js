define('pages/roles/roleRights/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  opg_ts_1.default.api({
      getAllRole: 'role/GetAllRole',
      getMenuByRoleId: 'role/GetRoleAllMenuByRoleId',
      getFullMenuWap: 'menu/GetMenusByType?menutype=0',
      getFullMenuPc: 'menu/GetMenusByType?menutype=1',
      'addRoleMenus!post': 'role/addrolemenus',
  });
  var apiAddRoleMenusUrl = opg_ts_1.default.api.addRoleMenus.toString();
  var lpg = Languages_1.Languages.package;
  var moduleName = lpg.moduleName;
  var form = $('#tbSearch'), spDesc = $('#desc');
  var treeWap, treePC;
  var panel = opg_ts_1.default.wrapPanel('#tbSearch', {
      title: "" + moduleName,
      btnSearchId: null,
  });
  var selRole = opg_ts_1.default('#roleId').listBox({
      api: opg_ts_1.default.api.getAllRole,
      autoPrependBlank: false,
      onSelect: function () {
          var data = this.selectedData;
          spDesc.text(data.desc || '');
          makeMenus(this.getValue());
      },
  });
  function makeMenus(roleId) {
      $(':checkbox').prop('checked', false);
      opg_ts_1.default.api.getMenuByRoleId({ roleId: roleId }, function (data) {
          data.map(function (val) {
              var id = val.id;
              var dom = document.getElementById(treeWap.treeName + "Chk_" + id);
              if (!dom) {
                  dom = document.getElementById(treePC.treeName + "Chk_" + id);
              }
              if (dom) {
                  dom.checked = true;
              }
          });
      });
  }
  $.when(selRole.createdPromise, opg_ts_1.default.api.getFullMenuWap(function (data) {
      treeWap = opg_ts_1.default('#treeMenuWap').tree({
          data: data,
          name: 'treeWap',
          root: 'App / WeChat',
          cmd: 'checkAll',
          childSrc: 'childMenus',
      });
  }), opg_ts_1.default.api.getFullMenuPc(function (data) {
      treePC = opg_ts_1.default('#treeMenuPC').tree({
          data: data,
          name: 'treePC',
          root: 'Web / back-end',
          cmd: 'checkAll',
          childSrc: 'childMenus',
      });
  })).then(function () {
      selRole.jq.trigger('change');
  });
  $('#btnSave').click(function () {
      var arr = [];
      $(':checkbox:checked', '#tb').each(function (i, elem) {
          arr.push(~~elem.value);
          var span = $(elem).closest('span');
          if (span.data('depth') == '2') {
              var ul = span.closest('ul'), pId = ul.data('parent');
              if (arr.indexOf(pId) === -1)
                  arr.push(~~pId);
          }
      });
      var api = opg_ts_1.default.api.addRoleMenus;
      api.set('url', apiAddRoleMenusUrl + "/" + selRole.getValue());
      console.log(arr);
      console.log(opg_ts_1.default.api.addRoleMenus);
      opg_ts_1.default.api.addRoleMenus(arr, function () {
      });
  });
  //# sourceMappingURL=/itb-dist/pc/pages/roles/roleRights/index.js.map?__=1552033897847
  

});
