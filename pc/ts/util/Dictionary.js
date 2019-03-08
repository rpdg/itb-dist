define('ts/util/Dictionary.ts', function(require, exports, module) {

  var Dictionary = /** @class */ (function () {
      function Dictionary(init) {
          this._keys = [];
          this._values = [];
          for (var x = 0; x < init.length; x++) {
              this[init[x].key] = init[x].value;
              this._keys.push(init[x].key);
              this._values.push(init[x].value);
          }
      }
      Dictionary.prototype.add = function (key, value) {
          this[key] = value;
          this._keys.push(key);
          this._values.push(value);
      };
      Dictionary.prototype.remove = function (key) {
          var index = this._keys.indexOf(key, 0);
          this._keys.splice(index, 1);
          this._values.splice(index, 1);
          delete this[key];
      };
      Dictionary.prototype.keys = function () {
          return this._keys;
      };
      Dictionary.prototype.values = function () {
          return this._values;
      };
      Dictionary.prototype.containsKey = function (key) {
          return !(typeof this[key] === "undefined");
      };
      return Dictionary;
  }());
  /*
  let dict: Map<number> = {};
  dict["one"] = 1;
  */
  //# sourceMappingURL=/itb-dist/pc/ts/util/Dictionary.js.map?__=1552033897847
  

});
