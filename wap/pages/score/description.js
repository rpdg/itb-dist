define('pages/score/description.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({});
  var lng = util_1.Languages.package;
  var clng = 'en';
  if (localStorage.getItem('lngPkg') != null || localStorage.getItem('lngPkg') != undefined) {
      var currentlng = localStorage.getItem('lngPkg');
      clng = currentlng.replace(/["""]/g, '');
  }
  if (clng == "cn") {
      $("#en1").hide();
      $("#cn1").show();
      $("#cn2").show();
      $("#cn3").show();
      $("#cn4").show();
      $("#cn5").show();
      $("#cn6").show();
  }
  else {
      $("#en1").show();
      $("#cn1").hide();
      $("#cn2").hide();
      $("#cn3").hide();
      $("#cn4").hide();
      $("#cn5").hide();
      $("#cn6").hide();
  }
  //# sourceMappingURL=/itb-dist/wap/pages/score/description.js.map?__=1552030651276
  

});
