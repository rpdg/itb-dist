define('pages/logistics/translation/manage.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      'getExhibitionOrBuyerBarcodeByUserId': 'operation/GetExhibitionOrBuyerBarcodeByUserId',
      'gettranslationlist!post': 'Operation/Gettranslationlist',
      'addTranslationApproval!post': 'Operation/AddTranslationApproval',
  });
  var lpg = Languages_1.Languages.package;
  var form = $('#tbSearch');
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  $("#totalsum").html(lpg.totalsum + ":0");
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
  //const permission = store.get('permission');
  var tbButtons = [];
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.gettranslationlist,
      lazy: true,
      titleBar: {
          title: "" + lpg.list,
          buttons: tbButtons,
      },
      columns: [
          {
              text: "" + lpg.standno, width: 100,
              src: 'standno',
          },
          {
              text: "" + lpg.company, width: 100,
              src: 'company',
          },
          {
              text: "" + lpg.country, width: 100,
              src: 'country',
          },
          {
              text: "" + lpg.contactperson, width: 100,
              src: 'contactperson',
              render: function (id, index, row) {
                  var html = "<a href=\"#\" class=\"href-c\" data-id=\"" + row.userid + "\">" + row.contactperson + "</a>";
                  return html;
              }
          },
          {
              text: "" + lpg.phonenum, width: 100,
              src: 'phonenum',
          },
          {
              text: "" + lpg.email, width: 100,
              src: 'email',
          },
          {
              text: "" + lpg.payment, width: 100,
              src: 'payment',
          },
          {
              text: "" + lpg.allreserveqty, width: 100,
              src: 'allreserveqty',
          },
          {
              text: "" + lpg.allunitprice, width: 100,
              src: 'allunitprice',
          },
          {
              text: "" + lpg.hostess, width: 100,
              src: 'hostess',
              render: function (id, index, row) {
                  var html = "";
                  if (row.hostess === 'yes') {
                      html += "<label class=\"deny\">" + lpg.hostesstype[0] + "</label>";
                  }
                  return html;
              }
          },
          {
              text: "" + lpg.createtime, width: 100,
              src: 'createtime',
          },
          {
              text: "" + lpg.approvaltime, width: 100,
              src: 'approvaltime',
          },
          {
              text: "" + lpg.status, width: 100,
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
              src: 'standno',
              render: function (id, index, row) {
                  var html = "<button data-id=\"" + row.standno + "\" data-name=\"" + row.company + "|" + row.createtime + "\" class=\"btn-mini btn-info\" >" + lpg.operationbutton + "</button> ";
                  return html;
              },
          }
      ],
      pagination: true,
  });
  refreshtable();
  //view
  var infoPage = '/itb-dist/pc/pages/logistics/translation/view.html?__=1552033897847';
  tb.tbody.on('click', '.btn-info', function () {
      var param = $('#tbSearch').fieldsToJson();
      var btn = $(this), id = btn.data('id'), name = btn.data('name');
      var companyname = name.split('|')[0];
      var ctime = name.split('|')[1];
      var pop = opg_ts_1.default.popTop("<iframe src=\"" + utils_1.url.setParam(infoPage, { standno: id, reservetype: param.reservetype, ctime: ctime }) + "\"></iframe>", {
          title: lpg.viewlist + ": " + id + "-" + companyname,
          btnMax: true,
          width: 900,
          height: 550,
          buttons: {
              agree: {
                  className: 'btn-success',
                  text: lpg.sendApproval,
                  onClick: function (i, ifr) {
                      var approval = ifr.getApprovalFill();
                      if (approval)
                          sendApproval(approval, pop);
                      return true;
                  }
              },
              deny: {
                  className: 'btn-danger',
                  text: lpg.sendDeny,
                  onClick: function (i, ifr) {
                      var approval = ifr.getDenyFill();
                      if (approval)
                          sendApproval(approval, pop);
                      return true;
                  }
              },
              cancel: lpg.cancel
          },
          onClose: function () {
              tb.update();
          }
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
  function sendApproval(approval, pop) {
      opg_ts_1.default.api.addTranslationApproval(approval, function (data) {
          pop.close();
          tb.update();
      });
  }
  //# sourceMappingURL=/itb-dist/pc/pages/logistics/translation/manage.js.map?__=1552033897847
  

});
