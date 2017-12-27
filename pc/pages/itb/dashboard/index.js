define('pages/itb/dashboard/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  api_1.api({
      getCarousel: 'canrousel/GetAllCanrousel',
      getAnnouncement: 'Information/QueryAllEnableInformations?type=1&pageIndex=0&pageSize=2',
      getSubjects: 'Information/InformationById',
  });
  api_1.api.getSubjects.set('unlimited', true);
  api_1.api.getCarousel(function (data) {
      document.getElementById('swiper').innerHTML = template('tpl-swiper', data);
      new Swiper('#swiper', {
          autoplay: {
              delay: 2500,
              disableOnInteraction: false,
          },
          navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
          },
          pagination: {
              el: '.swiper-pagination',
          },
      });
  });
  api_1.api.getAnnouncement(function (data) {
      var results = data.results;
      if (results && results.length) {
          getSubject(results, function (list) {
              console.log(list);
              document.getElementById('an1').innerHTML = template('tpl-news', list);
          });
      }
  });
  function getSubject(list, callback) {
      var i = 0, l = list.length, n = 0;
      var _loop_1 = function () {
          var an = list[i];
          api_1.api.getSubjects({ informationId: an.id }, function (data) {
              an['subjects'] = data;
              if (++n === l) {
                  callback(list);
              }
          });
      };
      for (; i < l; i++) {
          _loop_1();
      }
  }
  //# sourceMappingURL=/itb-dist/pc/pages/itb/dashboard/index.js.map?__=
  

});
