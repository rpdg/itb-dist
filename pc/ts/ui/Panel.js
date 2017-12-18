define('ts/ui/Panel.ts', function(require, exports, module) {

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
  var Panel = /** @class */ (function (_super) {
      __extends(Panel, _super);
      function Panel(jq, cfg) {
          var _this = this;
          cfg = $.extend({
              title: '内容检索',
              btnClose: true,
              btnClass: 'btn-primary btn-small',
              btnSearchId: 'btnSearch',
              btnSearchText: '<i class="ico-find"></i> 查询'
          }, cfg);
          _this = _super.call(this, jq, cfg) || this;
          return _this;
      }
      Panel.prototype.init = function (jq, cfg) {
          _super.prototype.init.call(this, jq, cfg);
          this.cfg = cfg;
      };
      Panel.prototype.create = function (jq, cfg) {
          if (jq[0].tagName === 'DIV' && !jq[0].className) {
              this.panel = jq.addClass('panel');
          }
          else {
              this.panel = $('<div class="panel" />');
          }
          this.panel.show();
          this.titleBar = $('<div class="panel-title" />');
          this.titleBar.html(cfg.title);
          this.panel.append(this.titleBar);
          this.body = $('<div class="panel-body" />');
          this.panel.append(this.body);
          this.foot = $('<div class="panel-foot" />');
          this.panel.append(this.foot);
          if (cfg.btnClose) {
              this.btnClose = $('<b class="panel-collapse" />');
              this.titleBar.append(this.btnClose);
              var self_1 = this;
              this.btnClose.on('click', function () {
                  var btn = $(this);
                  if (!btn.hasClass('expanded')) {
                      self_1.body.hide();
                      self_1.foot.hide();
                  }
                  else {
                      self_1.body.show();
                      self_1.foot.show();
                  }
                  btn.toggleClass('expanded');
              });
          }
          if (cfg.btnSearchId) {
              this.btnSearch = $("<button id=\"" + cfg.btnSearchId + "\" class=\"" + cfg.btnClass + "\">" + cfg.btnSearchText + "</button>");
              this.addToFoot(this.btnSearch);
          }
          if (this.btnSearch) {
              if (cfg.btnSearchClick)
                  this.btnSearch.click(cfg.btnSearchClick);
              var that_1 = this;
              that_1.body.on('keypress', 'input', function (e) {
                  if (e.keyCode == 13) {
                      that_1.btnSearch.trigger('click');
                  }
              });
          }
          jq.append(this.panel);
          this.createdHandler();
          return this;
      };
      Panel.prototype.addToBody = function (selector) {
          this.body.append($(selector));
      };
      Panel.prototype.addToFoot = function (selector) {
          this.foot.append($(selector));
      };
      Panel.wrapPanel = function (selector, cfg) {
          var target = $(selector);
          var wrapper = $('<div />');
          target.replaceWith(wrapper);
          var sets = $.extend({
              onCreate: function () {
                  this.addToBody(target);
              }
          }, cfg);
          return new Panel(wrapper, sets);
      };
      return Panel;
  }(DisplayOject_1.DisplayObject));
  exports.default = Panel;
  //# sourceMappingURL=/itb-dist/pc/ts/ui/Panel.js.map?__=
  

});
