define('pages/content/module/SubNode.ts', function(require, exports, module) {

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
  var subNodeTypes;
  (function (subNodeTypes) {
      subNodeTypes[subNodeTypes["pureText"] = 0] = "pureText";
      subNodeTypes[subNodeTypes["picture"] = 1] = "picture";
      subNodeTypes[subNodeTypes["link"] = 2] = "link";
      subNodeTypes[subNodeTypes["richText"] = 3] = "richText";
      subNodeTypes[subNodeTypes["attachment"] = 4] = "attachment";
  })(subNodeTypes || (subNodeTypes = {}));
  var SubNode = /** @class */ (function () {
      function SubNode() {
      }
      SubNode.creator = function (type, content) {
          switch (type) {
              case subNodeTypes.pureText:
                  return new PureTextNode(content);
              case subNodeTypes.picture:
                  return new PictureNode(content);
          }
      };
      return SubNode;
  }());
  exports.SubNode = SubNode;
  var PureTextNode = /** @class */ (function (_super) {
      __extends(PureTextNode, _super);
      function PureTextNode(content) {
          var _this = _super.call(this) || this;
          _this.type = subNodeTypes.pureText;
          if (content)
              _this.content = content;
          return _this;
      }
      Object.defineProperty(PureTextNode.prototype, "content", {
          get: function () {
              return '';
          },
          set: function (content) {
          },
          enumerable: true,
          configurable: true
      });
      PureTextNode.prototype.post = function () {
      };
      return PureTextNode;
  }(SubNode));
  exports.PureTextNode = PureTextNode;
  var PictureNode = /** @class */ (function (_super) {
      __extends(PictureNode, _super);
      function PictureNode(content) {
          var _this = _super.call(this) || this;
          _this.type = subNodeTypes.pureText;
          if (content)
              _this.content = content;
          return _this;
      }
      Object.defineProperty(PictureNode.prototype, "content", {
          get: function () {
              return '';
          },
          set: function (content) {
          },
          enumerable: true,
          configurable: true
      });
      PictureNode.prototype.post = function () {
      };
      return PictureNode;
  }(SubNode));
  exports.PictureNode = PictureNode;
  //# sourceMappingURL=/itb-dist/pc/pages/content/module/SubNode.js.map?__=
  

});
