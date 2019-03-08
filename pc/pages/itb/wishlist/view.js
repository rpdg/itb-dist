define('pages/itb/wishlist/view.ts', function(require, exports, module) {

  "use strict";
  /// <reference path="../../../@types/jquery.d.ts" />
  /// <reference path="../../../@types/jquery.plugins.d.ts" />
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var store_1 = require("ts/util/store.ts");
  var api_1 = require("ts/util/api.ts");
  var currentRole = store_1.store.get('RoleName');
  var currentStage = store_1.store.get('Stage');
  var lngPkg = Languages_1.Languages.package;
  if (currentRole === 'buyer') {
      opg_1.default.api({
          myList: 'buyer/GetBuyerChooseExhibitionWishlist',
          del: 'buyer/DelBuyerWhilistByExhibitionBarCode',
          'updateListSort!post': 'buyer/UpdateBuyerChooseExhibitions'
      });
  }
  else if (currentRole === 'exhibition') {
      opg_1.default.api({
          myList: 'exhibition/ExhibitionChooseWishListResultForView',
          del: 'exhibition/DelExhibtionWhilistByBuyerBarCode',
          'updateListSort!post': 'exhibition/UpdateExhibitionChooseBuyers'
      });
  }
  if (currentStage === 'wishlist') {
      $('#btnselected').show();
      $('#btnselected').html(lngPkg.btnselected);
  }
  else {
      $('#btnselected').hide();
      $('#btnselected').html(lngPkg.btnselected);
  }
  var barcodeArr;
  var tb = opg_1.default('#tb').table({
      api: opg_1.default.api.myList,
      titleBar: {
          title: lngPkg.list
      },
      columns: [
          {
              text: ' ',
              width: 64,
              align: 'center',
              src: 'company',
              render: function (id, i, row) {
                  return i + 1;
              }
          },
          {
              text: lngPkg.th1,
              src: 'company',
              render: function (id, index, row) {
                  var html = row.company + " \u3010" + (" " + row.Name + "\u3011<b class=\"ico-handle\">\u2261</b>");
                  return html;
              }
          },
          {
              text: lngPkg.th2,
              width: 180,
              src: 'applieddatetime'
          },
          {
              text: lngPkg.th3,
              width: 100,
              src: 'barcode',
              render: function (id, index, row) {
                  var html = "<button data-id=\"" + row.barcode + "\"  class=\"btn-mini btn-danger\" >" + lngPkg.th4 + "</button> ";
                  return html;
              }
          }
      ],
      pagination: false,
      onAjaxEnd: function (data) {
          console.log(data);
          var arr = [];
          for (var i = 0, l = data.length; i < l; i++) {
              arr.push(data[i].barcode);
          }
          barcodeArr = arr;
      }
  });
  tb.tbody.on('click', '.btn-danger', function () {
      var barcode = $(this).data('id');
      top.opg.confirm(lngPkg.Content, function () {
          if (currentStage === 'wishlist') {
              var param = {};
              if (currentRole == 'buyer') {
                  param.exhbitionBarCode = barcode;
              }
              else if (currentRole == 'exhibition') {
                  param.buyerBarCode = barcode;
              }
              opg_1.default.api.del(param, function (data) {
                  tb.update();
              });
          }
      }, {
          title: lngPkg.Tips,
      });
  });
  $('#btnselected').click(function () {
      location.href = 'index.html';
  });
  var slippyList = $('#tb').find('tbody')[0];
  slippyList.addEventListener('slip:beforereorder', function (e) {
      if (e.target.tagName === 'BUTTON') {
          e.preventDefault();
      }
  }, false);
  slippyList.addEventListener('slip:beforewait', function (e) {
      e.preventDefault();
  }, false);
  slippyList.addEventListener('slip:reorder', function (e) {
      e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
      updateSort();
      return false;
  }, false);
  new Slip(slippyList);
  function updateSort() {
      var barCodes = [];
      $('tr', slippyList).each(function (i, tr) {
          var btn = $(tr).find('button')[0];
          barCodes.push(btn.getAttribute('data-id'));
      });
      if (JSON.stringify(barCodes) === JSON.stringify(barcodeArr)) {
          return;
      }
      if (currentRole == 'buyer') {
          api_1.api.updateListSort({ exhibitionBarCodes: barCodes }, function () {
              barcodeArr = barCodes;
              tb.update();
          });
      }
      else {
          api_1.api.updateListSort({ buyerBarCodes: barCodes }, function () {
              barcodeArr = barCodes;
              tb.update();
          });
      }
  }
  //# sourceMappingURL=/itb-dist/pc/pages/itb/wishlist/view.js.map?__=1552033897847
  

});
