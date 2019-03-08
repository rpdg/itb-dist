define('pages/logistics/translation/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  opg_ts_1.default.api({
      'gettranslationlisttotalsumbyuser!post': 'Operation/Gettranslationlisttotalsumbyuser',
      'gettranslationlistbyuser!post': 'Operation/Gettranslationlistbyuser',
      'addTranslation!post': 'Operation/AddTranslation',
      'addHostess!post': 'Operation/AddHostess',
      getCurrentUserMoreInfo: 'user/GetCurrentUserMoreInfo',
  });
  var lpg = Languages_1.Languages.package;
  var form = $('#tbSearch');
  var orderflag = false;
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
      xparam.reservetype = "translation";
      tb.update(xparam);
      opg_ts_1.default.api.gettranslationlisttotalsumbyuser(xparam, function (data) {
          $("#totalsum").html(lpg.totalsum + ":" + data[0].totalsum);
      });
      // setTimeout(function () {
      //     var trl=$("#tb").find("tr").length;
      //     if(trl>2) {
      //         $('#btnServiceApply').attr('disabled',"true");
      //     }
      //     else
      //     {
      //         $('#btnServiceApply').removeAttr("disabled");
      //     }
      // }, 1000);
  }
  //const permission = store.get('permission');
  var tbButtons = [];
  // tbButtons.push({id: 'btnServiceApply', className: 'btn-warning', html: `${lpg.serviceApply}`});
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.gettranslationlistbyuser,
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
              text: "" + lpg.hostess, width: 100,
              src: 'hostess',
              render: function (id, index, row) {
                  var html = "";
                  if (row.hostess === 'yes') {
                      html += "<label class=\"deny\">" + lpg.hostesstype[0] + "</label>";
                      $("#needtranslate").attr("checked", 'checked');
                  }
                  return html;
              }
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
                      $('#btnServiceApply').attr('disabled', "true");
                      $("#needtranslate").attr('disabled', "true");
                  }
                  else if (row.status === '2') {
                      html += "<label class=\"deny\">" + lpg.statustype[2] + "</label>";
                      $('#btnServiceApply').attr('disabled', "true");
                      $("#needtranslate").attr('disabled', "true");
                  }
                  return html;
              }
          }
      ],
      pagination: true,
  });
  refreshtable();
  var addPage = '/itb-dist/pc/pages/logistics/translation/translationlist.html?__=7fffdfe';
  var xparam = {};
  opg_ts_1.default.api.getCurrentUserMoreInfo(xparam, function (data) {
      //console.log(data);
      $("#country").val(data[0].country);
      $("#contactperson").val(data[0].firstname + " " + data[0].lastname);
      $("#phonenum").val(data[0].mobile);
      $("#email").val(data[0].email);
  });
  $("#btnServiceApply").click(function () {
      var param = $('#tbSearch').fieldsToJson();
      param.reservetype = "translation";
      var reservetype = "" + param.reservetype;
      if (orderflag || (param.country != "" && param.contactperson != "" && param.phonenum != "" && param.email != "" && param.payment != "")) {
          var pop_1 = opg_ts_1.default.popTop("<iframe src=\"" + utils_1.url.setParam(addPage, { reservetype: reservetype }) + "\"></iframe>", {
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
                              var resource = ifr.getTranslationFill();
                              resource.country = param.country;
                              resource.contactperson = param.contactperson;
                              resource.phonenum = param.phonenum;
                              resource.email = param.email;
                              resource.payment = param.payment;
                              resource.hostess = orderflag == true ? "yes" : "no";
                              if (resource) {
                                  sendTranslation(resource, pop_1, pop2);
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
      }
      else {
          top.opg.confirm(lpg.omitinfo, function () {
          });
      }
  });
  $("#needtranslate").click(function () {
      if ($(this).prop("checked")) {
          orderflag = true;
      }
      else {
          orderflag = false;
      }
      sendHostess();
  });
  // $("#btnSearch").click(function(){
  //     refreshtable();
  // });
  function sendTranslation(resource, pop, pop2) {
      opg_ts_1.default.api.addTranslation(resource, function (data) {
          pop.close();
          pop2.close();
          refreshtable();
      });
  }
  function sendHostess() {
      var param = $('#tbSearch').fieldsToJson();
      var resource = {};
      resource.reservetype = "translation";
      resource.country = param.country;
      resource.contactperson = param.contactperson;
      resource.phonenum = param.phonenum;
      resource.email = param.email;
      resource.payment = "";
      resource.hostess = orderflag == true ? "yes" : "no";
      opg_ts_1.default.api.addHostess(resource, function (data) {
          refreshtable();
      });
  }
  //# sourceMappingURL=/itb-dist/pc/pages/logistics/translation/index.js.map?__=1552033897847
  

});
