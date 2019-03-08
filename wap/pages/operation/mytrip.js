define('pages/operation/mytrip.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({
      'addtripbyuser!post': 'Operation/Addtripbyuser',
      'gettriplistbyuser!post': 'Operation/Gettriplistbyuser'
  });
  var lng = util_1.Languages.package;
  var clng = 'en';
  if (localStorage.getItem('lngPkg') != null || localStorage.getItem('lngPkg') != undefined) {
      var currentlng = localStorage.getItem('lngPkg');
      clng = currentlng.replace(/["""]/g, '');
  }
  if (clng == "cn") {
      $("#en1").hide();
      $("#cn1").show();
  }
  else {
      $("#en1").show();
      $("#cn1").hide();
  }
  var param2 = {};
  param2.currentlng = clng;
  param2.pageIndex = 0;
  param2.pageSize = 10;
  api_1.api.gettriplistbyuser(param2, function (data) {
      if (data.results.length > 0) {
          $("#comemethod").val(data.results[0].comemethod);
          $("#comecity").val(data.results[0].comecity);
          $("#comedate").html(data.results[0].comedate);
          $("#comemethodinfo").val(data.results[0].comemethodinfo);
          $("#comearrivedate").html(data.results[0].comearrivedate);
          $("#leavemethod").val(data.results[0].leavemethod);
          $("#leavecity").val(data.results[0].leavecity);
          $("#leavedate").html(data.results[0].leavedate);
          $("#leavemethodinfo").val(data.results[0].leavemethodinfo);
          $("#leavearrivedate").html(data.results[0].leavearrivedate);
          $("#paymethod").val(data.results[0].paymethod);
          if (data.results[0].paymethod == "支付宝") {
              $(".zhifubao").show();
              $(".bank").hide();
          }
          else if (data.results[0].paymethod == "银行") {
              $(".zhifubao").hide();
              $(".bank").show();
          }
          else {
              $(".zhifubao").hide();
              $(".bank").hide();
          }
          $("#zhifubaoname").val(data.results[0].zhifubaoname);
          $("#zhifubaoaccount").val(data.results[0].zhifubaoaccount);
          $("#bankaccountname").val(data.results[0].bankaccountname);
          $("#bankaccount").val(data.results[0].bankaccount);
          $("#bankname").val(data.results[0].bankname);
      }
  });
  $("#savebtn").click(function () {
      var param = {};
      param.comemethod = $("#comemethod").val();
      param.comecity = $("#comecity").val();
      param.comedate = $("#comedate").html() == "选择日期时间 ..." ? "" : $("#comedate").html();
      param.comemethodinfo = $("#comemethodinfo").val();
      param.comearrivedate = $("#comearrivedate").html() == "选择日期时间 ..." ? "" : $("#comearrivedate").html();
      param.leavemethod = $("#leavemethod").val();
      param.leavecity = $("#leavecity").val();
      param.leavedate = $("#leavedate").html() == "选择日期时间 ..." ? "" : $("#leavedate").html();
      param.leavemethodinfo = $("#leavemethodinfo").val();
      param.leavearrivedate = $("#leavearrivedate").html() == "选择日期时间 ..." ? "" : $("#leavearrivedate").html();
      param.paymethod = $("#paymethod").val();
      param.zhifubaoname = $("#zhifubaoname").val();
      param.zhifubaoaccount = $("#zhifubaoaccount").val();
      param.bankaccountname = $("#bankaccountname").val();
      param.bankaccount = $("#bankaccount").val();
      param.bankname = $("#bankname").val();
      // if(param.comemethod=="" || param.leavemethod=="") {
      //     mui.alert(Languages.package['tips6'], Languages.package['tipstitle'], Languages.package['okb']);
      // }
      if (param.comemethod != "" && (param.comedate == "" || param.comearrivedate == "")) {
          mui.alert(util_1.Languages.package['tips5'], util_1.Languages.package['tipstitle'], util_1.Languages.package['okb']);
      }
      else if (param.leavemethod != "" && (param.leavedate == "" || param.leavearrivedate == "")) {
          mui.alert(util_1.Languages.package['tips5'], util_1.Languages.package['tipstitle'], util_1.Languages.package['okb']);
      }
      // else if(param.paymethod=="") {
      //     mui.alert(Languages.package['tips7'], Languages.package['tipstitle'], Languages.package['okb']);
      // }
      else if (param.paymethod == "支付宝" && (param.zhifubaoname == "" || param.zhifubaoaccount == "")) {
          mui.alert(util_1.Languages.package['tips4'], util_1.Languages.package['tipstitle'], util_1.Languages.package['okb']);
      }
      else if (param.paymethod == "银行" && (param.bankaccountname == "" || param.bankaccount == "" || param.bankname == "")) {
          mui.alert(util_1.Languages.package['tips3'], util_1.Languages.package['tipstitle'], util_1.Languages.package['okb']);
      }
      else {
          api_1.api.addtripbyuser(param, function (data) {
              if (data) {
                  mui.alert(util_1.Languages.package['tips'], util_1.Languages.package['tipstitle'], util_1.Languages.package['okb']);
              }
              else {
                  mui.alert(util_1.Languages.package['tips2'], util_1.Languages.package['tipstitle'], util_1.Languages.package['okb']);
              }
          });
      }
  });
  $('#paymethod').on('change', function () {
      //判断是否选取prompt属性，无返回值；
      if ($(this).val() == "支付宝") {
          $(".zhifubao").show();
          $(".bank").hide();
      }
      else if ($(this).val() == "银行") {
          $(".zhifubao").hide();
          $(".bank").show();
      }
      else {
          $(".zhifubao").hide();
          $(".bank").hide();
      }
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
  //# sourceMappingURL=/itb-dist/wap/pages/operation/mytrip.js.map?__=1552030651276
  

});
