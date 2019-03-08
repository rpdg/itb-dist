define('pages/itb/dashboard/jumpto.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  api_1.api({
      ExhibitorLogin: 'sync/ExhibitorLogin'
  });
  var type = utils_1.request['type'];
  var lpg = Languages_1.Languages.package;
  var clng = 'en';
  var param = { type: type };
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  api_1.api.ExhibitorLogin(param, function (data) {
      formsubmit_ExhibitorLogin(data);
      setTimeout(function () {
          location.href = "index.html";
      }, 2000);
  });
  function formsubmit_ExhibitorLogin(data) {
      //var url =  "http://itbchina.7-event.com/index/login?lng="+ clng;
      var url = "https://reg.itb-china.com/portal/index/login?lng=" + clng;
      var form = document.createElement("form");
      form.setAttribute('target', '_blank');
      document.body.appendChild(form);
      var h_exLink = document.createElement("input");
      h_exLink.type = 'hidden';
      h_exLink.name = 'exLink';
      h_exLink.value = data;
      form.appendChild(h_exLink);
      form.method = "post";
      form.action = url;
      form.submit();
  }
  //# sourceMappingURL=/itb-dist/pc/pages/itb/dashboard/jumpto.js.map?__=1552033897847
  

});
