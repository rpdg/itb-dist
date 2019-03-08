define('pages/navigation/FloorSelector.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var util_1 = require("js/util.ts");
  var FloorSelector = /** @class */ (function () {
      function FloorSelector(floorArr, buttonId) {
          this.picker = new mui.PopPicker({
              buttons: [util_1.Languages.package.cancel, util_1.Languages.package.ok]
          });
          this.button = document.getElementById(buttonId);
          this.picker.setData(floorArr);
          this.button.innerText = floorArr[0].text;
      }
      return FloorSelector;
  }());
  exports.FloorSelector = FloorSelector;
  //# sourceMappingURL=/itb-dist/wap/pages/navigation/FloorSelector.js.map?__=1552030651276
  

});
