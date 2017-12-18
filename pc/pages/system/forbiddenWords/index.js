define('pages/system/forbiddenWords/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var store_1 = require("ts/util/store.ts");
  var utils_1 = require("ts/util/utils.ts");
  opg_ts_1.default.api({
      getAll: 'disablewords/GetAllDisableWords',
      deleteById: 'disablewords/DelDisableWordById',
  });
  var lpg = Languages_1.Languages.package;
  var moduleName = lpg.forbiddenWords;
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.getAll,
      titleBar: {
          title: moduleName + " " + lpg.list,
          buttons: [{ id: 'btnAdd', className: 'btn-create', html: "<i class=\"ico ico-create\"></i> " + lpg.add }],
      },
      columns: [
          {
              text: "ID", width: 120,
              src: 'id',
          },
          {
              text: lpg.forbiddenWords,
              src: 'word',
          },
          {
              text: "" + lpg.process,
              src: 'id',
              width: 200,
              render: function (id, i, row) {
                  //console.log(arr);
                  return "\n\t\t\t\t\t\t<button class=\"btn-mini btn-info\" data-id=\"" + id + "\"  data-word=\"" + row.word + "\">" + lpg.edit + "</button> \n\t\t\t\t\t\t<button class=\"btn-mini btn-danger\" data-id=\"" + id + "\" data-word=\"" + row.word + "\">" + lpg.del + "</button>\n\t\t\t\t";
              },
          },
      ],
      pagination: false,
  });
  var cache = store_1.Cache.getInstance();
  var infoPage = '/itb-dist/pc/pages/system/forbiddenWords/edit.html?__=8500909';
  //Edit
  tb.tbody.on('click', '.btn-info', function () {
      var btn = $(this), word = btn.data('word'), id = btn.data('id');
      var src = utils_1.url.setParam(infoPage, { id: id, word: word });
      var pop = top.opg.confirm("<iframe src=\"" + src + "\" />", function (i, ifr) {
          return ifr.doSave(pop, tb);
      }, {
          title: "" + lpg.edit + moduleName + ": " + word,
          width: 500,
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
          width: 500,
          buttons: {
              ok: "" + lpg.save + moduleName,
              cancel: lpg.cancel,
          },
      });
  });
  //del
  tb.tbody.on('click', '.btn-danger', function () {
      var btn = $(this), word = btn.data('word'), id = btn.data('id');
      opg_ts_1.default.danger("" + lpg.del + lpg.forbiddenWords + " [<b>" + word + "</b>] ? ", function () {
          opg_ts_1.default.api.deleteById({ id: id }, function () { return tb.update(); });
      }, {
          title: "" + lpg.please + lpg.confirm,
      });
  });
  //# sourceMappingURL=/itb-dist/pc/pages/system/forbiddenWords/index.js.map?__=
  

});
