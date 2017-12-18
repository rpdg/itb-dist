define('ts/ui/TabView.ts', function(require, exports, module) {

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
  var TabBar = /** @class */ (function (_super) {
      __extends(TabBar, _super);
      function TabBar(jq, cfg) {
          var _this = this;
          cfg = $.extend({
              autoFire: true,
              selectedIndex: 0,
              bindOptions: {
                  template: '<li>${label}</li>'
              }
          }, cfg);
          _this = _super.call(this, jq, cfg) || this;
          return _this;
          //this.create(jq, cfg);
      }
      TabBar.prototype.init = function (jq, cfg) {
          jq.css({ display: 'table' });
          var navi = $('<div class="tabNavigator"></div>');
          this.bar = $('<ul class="tabUL"></ul>');
          $('<div class="tabWrap"></div>').append(this.bar).appendTo(navi);
          this.data = cfg.bindOptions.list = cfg.data;
          //console.log(cfg.bindOptions);
          this.bar.bindList(cfg.bindOptions);
          jq.prepend(navi);
          this.items = this.bar.find("li");
          this._prevIndex = -1;
          this._selectedIndex = -1;
          this._initSelectedIndex = (this.items.length > cfg.selectedIndex) ? cfg.selectedIndex : (this.items.length ? 0 : -1);
          var self = this;
          this.bar.on('click.opg', 'li', function (evt) {
              self.selectHandler.call(self, evt);
          });
          if (typeof cfg.onSelect === 'function')
              this.onSelect = cfg.onSelect;
          this.createdHandler(this.data);
          if (cfg.autoFire && cfg.selectedIndex > -1) {
              self.selectedIndex = (cfg.selectedIndex);
          }
          return this;
      };
      TabBar.prototype.selectHandler = function (evt) {
          evt.stopImmediatePropagation();
          var li = evt.target, i = this.items.index(li);
          if (i === this._selectedIndex && this._prevIndex != -1)
              return;
          $(li).addClass("current").siblings("li.current").removeClass("current");
          this.selectedIndex = i;
          if (typeof this.onSelect === 'function')
              this.onSelect.call(this, evt);
      };
      Object.defineProperty(TabBar.prototype, "selectedIndex", {
          get: function () {
              return this._selectedIndex;
          },
          set: function (i) {
              if (this._selectedIndex != i) {
                  this._prevIndex = this._selectedIndex;
                  this._selectedIndex = i;
                  this.bar.find("li:eq(" + i + ")").trigger('click.opg');
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(TabBar.prototype, "prevIndex", {
          get: function () {
              return this._prevIndex;
          },
          enumerable: true,
          configurable: true
      });
      TabBar.prototype.getSelectedData = function (original) {
          var src = this.data[this.selectedIndex];
          //过滤对象中的绑定时增加的属性
          if (!original) {
              var tar = {}, key = void 0;
              for (key in src)
                  if (key.indexOf(":") === -1)
                      tar[key] = src[key];
              return tar;
          }
          else
              return src;
      };
      return TabBar;
  }(DisplayOject_1.DisplayObject));
  exports.TabBar = TabBar;
  var TabNavigator = /** @class */ (function (_super) {
      __extends(TabNavigator, _super);
      function TabNavigator(jq, cfg) {
          return _super.call(this, jq, cfg) || this;
          //this.create(jq, cfg);
      }
      TabNavigator.prototype.create = function (jq, cfg) {
          var x = cfg.selectedIndex || 0;
          var self = this;
          cfg.selectedIndex = -1;
          this.tabBar = new TabBar(jq, cfg);
          this.iframe = $('<iframe frameborder="0" src="about:blank"></iframe>').appendTo($('<div class="tabStack"></div>').appendTo(jq));
          this.tabBar.onSelect = function () {
              self.iframe.attr('src', self.tabBar.getSelectedData()['url']);
          };
          this.tabBar.selectedIndex = (x);
          this.createdHandler();
      };
      return TabNavigator;
  }(DisplayOject_1.DisplayObject));
  exports.TabNavigator = TabNavigator;
  var TabView = /** @class */ (function (_super) {
      __extends(TabView, _super);
      function TabView(jq, cfg) {
          return _super.call(this, jq, cfg) || this;
      }
      TabView.prototype.create = function (jq, cfg) {
          this.views = [];
          var x = cfg.selectedIndex || 0;
          var self = this;
          cfg.selectedIndex = -1;
          this.tabBar = new TabBar(jq, cfg);
          this.stack = $('<div class="tabStack"></div>').appendTo($('<div style="display: table-row;height: 100%;"></div>').appendTo(jq));
          for (var i = 0, l = cfg.data.length; i < l; i++) {
              var div = cfg.data[i]['view'];
              this.addView($(div));
          }
          this.tabBar.onSelect = function () {
              if (self.views[self.tabBar.prevIndex])
                  self.views[self.tabBar.prevIndex].toggle();
              if (self.views[self.tabBar.selectedIndex])
                  self.views[self.tabBar.selectedIndex].toggle();
          };
          this.tabBar.selectedIndex = (x);
          this.createdHandler();
      };
      TabView.prototype.addView = function (jqDiv) {
          this.views.push(jqDiv);
          this.stack.append(jqDiv.addClass('tabDivision'));
      };
      return TabView;
  }(DisplayOject_1.DisplayObject));
  exports.TabView = TabView;
  //# sourceMappingURL=/itb-dist/pc/ts/ui/TabView.js.map?__=
  

});
