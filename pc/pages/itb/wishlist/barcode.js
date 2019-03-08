define('pages/itb/wishlist/barcode.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  api_1.api({
      'getExhibitionDetailByBarCode': 'exhibition/GetExhibitionDetailByBarCode',
      'getBuyerDetailByBarCode': 'buyer/GetBuyerDetailByBarCode'
  });
  var lng = Languages_1.Languages.package;
  var clng = 'en';
  var barcode = utils_1.request['barcode'];
  var type = utils_1.request['type'];
  if (localStorage.getItem('lngPkg') != null || localStorage.getItem('lngPkg') != undefined) {
      var currentlng = localStorage.getItem('lngPkg');
      clng = currentlng.replace(/["""]/g, '');
  }
  var action = '', act = '';
  if (type == "exhibition") {
      action = 'getExhibitionDetailByBarCode';
      act = 'buyer';
  }
  else if (type == "buyer") {
      action = 'getBuyerDetailByBarCode';
      act = 'exhibition';
  }
  template.defaults.imports.act = act;
  api_1.api[action]({ barcode: barcode }, function (data) {
      for (var i = 0; i < data.length; i++) {
          var ppic = filterRegistrationLogoUrl(data[i].company_logo);
          var ppic2 = filterRegistrationLogoUrl(data[i].logourl);
          if (ppic != '' && ppic != undefined && ppic != null) {
              data[i].company_logo = ppic;
          }
          else {
              data[i].company_logo = "";
          }
          if (ppic2 != '' && ppic2 != undefined && ppic2 != null) {
              data[i].logourl = ppic2;
          }
          else {
              data[i].logourl = "";
          }
      }
      document.getElementById('swiper').innerHTML = template('tpl-swiper', { data: data, lng: Languages_1.Languages.package });
  });
  function filterRegistrationLogoUrl(logourl) {
      if (logourl != null && logourl != undefined && $.trim(logourl) != "N/A" && $.trim(logourl) != "未提供") {
          var newurl = logourl.split('/');
          return '/Logo/' + newurl[newurl.length - 1];
      }
      else
          return "";
  }
  //# sourceMappingURL=/itb-dist/pc/pages/itb/wishlist/barcode.js.map?__=1552033897847
  

});
