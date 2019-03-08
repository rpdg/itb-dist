define('pages/exhibitionInfo/detail.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({
      getMain: 'mediaexhibtion/GetMediaExhibitonInfoSubjectById',
      getSub: 'mediaexhibtion/MediaExhibitionInfoById',
  });
  var informationId = util_1.request['id'];
  $.when(api_1.api.getMain({ id: informationId }, function (data) {
      document.getElementById('main').innerHTML = template('tpl-main', data[0]);
  })).then(function () {
      api_1.api.getSub({ informationId: informationId }, function (data) {
          if (data.length) {
              var html_1 = '';
              data.forEach(function (v) {
                  html_1 += "<p>" + v.content + "</p>";
              });
              document.getElementById('sub').innerHTML = html_1;
          }
      });
  });
  //# sourceMappingURL=/itb-dist/wap/pages/exhibitionInfo/detail.js.map?__=1552030651276
  

});
