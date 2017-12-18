define('pages/content/message/send.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      getAllRole: 'role/GetAllRole',
  });
  var lpg = Languages_1.Languages.package;
  window['getMsg'] = function () {
      var param = $('#form').fieldsToJson({
          msgTitle: {
              name: lpg.msgTitle,
              type: 'ns',
              require: true,
          },
          msgContent: {
              name: lpg.msgContent,
              type: 'ns',
              require: true,
          },
      });
      if (param)
          return param;
  };
  //# sourceMappingURL=/itb-dist/pc/pages/content/message/send.js.map?__=
  

});
