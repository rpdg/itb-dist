define('pages/logistics/myTrip/trip.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var api_1 = require("ts/util/api.ts");
  opg_ts_1.default.api({
      'gettriplistbyuser!post': 'Operation/Gettriplistbyuser',
      'addtripbyuser!post': 'Operation/Addtripbyuser',
      getCurrentUserInfoAndMenus: 'user/GetCurrentUserInfoAndMenus',
      getBuyerByBarCode: 'buyer/GetBuyerByBarCode'
  });
  var lpg = Languages_1.Languages.package;
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  var curStage = '';
  var barcode = '';
  var param = {};
  param.type = '1';
  opg_ts_1.default.api.getCurrentUserInfoAndMenus(param, function (data) {
      curStage = data.stage[0].name;
      barcode = data.barcode;
      if (data.RoleId == "2") {
          api_1.api.getBuyerByBarCode({ barcode: barcode }, function (data2) {
              if (data2[0].N != "Fully") {
                  var pop_1 = top.opg.alert("" + lpg.Content, function () {
                      pop_1.close();
                      location.href = '../itb/dashboard/index.html';
                  }, {
                      btnClose: false,
                      title: "" + lpg.Tips,
                      buttons: {
                          ok: "" + lpg.okb
                      }
                  });
              }
          });
      }
  });
  jQuery.datetimepicker.setLocale(Languages_1.Languages.current);
  $('#comedate,#leavedate').each(function (i, elem) {
      $(elem).datetimepicker({
          timepicker: false,
          closeOnDateSelect: true,
          format: 'Y-m-d'
      });
  });
  $('#comearrivedate,#leavearrivedate').each(function (i, elem) {
      $(elem).datetimepicker({
          timepicker: true,
          minuteStep: 5,
          minView: 'minute',
          //closeOnDateSelect: true,
          format: 'Y-m-d H:m:s'
      });
  });
  if (clng == "en") {
      $("#tbMain2").show();
      $("#tbMain").hide();
      //$("#cntb").hide();
      $("#buttonSection").hide();
  }
  else {
      $("#tbMain").show();
      $("#tbMain2").hide();
      //$("#cntb").show();
      $("#buttonSection").show();
  }
  function refreshtable() {
      var xparam = {};
      xparam.pageIndex = 0;
      xparam.currentlng = clng;
      tb.update(xparam);
  }
  //const permission = store.get('permission');
  var tbButtons = [];
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.gettriplistbyuser,
      lazy: true,
      titleBar: {
          title: "" + lpg.list,
          buttons: tbButtons,
      },
      columns: [
          {
              text: "" + lpg.comemethod, width: 50,
              src: 'comemethod',
          },
          {
              text: "" + lpg.comemethodinfo, width: 50,
              src: 'comemethodinfo',
          },
          {
              text: "" + lpg.comearrivedate, width: 50,
              src: 'comearrivedate',
          },
          {
              text: "" + lpg.leavemethod, width: 100,
              src: 'leavemethod'
          },
          {
              text: "" + lpg.leavemethodinfo, width: 50,
              src: 'leavemethodinfo',
          },
          {
              text: "" + lpg.leavearrivedate, width: 100,
              src: 'leavearrivedate',
          },
          {
              text: "" + lpg.paymethod, width: 100,
              src: 'paymethod',
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
      // if(param.comemethod=="" || param.leavemethod=="") {
      //
      //     top.opg.warn(Languages.package['tips6']);
      // }
      if (param.comemethod != "" && (param.comedate == "" || param.comearrivedate == "")) {
          top.opg.warn(Languages_1.Languages.package['tips5']);
      }
      else if (param.leavemethod != "" && (param.leavedate == "" || param.leavearrivedate == "")) {
          top.opg.warn(Languages_1.Languages.package['tips5']);
      }
      // else if(param.paymethod=="") {
      //     top.opg.warn(Languages.package['tips7']);
      // }
      else if (param.paymethod == "支付宝" && (param.zhifubaoname == "" || param.zhifubaoaccount == "")) {
          top.opg.warn(Languages_1.Languages.package['tips4']);
      }
      else if (param.paymethod == "银行" && (param.bankaccountname == "" || param.bankaccount == "" || param.bankname == "")) {
          top.opg.warn(Languages_1.Languages.package['tips3']);
      }
      else {
          opg_ts_1.default.api.addtripbyuser(param, function (data) {
              if (data) {
                  top.opg.warn(Languages_1.Languages.package['tips']);
                  setTimeout(function () {
                      location.reload(true);
                  }, 1000);
              }
              else {
                  top.opg.warn(Languages_1.Languages.package['tips2']);
              }
          });
      }
  });
  $('#paymethod').on('change', function () {
      //判断是否选取prompt属性，无返回值；
      if ($(this).val() == "支付宝") {
          $(".zhifubao").attr("disabled", false);
          $(".bank").attr("disabled", true);
      }
      else if ($(this).val() == "银行") {
          $(".zhifubao").attr("disabled", true);
          $(".bank").attr("disabled", false);
      }
      else {
          $(".zhifubao").attr("disabled", true);
          $(".bank").attr("disabled", true);
      }
  });
  var param2 = {};
  param2.currentlng = clng;
  param2.pageIndex = 0;
  param2.pageSize = 10;
  api_1.api.gettriplistbyuser(param2, function (data) {
      if (data.results.length > 0) {
          $("#comemethod").val(data.results[0].comemethod);
          $("#comecity").val(data.results[0].comecity);
          $("#comedate").val(formatdate(data.results[0].comedate));
          $("#comemethodinfo").val(data.results[0].comemethodinfo);
          $("#comearrivedate").val(data.results[0].comearrivedate);
          $("#leavemethod").val(data.results[0].leavemethod);
          $("#leavecity").val(data.results[0].leavecity);
          $("#leavedate").val(formatdate(data.results[0].leavedate));
          $("#leavemethodinfo").val(data.results[0].leavemethodinfo);
          $("#leavearrivedate").val(data.results[0].leavearrivedate);
          $("#paymethod").val(data.results[0].paymethod);
          if (data.results[0].paymethod == "支付宝") {
              $(".zhifubao").attr("disabled", false);
              $(".bank").attr("disabled", true);
          }
          else if (data.results[0].paymethod == "银行") {
              $(".zhifubao").attr("disabled", true);
              $(".bank").attr("disabled", false);
          }
          else {
              $(".zhifubao").attr("disabled", true);
              $(".bank").attr("disabled", true);
          }
          $("#zhifubaoname").val(data.results[0].zhifubaoname);
          $("#zhifubaoaccount").val(data.results[0].zhifubaoaccount);
          $("#bankaccountname").val(data.results[0].bankaccountname);
          $("#bankaccount").val(data.results[0].bankaccount);
          $("#bankname").val(data.results[0].bankname);
      }
  });
  //refreshtable();
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
  //# sourceMappingURL=/itb-dist/pc/pages/logistics/myTrip/trip.js.map?__=1552033897847
  

});
