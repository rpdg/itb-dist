define('pages/wishlist/wishlist.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({});
  new Swiper('#slider', {
      slidesPerView: 'auto',
      centeredSlides: true,
      loop: true,
      loopFillGroupWithBlank: true,
      spaceBetween: 30,
  });
  var tplDetail = template.compile(document.getElementById('tpl-detail').innerHTML);
  $('#slider').on('click', '.cont', function () {
      var data = {
          title: 'tuniu travel'
      };
      showMask(tplDetail(data));
  });
  $('#like').click(function () {
      showResult(20);
  });
  var tplResult = template.compile(document.getElementById('tpl-result').innerHTML);
  function showResult(percent) {
      var data = {
          result: percent,
          resultTitle: util_1.Languages.package.resultTitle,
          selected: util_1.Languages.package.selected,
          atLeast: util_1.Languages.package.atLeast,
          atMost: util_1.Languages.package.atMost,
      };
      showMask(tplResult(data));
  }
  function showMask(htmlContent) {
      var mask = $("<div class=\"mask\" style=\"background-color: rgba(0,0,0,0.6)\"></div>");
      mask.on('click', function () {
          mask.remove();
      });
      mask.append(htmlContent);
      $('body').append(mask);
  }
  //# sourceMappingURL=/itb-dist/wap/pages/wishlist/wishlist.js.map?__=
  

});
