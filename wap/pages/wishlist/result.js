define('pages/wishlist/result.ts', function(require, exports, module) {

  "use strict";
  /// <reference path="../../@types/jquery.d.ts" />
  /// <reference path="../../@types/mui.d.ts" />
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  var currentRole = util_1.Store.get('RoleName');
  var currentStage = util_1.Store.get('Stage');
  var lngPkg = util_1.Languages.package;
  var scheduleAddtoTime = util_1.Store.get('scheduleAddtoTime', '');
  if (currentRole === 'buyer') {
      api_1.api({
          myList: 'buyer/GetBuyerChooseExhibitions',
          del: 'buyer/DelBuyerWhilistByExhibitionBarCode',
          getDetail: 'exhibition/GetExhibitionDetailByBarCode',
          'updateListSort!post': 'buyer/UpdateBuyerChooseExhibitions'
      });
  }
  else if (currentRole === 'exhibition') {
      api_1.api({
          myList: 'exhibition/GetExhibitionChooseBuyers',
          del: 'exhibition/DelExhibtionWhilistByBuyerBarCode',
          getDetail: 'buyer/GetBuyerDetailByBarCode',
          'updateListSort!post': 'exhibition/UpdateExhibitionChooseBuyers'
      });
  }
  var comepage = util_1.request['comepage'];
  $('#pagetitle').html(lngPkg.pageTitle);
  var btnSelect = $('#btnSelect');
  btnSelect.html(lngPkg.btnselected);
  if (currentStage === 'wishlist') {
      btnSelect.show();
  }
  template.defaults.imports.currentRole = currentRole;
  function deleteWishlist(barcode) {
      mui.confirm(lngPkg['Content'], lngPkg['Tips'], [lngPkg['okb'], lngPkg['cancelb']], function (e) {
          if (e.index == 0) {
              if (currentRole == 'buyer') {
                  api_1.api.del({ exhbitionBarCode: barcode }, function (data) {
                      location.reload(true);
                  });
              }
              else if (currentRole == 'exhibition') {
                  api_1.api.del({ buyerBarCode: barcode }, function (data) {
                      location.reload(true);
                  });
              }
              else {
                  return;
              }
          }
      });
  }
  function showMyList() {
      api_1.api.myList({ scheduleAddtoTime: scheduleAddtoTime }, function (data) {
          showdata(data);
      });
  }
  showMyList();
  var tbd = $('#resultlistTBD');
  tbd.on('click', '.deleteSpan', function (e) {
      if (currentStage === 'wishlist') {
          deleteWishlist(e.target.getAttribute('data-barcode'));
      }
  }).on('click', '.tdName', function (e) {
      getInfoBybarcode(e.target.getAttribute('data-barcode'));
  });
  $('#resulthead').append('<thead><th style="width:32px;"></th><th style="width:70%">' +
      lngPkg.th1 +
      '</th><th>' +
      lngPkg.th3 +
      '</th></thead>');
  function showdata(data) {
      var html = '';
      for (var i = 0; i < data.length; i++) {
          html += "<tr><td style=\"width:32px;\">" + (1 + i) + "</td><td style=\"width:70%\" class=\"tdName\" data-barcode=\"" + data[i].barcode + "\"><b class=\"ico-handle\">\u2261</b>" + data[i].company + "</td><td><span class=\"deleteSpan\" data-barcode=\"" + data[i].barcode + "\">" + lngPkg.th4 + "</span></td></tr>";
      }
      tbd.html(html);
  }
  $('#btnSelect').click(function () {
      location.href = './wishlist.html';
  });
  $('#returntobtn').click(function () {
      if (comepage == 'wishlist')
          location.href = 'wishlist.html';
      else
          location.href = '../dashboard/index.html?s=wishlist';
  });
  var maskFlag = 1;
  function getInfoBybarcode(barcode) {
      var p = {
          barcode: barcode
      };
      api_1.api.getDetail(p, function (data) {
          var renderDetail = template.compile(document.getElementById('tpl-detail').innerHTML);
          var it = data[0];
          it.lng = lngPkg;
          console.log(it);
          maskFlag = 1;
          showMask(renderDetail(it));
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
  var slippyList = document.querySelector('#resultlistTBD');
  slippyList.addEventListener('slip:beforereorder', function (e) {
      if (/deleteSpan/.test(e.target.className)) {
          e.preventDefault();
      }
  }, false);
  slippyList.addEventListener('slip:reorder', function (e) {
      e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
      updateSort();
      return false;
  }, false);
  slippyList.addEventListener('slip:beforeswipe', function (e) {
      if (/deleteSpan/.test(e.target.className)) {
          e.preventDefault();
      }
  }, false);
  slippyList.addEventListener('slip:swipe', function (e) {
      var li = $(e.target);
      li.remove();
      deleteWishlist(li.data('barcode'));
  }, false);
  new Slip(slippyList);
  function updateSort() {
      var barCodes = [];
      $('tr', slippyList).each(function (i, tr) {
          var btn = $(tr).find('.deleteSpan')[0];
          barCodes.push(btn.id);
      });
      if (currentRole == 'buyer') {
          api_1.api.updateListSort({ exhibitionBarCodes: barCodes }, showMyList);
      }
      else {
          api_1.api.updateListSort({ buyerBarCodes: barCodes }, showMyList);
      }
  }
  //# sourceMappingURL=/itb-dist/wap/pages/wishlist/result.js.map?__=1552030651276
  

});
