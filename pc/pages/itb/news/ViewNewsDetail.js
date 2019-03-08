define('pages/itb/news/ViewNewsDetail.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var utils_1 = require("ts/util/utils.ts");
  var opg_1 = require("ts/opg.ts");
  var page = '/itb-dist/pc/pages/itb/news/detail.html?__=2011f69';
  var ViewNewsDetail = /** @class */ (function () {
      function ViewNewsDetail(id, winTitle) {
          var src = utils_1.url.setParam(page, { id: id });
          opg_1.default.popTop("<iframe src=\"" + src + "\"></iframe>", {
              title: winTitle,
              height: 600,
              width: 1000,
              btnMax: true,
          });
      }
      return ViewNewsDetail;
  }());
  exports.default = ViewNewsDetail;
  //# sourceMappingURL=/itb-dist/pc/pages/itb/news/ViewNewsDetail.js.map?__=1552033897847
  

});
