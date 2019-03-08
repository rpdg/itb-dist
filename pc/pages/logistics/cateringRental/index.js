define('pages/logistics/cateringRental/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  opg_ts_1.default.api({
      'getcateringlisttotalsumbyuser!post': 'Operation/Getcateringlisttotalsumbyuser',
      'getcateringlistbyuser!post': 'Operation/Getcateringlistbyuser',
      'addCatering!post': 'Operation/AddCatering'
  });
  var lpg = Languages_1.Languages.package;
  var form = $('#tbSearch');
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  $("#totalsum").html(lpg.totalsum + ":0");
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
      xparam.reservetype = "catering";
      tb.update(xparam);
      opg_ts_1.default.api.getcateringlisttotalsumbyuser(xparam, function (data) {
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
      }, 1000);
  }
  //const permission = store.get('permission');
  var tbButtons = [];
  // tbButtons.push({id: 'btnServiceApply', className: 'btn-warning', html: `${lpg.serviceApply}`});
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.getcateringlistbyuser,
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
              text: "" + lpg.unitprice, width: 100,
              src: 'unitprice',
          },
          {
              text: "" + lpg.reserveqty1, width: 100,
              src: 'oneday',
          },
          {
              text: "" + lpg.reserveqty2, width: 100,
              src: 'twoday',
          },
          {
              text: "" + lpg.reserveqty3, width: 100,
              src: 'threeday',
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
  var addPage = '/itb-dist/pc/pages/logistics/cateringRental/cateringlist.html?__=d549896';
  $("#btnServiceApply").click(function () {
      var param = $('#tbSearch').fieldsToJson();
      param.reservetype = "catering";
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
                          var resource = ifr.getCateringFill();
                          if (resource)
                              sendCatering(resource, pop, pop2);
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
  function sendCatering(resource, pop, pop2) {
      opg_ts_1.default.api.addCatering(resource, function (data) {
          pop.close();
          pop2.close();
          refreshtable();
      });
  }
  //# sourceMappingURL=/itb-dist/pc/pages/logistics/cateringRental/index.js.map?__=1552033897847
  

});
