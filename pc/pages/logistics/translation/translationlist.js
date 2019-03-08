define('pages/logistics/translation/translationlist.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      'getAlltranslation!post': 'Operation/Getalltranslation',
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
  $("#totalnow").html(lpg.totalsum + "0");
  opg_ts_1.default.api.getAlltranslation(param, function (data) {
      for (var i = 0; i < data.length; i++) {
          var _len = $("#listtable tr").length;
          $("#listtable").append("<tr align='center'>"
              + "<td id='td" + _len + "'>" + data[i].itemno + "</td>"
              + "<td>" + data[i].itemname + "</td>"
              + "<td>" + data[i].description + "</td>"
              + "<td id='pr" + _len + "'>" + data[i].unitprice + "</td>"
              + "<td><input type='text' name='qty1" + _len + "' id='qty1" + _len + "' style='width:60px;' value='0' /></td>"
              + "<td><input type='text' name='qty2" + _len + "' id='qty2" + _len + "' style='width:60px;' value='0' /></td>"
              + "<td><input type='text' name='qty3" + _len + "' id='qty3" + _len + "' style='width:60px;' value='0' /></td>"
              + "</tr>");
      }
      $("#listtable input").on('input', function () {
          var total = 0;
          var len = $("#listtable tr").length;
          for (var i = 0; i < len; i++) {
              total = total + checknum($("#pr" + i).html()) * (checknum($("#qty1" + i).val()) + checknum($("#qty2" + i).val()) + checknum($("#qty3" + i).val()));
          }
          $("#totalnow").html(lpg.totalsum + total.toString());
      });
  });
  function checknum(val) {
      if (!isNaN(parseInt(val))) {
          return parseInt(val);
      }
      else {
          return 0;
      }
  }
  window['getTranslationFill'] = function () {
      param.itemno = "";
      param.itemqty = "";
      var len = $("#listtable tr").length;
      for (var i = 1; i < len; i++) {
          param.itemno = param.itemno + $("#td" + i).html() + "|";
          param.itemqty = param.itemqty + $("#qty1" + i).val() + "," + $("#qty2" + i).val() + "," + $("#qty3" + i).val() + "|";
      }
      return param;
  };
  //# sourceMappingURL=/itb-dist/pc/pages/logistics/translation/translationlist.js.map?__=1552033897847
  

});
