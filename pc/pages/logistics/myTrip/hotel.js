define('pages/logistics/myTrip/hotel.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var Languages_1 = require("ts/util/Languages.ts");
  var lpg = Languages_1.Languages.package;
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  if (clng === "cn") {
      $("#tbMain2").show();
  }
  else if (clng === "en") {
      $("#tbMain").show();
  }
  else {
      $("#tbMain").show();
  }
  //
  // $("#btn2,#btn6").click(function () {
  //     top.opg.confirm(lpg.bookinfo,function() {
  //
  //     });
  // });
  //# sourceMappingURL=/itb-dist/pc/pages/logistics/myTrip/hotel.js.map?__=1552033897847
  

});
