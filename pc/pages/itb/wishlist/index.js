define('pages/itb/wishlist/index.ts', function(require, exports, module) {

  "use strict";
  /// <reference path="../../../@types/jquery.d.ts" />
  /// <reference path="../../../@types/jquery.plugins.d.ts" />
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var store_1 = require("ts/util/store.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var opg_1 = require("ts/opg.ts");
  api_1.api({
      exhibition_getList: 'exhibition/GetExhibitionWishlist',
      exhibition_like: 'exhibition/LikeBuyerForExhibtionByBarCode',
      exhibition_unlike: 'exhibition/UnLikeBuyerForExhibtionByBarCode',
      exhibition_result: 'exhibition/ExhibitionWishListResult',
      'exhibition_ignores!post': 'exhibition/UpExhibitionWishlistStatus',
      buyer_getList: 'buyer/GetBuyerWishlist',
      buyer_like: 'buyer/LikeExhibtionForBuyerByBarCode',
      buyer_unlike: 'buyer/UnLikeExhibtionForBuyerByBarCode',
      buyer_result: 'buyer/BuyerWishListResult',
      'buyer_ignores!post': 'buyer/UpBuyerWishlistStatus'
  });
  var lng = Languages_1.Languages.package;
  var clng = 'en';
  api_1.api.exhibition_like.set('onError', function (code, error, callback) {
      if (code === 200 && error === 'LikeBuyerForExhibtionByBarCode_Error01') {
          var errorMsg = lng['tips3'];
          top.opg.confirm("" + errorMsg);
      }
  });
  api_1.api.buyer_like.set('onError', function (code, error, callback) {
      if (code === 200 && error === 'LikeExhibtionForBuyerByBarCode_Error01') {
          var errorMsg = lng['tips3'];
          top.opg.confirm("" + errorMsg, function () { });
      }
  });
  api_1.api.exhibition_getList.set('onError', function (code, error, callback) {
      if (code === 200 && error === 'GetExhibitionWishlist_Error01') {
          //location.href = __uri('../wishlist/result.html?isemployee=1');
          var errorMsg = lng['tips'];
          //alert(`${errorMsg}`);
          top.opg.confirm("" + errorMsg, function () { });
      }
  });
  if (localStorage.getItem('lngPkg') != null || localStorage.getItem('lngPkg') != undefined) {
      var currentlng = localStorage.getItem('lngPkg');
      clng = currentlng.replace(/["""]/g, '');
  }
  var act = store_1.store.get('RoleName') === 'exhibition' ? 'exhibition' : 'buyer';
  template.defaults.imports.act = act;
  var target = act === 'exhibition' ? 'buyer' : 'exhibition';
  var resultPage = '/itb-dist/pc/pages/itb/wishlist/view.html?__=ba4bc51';
  var checkedSet = {};
  api_1.api[act + '_getList'](function (data) {
      showResult();
      if (data.length === 0) {
          if (act == 'exhibition')
              top.opg.confirm(lng['tips4'], function () { });
          else
              top.opg.confirm(lng['tips5'], function () { });
      }
      for (var i = 0; i < data.length; i++) {
          var ppic = filterRegistrationLogoUrl(data[i].company_logo);
          var ppic2 = filterRegistrationLogoUrl(data[i].logourl);
          if (ppic != '' && ppic != undefined && ppic != null) {
              data[i].company_logo = ppic;
          }
          else {
              data[i].company_logo = '';
          }
          if (ppic2 != '' && ppic2 != undefined && ppic2 != null) {
              data[i].logourl = ppic2;
          }
          else {
              data[i].logourl = '';
          }
      }
      //console.log(data);
      document.getElementById('swiper').innerHTML = template('tpl-swiper', { data: data, lng: Languages_1.Languages.package });
      var swiper = new Swiper('#swiper', {
          autoplay: false,
          /*pagination: {
              el: '.swiper-pagination',
              type: 'fraction',
          },*/
          navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
          },
          on: {
              slideChange: function () {
                  if (this.realIndex == this.slides.length - 1) {
                      var errorMsg = lng['swiperTitle'];
                      opg_1.default.confirm(errorMsg, function () {
                          var uncheckedArray = [];
                          for (var i = 0, l = data.length; i < l; i++) {
                              var barcode = data[i].barcode;
                              if (!(barcode in checkedSet)) {
                                  uncheckedArray.push(barcode);
                              }
                          }
                          if (uncheckedArray.length) {
                              var param = { barcodes: uncheckedArray.join(',') };
                              api_1.api[act + '_ignores'](param, function () {
                                  location.href = '/itb-dist/pc/pages/itb/wishlist/index.html?__=9938930';
                              });
                          }
                          else {
                              location.href = '/itb-dist/pc/pages/itb/wishlist/index.html?__=9938930';
                          }
                      }, {
                          width: 400,
                          buttons: {
                              ok: lng['swiperCancel'],
                              cancel: lng['swiperOk']
                          }
                      });
                  }
              }
          }
      });
      $('#like,#unlike').click(function () {
          var _this = this;
          var index = swiper.realIndex, item = data[index];
          var paramKey = target + 'Barcode', param = {};
          //console.log(item, paramKey , param , swiper.realIndex);
          param[paramKey] = item.barcode;
          api_1.api[act + "_" + this.id](param, function (res) {
              if ("" + _this.id === 'like') {
                  var pop_1 = opg_1.default.popTop($("<div style=\"border-radius: 5px;background-color: #999;line-height: 100px; color:#ffffff;width:300px;height:100px;text-align: center;font-size:22px;\">" + lng.addWishListOk + "</div>"), {
                      modalClose: true
                  });
                  setTimeout(function () { return pop_1.close(); }, 1000);
              }
              else if ("" + _this.id === 'unlike') {
                  var pop_2 = opg_1.default.popTop($("<div style=\"border-radius: 5px;background-color: #999;line-height: 100px; color:#ffffff;width:300px;height:100px;text-align: center;font-size:22px;\">" + lng.addWishListFail + "</div>"), {
                      modalClose: true
                  });
                  setTimeout(function () { return pop_2.close(); }, 1000);
              }
              //add barcode into checked array
              checkedSet[item.barcode] = true;
              if (data.length > 1) {
                  data.splice(index, 1);
                  swiper.removeSlide(index);
              }
              else {
                  continueSelect();
              }
          });
      });
  });
  function continueSelect() {
      opg_1.default.confirm(lng.continueSelect, function (e) {
          if (e.index == 0) {
              location.reload(true);
          }
          else {
              location.href = resultPage;
          }
      }, {
          title: lng.process,
          buttons: {
              ok: lng.btn.yes,
              cancel: lng.btn.no
          }
      });
  }
  var tplResult = template.compile(document.getElementById('tpl-result').innerHTML);
  function showResult() {
      api_1.api[act + "_result"](function (res) {
          if (res.min === 0 && res.max === 0) {
              var errorMsg = lng['tips2'];
              top.opg.confirm("" + errorMsg, function () {
                  location.href = '../dashboard/idnex.';
              });
          }
          else {
              res.percent = ((res.selected / res.max) * 100).toFixed(0) + '%';
              var data = {
                  lng: lng,
                  result: res
              };
              var html = tplResult(data);
              var ophtml_1 = opg_1.default(html).popup({
                  modalClose: false,
                  width: 300,
                  height: 480
              });
              $('#btnContinue').click(function (e) {
                  e.stopPropagation();
                  ophtml_1.close();
                  //location.reload(true);
              });
              $('#btnViewScore').click(function (e) {
                  e.stopPropagation();
                  location.href = resultPage;
              });
          }
      });
  }
  function filterRegistrationLogoUrl(logourl) {
      if (logourl != null && logourl != undefined && $.trim(logourl) != 'N/A' && $.trim(logourl) != '未提供') {
          var newurl = logourl.split('/');
          return '/Logo/' + newurl[newurl.length - 1];
      }
      else
          return '';
  }
  //# sourceMappingURL=/itb-dist/pc/pages/itb/wishlist/index.js.map?__=1552033897847
  

});
