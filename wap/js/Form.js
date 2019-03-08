define('js/Form.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var Form = /** @class */ (function () {
      function Form(formID) {
          this.formElement = document.getElementById(formID);
      }
      Object.defineProperty(Form.prototype, "data", {
          get: function () {
              return new FormData(this.formElement);
          },
          set: function (data) {
          },
          enumerable: true,
          configurable: true
      });
      Form.prototype.getData = function (rule) {
          var data = this.data;
      };
      return Form;
  }());
  exports.default = Form;
  //# sourceMappingURL=/itb-dist/wap/js/Form.js.map?__=1552030651276
  

});
