define('pages/buyer/buyer1.ts', function(require, exports, module) {

  "use strict";
  /// <reference path="../../@types/jquery.d.ts" />
  /// <reference path="../../@types/mui.d.ts" />
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({
      product: 'product/GetProductGroup',
      region: 'country/GetAllContinent',
      myList: 'exhibition/GetExhibitionChooseBuyers',
      allList: 'buyer/GetAllBuyers',
      'search!POST': 'buyer/SearchBuyersByFilter',
      'sendScheduleMessage!post': 'message/SendScheduleMessage',
      likeBuyerForExhibtionByBarCodeInList: 'exhibition/LikeBuyerForExhibtionByBarCodeInList',
      unlike: 'exhibition/UnLikeBuyerForExhibtionByBarCode',
      'updateListSort!post': 'exhibition/UpdateExhibitionChooseBuyers'
  });
  api_1.api.allList.set('timeOut', 3e5);
  var by = util_1.request['by'];
  var scheduleAddtoTime = util_1.Store.get('scheduleAddtoTime') == null ? '' : util_1.Store.get('scheduleAddtoTime');
  var fromSchedule = util_1.request['from'] === 'schedule';
  var wishListStage = util_1.Store.get('Stage') === 'wishlist' && util_1.Store.get('RoleName') == 'exhibition' && by != 'choose';
  var lngPkg = util_1.Languages.package;
  var currentLng = util_1.Languages.current;
  var mytext = util_1.request['text'];
  var mytext2 = '';
  if (mytext == undefined || mytext == '') {
      mytext = lngPkg.sr;
  }
  var mytexthead = "";
  if (mytext != undefined) {
      mytexthead = mytext.split('-');
      if (mytexthead.length > 0) {
          mytext2 = mytexthead[0].trim();
      }
  }
  template.defaults.imports.currentLng = currentLng;
  var renderSelect = template.compile($('#tpl-selects').html());
  var selRegion, selProduct;
  $.when(api_1.api.region(function (data) {
      var opts = renderSelect({ txt: "chau_" + currentLng, val: "chau_" + currentLng, list: data });
      selRegion = $('#selRegion')
          .append(opts);
      // .on('change', function() {
      // 	$('#btnSearch').click();
      // });
  }), api_1.api.product(function (data) {
      selProduct = $('#selProduct')
          .append(renderSelect({ txt: "group_" + currentLng, val: "id", list: data }));
      // .on('change', function() {
      // 	$('#btnSearch').click();
      // });
  })).then(function () {
      switch (by) {
          case 'product':
              //api.product({ productId: request['productId'], scheduleAddtoTime: scheduleAddtoTime }, data => showData(data));
              selProduct.val(util_1.request['productId']);
              doSearch();
              $('#backurl').attr('href', 'list.html?from=' + util_1.request['from'] + '&by=' + by + '&text=' + mytext2);
              // $('#backurl').click(function (e) {
              //     location.href='list.html?by='+by + '&text='+mytext2 + '&time='+((new Date()).getTime());
              // });
              break;
          case 'choose':
              //api.choose({ scheduleAddtoTime: scheduleAddtoTime }, data => showData(data));
              //$('#mytext2').html(lng.tips5);
              $('#backurl').attr('href', 'old_buyer1.html');
              doSearch();
              // $('#backurl').click(function (e) {
              //     location.href='buyer1.html'+ '&time='+((new Date()).getTime());
              // });
              break;
          case 'region':
              selRegion.val(util_1.request['regionId']);
              doSearch();
              //api.region({country: request['regionId']}, data => showData(data));
              //api.region({ continent: request['regionId'], scheduleAddtoTime: scheduleAddtoTime }, data => showData(data));
              $('#backurl').attr('href', 'list.html?from=' + util_1.request['from'] + '&by=' + by + '&text=' + mytext2);
              // $('#backurl').click(function (e) {
              //     location.href='list.html?by='+by + '&text='+mytext2 + '&time='+((new Date()).getTime());
              // });
              break;
          case 'interestedregion':
              selRegion.val(util_1.request['regionId']);
              doSearch();
              // api.interestedregion({ continent: request['regionId'], scheduleAddtoTime: scheduleAddtoTime }, data =>
              // 	showData(data)
              // );
              $('#backurl').attr('href', 'list.html?from=' + util_1.request['from'] + '&by=' + by + '&text=' + mytext2);
              // $('#backurl').click(function (e) {
              //     location.href='list.html?by='+by + '&text='+mytext2 + '&time='+((new Date()).getTime());
              // });
              break;
          case 'segment':
              //api.segment({ group: request['productId'], scheduleAddtoTime: scheduleAddtoTime }, data => showData(data));
              //$('#backurl').attr('href', 'list.html?from=' + request['from'] + '&by=' + by + '&text=' + mytext2);
              // $('#backurl').click(function (e) {
              //     location.href='list.html?by='+by + '&text='+mytext2 + '&time='+((new Date()).getTime());
              // });
              doSearch();
              break;
          case 'search':
              //api.search({ keyword: request['keyword'], scheduleAddtoTime: scheduleAddtoTime }, data => showData(data));
              $("#iptSearch").val(util_1.request['keyword']);
              $('#backurl').attr('href', 'old_buyer1.html');
              // $('#backurl').click(function (e) {
              //     location.href='buyer1.html'+ '&time='+((new Date()).getTime());
              // });
              doSearch();
              break;
          case 'all':
              //api.all({ scheduleAddtoTime: scheduleAddtoTime }, data => showData(data));
              $('#backurl').attr('href', 'old_buyer1.html');
              doSearch();
              // $('#backurl').click(function (e) {
              //     location.href='buyer1.html' + '&time='+((new Date()).getTime());
              // });
              break;
          default:
              doSearch();
      }
  });
  var sideBar = $('#sideBar');
  var mask1 = $('#mask1');
  var sortBar = $('#sortBar');
  $('#icoFilter').on('click', function () {
      mask1.toggle();
      sideBar.toggleClass('shown');
  });
  $('#icoCart').on('click', function () {
      mask1.toggle();
      sortBar.toggleClass('shown');
  });
  mask1.on('click', function () {
      sideBar.removeClass('shown');
      sortBar.removeClass('shown');
      mask1.hide();
  });
  var slippyList = document.querySelector('#slippyList');
  slippyList.addEventListener('slip:beforewait', function (e) {
      e.preventDefault();
  }, false);
  slippyList.addEventListener('slip:beforereorder', function (e) {
      if (/ico-remove/.test(e.target.className)) {
          e.preventDefault();
          var btnArray = [lngPkg.okb, lngPkg.cancelb];
          mui.confirm(lngPkg.Content, lngPkg.Tips, btnArray, function (ev) {
              if (ev.index == 0) {
                  api_1.api.unlike({ buyerBarcode: $(e.target).data('barcode') }, showMyList);
              }
          });
      }
  }, false);
  slippyList.addEventListener('slip:reorder', function (e) {
      e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
      updateSort();
      return false;
  }, false);
  slippyList.addEventListener('slip:beforeswipe', function (e) {
      if (/ico-remove/.test(e.target.className)) {
          e.preventDefault();
      }
  }, false);
  /* slippyList.addEventListener(
      'slip:swipe',
      function(e) {
          let li = $(e.target);
          li.remove();
          api.unlike({ buyerBarcode: li.data('barcode') },showMyList);
      },
      false
  ); */
  new Slip(slippyList);
  showMyList();
  var renderChoosed = template.compile($('#tpl-choosed').html());
  function showMyList() {
      api_1.api.myList({ scheduleAddtoTime: scheduleAddtoTime }, function (data) {
          slippyList.innerHTML = renderChoosed(data);
      });
  }
  function updateSort() {
      var buyerBarCodes = [];
      $('li', slippyList).each(function (i, li) {
          buyerBarCodes.push(li.getAttribute('data-barcode'));
      });
      api_1.api.updateListSort({ buyerBarCodes: buyerBarCodes }, function () { });
  }
  var divResult = $('#divResult');
  var renderResult = template.compile(document.getElementById('tpl-result').innerHTML);
  var tplDetail = template.compile(document.getElementById('tpl-detail').innerHTML);
  function addBuyer(buyerBarcode) {
      api_1.api.likeBuyerForExhibtionByBarCodeInList({ buyerBarcode: buyerBarcode }, function (data) {
          showMyList();
          mui.toast(util_1.Languages.package.addWishListOk, { verticalAlign: 'center' });
      });
  }
  divResult.on('click', 'li', function (e) {
      var toBarCode = this.getAttribute('data-barcode');
      if (e.target.tagName === 'IMG') {
          addBuyer(toBarCode);
          return false;
      }
      var mask = $("<div class=\"mask\" style=\"background-color: rgba(0,0,0,0.6)\"></div>");
      mask.on('click', function () {
          mask.remove();
      });
      var obj = data[this.getAttribute('data-index')];
      obj.fromSchedule = fromSchedule;
      obj.stage = wishListStage;
      obj['__lng'] = util_1.Languages.package;
      obj.currentLng = currentLng;
      mask.append(tplDetail(obj));
      $('body').append(mask);
      console.log(obj);
      //data-barcode
      $('#btnSendSchedule').click(function (e) {
          e.stopPropagation();
          api_1.api.sendScheduleMessage({
              msgTitle: util_1.Languages.package.msgTitle,
              msgContent: util_1.request['info'].replace(/\+/gi, ' '),
              toBarCode: toBarCode
          }, function (data) {
              mask.remove();
              mui.alert(util_1.Languages.package.scheduleOk, util_1.Languages.package.tipTitle, util_1.Languages.package.okb, function () {
                  window.location.href = '../schedule/mine.html';
              });
          });
      });
      $('#btnWishList').click(function (e) {
          e.stopPropagation();
          mask.remove();
          addBuyer(toBarCode);
      });
  });
  var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var list;
  var data;
  function showData(arr) {
      list = {};
      if (util_1.Languages.current === 'en') {
          data = util_1.array.sort(arr, 'company', function (a, b) {
              var A = a['company'].toUpperCase(), B = b['company'].toUpperCase();
              return A === B ? 0 : A > B ? 1 : -1;
          });
          for (var i = 0, l = data.length; i < l; i++) {
              var it = data[i], f = it['company'].substr(0, 1).toUpperCase();
              if (!list[f]) {
                  if (alpha.indexOf(f) === -1)
                      f = '#';
                  list[f] = [];
              }
              it[':index'] = i;
              list[f].push(it);
          }
      }
      else {
          data = util_1.array.sort(arr, 'company', function (a, b) {
              var A = makePy(a['company'])[0].toUpperCase(), B = makePy(b['company'])[0].toUpperCase();
              return A === B ? 0 : A > B ? 1 : -1;
          });
          for (var i = 0, l = data.length; i < l; i++) {
              var it = data[i], f = makePy(it['company'])[0]
                  .substr(0, 1)
                  .toUpperCase();
              if (!list[f]) {
                  if (alpha.indexOf(f) === -1)
                      f = '#';
                  list[f] = [];
              }
              it[':index'] = i;
              list[f].push(it);
          }
      }
      divResult.html(renderResult({ list: list, stage: wishListStage }));
  }
  //api.search({"keyword":"","region":"","product":""} , data => showData(data));
  function doSearch() {
      var param = $('#sideBar').fieldsToJson();
      api_1.api.search(param, function (data) { return showData(data); });
  }
  document.getElementById('btnSearch').addEventListener('click', function () {
      sideBar.removeClass('shown');
      mask1.hide();
      doSearch();
  }, false);
  document.getElementById('btnReset').addEventListener('click', function () {
      $("#selRegion option:first").prop("selected", 'selected');
      $("#selProduct option:first").prop("selected", 'selected');
      $("#iptSearch").val("");
  }, false);
  var toggleViewStyle = document.querySelector('#toggleViewStyle');
  var currentStyle = util_1.Store.get('wishListViewStyle', 'list');
  tkView(currentStyle);
  $('#toggleViewStyle').click(function (e) {
      if (e.target.className === 'i-icon') {
          return false;
      }
      currentStyle = currentStyle === 'thumb' ? 'list' : 'thumb';
      tkView(currentStyle);
  });
  function tkView(style) {
      divResult[0].className = (currentStyle === 'list' ? 'divListView' : 'divThumbView');
      toggleViewStyle.className = currentStyle;
      util_1.Store.set('wishListViewStyle', currentStyle);
  }
  if (fromSchedule) {
      $('#backurl').attr('href', '../schedule/mine.html');
  }
  else {
      $('#backurl').attr('href', '../dashboard/index.html');
  }
  //# sourceMappingURL=/itb-dist/wap/pages/buyer/buyer1.js.map?__=1552030651276
  

});
