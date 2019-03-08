define('pages/exhibitionInfo/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  api_1.api({
      types: 'meinfotype/GetMediaExhibtionInfoType?type=1'
  });
  api_1.api.types(function (data) {
      var html = '';
      data.forEach(function (v) {
          html += "<li><b class=\"padRed\"></b> <a href=\"./list.html?id=" + v.id + "\">" + v.name + "</a></li>";
      });
      document.getElementById('ulBuyerList').innerHTML = html;
  });
  //# sourceMappingURL=/itb-dist/wap/pages/exhibitionInfo/index.js.map?__=1552030651276
  

});
