define('pages/score/myScore.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  api_1.api({
      score: 'userscore/CurrrentUserScore',
  });
  api_1.api.score(function (data) {
      $('#round').text(~~data);
  });
  //# sourceMappingURL=/itb-dist/wap/pages/score/myScore.js.map?__=1552030651276
  

});
