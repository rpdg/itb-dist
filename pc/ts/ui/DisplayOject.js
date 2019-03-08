define('ts/ui/DisplayOject.ts', function(require, exports, module) {

  "use strict";
  var __extends = (this && this.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });
  var blankArray = $({});
  var DisplayObject = /** @class */ (function () {
      function DisplayObject(jq, cfg) {
          this._created = false;
          this.guid = DisplayObject.guid();
          this.jq = jq;
          this.onCreate = cfg.onCreate;
          this.init(jq, cfg);
          this.create(jq, cfg);
      }
      DisplayObject.prototype.init = function (jq, cfg) {
      };
      DisplayObject.prototype.create = function (jq, cfg) {
          return this;
      };
      DisplayObject.prototype.createdHandler = function (data) {
          this._created = true;
          if (this._createdPromise) {
              this._createdPromise.resolve();
          }
          if (this.onCreate)
              this.onCreate(data);
      };
      Object.defineProperty(DisplayObject.prototype, "createdPromise", {
          get: function () {
              if (!this._createdPromise)
                  this._createdPromise = $.Deferred();
              if (this._created)
                  this._createdPromise.resolve();
              return this._createdPromise;
          },
          enumerable: true,
          configurable: true
      });
      DisplayObject.guid = (function () {
          var seed = 0;
          return function () {
              return ++seed;
          };
      })();
      return DisplayObject;
  }());
  exports.DisplayObject = DisplayObject;
  var AjaxDisplayObject = /** @class */ (function (_super) {
      __extends(AjaxDisplayObject, _super);
      function AjaxDisplayObject(jq, cfg) {
          var _this = _super.call(this, jq, cfg) || this;
          _this._lazy = false;
          _this._defBindOpt = {};
          return _this;
      }
      AjaxDisplayObject.prototype.init = function (jq, cfg) {
          this._api = cfg.api;
          this._bindOption = $.extend(this._defBindOpt, cfg.bindOptions);
          this._lazy = !!cfg.lazy;
          this._param = cfg.param;
          this._items = blankArray;
          this._prevIndex = -1;
          this._selectedIndex = -1;
          this._initSelectedIndex = -1;
          this.arrSrc = cfg.arrSrc || 'results';
          this.container = this.jq;
          this.onUpdate = cfg.onUpdate;
          this.onAjaxEnd = cfg.onAjaxEnd;
          this.onSelect = cfg.onSelect;
          this.onBind = cfg.onBind;
      };
      AjaxDisplayObject.prototype.create = function (jq, cfg) {
          if (!this._lazy) {
              if (cfg.data) {
                  this.bindData(cfg.data);
              }
              else if (this._api) {
                  this.ajax(this._param);
              }
          }
          else {
              this.bindData([]);
          }
          return this;
      };
      AjaxDisplayObject.prototype.selectHandler = function (evt) {
          if (typeof this.onSelect === 'function')
              this.onSelect.call(this, evt);
      };
      Object.defineProperty(AjaxDisplayObject.prototype, "selectedIndex", {
          get: function () {
              return this._selectedIndex;
          },
          set: function (i) {
              this._prevIndex = this._selectedIndex;
              this._selectedIndex = i;
              var evt = { target: this._items[i] };
              this.selectHandler(evt);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(AjaxDisplayObject.prototype, "selectedData", {
          get: function () {
              return this._data[this._selectedIndex];
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(AjaxDisplayObject.prototype, "selectedItem", {
          get: function () {
              return this._items[this._selectedIndex];
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(AjaxDisplayObject.prototype, "data", {
          get: function () {
              /*let d = this._data;
              let obj = {};
              for(let key in d){
                  if(key.indexOf(':')===-1)
                      obj[key] = d[key];
              }*/
              return this._data;
          },
          set: function (data) {
              this._data = data;
              if (this._created) {
                  this.updateHandler(data);
              }
              else {
                  this.createdHandler(data);
              }
          },
          enumerable: true,
          configurable: true
      });
      AjaxDisplayObject.prototype.update = function (param) {
          if (this._api) {
              if (this._param)
                  $.extend(this._param, param);
              else
                  this._param = param;
              this.ajax(this._param);
          }
          else {
              var data = param || this._data;
              this.bindData(data);
          }
      };
      AjaxDisplayObject.prototype.updateHandler = function (data) {
          if (this.onUpdate)
              this.onUpdate(data);
      };
      AjaxDisplayObject.prototype.ajax = function (param) {
          var that = this;
          this._api(param, function (json) {
              that._json = json;
              that.ajaxEndHandler(json);
              that.bindData(json);
          });
          return this;
      };
      AjaxDisplayObject.prototype.ajaxEndHandler = function (json) {
          if (this.onAjaxEnd)
              this.onAjaxEnd(json);
      };
      AjaxDisplayObject.prototype.bindData = function (data) {
          //this._json = data;
          var list;
          if ($.isArray(data)) {
              list = data;
          }
          else {
              list = data[this.arrSrc];
          }
          this._bindOption.list = list;
          // 如果有过滤器，则需要
          // 将过滤后的array保存下，待稍后作为 this.data
          if (this._bindOption.itemFilter)
              this._bindOption.storeData = true;
          // bind data
          this.container.bindList(this._bindOption);
          //this.data 是过滤后的数组
          if (this._bindOption.itemFilter) {
              this.data = this.container.data('bound-array');
              this.container.removeData('bound-array');
          }
          else {
              this.data = list;
          }
          this.bindHandler(data);
          return this;
      };
      AjaxDisplayObject.prototype.bindHandler = function (json) {
          if (this.onBind)
              this.onBind(json);
      };
      return AjaxDisplayObject;
  }(DisplayObject));
  exports.AjaxDisplayObject = AjaxDisplayObject;
  //# sourceMappingURL=/itb-dist/pc/ts/ui/DisplayOject.js.map?__=1552033897847
  

});
