define('pages/logistics/serviceRental/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      'getservicelisttotalsumbyuser!post': 'Operation/Getservicelisttotalsumbyuser',
      'getservicelistbyuser!post': 'Operation/Getservicelistbyuser',
      'addResource!post': 'Operation/AddResource'
  });
  var lpg = Languages_1.Languages.package;
  var form = $('#tbSearch');
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  $("#totalsum").html(lpg.totalsum + ":0");
  $("#totalsum2").html(lpg.totalsum + ":0");
  $("#totalsum3").html(lpg.totalsum + ":0");
  // let panel: Panel = opg.wrapPanel('#tbSearch', {
  // 	title: `${lpg.searchService}`,
  // 	btnSearchText: `<i class="ico-find"></i> ${lpg.search}`,
  // 	btnSearchClick: function () {
  //         refreshtable();
  // 	}
  // });
  function refreshtable() {
      var xparam = $('#tbSearch').fieldsToJson();
      xparam.pageIndex = 0;
      xparam.currentlng = clng;
      xparam.reservetype = "furniture";
      tb.update(xparam);
      opg_ts_1.default.api.getservicelisttotalsumbyuser(xparam, function (data) {
          $("#totalsum").html(lpg.totalsum + ":" + data[0].totalsum);
      });
      setTimeout(function () {
          var trl = $("#tb").find("tr").length;
          if (trl > 2) {
              $('#btnServiceApply').attr('disabled', "true");
          }
          else {
              $('#btnServiceApply').removeAttr("disabled");
          }
      }, 500);
  }
  function refreshtable2() {
      var xparam2 = $('#tbSearch').fieldsToJson();
      xparam2.pageIndex = 0;
      xparam2.currentlng = clng;
      xparam2.reservetype = "power";
      tb2.update(xparam2);
      opg_ts_1.default.api.getservicelisttotalsumbyuser(xparam2, function (data) {
          $("#totalsum2").html(lpg.totalsum + ":" + data[0].totalsum);
      });
      setTimeout(function () {
          var trl = $("#tb2").find("tr").length;
          if (trl > 2) {
              $('#btnServiceApply2').attr('disabled', "true");
          }
          else {
              $('#btnServiceApply2').removeAttr("disabled");
          }
      }, 500);
  }
  function refreshtable3() {
      var xparam3 = $('#tbSearch').fieldsToJson();
      xparam3.pageIndex = 0;
      xparam3.currentlng = clng;
      xparam3.reservetype = "other";
      tb3.update(xparam3);
      opg_ts_1.default.api.getservicelisttotalsumbyuser(xparam3, function (data) {
          $("#totalsum3").html(lpg.totalsum + ":" + data[0].totalsum);
      });
      setTimeout(function () {
          var trl = $("#tb3").find("tr").length;
          if (trl > 2) {
              $('#btnServiceApply3').attr('disabled', "true");
          }
          else {
              $('#btnServiceApply3').removeAttr("disabled");
          }
      }, 500);
  }
  //const permission = store.get('permission');
  var tbButtons = [];
  //tbButtons.push({id: 'btnServiceApply', className: 'btn-warning', html: `${lpg.serviceApply}`});
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.getservicelistbyuser,
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
              text: "" + lpg.exhibitor, width: 100,
              src: 'exhibitor',
          },
          {
              text: "" + lpg.company, width: 100,
              src: 'company',
          },
          {
              text: "" + lpg.reserveitemno, width: 100,
              src: 'reserveitemno',
          },
          {
              text: "" + lpg.itemname, width: 100,
              src: 'itemname',
          },
          {
              text: "" + lpg.description, width: 100,
              src: 'description',
          },
          {
              text: "" + lpg.reserveqty, width: 100,
              src: 'reserveqty',
          },
          {
              text: "" + lpg.unitprice, width: 100,
              src: 'unitprice',
          },
          {
              text: "" + lpg.createtime, width: 100,
              src: 'createtime',
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
          }
      ],
      pagination: true,
  });
  var tb2 = opg_ts_1.default('#tb2').table({
      api: opg_ts_1.default.api.getservicelistbyuser,
      lazy: true,
      titleBar: {
          title: "" + lpg.list2,
          buttons: tbButtons,
      },
      columns: [
          {
              text: "" + lpg.standno, width: 100,
              src: 'standno',
          },
          {
              text: "" + lpg.exhibitor, width: 100,
              src: 'exhibitor',
          },
          {
              text: "" + lpg.company, width: 100,
              src: 'company',
          },
          {
              text: "" + lpg.reserveitemno, width: 100,
              src: 'reserveitemno',
          },
          {
              text: "" + lpg.itemname, width: 100,
              src: 'itemname',
          },
          {
              text: "" + lpg.description, width: 100,
              src: 'description',
          },
          {
              text: "" + lpg.reserveqty, width: 100,
              src: 'reserveqty',
          },
          {
              text: "" + lpg.unitprice, width: 100,
              src: 'unitprice',
          },
          {
              text: "" + lpg.createtime, width: 100,
              src: 'createtime',
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
          }
      ],
      pagination: true,
  });
  var tb3 = opg_ts_1.default('#tb3').table({
      api: opg_ts_1.default.api.getservicelistbyuser,
      lazy: true,
      titleBar: {
          title: "" + lpg.list3,
          buttons: tbButtons,
      },
      columns: [
          {
              text: "" + lpg.standno, width: 100,
              src: 'standno',
          },
          {
              text: "" + lpg.exhibitor, width: 100,
              src: 'exhibitor',
          },
          {
              text: "" + lpg.company, width: 100,
              src: 'company',
          },
          {
              text: "" + lpg.reserveitemno, width: 100,
              src: 'reserveitemno',
          },
          {
              text: "" + lpg.itemname, width: 100,
              src: 'itemname',
          },
          {
              text: "" + lpg.description, width: 100,
              src: 'description',
          },
          {
              text: "" + lpg.reserveqty, width: 100,
              src: 'reserveqty',
          },
          {
              text: "" + lpg.unitprice, width: 100,
              src: 'unitprice',
          },
          {
              text: "" + lpg.createtime, width: 100,
              src: 'createtime',
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
          }
      ],
      pagination: true,
  });
  refreshtable();
  setTimeout(function () {
      refreshtable2();
  }, 1000);
  setTimeout(function () {
      refreshtable3();
  }, 1500);
  var addPage = '/itb-dist/pc/pages/logistics/serviceRental/servicelist.html?__=45699c7';
  $("#btnServiceApply").click(function () {
      var param = $('#tbSearch').fieldsToJson();
      param.reservetype = "furniture";
      var reservetype = "" + param.reservetype;
      var pop = opg_ts_1.default.popTop("<iframe src=\"" + utils_1.url.setParam(addPage, { reservetype: reservetype }) + "\"></iframe>", {
          title: "" + lpg.serviceApplylist,
          btnMax: false,
          width: 900,
          height: 550,
          buttons: {
              send: {
                  className: 'btn-success',
                  text: lpg.sendApply,
                  onClick: function (i, ifr) {
                      var pop2 = top.opg.confirm(lpg.submitinfo + "<br/>" + lpg.submitinfo2, function () {
                          var resource = ifr.getResourceFill();
                          if (resource)
                              sendResource(resource, pop, pop2);
                      });
                      return true;
                  }
              },
              cancel: lpg.cancel
          },
          onClose: function () {
          }
      });
  });
  $("#btnServiceApply2").click(function () {
      var param = $('#tbSearch').fieldsToJson();
      param.reservetype = "power";
      var reservetype = "" + param.reservetype;
      var pop = opg_ts_1.default.popTop("<iframe src=\"" + utils_1.url.setParam(addPage, { reservetype: reservetype }) + "\"></iframe>", {
          title: "" + lpg.serviceApplylist2,
          btnMax: false,
          width: 900,
          height: 550,
          buttons: {
              send: {
                  className: 'btn-success',
                  text: lpg.sendApply,
                  onClick: function (i, ifr) {
                      var pop2 = top.opg.confirm(lpg.submitinfo + "<br/>" + lpg.submitinfo2, function () {
                          var resource = ifr.getResourceFill();
                          if (resource) {
                              sendResource(resource, pop, pop2);
                          }
                      });
                      return true;
                  }
              },
              cancel: lpg.cancel
          },
          onClose: function () {
          }
      });
  });
  $("#btnServiceApply3").click(function () {
      var param = $('#tbSearch').fieldsToJson();
      param.reservetype = "other";
      var reservetype = "" + param.reservetype;
      var pop = opg_ts_1.default.popTop("<iframe src=\"" + utils_1.url.setParam(addPage, { reservetype: reservetype }) + "\"></iframe>", {
          title: "" + lpg.serviceApplylist3,
          btnMax: false,
          width: 900,
          height: 550,
          buttons: {
              send: {
                  className: 'btn-success',
                  text: lpg.sendApply,
                  onClick: function (i, ifr) {
                      var pop2 = top.opg.confirm(lpg.submitinfo + "<br/>" + lpg.submitinfo2, function () {
                          var resource = ifr.getResourceFill();
                          if (resource) {
                              sendResource(resource, pop, pop2);
                          }
                      });
                      return true;
                  }
              },
              cancel: lpg.cancel
          },
          onClose: function () {
          }
      });
  });
  // $("#btnSearch").click(function(){
  //     refreshtable();
  // });
  $("#popiconimg1").click(function () {
      var p = "../logistics/serviceRental/service/fur.jpg";
      var pop = opg_ts_1.default.popTop("<image style=\"width:100%;\" src=\"" + p + "\"/>", {
          title: "" + lpg.furniturepic,
          btnMax: false,
          width: 500,
          height: 650,
          buttons: {
              download: {
                  className: 'btn-success',
                  text: lpg.download,
                  onClick: function (i, ifr) {
                      window.open(p);
                      return true;
                  }
              },
              cancel: lpg.cancel
          },
          onClose: function () {
          }
      });
  });
  $("#popiconimg2").click(function () {
      var p = "../logistics/serviceRental/service/fur2.jpg";
      var pop = opg_ts_1.default.popTop("<image style=\"width:100%;\" src=\"" + p + "\"/>", {
          title: "" + lpg.furniturepic,
          btnMax: false,
          width: 500,
          height: 650,
          buttons: {
              download: {
                  className: 'btn-success',
                  text: lpg.download,
                  onClick: function (i, ifr) {
                      window.open(p);
                      return true;
                  }
              },
              cancel: lpg.cancel
          },
          onClose: function () {
          }
      });
  });
  function sendResource(resource, pop, pop2) {
      opg_ts_1.default.api.addResource(resource, function (data) {
          pop.close();
          pop2.close();
          refreshtable();
          setTimeout(function () {
              refreshtable2();
          }, 1000);
          setTimeout(function () {
              refreshtable3();
          }, 1500);
      });
  }
  //# sourceMappingURL=/itb-dist/pc/pages/logistics/serviceRental/index.js.map?__=1552033897847
  

});
