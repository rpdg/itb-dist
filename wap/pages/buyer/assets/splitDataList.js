define('pages/buyer/assets/splitDataList.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var util_1 = require("js/util.ts");
  var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var list = {};
  function splitDataList(arr) {
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
  }
  exports.default = splitDataList;
  //# sourceMappingURL=/itb-dist/wap/pages/buyer/assets/splitDataList.js.map?__=1552030651276
  

});
