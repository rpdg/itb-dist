define('pages/logistics/invitation/manage.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  opg_ts_1.default.api({
      'letterCountByDay': 'Operation/LetterCountByDay',
      'letterCountByCountryName': 'Operation/LetterCountByCountryName',
      'getExhibitionOrBuyerBarcodeByUserId': 'operation/GetExhibitionOrBuyerBarcodeByUserId',
      'getletterlist!post': 'Operation/Getletterlist',
      'updateletterstatus!post': 'Operation/Updateletterstatus',
      'createPDF!post': 'Operation/CreatePDF'
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
  //const permission = store.get('permission');
  var tbButtons = [];
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.getletterlist,
      lazy: true,
      titleBar: {
          title: "" + lpg.list,
          buttons: tbButtons,
      },
      columns: [
          {
              text: "" + lpg.countryname, width: 50,
              src: 'countryname',
          },
          {
              text: "" + lpg.username, width: 50,
              src: 'username',
              render: function (id, index, row) {
                  var html = "<a href=\"#\" class=\"href-c\" data-id=\"" + row.userid + "\">" + row.username + "</a>";
                  return html;
              }
          },
          {
              text: "" + lpg.gender, width: 50,
              src: 'gender',
          },
          {
              text: "" + lpg.dateofbirth, width: 50,
              src: 'dateofbirth',
              render: function (id, index, row) {
                  var html = formatdate(row.dateofbirth);
                  return html;
              }
          },
          {
              text: "" + lpg.position, width: 50,
              src: 'position',
          },
          {
              text: "" + lpg.nationality, width: 50,
              src: 'nationality',
          },
          {
              text: "" + lpg.passportnumber, width: 50,
              src: 'passportnumber',
          },
          {
              text: "" + lpg.passportvalidity, width: 50,
              src: 'passportvalidity',
              render: function (id, index, row) {
                  var html = formatdate(row.passportvalidity);
                  return html;
              }
          },
          {
              text: "" + lpg.employer, width: 50,
              src: 'employer',
          },
          {
              text: "" + lpg.residence, width: 50,
              src: 'strattime',
              render: function (id, index, row) {
                  var html = formatdate(row.starttime) + '--' + formatdate(row.stoptime);
                  return html;
              }
          },
          {
              text: "" + lpg.createtime, width: 50,
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
              text: "" + lpg.operation, width: 150,
              src: 'invitationid',
              render: function (id, index, row) {
                  var html = "<button data-id=\"" + row.invitationid + "\" data-name=\"\" class=\"btn-mini btn-info\" >" + lpg.preview + "</button> ";
                  if (row.status === '0') {
                      html += "<button data-id=\"" + row.invitationid + "\" data-name=\"1\" class=\"btn-mini btn-success\" >" + lpg.statustype[1] + "</button> ";
                      html += "<button data-id=\"" + row.invitationid + "\" data-name=\"2\" class=\"btn-mini btn-danger\" >" + lpg.statustype[2] + "</button> ";
                  }
                  return html;
              },
          }
      ],
      pagination: true,
  });
  refreshtable();
  tb.tbody.on('click', '.btn-success', function () {
      var btn = $(this), letterid = btn.data('id'), approvalstatus = btn.data('name');
      var param = {};
      param.letterid = letterid;
      param.approvalstatus = approvalstatus;
      opg_ts_1.default.api.updateletterstatus(param, function (data) {
          tb.update();
      });
  });
  tb.tbody.on('click', '.btn-danger', function () {
      var btn = $(this), letterid = btn.data('id'), approvalstatus = btn.data('name');
      var param = {};
      param.letterid = letterid;
      param.approvalstatus = approvalstatus;
      opg_ts_1.default.api.updateletterstatus(param, function (data) {
          tb.update();
      });
  });
  tb.tbody.on('click', '.btn-info', function () {
      var btn = $(this), letterid = btn.data('id');
      var param = {};
      param.letterid = letterid;
      opg_ts_1.default.api.createPDF(param, function (data) {
          window.open(data.filename, '_blank');
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
  //# sourceMappingURL=/itb-dist/pc/pages/logistics/invitation/manage.js.map?__=1552033897847
  

});
