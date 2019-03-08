define('pages/news/detail.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({
      getMain: 'Information/GetInformationSubjectById',
      getSub: 'Information/InformationById',
  });
  var informationId = util_1.request['id'];
  var comepage = util_1.request['comepage'];
  if (util_1.request['type'] == 2) {
      $('.mui-title').text(util_1.Languages.package.sponsor);
      $('#aBack').attr('href', util_1.url.setParam('/itb-dist/wap/pages/news/list.html?__=1552030651276', { type: util_1.request['type'] }));
  }
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
  $('#aBack').click(function () {
      if (comepage === "dashboard")
          location.href = '../dashboard/index.html';
      else if (comepage === "newslist")
          location.href = 'list.html';
      else
          location.href = '../dashboard/index.html';
  });
  //# sourceMappingURL=/itb-dist/wap/pages/news/detail.js.map?__=1552030651276
  

});
