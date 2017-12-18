define('pages/wishlist/wishlist.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  api_1.api({});
  var swiper = new Swiper('.swiper-container', {
      slidesPerView: 'auto',
      centeredSlides: true,
      loop: true,
      loopFillGroupWithBlank: true,
      spaceBetween: 30,
  });
  var tmpl = template.compile(document.getElementById('tpl-result').innerHTML);
  $('#like').click(function () {
      var mask = $("<div class=\"mask\"></div>");
      mask.append(tmpl({ result: 50 }));
      mask.on('click', function () {
          mask.remove();
      });
      $('body').append(mask);
  });
  //# sourceMappingURL=/itb-dist/wap/pages/wishlist/wishlist.js.map?__=
  

});
