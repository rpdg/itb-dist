define('pages/logistics/invitation/letterlist.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var Languages_1 = require("ts/util/Languages.ts");
  var lpg = Languages_1.Languages.package;
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  jQuery.datetimepicker.setLocale(Languages_1.Languages.current);
  $('#dateofbirth,#passportvalidity,#starttime,#stoptime').each(function (i, elem) {
      $(elem).datetimepicker({
          timepicker: false,
          //closeOnDateSelect: true,
          format: 'Y-m-d'
      });
  });
  window['getLetterFill'] = function () {
      var param = $('#form').fieldsToJson({
          countryname: {
              require: true,
          },
          username: {
              require: true,
          },
          position: {
              require: true,
          },
          gender: {
              require: true,
          },
          dateofbirth: {
              require: true,
          },
          nationality: {
              require: true,
          },
          passportnumber: {
              require: true,
          },
          passportvalidity: {
              require: true,
          },
          employer: {
              require: true,
          },
          starttime: {
              require: true,
          },
          stoptime: {
              require: true,
          },
      });
      return param;
  };
  //# sourceMappingURL=/itb-dist/pc/pages/logistics/invitation/letterlist.js.map?__=1552033897847
  

});
