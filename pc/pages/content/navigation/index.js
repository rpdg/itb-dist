define('pages/content/navigation/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var store_1 = require("ts/util/store.ts");
  var cache = store_1.Cache.getInstance();
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      'list!post': 'Information/QueryInformations',
      setStick: 'Information/SetInformationStick',
      cancelStick: 'Information/CancelInformationStick',
      'setStatus!post': 'Information/EnableOrDisableInformationById',
  });
  var lpg = Languages_1.Languages.package;
  var infoPage = '/itb-dist/pc/pages/content/sponsor/add.html?__=1552033897847';
  var moduleName = lpg.sponsor;
  var panel = opg_ts_1.default.wrapPanel('#tbSearch', {
      title: "" + moduleName + lpg.search,
      btnSearchText: "<i class=\"ico-find\"></i> " + lpg.search,
      btnSearchClick: function () {
          var param = $('#tbSearch').fieldsToJson();
          if (param.beginDate && param.beginDate.indexOf(' ') < 0) {
              param.beginDate += ' 00:00:00';
          }
          if (param.endDate && param.endDate.indexOf(' ') < 0) {
              param.endDate += ' 23:59:59';
          }
          //console.log(panel.jq, param);
          tb.update(param);
      },
  });
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.list,
      param: { informationType: 2 },
      titleBar: {
          title: "" + lpg.list,
      },
      columns: [
          {
              text: 'ID', width: 120,
              src: 'id',
          },
          {
              text: lpg.barcode,
              src: 'title',
          },
          {
              text: lpg.company,
              src: 'status',
              width: 100,
              render: function (v) { return v ? lpg.online : lpg.offline; },
          },
      ],
      pagination: true,
  });
  //# sourceMappingURL=/itb-dist/pc/pages/content/navigation/index.js.map?__=1552033897847
  

});
