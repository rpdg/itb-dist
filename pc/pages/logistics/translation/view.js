define('pages/logistics/translation/view.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      'gettranslationlistByStandNo!post': 'Operation/GettranslationlistByStandNo',
  });
  var lpg = Languages_1.Languages.package;
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  var param = {};
  param.reservetype = utils_1.request["reservetype"];
  param.currentlng = clng;
  param.standno = utils_1.request["standno"];
  param.createtime = utils_1.request["ctime"];
  opg_ts_1.default.api.gettranslationlistByStandNo(param, function (data) {
      for (var i = 0; i < data.length; i++) {
          var _len = $("#listtable tr").length;
          $("#listtable").append("<tr align='center'>"
              + "<td id='td" + _len + "'>" + data[i].reserveid + "</td>"
              + "<td>" + data[i].reserveitemno + "</td>"
              + "<td>" + data[i].itemname + "</td>"
              + "<td>" + data[i].description + "</td>"
              + "<td>" + data[i].oneday + "</td>"
              + "<td>" + data[i].twoday + "</td>"
              + "<td>" + data[i].threeday + "</td>"
              + "</tr>");
      }
  });
  window['getApprovalFill'] = function () {
      param.reserveid = "";
      param.approvaltype = "1";
      var len = $("#listtable tr").length;
      for (var i = 1; i < len; i++) {
          param.reserveid = param.reserveid + $("#td" + i).html() + ",";
      }
      return param;
  };
  window['getDenyFill'] = function () {
      param.reserveid = "";
      param.approvaltype = "2";
      var len = $("#listtable tr").length;
      for (var i = 1; i < len; i++) {
          param.reserveid = param.reserveid + $("#td" + i).html() + ",";
      }
      return param;
  };
  //# sourceMappingURL=/itb-dist/pc/pages/logistics/translation/view.js.map?__=1552033897847
  

});
