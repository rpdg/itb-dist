define('pages/system/forbiddenWords/edit.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      'add!post': 'disablewords/AddDisableWord',
      'update!post': 'disablewords/updsiableword',
  });
  var id = opg_ts_1.default.request['id'];
  var form = $('#tbSearch');
  if (id) {
      $('#word').val(opg_ts_1.default.request['word']);
  }
  window['doSave'] = function (popWin, table) {
      var param = form.fieldsToJson({
          word: {
              name: Languages_1.Languages.package.forbiddenWords,
              type: 'ns',
              require: true,
          },
      });
      if (!param)
          return true;
      var action;
      if (id) {
          action = 'update';
          var apiUpdateUrl = opg_ts_1.default.api.update.toString();
          opg_ts_1.default.api.update.set('url', apiUpdateUrl + "/" + id);
      }
      else {
          action = 'add';
      }
      return opg_ts_1.default.api[action](param, function () {
          popWin.close();
          table.update();
      });
  };
  //# sourceMappingURL=/itb-dist/pc/pages/system/forbiddenWords/edit.js.map?__=1552033897847
  

});
