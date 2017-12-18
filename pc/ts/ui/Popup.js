define('ts/ui/Popup.ts', function(require, exports, module) {

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
  var utils_1 = require("ts/util/utils.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var DEFAULTS = {
      callback: null,
      title: null,
      btnClose: true,
      btnMax: false,
      drag: true,
      modal: true,
      show: true,
      destroy: true,
      onClose: null,
      onDestroy: null,
      buttons: null
  };
  var BoxyStore = {
      manager: [],
      managerHash: {},
      dragging: null,
      _handleDrag: function (evt) {
          //evt.preventDefault() ;
          var d = BoxyStore.dragging;
          if (d) {
              var w = evt.pageX - d[1];
              var h = evt.pageY - d[2];
              if (w < 1)
                  w = 1;
              else if (w > d[3])
                  w = d[3];
              if (h < 1)
                  h = 1;
              else if (h > d[4])
                  h = d[4];
              d[0].style.cssText += ';left:' + w + 'px;top:' + h + 'px;';
          }
      }
  };
  var nextZ = (function () {
      var zIndex = 1000;
      return function () { return ++zIndex; };
  })();
  var returnFalse = function () { return false; };
  function setTitleBar(cfg) {
      var self = this;
      var tb = this.titleBar = $("<div class=\"dg-title\">" + cfg.title + "</div>");
      this.boxy.append(this.titleBar);
      tb[0].onselectstart = returnFalse;
      var btnSets = $('<div class="dg-title-buttons"></div>').appendTo(tb);
      if (cfg.btnMax) {
          this.btnMax = $("<b class='dg-btn-max'></b>");
          btnSets.append(this.btnMax);
          this.btnMax.on('click', function () {
              self.toggle();
          });
      }
      if (cfg.btnClose) {
          this.btnClose = $("<b class='dg-btn-x'></b>");
          btnSets.append(this.btnClose);
          this.btnClose.on('click', function () {
              self.close();
          });
      }
      if (cfg.drag) {
          setDraggable.call(this, this, cfg);
      }
      $('<div class="row tb-row" />').prependTo(this.boxy).append(tb);
  }
  function setDraggable(self) {
      var tb = self.titleBar;
      tb.on('mousedown', function (evt) {
          self.toTop();
          if (evt.target.tagName === 'B')
              return;
          if (evt.button < 2 && self.state !== "max") {
              tb.on('mousemove.boxy', function (e) {
                  tb.unbind("mousemove.boxy");
                  var boxy = self.boxy[0];
                  document.onselectstart = returnFalse;
                  var size = self.getSize();
                  BoxyStore.dragging = [
                      boxy,
                      e.pageX - boxy.offsetLeft,
                      e.pageY - boxy.offsetTop,
                      document.body.scrollWidth - size.width,
                      document.body.scrollHeight - size.height
                  ];
                  $(document)
                      .bind("mousemove.boxy", BoxyStore._handleDrag)
                      .bind("mouseup.boxy", function () {
                      if (self.state !== "max" && BoxyStore.dragging) {
                          $(document).unbind(".boxy");
                          BoxyStore.dragging = document.onselectstart = null;
                          var pos = self.boxy.position();
                          self.restoreSize.top = pos.top;
                          self.restoreSize.left = pos.left;
                      }
                  });
              });
          }
          tb.on("mouseup.boxy", function () {
              tb.unbind(".boxy");
          });
      });
  }
  function setFooter(cfg) {
      var footer = this.footBar = $('<div class="dg-footer"></div>');
      var htmlArr = [];
      for (var key in cfg.buttons) {
          var v = cfg.buttons[key], x = htmlArr.length;
          var cls = void 0, txt = void 0;
          if (typeof v === 'string') {
              cls = (x === 0 ? 'btn-primary' : '');
              txt = v;
          }
          else {
              cls = v.className || '';
              txt = v.text || '';
              if (typeof v.onClick === 'function') {
                  if (!cfg.callback) {
                      cfg.callback = function () { };
                  }
                  cfg.callback[key] = v.onClick;
              }
          }
          htmlArr.push("<button class=\"" + cls + "\" name=\"" + x + "\" data-key=\"" + key + "\">" + txt + "</button>");
      }
      footer.html(htmlArr.join(' '));
      var self = this;
      footer.on('click', 'button', function (evt) {
          var keepOpen = false;
          if (cfg.callback) {
              var clicked = this;
              var btnKey = $(this).data('key');
              var ifrWin = null;
              if (self.iframe) {
                  ifrWin = self.iframe.contentWindow ? self.iframe.contentWindow : self.iframe.contentDocument.defaultView;
              }
              var i = parseInt(clicked.name, 10);
              if (btnKey && (typeof cfg.callback[btnKey] === 'function')) {
                  keepOpen = cfg.callback[btnKey].call(self, i, ifrWin, clicked);
              }
              else {
                  keepOpen = cfg.callback.call(self, i, ifrWin, clicked);
              }
          }
          if (!keepOpen)
              self.close();
      });
      $('<div class="row tf-row" />').appendTo(this.boxy).append(footer);
  }
  var PopUp = /** @class */ (function (_super) {
      __extends(PopUp, _super);
      function PopUp(jq, cfg) {
          var _this = this;
          cfg = $.extend({}, DEFAULTS, cfg);
          _this = _super.call(this, jq, cfg) || this;
          BoxyStore.manager.push(_this);
          if (cfg.popId) {
              if (cfg.popId in BoxyStore.managerHash)
                  throw new Error("Duplicated PopId \"" + cfg.popId + "\"");
              else
                  BoxyStore.managerHash[cfg.popId] = _this;
          }
          return _this;
      }
      PopUp.prototype.init = function (jq, cfg) {
          _super.prototype.init.call(this, jq, cfg);
          this.cfg = cfg;
      };
      PopUp.prototype.create = function (jq, cfg) {
          this.state = 'normal';
          this.visible = false;
          this.mask = $('<div class="dg-mask"></div>');
          this.boxy = $('<div class="dg-wrapper" id="' + ('dialog_' + DisplayOject_1.DisplayObject.guid()) + '"></div>');
          this.content = $('<div class="dg-content"></div>');
          this.content.append(jq);
          this.boxy.append(this.content).appendTo(document.body);
          var titleBarHeight = 0, footBarHeight = 0;
          if (cfg.title) {
              setTitleBar.call(this, cfg);
              titleBarHeight = this.titleBar.outerHeight();
              this.boxy.find('.tb-row').css({ height: titleBarHeight });
          }
          if (cfg.buttons) {
              setFooter.call(this, cfg);
              this.boxy.find('.tf-row').css({ height: this.footBar.outerHeight() });
              footBarHeight = this.footBar.outerHeight();
          }
          if (this.jq[0].tagName === 'IFRAME')
              this.iframe = this.jq[0];
          var contentSize = {
              width: cfg.width || this.boxy.outerWidth() || 500,
              height: cfg.height || this.boxy.outerHeight() || 300
          };
          /*//console.log(size);
           this.boxy.css(contentSize);*/
          var doc = document.documentElement; //, win = window;
          var viewport = {
              //top: win.pageYOffset,
              //left: win.pageXOffset,
              width: doc.clientWidth,
              height: doc.clientHeight
          };
          //console.log(p);
          var pos = {
              width: cfg.width || this.boxy.outerWidth() || 500,
              height: cfg.height || this.boxy.outerHeight() || 300,
              top: Math.max(0, (viewport.height - contentSize.height) / 2),
              left: Math.max(0, (viewport.width - contentSize.width) / 2)
          };
          this.boxy.css(pos);
          this.restoreSize = pos;
          //console.warn(this.restoreSize);
          this.mask.append(this.boxy.css({ visibility: 'visible' })).appendTo(document.body);
          this.toTop();
          if (navigator.userAgent.indexOf('Firefox') > -1 && this.iframe) {
              jq.css({ height: contentSize.height - titleBarHeight - footBarHeight - 2 });
          }
          if (cfg.show)
              this.open();
          return this;
      };
      PopUp.prototype.getSize = function () {
          return {
              width: this.boxy.outerWidth(),
              height: this.boxy.outerHeight()
          };
      };
      PopUp.prototype.getPosition = function () {
          var b = this.boxy[0];
          return { left: b.offsetLeft, top: b.offsetTop };
      };
      PopUp.prototype.toTop = function () {
          this.mask.css({ zIndex: nextZ() });
          return this;
      };
      PopUp.prototype.open = function () {
          this.boxy.stop(true, true);
          if (this.visible) {
              return this.toTop();
          }
          this.mask.css({ display: "block", opacity: 1 });
          var topPx = this.boxy.position().top;
          //console.warn(this.boxy[0], topPx);
          this.boxy.css({ top: topPx - 20, opacity: 0 }).animate({ opacity: 1, top: topPx }, 200);
          this.visible = true;
          return this;
      };
      PopUp.prototype.close = function (fn) {
          var that = this;
          var css = this.getPosition();
          css.opacity = 0;
          css.top = Math.max(css.top - 40, 0);
          this.mask.animate({ opacity: 0 }, 200);
          this.boxy.stop(true, true).animate(css, 300, function () {
              if (typeof that.cfg.onClose === 'function')
                  that.cfg.onClose.call(that);
              if (typeof fn === 'function')
                  fn.call(that);
              if (that.cfg.destroy)
                  that.destroy.call(that);
              else {
                  that.visible = false;
                  that.boxy.css({ top: css.top + 40 });
                  that.mask.css({ display: 'none' });
              }
          });
          return this;
      };
      PopUp.prototype.max = function () {
          //resize window entity
          this.boxy.stop(true, true).css({
              left: 0,
              top: 0,
              width: '100%',
              height: '100%'
          });
          if (this.btnMax)
              this.btnMax.toggleClass('dg-btn-max dg-btn-restore');
          //$(document.body).addClass('no-scroll');
          this.state = 'max';
          return this;
      };
      PopUp.prototype.restore = function () {
          this.boxy.stop(true, true).css(this.restoreSize);
          if (this.btnMax)
              this.btnMax.toggleClass('dg-btn-max dg-btn-restore');
          //$(document.body).removeClass('no-scroll');
          this.state = 'normal';
          return this;
      };
      PopUp.prototype.destroy = function () {
          if (this.titleBar) {
              this.titleBar.off('mousedown');
              if (this.btnMax)
                  this.btnMax.off('click');
              if (this.btnClose)
                  this.btnClose.off('click');
          }
          if (this.footBar)
              this.footBar.off('click');
          this.mask.remove();
          /*fix the IE 9- 11 bug
          see:  http://stackoverflow.com/questions/8978235/why-can-i-sometimes-not-type-into-my-input-in-ie
          & http://stackoverflow.com/questions/19150008/ie-9-and-ie-10-cannot-enter-text-into-input-text-boxes-from-time-to-time
          */
          if (utils_1.is.UsingIE) {
              var tp_1 = $('<input type="text" style="opacity: 0;" />').appendTo('body').focus();
              setTimeout(function () {
                  tp_1.remove();
                  tp_1 = null;
              }, 20);
          }
          BoxyStore.manager.splice(BoxyStore.manager.indexOf(this), 1);
          if (this.cfg.popId) {
              delete BoxyStore.managerHash[this.cfg.popId];
          }
          if (typeof this.cfg.onDestroy === 'function') {
              this.cfg.onDestroy.call(this);
          }
      };
      PopUp.prototype.toggle = function () {
          if (this.state === 'normal') {
              this.max();
              if (navigator.userAgent.indexOf('Firefox') > -1 && this.iframe) {
                  this.iframe.style.cssText += 'height: ' + (this.boxy.outerHeight() - this.titleBar.outerHeight() - 2 - (this.footBar ? this.footBar.outerHeight() : 0)) + 'px; ';
              }
          }
          else {
              this.restore();
              if (navigator.userAgent.indexOf('Firefox') > -1 && this.iframe) {
                  this.iframe.style.cssText += 'height: ' + (this.restoreSize.height - this.titleBar.outerHeight() - 2 - (this.footBar ? this.footBar.outerHeight() : 0)) + 'px; ';
              }
          }
          return this;
      };
      PopUp.alert = function (message, callback, options) {
          if (options === void 0) { options = {}; }
          var _a = wrapAsk(message, callback, options), html = _a.html, cfg = _a.cfg;
          return new PopUp($(html), cfg);
      };
      PopUp.confirm = function (message, callback, options) {
          if (options === void 0) { options = {}; }
          var _a = wrapAsk(message, callback, options), html = _a.html, cfg = _a.cfg;
          if (!cfg.buttons.cancel) {
              cfg.buttons.cancel = "" + Languages_1.Languages.package.cancel;
          }
          cfg.callback = function (i, ifrWin) {
              if (i === 0)
                  return callback.call(this, i, ifrWin);
              return void (0);
          };
          return new PopUp($(html), cfg);
      };
      PopUp.popTop = function (iframe, options) {
          //noinspection TypeScriptUnresolvedFunction
          return top.opg(iframe).popup(options);
      };
      PopUp.closeLast = function () {
          if (BoxyStore.manager.length > 0) {
              var pop = BoxyStore.manager[BoxyStore.manager.length - 1];
              return pop.close();
          }
          else
              return null;
      };
      PopUp.closeById = function (popId) {
          if (BoxyStore.managerHash[popId]) {
              var pop = BoxyStore.managerHash[popId];
              return pop.close();
          }
          else
              return null;
      };
      return PopUp;
  }(DisplayOject_1.DisplayObject));
  function wrapAsk(msg, cb, cfg) {
      if (typeof cb === 'function')
          cfg.callback = cb;
      if (!cfg.buttons) {
          cfg.buttons = {};
      }
      if (!cfg.buttons.ok) {
          cfg.buttons.ok = "" + Languages_1.Languages.package.ok;
      }
      var html;
      if (typeof msg === 'string' && msg.indexOf('<iframe ') < 0) {
          html = "<div class=\"dg-alert\">" + msg + "</div>";
      }
      else
          html = msg;
      return { html: html, cfg: cfg };
  }
  exports.default = PopUp;
  //# sourceMappingURL=/itb-dist/pc/ts/ui/Popup.js.map?__=
  

});
