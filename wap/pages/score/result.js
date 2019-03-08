define('pages/score/result.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({
      score: 'buyer/BuyerScoreListByBarCode',
  });
  var lng = util_1.Languages.package;
  var barcode = util_1.Store.get('barcode');
  api_1.api.score({ barcode: barcode }, function (data) {
      $('#resultlist').html(template('tpl-resultlist', data));
  });
  //# sourceMappingURL=/itb-dist/wap/pages/score/result.js.map?__=1552030651276
  

});
