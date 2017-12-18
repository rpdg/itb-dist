define('pages/content/carousel/add.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      getInformation: 'Information/QueryAllEnableInformations',
      'addCarousel!post': 'canrousel/AddCanrousel',
  });
  $('#type').on('change', function () {
      tb.update({ type: $(this).val(), pageIndex: 0, pageSize: 10 });
  });
  var tb = opg_ts_1.default('#tbResult').table({
      api: opg_ts_1.default.api.getInformation,
      param: { type: 0 },
      titleBar: {
          title: "" + Languages_1.Languages.package.news + Languages_1.Languages.package.list,
      },
      columns: [
          {
              text: ' ',
              src: 'id', cmd: 'checkOne',
          },
          {
              text: "" + Languages_1.Languages.package.news + Languages_1.Languages.package.title,
              src: 'title',
          },
      ],
      pagination: {
          pageSize: 20,
      },
  });
  var form = $('#tbSearch');
  window['doSave'] = function (popWin, table) {
      var informationId = tb.getCheckedValue();
      if (!informationId) {
          opg_ts_1.default.warn("" + Languages_1.Languages.package.nullSelectWarn);
          return true;
      }
      var param = form.fieldsToJson({
          title: {
              name: Languages_1.Languages.package.title,
              type: 'ns',
              require: true,
          },
      });
      if (!param)
          return true;
      param.informationId = informationId;
      return opg_ts_1.default.api.addCarousel(param, function () {
          popWin.close();
          table.update();
      });
  };
  //# sourceMappingURL=/itb-dist/pc/pages/content/carousel/add.js.map?__=
  

});
