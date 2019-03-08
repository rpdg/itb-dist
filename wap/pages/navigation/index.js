define('pages/navigation/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var FMap_1 = require("pages/navigation/FMap.ts");
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({
      'GetMapInitParameters': 'AppRemote/GetMapInitParameters',
      'GetFidByBooth': 'ExhibitionArea/GetFidByBooth',
      'GetFidByCompanyOrBooth': 'ExhibitionArea/GetFidByCompanyOrBooth',
  });
  var booth = util_1.request['booth'];
  var from = util_1.request['from'];
  var fid = '';
  if (booth != null && booth != "") {
      api_1.api.GetFidByBooth({ booth: booth }, function (data2) {
          if (data2.length > 0) {
              fid = data2[0].fid;
          }
      });
  }
  var lng = util_1.Languages.package;
  var clng = 'en';
  if (localStorage.getItem('lngPkg') != null || localStorage.getItem('lngPkg') != undefined) {
      var currentlng = localStorage.getItem('lngPkg');
      clng = currentlng.replace(/["""]/g, '');
  }
  // let map = window['CONFIG']['map'];
  // new FMap(map.id, map.name, map.key, map.server);
  //通过数据库调用
  var param = {};
  setTimeout(function () {
      api_1.api.GetMapInitParameters(param, function (data) {
          if (data.length > 0) {
              for (var i = 0; i < data.length; i++) {
                  if (data[i].value5 == clng) {
                      new FMap_1.default(data[i].value2, data[i].value3, data[i].value4, data[i].value1, fid);
                  }
              }
          }
      });
  }, 1000);
  if (from != null && from != "") {
      if (from == 'exhibitors3.html')
          $('#backurl').attr('href', '../exhibitors/exhibitors3.html' + location.search.substring(0, location.search.indexOf("from") - 1));
      else if (from == 'detailAppoint.html')
          $('#backurl').attr('href', '../meetings/detailAppoint.html' + location.search.substring(0, location.search.indexOf("from") - 1));
  }
  else {
      $('#backurl').attr('href', '../dashboard/index.html');
  }
  document.getElementById('iptSearch').addEventListener('keypress', function (evt) {
      if (evt.keyCode === 13 && this.value) {
          api_1.api.GetFidByCompanyOrBooth({ companyorbooth: this.value }, function (data2) {
              if (data2.length > 0) {
                  location.href = 'index.html?booth=' + data2[0].booth_no;
              }
          });
      }
  }, false);
  $("#iptSearch").attr('placeholder', lng.searchtips);
  //# sourceMappingURL=/itb-dist/wap/pages/navigation/index.js.map?__=1552030651276
  

});
