define('pages/itb/schedule/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  api_1.api({
      getCarousel: 'canrousel/GetAllCanrousel',
      getAnnouncement: 'Information/QueryAllEnableInformations?type=1&pageIndex=0&pageSize=3',
  });
  /*
  let d: AuiDialog = dialog({
      id: 'id-demo',
      align: 'right top',
      content: 'Hello World!',
      quickClose: true// 点击空白处快速关闭
  });
  dialog.get('id-demo').show(document.getElementById('quickref-bubble'));
  */
  $('#tbSchedule').on('mouseenter', '.divActivity', function () {
      var d = dialog({
          id: 'id-demo',
          align: 'right top',
          content: '<h3>Tuniu Travel</h3><p>hello world!</p>',
          quickClose: true // 点击空白处快速关闭
      });
      dialog.get('id-demo').show(this);
  }).on('mouseleave', '.divActivity', function () {
      dialog.get('id-demo').close();
  });
  //# sourceMappingURL=/itb-dist/pc/pages/itb/schedule/index.js.map?__=
  

});
