define('ts/ui/Combo.ts', function(require, exports, module) {

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
  var ComboManager = {
      zIndex: 999,
      instances: {},
      remove: function (key) {
          delete this.instances[key];
      },
      closeAll: function () {
          for (var key in this.instances) {
              var target = this.instances[key];
              if (target.status === 'opened')
                  target.close();
          }
      },
  };
  var $BODY = $('body');
  function bodyBinder() {
      $BODY.on('mousedown.dropDownHide', function () {
          ComboManager.closeAll();
      });
  }
  var Combo = /** @class */ (function (_super) {
      __extends(Combo, _super);
      function Combo(jq, cfg) {
          var _this = this;
          cfg = $.extend({}, cfg);
          _this = _super.call(this, jq, cfg) || this;
          return _this;
      }
      Combo.prototype.init = function (jq, cfg) {
          this._evtName = 'mousedown.ComboEvent';
          if (jq[0].tagName === 'INPUT')
              jq.addClass('combo-input').val(cfg.text);
          else
              jq.text(cfg.text);
          this.jqValueField = $(cfg.valueField);
          this.target = cfg.target; //drop down
          this.target.addClass('combo-dropDown').on('mousedown', function (evt) {
              evt.stopPropagation();
          });
          //EVENTS
          this.onBeforeOpen = cfg.onBeforeOpen;
          this.onOpen = cfg.onOpen;
          this.onClose = cfg.onClose;
          //ereaser
          if (cfg.allowBlank) {
              Combo.makeClearableInput(this.jq, this.jqValueField);
          }
          ComboManager.instances[this.guid] = this;
          this.enable = true;
      };
      Combo.makeClearableInput = function (ipt, valueIpt) {
          var isIE = $.detectIE();
          if (isIE && (isIE > 10) && !ipt.prop('readonly')) {
              //do nothing
          }
          else {
              var wrapper = ipt.css({
                  float: 'left',
                  margin: 0,
              }).wrap('<span class="sp-eraserWrap"></span>').parents('span:first');
              var eraser_1 = $('<div class="ipt-eraser">&times;</div>')
                  .appendTo(wrapper)
                  .click(function () {
                  if (!ipt.prop('disabled')) {
                      ipt.val('');
                      valueIpt.val('');
                      eraser_1.hide();
                  }
              });
              wrapper.mouseenter(function () {
                  if (!ipt.prop('disabled') && ipt.val()) {
                      eraser_1.show();
                  }
              }).mouseleave(function () {
                  eraser_1.hide();
              });
          }
      };
      Object.defineProperty(Combo.prototype, "enable", {
          set: function (b) {
              if (b) {
                  var that_1 = this, $c_1 = this.target;
                  this.jq.on(this._evtName, function () {
                      //event.stopImmediatePropagation();
                      var go = true;
                      that_1.status === 'closed' && that_1.position();
                      if (typeof that_1.onBeforeOpen === 'function') {
                          go = that_1.onBeforeOpen.apply(that_1);
                          if (go === false)
                              return that_1;
                      }
                      $c_1.stop(true, true).slideToggle(90, function () {
                          if ($c_1.css('display') === 'block')
                              that_1.status = 'opened';
                          else
                              that_1.status = 'closed';
                      });
                      return that_1;
                  });
              }
              else {
                  this.jq.off(this._evtName).prop('disabled', true);
                  this.target.hide();
                  return this;
              }
          },
          enumerable: true,
          configurable: true
      });
      Combo.prototype.position = function () {
          var $t = this.jq, //input
          $c = this.target, //drop down
          offset = $t.offset();
          var top = offset.top + $t.outerHeight(), ch = $c.outerHeight();
          if (top + ch > $(document).outerHeight() && offset.top > ch) {
              top = offset.top - $c.outerHeight();
          }
          $c.css({
              top: top,
              left: offset.left,
              zIndex: ComboManager['zIndex']++,
          });
      };
      Combo.prototype.open = function () {
          if (typeof this.onBeforeOpen === 'function') {
              var go = this.onBeforeOpen();
              if (go === false)
                  return this;
          }
          this.position();
          this.target.stop(true, true).slideDown(90);
          this.status = 'opened';
      };
      Combo.prototype.close = function () {
          this.target.stop(true, true).slideUp(90);
          this.status = 'closed';
      };
      Object.defineProperty(Combo.prototype, "status", {
          get: function () {
              return this._state;
          },
          set: function (s) {
              if (s === 'opened') {
                  this._state = 'opened';
                  bodyBinder();
                  this.target.on('mouseleave.dropDownHide', bodyBinder)
                      .on('mouseenter.dropDownHide', function () {
                      $BODY.off('.dropDownHide');
                  });
                  if (typeof this.onOpen === 'function')
                      this.onOpen.apply(this, arguments);
              }
              else {
                  this._state = 'closed';
                  $BODY.off('.dropDownHide');
                  this.target.off('.dropDownHide');
                  if (typeof this.onClose === 'function')
                      this.onClose.apply(this, arguments);
              }
          },
          enumerable: true,
          configurable: true
      });
      Combo.prototype.setValue = function (txt, val) {
          this.jq.val(txt);
          this.jqValueField.val(val);
      };
      Object.defineProperty(Combo.prototype, "text", {
          get: function () {
              return $.trim(this.jq.val());
          },
          enumerable: true,
          configurable: true
      });
      return Combo;
  }(DisplayOject_1.DisplayObject));
  exports.Combo = Combo;
  //# sourceMappingURL=/itb-dist/pc/ts/ui/Combo.js.map?__=
  

});
