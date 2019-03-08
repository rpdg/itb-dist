define('pages/system/integralMatch/ManualExhibitionSchedule.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var opg_1 = require("ts/opg.ts");
  api_1.api({
      'ManualAddExhbitionSchedule!post': 'schedule/ManualAddExhbitionSchedule'
  });
  var ManualExhibitionSchedule = /** @class */ (function () {
      function ManualExhibitionSchedule(lng) {
          opg_1.default.wrapPanel('#formExhibitionSchedule', {
              title: "",
              btnSearchText: "" + lng.calc,
              btnSearchClick: function () {
                  var param = $('#formExhibitionSchedule').fieldsToJson();
                  if (param.barcode && param.name && param.buyerRange) {
                      api_1.api.ManualAddExhbitionSchedule({
                          barcode: param.barcode,
                          addCount: param.name,
                          buyerRange: param.buyerRange,
                          isRandom: $('#exRandom').prop('checked')
                      }, function () {
                          opg_1.default.ok('ok');
                          $('#formExhibitionSchedule').jsonToFields({
                              barcode: '',
                              name: '',
                              buyerRange: ''
                          });
                      });
                  }
              }
          });
      }
      return ManualExhibitionSchedule;
  }());
  exports.default = ManualExhibitionSchedule;
  //# sourceMappingURL=/itb-dist/pc/pages/system/integralMatch/ManualExhibitionSchedule.js.map?__=1552033897847
  

});
