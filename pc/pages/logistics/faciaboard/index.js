define('pages/logistics/faciaboard/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  opg_ts_1.default.api({
      'getboardlistbyuser!post': 'Operation/GetBoardlistbyuser',
      'addboard!post': 'Operation/AddBoard',
      'getBoothByBarcode!post': 'Operation/GetBoothByBarcode',
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
          $("#standno").val(data[0].booth_no);
          $("#companycn").val(data[0].company_cn);
          $("#company").val(data[0].company);
      }
  });
  function refreshtable() {
      var xparam = {};
      xparam.pageIndex = 0;
      xparam.currentlng = clng;
      tb.update(xparam);
  }
  var tbButtons = [];
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.getboardlistbyuser,
      lazy: true,
      titleBar: {
          title: "" + lpg.list,
          buttons: tbButtons,
      },
      columns: [
          {
              text: "" + lpg.booth, width: 50,
              src: 'standno',
          },
          {
              text: "" + lpg.companycn, width: 100,
              src: 'company_cn',
          },
          {
              text: "" + lpg.company, width: 100,
              src: 'company',
          },
          {
              text: "" + lpg.createtime, width: 100,
              src: 'createtime',
          },
          {
              text: "" + lpg.status, width: 50,
              src: 'status',
              render: function (id, index, row) {
                  var html = "";
                  if (row.status === '0') {
                      html += "<label class=\"apply\">" + lpg.statustype[0] + "</label>";
                  }
                  else if (row.status === '1') {
                      html += "<label class=\"agree\">" + lpg.statustype[1] + "</label>";
                  }
                  else if (row.status === '2') {
                      html += "<label class=\"deny\">" + lpg.statustype[2] + "</label>";
                  }
                  return html;
              }
          }
      ],
      pagination: true,
  });
  $("#btnReset").click(function () {
      location.reload(true);
  });
  $("#btnSaveMain").click(function () {
      var param = $("#tbMain").fieldsToJson();
      opg_ts_1.default.api.addboard(param, function (data) {
          location.reload(true);
      });
  });
  refreshtable();
  function formatdate(mydate) {
      var newdate;
      var data = new Date(mydate);
      var year = data.getFullYear(); //获取年
      var month = data.getMonth() + 1; //获取月
      var day = data.getDate(); //获取日
      if (month < 10) {
          if (day < 10)
              newdate = year + "-0" + month + "-0" + day;
          else
              newdate = year + "-0" + month + "-" + day;
      }
      else {
          if (day < 10)
              newdate = year + "-" + month + "-0" + day;
          else
              newdate = year + "-" + month + "-" + day;
      }
      return newdate;
  }
  //# sourceMappingURL=/itb-dist/pc/pages/logistics/faciaboard/index.js.map?__=1552033897847
  

});
