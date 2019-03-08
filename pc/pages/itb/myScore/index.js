define('pages/itb/myScore/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var store_1 = require("ts/util/store.ts");
  opg_ts_1.default.api({
      score: 'buyer/BuyerScoreListByBarCode'
  });
  var lpg = Languages_1.Languages.package;
  var barcode = store_1.store.get('barcode');
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.score,
      param: { barcode: barcode },
      lazy: true,
      titleBar: {
          title: "" + lpg.list
      },
      columns: [
          {
              text: "" + lpg.th1, width: 400,
              src: 'title',
          },
          {
              text: "" + lpg.th2, width: 200,
              src: 'score',
          }
      ],
      pagination: false
  });
  function refreshtable() {
      tb.update();
  }
  refreshtable();
  //# sourceMappingURL=/itb-dist/pc/pages/itb/myScore/index.js.map?__=1552033897847
  

});
