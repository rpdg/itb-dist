define('pages/buyer/buyer3.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({
      product: 'buyer/GetBuyersByProduct',
      choose: 'exhibition/GetExhibitionChooseBuyers',
      //region: 'buyer/GetBuyersByCountry',
      region: 'buyer/GetBuyersByContinent',
      interestedregion: 'buyer/GetBuyersByContinent2',
      segment: 'buyer/GetBuyersByGroup',
      all: 'buyer/GetAllBuyers',
      search: 'buyer/SearchBuyers',
      'sendScheduleMessage!post': 'message/SendScheduleMessage',
      likeBuyerForExhibtionByBarCodeInList: 'exhibition/LikeBuyerForExhibtionByBarCodeInList'
  });
  api_1.api.all.set('timeOut', 3e5);
  var by = util_1.request['by'];
  var scheduleAddtoTime = util_1.Store.get('scheduleAddtoTime') == null ? '' : util_1.Store.get('scheduleAddtoTime');
  var fromSchedule = util_1.request['from'] === 'schedule';
  var wishListStage = util_1.Store.get('Stage') === 'wishlist' && util_1.Store.get('RoleName') == 'exhibition' && by != 'choose';
  var lng = util_1.Languages.package;
  var clng = 'en';
  if (localStorage.getItem('lngPkg') != null || localStorage.getItem('lngPkg') != undefined) {
      var currentlng = localStorage.getItem('lngPkg');
      clng = currentlng.replace(/["""]/g, '');
  }
  template.defaults.imports.clng = clng;
  var mytext = util_1.request['text'];
  var mytext2 = '';
  if (mytext == undefined || mytext == '') {
      mytext = lng.sr;
  }
  var mytexthead = mytext.split('-');
  if (mytexthead.length > 0) {
      mytext2 = mytexthead[0].trim();
  }
  $('#mytext').html('- ' + mytext);
  api_1.api.likeBuyerForExhibtionByBarCodeInList.set('onError', function (code, error, callback) {
      if (code === 200 && error === 'LikeBuyerForExhibtionByBarCodeInList_Error01') {
          var errorMsg = lng['tips3'];
          mui.alert("" + errorMsg, lng['tipTitle'], lng['okb']);
      }
  });
  api_1.api.sendScheduleMessage.set('onError', function (code, error, callback) {
      if (code === 200 && error === 'message_error05') {
          var errorMsg = lng['tips4'];
          mui.alert("" + errorMsg, lng['tipTitle'], lng['okb']);
      }
  });
  switch (by) {
      case 'product':
          api_1.api.product({ productId: util_1.request['productId'], scheduleAddtoTime: scheduleAddtoTime }, function (data) { return showData(data); });
          $('#backurl').attr('href', 'list.html?from=' + util_1.request['from'] + '&by=' + by + '&text=' + mytext2);
          // $('#backurl').click(function (e) {
          //     location.href='list.html?by='+by + '&text='+mytext2 + '&time='+((new Date()).getTime());
          // });
          break;
      case 'choose':
          api_1.api.choose({ scheduleAddtoTime: scheduleAddtoTime }, function (data) { return showData(data); });
          $('#mytext2').html(lng.tips5);
          $('#backurl').attr('href', 'buyer1.html?from=' + util_1.request['from']);
          // $('#backurl').click(function (e) {
          //     location.href='buyer1.html'+ '&time='+((new Date()).getTime());
          // });
          break;
      case 'region':
          //api.region({country: request['regionId']}, data => showData(data));
          api_1.api.region({ continent: util_1.request['regionId'], scheduleAddtoTime: scheduleAddtoTime }, function (data) { return showData(data); });
          $('#backurl').attr('href', 'list.html?from=' + util_1.request['from'] + '&by=' + by + '&text=' + mytext2);
          // $('#backurl').click(function (e) {
          //     location.href='list.html?by='+by + '&text='+mytext2 + '&time='+((new Date()).getTime());
          // });
          break;
      case 'interestedregion':
          api_1.api.interestedregion({ continent: util_1.request['regionId'], scheduleAddtoTime: scheduleAddtoTime }, function (data) {
              return showData(data);
          });
          $('#backurl').attr('href', 'list.html?from=' + util_1.request['from'] + '&by=' + by + '&text=' + mytext2);
          // $('#backurl').click(function (e) {
          //     location.href='list.html?by='+by + '&text='+mytext2 + '&time='+((new Date()).getTime());
          // });
          break;
      case 'segment':
          api_1.api.segment({ group: util_1.request['productId'], scheduleAddtoTime: scheduleAddtoTime }, function (data) { return showData(data); });
          $('#backurl').attr('href', 'list.html?from=' + util_1.request['from'] + '&by=' + by + '&text=' + mytext2);
          // $('#backurl').click(function (e) {
          //     location.href='list.html?by='+by + '&text='+mytext2 + '&time='+((new Date()).getTime());
          // });
          break;
      case 'search':
          api_1.api.search({ keyword: util_1.request['keyword'], scheduleAddtoTime: scheduleAddtoTime }, function (data) { return showData(data); });
          $('#backurl').attr('href', 'buyer1.html?from=' + util_1.request['from']);
          // $('#backurl').click(function (e) {
          //     location.href='buyer1.html'+ '&time='+((new Date()).getTime());
          // });
          break;
      case 'all':
          api_1.api.all({ scheduleAddtoTime: scheduleAddtoTime }, function (data) { return showData(data); });
          $('#backurl').attr('href', 'buyer1.html?from=' + util_1.request['from']);
          // $('#backurl').click(function (e) {
          //     location.href='buyer1.html' + '&time='+((new Date()).getTime());
          // });
          break;
      default:
  }
  var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var list = {};
  function showData(arr) {
      var data;
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
      /*let obj = {
          lng: Languages.current,
          arr: list
      };*/
      var ul = $('#divBuyerThumbList');
      var pd = $.isEmptyObject(list);
      if (pd) {
          ul.hide();
      }
      else {
          ul.show();
          ul.html(template('tpl', list));
      }
      var tplDetail = template.compile(document.getElementById('tpl-detail').innerHTML);
      ul.on('click', 'li', function () {
          var mask = $("<div class=\"mask\" style=\"background-color: rgba(0,0,0,0.6)\"></div>");
          mask.on('click', function () {
              mask.remove();
          });
          var obj = data[this.getAttribute('data-index')];
          obj.fromSchedule = fromSchedule;
          obj.stage = wishListStage;
          obj['__lng'] = util_1.Languages.package;
          obj.clng = clng;
          mask.append(tplDetail(obj));
          $('body').append(mask);
          console.log(obj);
          var toBarCode = this.getAttribute('data-barcode');
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
              api_1.api.likeBuyerForExhibtionByBarCodeInList({ buyerBarcode: toBarCode }, function (data) {
                  mask.remove();
                  //mui.alert(Languages.package.addWishListOk, Languages.package.tipTitle, 'OK');
                  mui.toast(util_1.Languages.package.addWishListOk, { verticalAlign: 'center' });
              });
          });
      });
  }
  document.getElementById('iptSearch').addEventListener('keypress', function (evt) {
      if (evt.keyCode === 13 && this.value) {
          location.href =
              './buyer3.html?by=search' +
                  (util_1.request['from'] ? '&from=' + util_1.request['from'] : '') +
                  (util_1.request['info'] ? '&info=' + util_1.request['info'] : '') +
                  '&keyword=' +
                  this.value;
      }
  }, false);
  $('#iptSearch').attr('placeholder', lng.searchtips);
  //# sourceMappingURL=/itb-dist/wap/pages/buyer/buyer3.js.map?__=1552030651276
  

});
