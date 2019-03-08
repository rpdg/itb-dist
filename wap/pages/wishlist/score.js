define('pages/wishlist/score.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  var act = util_1.Store.get('RoleName') === 'exhibition' ? 'exhibition' : 'buyer';
  api_1.api({
      exhibition_result: 'exhibition/ExhibitionWishListResult',
      buyer_result: 'buyer/BuyerWishListResult',
  });
  api_1.api[act + "_result"](function (res) {
      res.percent = (res.selected / res.max * 100).toFixed(0) + '%';
      var data = {
          result: res,
          resultTitle: util_1.Languages.package.resultTitle,
          selected: util_1.Languages.package.selected,
          atLeast: util_1.Languages.package.atLeast,
          atMost: util_1.Languages.package.atMost,
      };
      var mask = $("<div class=\"mask\" style=\"background-color: rgba(0,0,0,0.6)\"></div>");
      var htmlContent = template('tpl-result', data);
      mask.append(htmlContent);
      $('body').append(mask);
      mask.on('click', function () {
          history.back();
      });
  });
  //# sourceMappingURL=/itb-dist/wap/pages/wishlist/score.js.map?__=1552030651276
  

});
