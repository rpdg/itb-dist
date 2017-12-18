define('ts/ui/Sp.ts', function(require, exports, module) {

  "use strict";
  var __extends = (this && this.__extends) || (function () {
      var extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });
  var DisplayOject_1 = require("ts/ui/DisplayOject.ts");
  var defaults = {
      text: "default string"
  };
  var Sp = /** @class */ (function (_super) {
      __extends(Sp, _super);
      function Sp(jq, cfg) {
          var _this = this;
          cfg = $.extend({}, defaults, cfg);
          _this = _super.call(this, jq, cfg) || this;
          return _this;
      }
      Sp.prototype.bindData = function (data) {
          this.jq.text(data.text);
          this.data = data;
      };
      return Sp;
  }(DisplayOject_1.AjaxDisplayObject));
  exports.default = Sp;
  //# sourceMappingURL=/itb-dist/pc/ts/ui/Sp.js.map?__=
  

});
