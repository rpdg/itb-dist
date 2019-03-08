define('pages/meetings/myQr.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  api_1.api({
      qrCode: 'user/GetUserQrCode',
      personinfo: 'user/GetCurrentUserInfoAndMenus'
  });
  api_1.api.qrCode(function (data) {
      $('#qImg').attr('src', 'data:image/png;base64,' + data.qrCodeImg);
  });
  api_1.api.personinfo({ type: 0 }, function (data) {
      console.log(data);
      $('#personinfo').html(data.company + "<br/>" + data.firstName + "&emsp;" + data.lastName);
  });
  //# sourceMappingURL=/itb-dist/wap/pages/meetings/myQr.js.map?__=1552030651276
  

});
