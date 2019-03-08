define('pages/logistics/emailbanner/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  opg_ts_1.default.api({
      'getBoothByBarcode!post': 'Operation/GetBoothByBarcode',
      'createEmailBanner!post': 'Operation/CreateEmailBanner'
  });
  var lpg = Languages_1.Languages.package;
  var clng = 'en';
  var barcode = '';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  opg_ts_1.default.api.getBoothByBarcode({ barcode: barcode }, function (data) {
      if (data.length > 0) {
          $("#boothid").val(data[0].booth_no);
      }
  });
  $("#btnDownloadcn").click(function () {
      var param = $("#tbMain").fieldsToJson();
      param.language = "cn";
      param.boothid = param.boothid.substr(0, 3);
      opg_ts_1.default.api.createEmailBanner(param, function (data) {
          window.open(data.filename, '_blank');
      });
  });
  $("#btnDownloaden").click(function () {
      var param = $("#tbMain").fieldsToJson();
      param.language = "en";
      param.boothid = param.boothid.substr(0, 3);
      opg_ts_1.default.api.createEmailBanner(param, function (data) {
          window.open(data.filename, '_blank');
      });
  });
  //# sourceMappingURL=/itb-dist/pc/pages/logistics/emailbanner/index.js.map?__=1552033897847
  

});
