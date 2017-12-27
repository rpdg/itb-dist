define('pages/announcement/announcement.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  api_1.api({
      getList: 'message/GetMessageByCurrentUser',
  });
  $('.mui-content').on('tap', '.btnLink', function () {
      location.href = './detail.html';
  });
  //# sourceMappingURL=/itb-dist/wap/pages/announcement/announcement.js.map?__=
  

});
