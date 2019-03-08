define('pages/wishlist/wishlist.ts', function(require, exports, module) {

  "use strict";
  /// <reference path="../../@types/jquery.d.ts" />
  /// <reference path="../../@types/mui.d.ts" />
  /// <reference path="../../@types/custom.d.ts" />
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
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
  var lng = util_1.Languages.package;
  var resultPage = '/itb-dist/wap/pages/wishlist/result.html?__=1552030651276';
  api_1.api.exhibition_getList.set('onError', function (code, error, callback) {
      if (code === 200 && error === 'GetExhibitionWishlist_Error01') {
          //location.href = __uri('../wishlist/result.html?isemployee=1');
          var errorMsg = lng['tips'];
          mui.alert("" + errorMsg, lng['tipTitle'], lng['okb']);
      }
  });
  api_1.api.exhibition_like.set('onError', function (code, error, callback) {
      if (code === 200 && error === 'LikeBuyerForExhibtionByBarCode_Error01') {
          var errorMsg = lng['tips3'];
          mui.alert("" + errorMsg, lng['tipTitle'], lng['okb']);
      }
  });
  api_1.api.buyer_like.set('onError', function (code, error, callback) {
      if (code === 200 && error === 'LikeExhibtionForBuyerByBarCode_Error01') {
          var errorMsg = lng['tips3'];
          mui.alert("" + errorMsg, lng['tipTitle'], lng['okb']);
      }
  });
  var clng = 'en';
  if (localStorage.getItem('lngPkg') != null || localStorage.getItem('lngPkg') != undefined) {
      var currentlng = localStorage.getItem('lngPkg');
      clng = currentlng.replace(/["""]/g, '');
  }
  var act = util_1.Store.get('RoleName') === 'exhibition' ? 'exhibition' : 'buyer';
  var target = act === 'exhibition' ? 'buyer' : 'exhibition';
  template.defaults.imports.act = act;
  var checkedSet = {};
  var getWishList = function (isShowResult) {
      api_1.api[act + '_getList'](function (data) {
          if (isShowResult) {
              showResult();
          }
          if (data.length === 0) {
              if (act == 'exhibition') {
                  var errorMsg = lng['tips4'];
                  mui.alert("" + errorMsg, lng['tipTitle'], lng['okb']);
              }
              else {
                  var errorMsg = lng['tips5'];
                  mui.alert("" + errorMsg, lng['tipTitle'], lng['okb']);
              }
          }
          data.showDetail = lng.showDetail;
          data.lng = util_1.Languages.package;
          data.clng = clng;
          document.getElementById('swiper-wrapper').innerHTML = template('tpl-slider', data);
          var swiper = new Swiper('#slider', {
              slidesPerView: 'auto',
              centeredSlides: true,
              loop: false,
              loopFillGroupWithBlank: true,
              observer: true,
              observeParents: true,
              spaceBetween: 30,
              on: {
                  slideChange: function () {
                      if (this.realIndex == this.slides.length - 1) {
                          var btnArray = [lng['swiperOk'], lng['swiperCancel']];
                          mui.confirm(lng['swiperTitle'], lng['tipTitle'], btnArray, function (e) {
                              if (e.index == 1) {
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
                                          location.href = '/itb-dist/wap/pages/wishlist/wishlist.html?__=1552030651276';
                                      });
                                  }
                                  else {
                                      location.href = '/itb-dist/wap/pages/wishlist/wishlist.html?__=1552030651276';
                                  }
                              }
                          });
                      }
                  }
              }
          });
          var renderDetail = template.compile(document.getElementById('tpl-detail').innerHTML);
          $('#slider')
              .off('click')
              .on('click', '.swiper-slide', function () {
              var idx = this.getAttribute('data-index');
              var it = data[idx];
              it.clng = clng;
              it.lng = lng;
              maskFlag = 1;
              showMask(renderDetail(it));
          });
          $('#like,#unlike').click(function () {
              var _this = this;
              var ele = $('.swiper-slide-active');
              var index = $('.swiper-slide').index(ele);
              //let index = swiper.realIndex;
              var item = data[index];
              var paramKey = target + 'Barcode', param = {};
              //console.log(item, paramKey , param , swiper.realIndex);
              param[paramKey] = item.barcode;
              api_1.api[act + "_" + this.id](param, function (res) {
                  if ("" + _this.id === 'like')
                      mui.toast(lng.addWishListOk, { verticalAlign: 'center' });
                  else if ("" + _this.id === 'unlike')
                      mui.toast(lng.addWishListFail, { verticalAlign: 'center' });
                  //add barcode into checked array
                  checkedSet[item.barcode] = true;
                  if (data.length > 1) {
                      //debugger;
                      data.splice(index, 1);
                      swiper.removeSlide(index);
                      swiper.update();
                  }
                  else {
                      showResult();
                  }
              });
          });
          runTour();
      });
  };
  getWishList(util_1.Store.get('tour_end') && util_1.Store.get('tour_end') == 'yes');
  var tplResult = template.compile(document.getElementById('tpl-result').innerHTML);
  var maskFlag = 1;
  function showResult() {
      api_1.api[act + "_result"](function (res) {
          if (res.min === 0 && res.max === 0) {
              var errorMsg = lng['tips2'];
              var btnArray = [lng['okb'], lng['cancelb']];
              mui.confirm("" + errorMsg, lng['tipTitle'], btnArray, function (e) {
                  if (e.index == 0) {
                      location.href = '../dashboard/index.html';
                  }
                  else {
                      location.href = '../dashboard/index.html';
                  }
              });
          }
          else {
              res.percent = ((res.selected / res.max) * 100).toFixed(0) + '%';
              var data = {
                  lng: lng,
                  result: res
              };
              maskFlag = 0;
              var mask_1 = showMask(tplResult(data));
              $('#btnSetting').click(function (e) {
                  e.stopPropagation();
                  location.href = 'busydate.html';
              });
              $('#btnContinue').click(function (e) {
                  e.stopPropagation();
                  mask_1.remove();
                  getWishList(false);
                  //location.reload(true);
              });
              $('#btnViewScore').click(function (e) {
                  e.stopPropagation();
                  location.href = resultPage + '&comepage=wishlist';
              });
              if (act === 'exhibition')
                  $('#btnSetting').hide();
          }
      });
  }
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
  /*function continueSelect() {
      let btnArray = [lng.btn.yes, lng.btn.no];
      mui.confirm(lng.continueSelect, lng.process, btnArray, function (e) {
          if (e.index == 0) {
              location.reload(true);
          } else {
              location.href = resultPage;
          }
      });
  }*/
  $('#btn_submit').click(function () {
      location.href = '../dashboard/index.html?s=wishlist';
  });
  function runTour() {
      var tour = new Tour({
          backdrop: true,
          smartPlacement: true,
          //storage: false,
          template: "<div class='popover tour'>\n\t\t\t\t  <div class='arrow'></div>\n\t\t\t\t  <h3 class='popover-title'></h3>\n\t\t\t\t  <div class='popover-content'></div>\n\t\t\t\t  <div class='popover-navigation'>\n\t\t\t\t    <button class='btn btn-default' data-role='prev'>\u00AB " + lng.tourLabel.prev + "</button>\n\t\t\t\t    <button class='btn btn-default' data-role='next'>" + lng.tourLabel.next + " \u00BB</button>\n\t\t\t\t    <button class='btn btn-default' data-role='end'>" + lng.tourLabel.end + "</button>\n\t\t\t\t  </div>\n\t\t\t\t</div>",
          steps: [
              {
                  element: '.swiper-slide-active',
                  reflex: true,
                  placement: 'top',
                  title: lng.tour[7].title,
                  content: lng.tour[7].content
              },
              {
                  element: '.swiper-slide-active',
                  reflex: true,
                  placement: 'top',
                  title: act == 'exhibition' ? lng.tour[0].title : lng.tour[5].title,
                  content: act == 'exhibition' ? lng.tour[0].content : lng.tour[5].content
              },
              {
                  element: '#btn_submit',
                  reflex: true,
                  placement: 'left',
                  title: lng.tour[6].title,
                  content: lng.tour[6].content
              },
              {
                  element: '#like',
                  reflex: true,
                  placement: 'top',
                  title: act == 'exhibition' ? lng.tour[1].title : lng.tour[3].title,
                  content: act == 'exhibition' ? lng.tour[1].content : lng.tour[3].content
              },
              {
                  element: '#unlike',
                  reflex: true,
                  placement: 'top',
                  title: act == 'exhibition' ? lng.tour[2].title : lng.tour[4].title,
                  content: act == 'exhibition' ? lng.tour[2].content : lng.tour[4].content
              }
          ]
          /*onNext :function () {
              tour.redraw();
          }*/
      });
      // Initialize the tour
      tour.init();
      // Start the tour
      tour.start();
  }
  //$('.mui-content').addClass('mui-content-app-correction');
  //# sourceMappingURL=/itb-dist/wap/pages/wishlist/wishlist.js.map?__=1552030651276
  

});
