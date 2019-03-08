define('pages/itb/news/detail.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var utils_1 = require("ts/util/utils.ts");
  api_1.api({
      getMain: 'Information/GetInformationSubjectById',
      getSub: 'Information/InformationById',
  });
  var informationId = utils_1.request['id'];
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
  //# sourceMappingURL=/itb-dist/pc/pages/itb/news/detail.js.map?__=1552033897847
  

});
