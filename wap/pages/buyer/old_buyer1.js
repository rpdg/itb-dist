define('pages/buyer/old_buyer1.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({});
  var lng = util_1.Languages.package;
  var from = util_1.request['from'];
  var clng = 'en';
  if (localStorage.getItem('lngPkg') != null || localStorage.getItem('lngPkg') != undefined) {
      var currentlng = localStorage.getItem('lngPkg');
      clng = currentlng.replace(/["""]/g, '');
  }
  $('#sec').html(template('tpl', { request: util_1.request, lng: util_1.Languages.package }));
  document.getElementById('iptSearch').addEventListener('keypress', function (evt) {
      if (evt.keyCode === 13 && this.value) {
          //location.href = './buyer3.html?by=search' + (request['from']?'&from='+request['from']: '') +  (request['info']?'&info='+request['info']: '') +  '&keyword=' + this.value;
          location.href = './buyer1.html?by=search' + (util_1.request['from'] ? '&from=' + util_1.request['from'] : '') + (util_1.request['info'] ? '&info=' + util_1.request['info'] : '') + '&keyword=' + this.value;
      }
  }, false);
  $("#iptSearch").attr('placeholder', lng.searchtips);
  if (from == "schedule") {
      $('#backurl').attr('href', '../schedule/mine.html');
  }
  else {
      $('#backurl').attr('href', '../dashboard/index.html');
  }
  //# sourceMappingURL=/itb-dist/wap/pages/buyer/old_buyer1.js.map?__=1552030651276
  

});
