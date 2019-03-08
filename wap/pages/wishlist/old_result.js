define('pages/wishlist/old_result.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({
      'getBuyerChooseExhibitionWishlist': 'buyer/GetBuyerChooseExhibitionWishlist',
      'exhibitionChooseWishListResult': 'exhibition/ExhibitionChooseWishListResult',
      'delBuyerWhilistByExhibitionBarCode': 'buyer/DelBuyerWhilistByExhibitionBarCode',
      'delExhibtionWhilistByBuyerBarCode': 'exhibition/DelExhibtionWhilistByBuyerBarCode',
      'getExhibitionDetailByBarCode': 'exhibition/GetExhibitionDetailByBarCode',
      'getBuyerDetailByBarCode': 'buyer/GetBuyerDetailByBarCode'
  });
  var lpg = util_1.Languages.package;
  var comepage = util_1.request['comepage'];
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  $("#pagetitle").html(lpg.pageTitle);
  var btnSelect = $("#btnSelect");
  btnSelect.html(lpg.btnselected);
  var act = util_1.Store.get('RoleName') === 'exhibition' ? 'exhibition' : 'buyer';
  var target = util_1.Store.get('RoleName') === 'exhibition' ? 'buyer' : 'exhibition';
  var curStage = util_1.Store.get('Stage');
  if (curStage === 'wishlist') {
      btnSelect.show();
  }
  template.defaults.imports.act = act;
  function deleteWishlist(barcode) {
      mui.confirm(lpg['Content'], lpg['Tips'], [lpg['okb'], lpg['cancelb']], function (e) {
          if (e.index == 0) {
              if (act == "buyer") {
                  api_1.api.delBuyerWhilistByExhibitionBarCode({ exhbitionBarCode: barcode }, function (data) {
                      location.reload(true);
                  });
              }
              else if (act == "exhibition") {
                  api_1.api.delExhibtionWhilistByBuyerBarCode({ buyerBarCode: barcode }, function (data) {
                      location.reload(true);
                  });
              }
              else {
                  return;
              }
          }
      });
  }
  ;
  var param = {};
  if (act == "buyer") {
      api_1.api.getBuyerChooseExhibitionWishlist(param, function (data) {
          showdata(data);
      });
  }
  else if (act == "exhibition") {
      api_1.api.exhibitionChooseWishListResult(param, function (data) {
          showdata(data);
      });
  }
  function showdata(data) {
      $("#resulthead tr").html("");
      $("#resulthead").append("<thead><th style='width:70%'>" + lpg.th1 + "</th><th>" + lpg.th3 + "</th></thead>");
      $("#resultlist tr").html("");
      var _loop_1 = function () {
          _len = $("#resultlist tr").length;
          var b = data[i].barcode;
          var deletespan = $("<span class='deleteSpan' id='" + data[i].barcode + "'>" + lpg.th4 + "</span>");
          deletespan.on('click', function () {
              if (curStage === 'wishlist') {
                  deleteWishlist(b);
              }
          });
          if (data[i].company.length > 25) {
              $("#resultlist").append("<tr><td style='width:70%' id='c" + data[i].barcode + "'>" + data[i].company.substr(0, 22) + "...</td>"
                  + "<td id='td" + data[i].barcode + "'></td>"
                  + "</tr>");
              $("#td" + data[i].barcode).append(deletespan);
              $("#c" + data[i].barcode).on('click', function () {
                  getInfoBybarcode(b);
              });
          }
          else {
              $("#resultlist").append("<tr><td style='width:70%' id='c" + data[i].barcode + "'>" + data[i].company + "</td>"
                  + "<td id='td" + data[i].barcode + "'></td>"
                  + "</tr>");
              $("#td" + data[i].barcode).append(deletespan);
              $("#c" + data[i].barcode).on('click', function () {
                  getInfoBybarcode(b);
              });
          }
      };
      var _len;
      for (var i = 0; i < data.length; i++) {
          _loop_1();
      }
  }
  $('#btnSelect').click(function () {
      location.href = './wishlist.html';
  });
  $('#returntobtn').click(function () {
      if (comepage == "wishlist")
          location.href = 'wishlist.html';
      else
          location.href = "../dashboard/index.html?s=wishlist";
  });
  var maskFlag = 1;
  function getInfoBybarcode(barcode) {
      var p = {};
      p.barcode = barcode;
      if (act == "buyer") {
          api_1.api.getExhibitionDetailByBarCode(p, function (data) {
              var renderDetail = template.compile(document.getElementById('tpl-detail').innerHTML);
              var it = data[0];
              it.clng = clng;
              it.lng = lpg;
              console.log(it);
              maskFlag = 1;
              showMask(renderDetail(it));
          });
      }
      else if (act == "exhibition") {
          api_1.api.getBuyerDetailByBarCode(p, function (data) {
              var renderDetail = template.compile(document.getElementById('tpl-detail').innerHTML);
              var it = data[0];
              it.clng = clng;
              it.lng = lpg;
              console.log(it);
              maskFlag = 1;
              showMask(renderDetail(it));
          });
      }
  }
  ;
  function showMask(htmlContent) {
      var mask = $("<div id=\"mymask\" class=\"mask\" style=\"background-color: rgba(0,0,0,0.6)\"></div>");
      mask.on('click', function () {
          if (maskFlag === 1) {
              mask.remove();
          }
      });
      mask.append(htmlContent);
      $('body').append(mask);
      return mask;
  }
  //# sourceMappingURL=/itb-dist/wap/pages/wishlist/old_result.js.map?__=1552030651276
  

});
