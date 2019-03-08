define('pages/itb/wishlist/old_view.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  opg_ts_1.default.api({
      'getBuyerChooseExhibitionWishlist': 'buyer/GetBuyerChooseExhibitionWishlist',
      'exhibitionChooseWishListResult': 'exhibition/ExhibitionChooseWishListResultForView',
      'delBuyerWhilistByExhibitionBarCode': 'buyer/DelBuyerWhilistByExhibitionBarCode',
      'delExhibtionWhilistByBuyerBarCode': 'exhibition/DelExhibtionWhilistByBuyerBarCode',
      'getCurrentUserInfoAndMenus': 'user/GetCurrentUserInfoAndMenus',
  });
  var lpg = Languages_1.Languages.package;
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  var RoleName = localStorage.getItem('RoleName').replace(/["""]/g, "");
  var curStage = '';
  var needapi = '';
  opg_ts_1.default.api.getCurrentUserInfoAndMenus({ type: 1 }, function (data) {
      curStage = data.stage[0].name;
      var timeout = setTimeout(function () {
          refreshtable();
      }, 1000);
  });
  function refreshtable() {
      if (curStage === "Wishlist") {
          $("#btnselected").show();
          $("#btnselected").html(lpg.btnselected);
      }
      else {
          $("#btnselected").hide();
          $("#btnselected").html(lpg.btnselected);
      }
      tb.update();
  }
  if (RoleName === "buyer") {
      needapi = "getBuyerChooseExhibitionWishlist";
  }
  else if (RoleName === "exhibition") {
      needapi = "exhibitionChooseWishListResult";
  }
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api[needapi],
      lazy: true,
      titleBar: {
          title: "" + lpg.list
      },
      columns: [
          {
              text: "" + lpg.th1, width: 300,
              src: 'company',
              render: function (id, index, row) {
                  var html = row.company + " \u3010" + (" " + row.Name + "\u3011");
                  return html;
              }
          },
          {
              text: "" + lpg.th2, width: 100,
              src: 'applieddatetime',
          },
          {
              text: "" + lpg.th3, width: 100,
              src: 'barcode',
              render: function (id, index, row) {
                  var html = "<button data-id=\"" + row.barcode + "\"  class=\"btn-mini btn-danger\" >" + lpg.th4 + "</button> ";
                  return html;
              }
          }
      ],
      pagination: false,
  });
  tb.tbody.on('click', '.btn-danger', function () {
      var btn = $(this), barcode = btn.data('id');
      var param = {};
      param.barcode = barcode;
      var pop = top.opg.confirm("" + lpg.Content, function () {
          if (RoleName == "buyer" && curStage === 'Wishlist') {
              opg_ts_1.default.api.delBuyerWhilistByExhibitionBarCode({ exhbitionBarCode: barcode }, function (data) {
                  tb.update();
              });
          }
          else if (RoleName == "exhibition" && curStage === 'Wishlist') {
              opg_ts_1.default.api.delExhibtionWhilistByBuyerBarCode({ buyerBarCode: barcode }, function (data) {
                  tb.update();
              });
          }
          else {
              return;
          }
      }, {
          title: "" + lpg.Tips,
          buttons: {
              ok: "" + lpg.okb,
              cancel: "" + lpg.cancelb
          },
      });
  });
  $("#btnselected").click(function () {
      location.href = "index.html";
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
  //# sourceMappingURL=/itb-dist/pc/pages/itb/wishlist/old_view.js.map?__=1552033897847
  

});
