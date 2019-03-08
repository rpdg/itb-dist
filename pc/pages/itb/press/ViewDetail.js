define('pages/itb/press/ViewDetail.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var utils_1 = require("ts/util/utils.ts");
  var opg_1 = require("ts/opg.ts");
  var page = '/itb-dist/pc/pages/itb/press/detail.html?__=11e22d0';
  var ViewDetail = /** @class */ (function () {
      function ViewDetail(id, winTitle) {
          var src = utils_1.url.setParam(page, { id: id });
          opg_1.default.popTop("<iframe src=\"" + src + "\"></iframe>", {
              title: winTitle,
              height: 600,
              width: 800,
              btnMax: true,
          });
      }
      return ViewDetail;
  }());
  exports.default = ViewDetail;
  //# sourceMappingURL=/itb-dist/pc/pages/itb/press/ViewDetail.js.map?__=1552033897847
  

});
