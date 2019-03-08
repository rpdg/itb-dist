define('pages/logistics/digitalpress/manage.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  opg_ts_1.default.api({
      'getExhibitionOrBuyerBarcodeByUserId': 'operation/GetExhibitionOrBuyerBarcodeByUserId',
      'getdigitalpresslist!post': 'Operation/Getdigitalpresslist',
      'updatedigitalpressstatus!post': 'Operation/Updatedigitalpressstatus',
  });
  var lpg = Languages_1.Languages.package;
  var form = $('#tbSearch');
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  function refreshtable() {
      var xparam = $('#tbSearch').fieldsToJson();
      xparam.pageIndex = 0;
      xparam.currentlng = clng;
      tb.update(xparam);
  }
  var panel = opg_ts_1.default.wrapPanel('#tbSearch', {
      title: "" + lpg.searchService,
      btnSearchText: "<i class=\"ico-find\"></i> " + lpg.search,
      btnSearchClick: function () {
          refreshtable();
      }
  });
  // $("#btnSearch").click(function (){
  //     refreshtable();
  // });
  //const permission = store.get('permission');
  var tbButtons = [];
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.getdigitalpresslist,
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
              text: "" + lpg.exhibitor, width: 50,
              src: 'exhibitor',
          },
          {
              text: "" + lpg.company, width: 50,
              src: 'company',
          },
          {
              text: "" + lpg.presstitleen, width: 50,
              src: 'presstitleen'
          },
          {
              text: "" + lpg.presstitlecn, width: 50,
              src: 'presstitlecn',
          },
          {
              text: "" + lpg.pic0, width: 100,
              src: 'pressfile',
              render: function (id, index, row) {
                  var html = "";
                  var f = row.pressfile.split('|');
                  for (var i = 0; i < f.length; i++) {
                      if (i == 0 && f[i] != "")
                          html += "<a href=\"" + f[i] + ("\" target=\"_blank\">" + lpg.pic + "</a>&emsp;&emsp;");
                      else if (i == 1 && f[i] != "")
                          html += "<a href=\"" + f[i] + ("\" target=\"_blank\">" + lpg.pic2 + "</a>");
                  }
                  return html;
              }
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
              src: 'digitalpressid',
              render: function (id, index, row) {
                  var html = "";
                  if (row.status === '0') {
                      html += "<button data-id=\"" + row.digitalpressid + "\" data-name=\"1\" class=\"btn-mini btn-success\" >" + lpg.statustype[1] + "</button> ";
                      html += "<button data-id=\"" + row.digitalpressid + "\" data-name=\"2\" class=\"btn-mini btn-danger\" >" + lpg.statustype[2] + "</button> ";
                  }
                  return html;
              },
          }
      ],
      pagination: true,
  });
  refreshtable();
  tb.tbody.on('click', '.btn-success', function () {
      var btn = $(this), digitalpressid = btn.data('id'), approvalstatus = btn.data('name');
      var param = {};
      param.digitalpressid = digitalpressid;
      param.approvalstatus = approvalstatus;
      opg_ts_1.default.api.updatedigitalpressstatus(param, function (data) {
          tb.update();
      });
  });
  tb.tbody.on('click', '.btn-danger', function () {
      var btn = $(this), digitalpressid = btn.data('id'), approvalstatus = btn.data('name');
      var param = {};
      param.digitalpressid = digitalpressid;
      param.approvalstatus = approvalstatus;
      opg_ts_1.default.api.updatedigitalpressstatus(param, function (data) {
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
  //# sourceMappingURL=/itb-dist/pc/pages/logistics/digitalpress/manage.js.map?__=1552033897847
  

});
