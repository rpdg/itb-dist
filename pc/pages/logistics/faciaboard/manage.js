define('pages/logistics/faciaboard/manage.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  opg_ts_1.default.api({
      'getExhibitionOrBuyerBarcodeByUserId': 'operation/GetExhibitionOrBuyerBarcodeByUserId',
      'getBoardlist!post': 'Operation/GetBoardlist',
      'updateBoardstatus!post': 'Operation/UpdateBoardstatus',
  });
  var lpg = Languages_1.Languages.package;
  var form = $('#tbSearch');
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  var panel = opg_ts_1.default.wrapPanel('#tbSearch', {
      title: "" + lpg.searchService,
      btnSearchText: "<i class=\"ico-find\"></i> " + lpg.search,
      btnSearchClick: function () {
          refreshtable();
      }
  });
  function refreshtable() {
      var xparam = $('#tbSearch').fieldsToJson();
      xparam.pageIndex = 0;
      xparam.currentlng = clng;
      tb.update(xparam);
  }
  // $("#btnSearch").click(function (){
  //     refreshtable();
  // });
  //const permission = store.get('permission');
  var tbButtons = [];
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.getBoardlist,
      lazy: true,
      titleBar: {
          title: "" + lpg.list,
          buttons: tbButtons,
      },
      columns: [
          {
              text: "" + lpg.booth, width: 50,
              src: 'standno',
              render: function (id, index, row) {
                  var html = "<a href=\"#\" class=\"href-c\" data-id=\"" + row.userid + "\">" + row.standno + "</a>";
                  return html;
              }
          },
          {
              text: "" + lpg.companycn, width: 50,
              src: 'company_cn',
          },
          {
              text: "" + lpg.company, width: 50,
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
              },
          },
          {
              text: "" + lpg.operation, width: 100,
              src: 'boardid',
              render: function (id, index, row) {
                  var html = "";
                  if (row.status === '0') {
                      html += "<button data-id=\"" + row.boardid + "\" data-name=\"1\" class=\"btn-mini btn-success\" >" + lpg.statustype[1] + "</button> ";
                      html += "<button data-id=\"" + row.boardid + "\" data-name=\"2\" class=\"btn-mini btn-danger\" >" + lpg.statustype[2] + "</button> ";
                  }
                  return html;
              },
          }
      ],
      pagination: true,
  });
  refreshtable();
  tb.tbody.on('click', '.btn-success', function () {
      var btn = $(this), eventid = btn.data('id'), approvalstatus = btn.data('name');
      var param = {};
      param.boardid = eventid;
      param.approvalstatus = approvalstatus;
      opg_ts_1.default.api.updateBoardstatus(param, function (data) {
          tb.update();
      });
  });
  tb.tbody.on('click', '.btn-danger', function () {
      var btn = $(this), eventid = btn.data('id'), approvalstatus = btn.data('name');
      var param = {};
      param.boardid = eventid;
      param.approvalstatus = approvalstatus;
      opg_ts_1.default.api.updateBoardstatus(param, function (data) {
          tb.update();
      });
  });
  tb.tbody.on('click', '.href-c', function () {
      var btn = $(this), userid = btn.data('id');
      var param = {};
      param.userid = userid;
      opg_ts_1.default.api.getExhibitionOrBuyerBarcodeByUserId(param, function (data) {
          if (data.substr(0, 1) === "1" || data.substr(0, 1) === "4") {
              top.window.open("../../itb/wishlist/barcode.html?barcode=" + data + "&type=exhibition", "_blank");
          }
          else if (data.substr(0, 1) === "2") {
              top.window.open("../../itb/wishlist/barcode.html?barcode=" + data + "&type=buyer", "_blank");
          }
      });
  });
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
  //# sourceMappingURL=/itb-dist/pc/pages/logistics/faciaboard/manage.js.map?__=1552033897847
  

});
