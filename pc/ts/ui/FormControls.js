define('ts/ui/FormControls.ts', function(require, exports, module) {

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
  var DisplayOject_1 = require("ts/ui/DisplayOject.ts");
  var ListBox = /** @class */ (function (_super) {
      __extends(ListBox, _super);
      function ListBox(jq, cfg) {
          var _this = this;
          cfg = $.extend({
              autoPrependBlank: true,
              bindOptions: {
                  //mode: 'append',
                  template: '<option value="${' + (cfg.value || 'id') + '}">${' + (cfg.text || 'name') + '}</option>'
              }
          }, cfg);
          cfg.name = cfg.name || ('opgElem_' + DisplayOject_1.DisplayObject.guid());
          //如果是从空容器创建的，将jq对象指定到select控件上
          if (jq[0].tagName !== 'SELECT') {
              jq = $('<select name="' + cfg.name + '"></select>').appendTo(jq);
          }
          _this = _super.call(this, jq, cfg) || this;
          return _this;
      }
      ListBox.prototype.init = function (jq, cfg) {
          var _this = this;
          _super.prototype.init.call(this, jq, cfg);
          this._initSelectedIndex = cfg.selectedIndex || 0;
          this.elementName = cfg.name;
          this.autoPrependBlank = cfg.autoPrependBlank || false;
          //add event listener
          jq.on("change.opg", function (evt) {
              _this.selectedIndex = evt.target.selectedIndex;
          });
      };
      ListBox.prototype.bindHandler = function (json) {
          if (this.autoPrependBlank) {
              var txt = (typeof this.autoPrependBlank === 'string') ? this.autoPrependBlank : '--';
              this.jq.prepend("<option value=\"\">" + txt + "</option>");
              this._data.unshift({});
          }
          this._items = this.jq.find("option");
          var i = (this._items.length > this._initSelectedIndex) ? this._initSelectedIndex : (this._items.length ? 0 : -1);
          if (typeof this.onBind === 'function')
              this.onBind(json);
          if (i > -1) {
              this.selectedIndex = i;
          }
      };
      Object.defineProperty(ListBox.prototype, "selectedIndex", {
          set: function (i) {
              this._prevIndex = this._selectedIndex;
              //(this.jq[0] as HTMLSelectElement).selectedIndex = i;
              $(this._items).removeAttr('selected').eq(i).attr('selected', 'selected');
              this._selectedIndex = i;
              var evt = { target: this._items[i] };
              this.selectHandler(evt);
          },
          enumerable: true,
          configurable: true
      });
      ListBox.prototype.setValue = function (v) {
          this.jq.recheckElement(v);
      };
      ListBox.prototype.getValue = function () {
          return this.jq.val();
      };
      ListBox.prototype.getText = function () {
          var selectElem = this.jq[0];
          if (selectElem.options.length) {
              return selectElem.options[selectElem.selectedIndex].text;
          }
          return null;
      };
      return ListBox;
  }(DisplayOject_1.AjaxDisplayObject));
  exports.ListBox = ListBox;
  var CheckBox = /** @class */ (function (_super) {
      __extends(CheckBox, _super);
      function CheckBox(jq, cfg) {
          var _this = this;
          if (!cfg.labelClass)
              cfg.labelClass = 'lbAutoWidth';
          if (!cfg.name)
              cfg.name = 'opgElem_' + DisplayOject_1.DisplayObject.guid();
          cfg = $.extend({
              bindOptions: {
                  template: '<label class="' + cfg.labelClass + '"><input name="' + cfg.name
                      + '" type="checkbox" value="${' + (cfg.value || 'id') + '}">${' + (cfg.text || 'name') + '}</label>'
                      + (cfg.joiner === undefined ? ' ' : cfg.joiner)
              }
          }, cfg);
          _this = _super.call(this, jq, cfg) || this;
          return _this;
      }
      CheckBox.prototype.init = function (jq, cfg) {
          var _this = this;
          _super.prototype.init.call(this, jq, cfg);
          this.elementName = cfg.name;
          this._initSelectedIndex = cfg.selectedIndex || [];
          this._prevIndex = [];
          this._selectedIndex = [];
          //add event listener
          jq.on("change.opg", ':checkbox', function (evt) {
              _this.selectHandler(evt);
          });
      };
      CheckBox.prototype.bindHandler = function (json) {
          this._items = this.jq.find("input[name='" + this.elementName + "']:checkbox");
          if (typeof this.onBind === 'function')
              this.onBind(json);
          var iSel = this._initSelectedIndex;
          if (iSel.length) {
              this.selectedIndex = iSel;
          }
      };
      Object.defineProperty(CheckBox.prototype, "selectedIndex", {
          set: function (arr) {
              var chkIdx = [], chkItem = [];
              for (var i = 0, l = arr.length; i < l; i++) {
                  var ix = arr[i];
                  var item = this._items.eq(ix);
                  if (item.length) {
                      chkIdx.push(ix);
                      if (!item.prop('checked')) {
                          chkItem.push(item.prop('checked', true));
                      }
                  }
              }
              if (chkItem.length) {
                  this._prevIndex = this.selectedIndex;
                  this.selectedIndex = chkIdx;
                  var evt = { target: $(chkItem) };
                  this.selectHandler(evt);
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CheckBox.prototype, "selectedItem", {
          get: function () {
              return this._items.filter(':checked');
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(CheckBox.prototype, "selectedData", {
          get: function () {
              var s = this.selectedItem, arr = [], that = this;
              s.each(function (i, opt) {
                  var src = that.data[that._items.index(opt)], tar = {};
                  for (var key in src)
                      if (src.hasOwnProperty(key) && key.indexOf(":") === -1)
                          tar[key] = src[key];
                  arr.push(tar);
              });
              return arr;
          },
          set: function (arr) {
              this._items.each(function (i, elem) {
                  elem.checked = arr.indexOf(elem.value) > -1;
              });
          },
          enumerable: true,
          configurable: true
      });
      CheckBox.prototype.getValue = function () {
          var arr = [];
          var s = this.selectedItem;
          if (s.length) {
              s.each(function (i, o) {
                  arr.push(o.value);
              });
          }
          return arr;
      };
      CheckBox.prototype.getText = function () {
          var arr = [];
          var s = this.selectedItem;
          if (s.length) {
              s.each(function (i, o) {
                  arr.push($(o.parentNode).text());
              });
          }
          return arr;
      };
      return CheckBox;
  }(DisplayOject_1.AjaxDisplayObject));
  exports.CheckBox = CheckBox;
  var RadioBox = /** @class */ (function (_super) {
      __extends(RadioBox, _super);
      function RadioBox(jq, cfg) {
          var _this = this;
          cfg.name = cfg.name || ('opgElem_' + DisplayOject_1.DisplayObject.guid());
          cfg = $.extend({
              bindOptions: {
                  template: '<label class="lbAutoWidth"><input name="' + cfg.name
                      + '" type="radio" value="${' + (cfg.value || 'id') + '}">${' + (cfg.text || 'name') + '}</label>'
                      + (cfg.joiner === undefined ? ' ' : cfg.joiner)
              }
          }, cfg);
          _this = _super.call(this, jq, cfg) || this;
          return _this;
      }
      RadioBox.prototype.init = function (jq, cfg) {
          var _this = this;
          _super.prototype.init.call(this, jq, cfg);
          this.elementName = cfg.name;
          this._initSelectedIndex = ~~cfg.selectedIndex;
          //add event listener
          jq.on("change.opg", function (evt) {
              _this.selectedIndex = _this._items.index(evt.target);
          });
      };
      RadioBox.prototype.bindHandler = function (json) {
          this._items = this.jq.find("input[name='" + this.elementName + "']:radio");
          var i = (this._items.length > this._initSelectedIndex) ? this._initSelectedIndex : (this._items.length ? 0 : -1);
          if (typeof this.onBind === 'function')
              this.onBind(json);
          if (i > -1) {
              this._items.eq(i).prop('checked', true);
              this.selectedIndex = i;
          }
      };
      Object.defineProperty(RadioBox.prototype, "selectedItem", {
          get: function () {
              return this._items.filter(':checked');
          },
          enumerable: true,
          configurable: true
      });
      RadioBox.prototype.getValue = function () {
          return this.selectedItem.val();
      };
      RadioBox.prototype.getText = function () {
          var s = this.selectedItem;
          if (s.length) {
              return s.parent().text();
          }
          return null;
      };
      return RadioBox;
  }(DisplayOject_1.AjaxDisplayObject));
  exports.RadioBox = RadioBox;
  //# sourceMappingURL=/itb-dist/pc/ts/ui/FormControls.js.map?__=1552033897847
  

});
