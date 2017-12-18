define('pages/roles/role/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var store_1 = require("ts/util/store.ts");
  opg_ts_1.default.api({
      getAll: 'role/GetAllRole',
      delete: 'role/DelRole',
      getCount: 'canrousel/GetCurCanrouselCount',
      setCount: 'canrousel/SetCurCanrouselCount',
      'position!post': 'canrousel/ChangeCanrouselPosition',
  });
  var lpg = Languages_1.Languages.package;
  var moduleName = lpg.role;
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.getAll,
      titleBar: {
          title: "" + moduleName + lpg.list,
          buttons: [{ id: 'btnAdd', className: 'btn-create', html: "<i class=\"ico ico-create\"></i> " + lpg.add }],
      },
      columns: [
          {
              text: "ID", width: 120,
              src: 'id',
          },
          {
              text: "" + lpg.roleName,
              src: 'name',
          },
          {
              text: "" + lpg.roleDesc,
              src: 'desc',
          },
          {
              text: "" + lpg.process,
              src: 'id',
              width: 200,
              render: function (id, i, row) {
                  //console.log(arr);
                  return "\n\t\t\t\t\t\t<button class=\"btn-mini btn-info\" data-id=\"" + id + "\" data-index=\"" + row[':index'] + "\" data-title=\"" + row.name + "\">" + lpg.edit + "</button> \n\t\t\t\t\t\t<button class=\"btn-mini btn-danger\" data-id=\"" + id + "\" data-title=\"" + row.name + "\">" + lpg.del + "</button>\n\t\t\t\t";
              },
          },
      ],
      pagination: false,
  });
  var cache = store_1.Cache.getInstance();
  var infoPage = '/itb-dist/pc/pages/roles/role/info.html?__=b79a8fe'.split('?')[0];
  //Edit
  tb.tbody.on('click', '.btn-info', function () {
      var btn = $(this), title = btn.data('title'), id = btn.data('id'), index = btn.data('index');
      var role = tb.data[index];
      cache.set('cur_data', role);
      var pop = top.opg.confirm("<iframe src=\"" + infoPage + "?id=" + id + "\" />", function (i, ifr) {
          return ifr.doSave(pop, tb);
      }, {
          title: "" + lpg.edit + moduleName + ": " + title,
          btnMax: true,
          width: 700,
          height: 400,
          buttons: {
              ok: "" + lpg.save + moduleName,
              cancel: lpg.cancel,
          },
      });
  });
  //Add
  $('#btnAdd').click(function () {
      var pop = top.opg.confirm("<iframe src=\"" + infoPage + "\" />", function (i, ifr) {
          return ifr.doSave(pop, tb);
      }, {
          title: "" + lpg.add + moduleName,
          btnMax: true,
          width: 700,
          height: 400,
          buttons: {
              ok: "" + lpg.save + moduleName,
              cancel: lpg.cancel,
          },
      });
  });
  //del
  tb.tbody.on('click', '.btn-danger', function () {
      var btn = $(this), title = btn.data('title'), roleId = btn.data('id');
      opg_ts_1.default.danger("" + lpg.del + lpg.role + " [<b>" + title + "</b>] ? ", function () {
          opg_ts_1.default.api.delete({ roleId: roleId }, function () { return tb.update(); });
      }, {
          title: "" + lpg.please + lpg.confirm,
      });
  });
  //# sourceMappingURL=/itb-dist/pc/pages/roles/role/index.js.map?__=
  

});
