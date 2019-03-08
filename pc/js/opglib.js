;/*!ts/util/store.ts*/
define('ts/util/store.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var storage = window.localStorage;
  var deserialize = function (value) {
      if (typeof value != 'string') {
          return undefined;
      }
      try {
          return JSON.parse(value);
      }
      catch (e) {
          return value || undefined;
      }
  };
  var store = {
      use: function (storageType) {
          storage = window[storageType];
          return store;
      },
      get: function (key, defaultVal) {
          var val = deserialize(storage.getItem(key));
          return (val === undefined ? defaultVal : val);
      },
      set: function (key, val) {
          if (val === undefined) {
              return store.remove(key);
          }
          storage.setItem(key, JSON.stringify(val));
          return val;
      },
      remove: function (key) {
          storage.removeItem(key);
      },
      clear: function () {
          storage.clear();
      },
      each: function (callback) {
          for (var i = 0, l = storage.length; i < l; i++) {
              var key = storage.key(i);
              callback(key, store.get(key));
          }
      }
  };
  exports.store = store;
  var LocalStore = /** @class */ (function () {
      function LocalStore(inSession) {
          if (inSession === void 0) { inSession = true; }
          this.storage = window[inSession ? 'sessionStorage' : 'localStorage'];
      }
      LocalStore.prototype.get = function (key, defaultVal) {
          var val = deserialize(this.storage.getItem(key));
          return (val === undefined ? defaultVal : val);
      };
      LocalStore.prototype.set = function (key, val) {
          if (val === undefined) {
              return this.remove(key);
          }
          this.storage.setItem(key, JSON.stringify(val));
          return val;
      };
      LocalStore.prototype.remove = function (key) {
          this.storage.removeItem(key);
      };
      return LocalStore;
  }());
  exports.LocalStore = LocalStore;
  var Cache = /** @class */ (function () {
      function Cache() {
          if (!top.window['__Cache'])
              top.window['__Cache'] = {};
          this.cache = top.window['__Cache'];
      }
      Cache.getInstance = function () {
          if (!Cache.instance)
              Cache.instance = new Cache();
          return Cache.instance;
      };
      Cache.empty = function () {
          if (top.window['__Cache'])
              top.window['__Cache'] = null;
      };
      Cache.prototype.get = function (key, defaultVal) {
          var val = this.cache[key];
          return (val === undefined ? defaultVal : val);
      };
      Cache.prototype.set = function (key, val) {
          if (val === undefined) {
              return this.remove(key);
          }
          this.cache[key] = val;
      };
      Cache.prototype.remove = function (key) {
          delete this.cache[key];
      };
      return Cache;
  }());
  exports.Cache = Cache;
    

});

;/*!ts/app.cfg.ts*/
define('ts/app.cfg.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var store_1 = require("ts/util/store.ts");
  var cfg = {
      apiServer: (window.CONFIG && window.CONFIG.apiServer) ? window.CONFIG.apiServer : (store_1.store.get('apiServer') || null),
      ajaxTimeOut: 1800000,
      loginPage: (window.CONFIG && window.CONFIG.loginPage) ? window.CONFIG.loginPage : (store_1.store.get('loginPage') || '../login/index.html'),
      version: '1.0.3_20180411',
  };
  cfg.onUnauthorizedError = function () {
      var param = '', url = cfg.loginPage;
      if (top.window.location.hash) {
          param = '?ReturnUrl=' + encodeURIComponent(top.window.location.hash);
          url += param;
      }
      top.window.location.href = url;
  };
  var globalErrorCodes = {
      'exception': '服务器内部错误',
      'delete_failure': '删除失败',
      'add_failure': '新增失败',
      'update_failure': '更新失败',
      'query_failure': '查询失败',
      'max_length': '输入超出最大长度',
      'token_exception': 'token验证失败',
  };
  cfg.onServerError = function (code, errorMsg, callback) {
      if (errorMsg === void 0) { errorMsg = 'unknown error'; }
      if (code === 401 && location.pathname != cfg.loginPage) {
          cfg.onUnauthorizedError();
      }
      else {
          //top.opg.err(`api.${this.name} error ${code} (${errorMsg})`);
          top.opg.err("api." + this.name + " error (" + errorMsg + ")");
      }
  };
  exports.default = cfg;
    

});

;/*!ts/ui/DisplayOject.ts*/
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
    

});

;/*!ts/ui/FormControls.ts*/
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
    

});

;/*!ts/util/utils.ts*/
define('ts/util/utils.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  function hasOwnProperty(obj, prop) {
      return !!obj && obj.hasOwnProperty(prop);
  }
  function setParamsObject(obj, param, value, castBoolean) {
      var reg = /^(.+?)(\[.*\])$/, paramIsArray, match, allKeys, key, k;
      if (match = param.match(reg)) {
          key = match[1];
          allKeys = match[2].replace(/^\[|\]$/g, '').split('][');
          for (var i = 0; k = allKeys[i]; i++) {
              paramIsArray = !k || k.match(/^\d+$/);
              if (!key && is.Array(obj))
                  key = obj.length;
              if (!hasOwnProperty(obj, key)) {
                  obj[key] = paramIsArray ? [] : {};
              }
              obj = obj[key];
              key = k;
          }
          if (!key && paramIsArray)
              key = obj.length.toString();
          setParamsObject(obj, key, value, castBoolean);
      }
      else if (castBoolean && value === 'true') {
          obj[param] = true;
      }
      else if (castBoolean && value === 'false') {
          obj[param] = false;
      }
      else if (castBoolean && is.Number(value)) {
          obj[param] = parseFloat(value);
      }
      else {
          obj[param] = value;
      }
  }
  var request = (function (str, castBoolean) {
      var result = {}, split;
      str = (str && str.toString) ? str.toString() : '';
      var arr = str.replace(/^.*?\?/, '').split('&'), p;
      for (var i = 0; p = arr[i]; i++) {
          split = p.split('=');
          if (split.length !== 2)
              continue;
          setParamsObject(result, split[0], decodeURIComponent(split[1]), castBoolean);
      }
      return result;
  })(window.location.search, false);
  exports.request = request;
  var is = {
      Array: $.noop,
      RegExp: $.noop,
      Date: $.noop,
      Number: $.noop,
      String: $.noop,
      Object: $.noop,
      HTMLDocument: $.noop,
      UsingIE: $.detectIE(),
  };
  exports.is = is;
  var isTypes = ['Array', 'RegExp', 'Date', 'Number', 'String', 'Object', 'HTMLDocument'];
  for (var i = 0, c = void 0; c = isTypes[i++];) {
      is[c] = (function (type) {
          return function (obj) {
              return Object.prototype.toString.call(obj) == '[object ' + type + ']';
          };
      })(c);
  }
  function objectToQueryString(base, obj) {
      var tmp;
      // If a custom toString exists bail here and use that instead
      if (is.Array(obj) || is.Object(obj)) {
          tmp = [];
          iterateOverObject(obj, function (key, value) {
              if (base)
                  key = base + '[' + key + ']';
              tmp.push(objectToQueryString(key, value));
          });
          return tmp.join('&');
      }
      else {
          if (!base)
              return '';
          return sanitizeURIComponent(base) + '=' + (is.Date(obj) ? obj.getTime() : sanitizeURIComponent(obj));
      }
  }
  function sanitizeURIComponent(obj) {
      // undefined, null, and NaN are represented as a blank string,
      // while false and 0 are stringified. "+" is allowed in query string
      return !obj && obj !== false && obj !== 0 ? '' : encodeURIComponent(obj).replace(/%20/g, '+').replace(/%5B/g, '[').replace(/%5D/g, ']');
  }
  function iterateOverObject(obj, fn) {
      var key;
      for (key in obj) {
          if (!hasOwnProperty(obj, key))
              continue;
          if (fn.call(obj, key, obj[key], obj) === false)
              break;
      }
  }
  var url = {
      addSearch: function (url) {
          var params = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              params[_i - 1] = arguments[_i];
          }
          for (var i = 1, len = arguments.length; i < len; i++) {
              var p = arguments[i];
              if (p !== undefined && p !== null) {
                  if (p.indexOf('?') === 0 || p.indexOf('&') === 0)
                      p = p.substr(1);
                  var prefix = i > 1 ? '&' : (url.indexOf('?') > -1 ? '&' : '?');
                  url += (prefix + p);
              }
          }
          return url;
      },
      //opg.url.setParam('http://127.0.0.1:8080/page/home/' , {name:'Bob'}, 'user' );
      //opg.url.setParam('http://127.0.0.1:8080/page/home/' , {name:'Bob'} );
      setParam: function (urlString, obj, namespace) {
          return url.addSearch(urlString, objectToQueryString(namespace, obj));
      },
      getParam: function (url, name) {
          name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
          var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'), results = regex.exec(url.substr(url.indexOf('?')));
          return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
      },
  };
  exports.url = url;
  var string = {
      _str_pad_repeater: function (s, len) {
          var collect = '';
          while (collect.length < len) {
              collect += s;
          }
          collect = collect.substr(0, len);
          return collect;
      },
      pad: function (input, result_full_length, pad_string, pad_type) {
          //   example 1: str.pad('Kevin van Zonneveld', 30, '-=', 'STR_PAD_LEFT');
          //   returns 1: '-=-=-=-=-=-Kevin van Zonneveld'
          //   example 2: str.pad('Kevin van Zonneveld', 30, '-', 'STR_PAD_BOTH');
          //   returns 2: '------Kevin van Zonneveld-----'
          if (pad_string === void 0) { pad_string = '0'; }
          if (pad_type === void 0) { pad_type = 'STR_PAD_RIGHT'; }
          var half = '', pad_to_go;
          input += '';
          pad_string = pad_string !== undefined ? pad_string : ' ';
          if (pad_type !== 'STR_PAD_LEFT' && pad_type !== 'STR_PAD_RIGHT' && pad_type !== 'STR_PAD_BOTH') {
              pad_type = 'STR_PAD_RIGHT';
          }
          if ((pad_to_go = result_full_length - input.length) > 0) {
              if (pad_type === 'STR_PAD_LEFT') {
                  input = string._str_pad_repeater(pad_string, pad_to_go) + input;
              }
              else if (pad_type === 'STR_PAD_RIGHT') {
                  input = input + string._str_pad_repeater(pad_string, pad_to_go);
              }
              else if (pad_type === 'STR_PAD_BOTH') {
                  half = string._str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
                  input = half + input + half;
                  input = input.substr(0, result_full_length);
              }
          }
          return input;
      },
      padLeft: function (oStr, result_full_length, pad_string) {
          if (pad_string === void 0) { pad_string = '0'; }
          return string.pad(oStr, result_full_length, pad_string, 'STR_PAD_LEFT');
      },
      padRight: function (oStr, result_full_length, pad_string) {
          if (pad_string === void 0) { pad_string = '0'; }
          return string.pad(oStr, result_full_length, pad_string || 0, 'STR_PAD_RIGHT');
      },
  };
  exports.string = string;
  var dateTime = {
      addSeconds: function (d, s) {
          return new Date(d.getTime() + s * 1000);
      },
      addDays: function (d, s) {
          return new Date(d.getTime() + s * 24 * 3600 * 1000);
      },
      daySpan: function (dateFrom, dateTo) {
          return Math.round((dateTo.valueOf() - dateFrom.valueOf()) / 86400000);
      },
      weekSpan: function (dateFrom, dateTo) {
          var d = dateTime.daySpan(dateFrom, dateTo);
          return Math.ceil((d + dateFrom.getDay()) / 7);
      },
  };
  exports.dateTime = dateTime;
  var convert = {
      hashKeysToArray: function (obj) {
          if (Object.keys) {
              return Object.keys(obj);
          }
          else {
              var arr = [];
              for (arr[arr.length] in obj)
                  ;
              return arr;
          }
      },
      hashToArray: function (obj, converter) {
          var arr = [];
          for (var key in obj) {
              var val = obj[key];
              if (converter)
                  val = converter(val, key);
              arr.push(val);
          }
          return arr;
      },
      arrayToHash: function (arr, key) {
          var obj = {}, i = 0, l = arr.length;
          for (; i < l; i++) {
              var item = arr[i];
              if (!(item[key] in obj)) {
                  obj[item[key]] = item;
              }
          }
          return obj;
      },
      stringToDate: function (str, format) {
          if (format === void 0) { format = 'yyyy-MM-dd HH:mm:ss'; }
          //let format = formater || 'yyyy-MM-dd HH:mm:ss'; // default format
          var parts = str.match(/(\d+)/g), i = 0, fmt = {};
          // extract date-part indexes from the format
          format.replace(/(yyyy|dd|MM|HH|hh|mm|ss)/g, function (part) {
              fmt[part] = i++;
          });
          //
          if (!fmt['HH'] && fmt['hh'])
              fmt['HH'] = fmt['hh'];
          return new Date(parts[fmt['yyyy']] || 0, (parts[fmt['MM']] || 1) - 1, parts[fmt['dd']] || 0, parts[fmt['HH']] || 0, parts[fmt['mm']] || 0, parts[fmt['ss']] || 0);
      },
      jsonToDate: function (isoString) {
          return new Date(Date.parse(isoString));
      },
      /**
       * Convert seconds to hh:mm:ss format.
       * @param {number} totalSeconds - the total seconds to convert to hh- mm-ss
       **/
      secondsToTimecode: function (totalSeconds) {
          var hours = Math.floor(totalSeconds / 3600);
          var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
          var seconds = totalSeconds - (hours * 3600) - (minutes * 60);
          // round seconds
          seconds = Math.round(seconds * 100) / 100;
          var result = (hours < 10 ? '0' + hours : hours);
          result += ':' + (minutes < 10 ? '0' + minutes : minutes);
          result += ':' + (seconds < 10 ? '0' + seconds : seconds);
          return result;
      },
  };
  exports.convert = convert;
  var format = {
      date: function (date, format) {
          if (format === void 0) { format = 'yyyy-MM-dd'; }
          var o = {
              'M+': date.getMonth() + 1,
              'd+': date.getDate(),
              'h+': (date.getHours() > 12 ? date.getHours() - 12 : date.getHours()),
              'H+': date.getHours(),
              'm+': date.getMinutes(),
              's+': date.getSeconds(),
              'q+': Math.floor((date.getMonth() + 3) / 3),
              'S': date.getMilliseconds() //millisecond
          };
          if (/(y+)/.test(format))
              format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
          for (var k in o)
              if (new RegExp('(' + k + ')').test(format))
                  format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
          return format;
      },
      toFixed: function (input) {
          var n = Math.round(+input * 100);
          return format.toNFixed(n * .01);
      },
      toNFixed: function (input) {
          var s = (+input).toString(), i = s.indexOf('.');
          if (i < 0)
              return s + '.00';
          s += '00';
          return s.substr(0, i + 3);
      },
      number: function (number, decimals, dec_point, thousands_sep) {
          //   example 1: number_format(1234.56);
          //   returns 1: '1,235'
          //   example 2: number_format(1234.56, 2, ',', ' ');
          //   returns 2: '1 234,56'
          //   example 3: number_format(1234.5678, 2, '.', '');
          //   returns 3: '1234.57'
          //   example 4: number_format(67, 2, ',', '.');
          //   returns 4: '67,00'
          //   example 5: number_format(1000);
          //   returns 5: '1,000'
          //   example 6: number_format(67.311, 2);
          //   returns 6: '67.31'
          //   example 7: number_format(1000.55, 1);
          //   returns 7: '1,000.6'
          //   example 8: number_format(67000, 5, ',', '.');
          //   returns 8: '67.000,00000'
          //   example 9: number_format(0.9, 0);
          //   returns 9: '1'
          //  example 10: number_format('1.20', 2);
          //  returns 10: '1.20'
          //  example 11: number_format('1.20', 4);
          //  returns 11: '1.2000'
          //  example 12: number_format('1.2000', 3);
          //  returns 12: '1.200'
          //  example 13: number_format('1 000,50', 2, '.', ' ');
          //  returns 13: '100 050.00'
          //  example 14: number_format(1e-8, 8, '.', '');
          //  returns 14: '0.00000001'
          number = (number + '')
              .replace(/[^0-9+\-Ee.]/g, '');
          var n = !isFinite(+number) ? 0 : +number, prec = !isFinite(+decimals) ? 0 : Math.abs(decimals), sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep, dec = (typeof dec_point === 'undefined') ? '.' : dec_point, s = '', toFixedFix = function (n, prec) {
              var k = Math.pow(10, prec);
              return '' + (Math.round(n * k) / k)
                  .toFixed(prec);
          };
          // Fix forar IE parseFloat(0.55).toFixed(0) = 0;
          var s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
              .split('.');
          if (s[0].length > 3) {
              s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
          }
          if ((s[1] || '')
              .length < prec) {
              s[1] = s[1] || '';
              s[1] += new Array(prec - s[1].length + 1)
                  .join('0');
          }
          return s.join(dec);
      },
      fileSize: function (filesize) {
          if (filesize >= 1073741824) {
              filesize = format.number(filesize / 1073741824, 2, '.', ',') + ' GB';
          }
          else if (filesize >= 1048576) {
              filesize = format.number(filesize / 1048576, 2, '.', '') + ' MB';
          }
          else if (filesize >= 1024) {
              filesize = format.number(filesize / 1024, 0) + ' KB';
          }
          else {
              //filesize = '< 1KB';
              filesize = format.number(filesize, 0) + ' bytes';
          }
          return filesize;
      },
      json: (function () {
          var pattern = /\${(\w+[.]*\w*)\}(?!})/g;
          return function (template, json) {
              return template.replace(pattern, function (match, key, value) {
                  return json[key];
              });
          };
      })(),
      timeLength: function (seconds) {
          if (seconds === void 0) { seconds = 0; }
          return string.padLeft(Math.floor(seconds / 3600), 2) + ':' + string.padLeft(Math.floor((seconds % 3600) / 60), 2) + ':' + string.padLeft(Math.floor(seconds % 60), 2);
      },
  };
  exports.format = format;
  var cleanValueObject = function (vo) {
      for (var key in vo)
          if (key.indexOf(':') > -1)
              delete vo[key];
      return vo;
  };
  exports.cleanValueObject = cleanValueObject;
  var array = {
      swap: function (arr, srcIndex, tarIndex) {
          arr[srcIndex] = arr.splice(tarIndex, 1, arr[srcIndex])[0];
          return arr;
      },
      unique: function (arr) {
          var tmpArr = [], hash = {};
          for (var i = 0, l = arr.length; i < l; i++) {
              if (!hash[arr[i]]) {
                  hash[arr[i]] = true;
                  tmpArr.push(arr[i]);
              }
          }
          return tmpArr;
      },
      combine: function () {
          var needles = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              needles[_i] = arguments[_i];
          }
          var arr = [];
          for (var i = 0, l = needles.length; i < l; i++) {
              var a = needles[i], len = a.length;
              for (var k = 0; k < len; k = k + 5000) {
                  arr.push.apply(arr, a.slice(k, k + 5000));
              }
          }
          return arr;
      },
      sort: function (arr, propName, sortCompareFunction) {
          if (sortCompareFunction && typeof sortCompareFunction === 'function')
              return arr.sort(sortCompareFunction);
          else {
              var dup = Array.prototype.slice.call(arr, 0);
              //let dup = arr.slice(0);
              if (!arguments.length)
                  return dup.sort();
              //let args = Array.prototype.slice.call(arguments);
              return dup.sort(function (a, b) {
                  var A = a[propName], nA = isNaN(A), B = b[propName], nB = isNaN(B);
                  //两者皆非number
                  if (nA && nB) {
                      if (A === '')
                          return -1;
                      if (B === '')
                          return 1;
                      return (A === B ? 0 : A > B ? 1 : -1);
                  }
                  //a[prop] 非 number, b[prop] 是 number
                  else if (nA)
                      return -1;
                  //a[prop] 是 number, b[prop] 非 number
                  else if (nB)
                      return 1;
                  //a[prop], b[prop]  均是 number
                  return A === B ? 0 : A > B ? 1 : -1;
              });
          }
      },
  };
  exports.array = array;
    

});

;/*!ts/util/Languages.ts*/
define('ts/util/Languages.ts', function(require, exports, module) {

  "use strict";
  /// <reference path="../../@types/jquery.d.ts" />
  Object.defineProperty(exports, "__esModule", { value: true });
  var store_1 = require("ts/util/store.ts");
  var LanguageNames = {
      cn: 'cn',
      en: 'en'
  };
  var LanguagePKey = 'lngPkg';
  var defaultLanguagePackage = {
      en: {
          yes: 'yes',
          no: 'no',
          search: 'search ',
          list: 'list',
          add: 'add ',
          edit: 'edit ',
          del: 'delete ',
          save: 'save ',
          cancel: 'cancel',
          ok: 'OK',
          process: 'process',
          set: 'set',
          prevPage: 'prev ',
          nextPage: 'next ',
          please: 'please ',
          confirm: 'confirm',
          title: 'title'
      },
      cn: {
          yes: '是',
          no: '否',
          search: '查询',
          list: '列表',
          add: '新增',
          edit: '编辑',
          del: '删除',
          save: '保存',
          cancel: '取消',
          ok: '确定',
          process: '操作',
          set: '设置',
          prevPage: '上页',
          nextPage: '下页',
          please: '请',
          confirm: '确认',
          title: '标题'
      }
  };
  var Languages = {
      configKeyName: LanguagePKey,
      current: store_1.store.get(LanguagePKey) || LanguageNames.en,
      init: function (packageSet, callback) {
          if (!packageSet[Languages.current]) {
              Languages.current = LanguageNames.en;
          }
          Languages.package = $.extend({}, defaultLanguagePackage[Languages.current], packageSet[Languages.current]);
          if (!Languages.package) {
              throw new Error("no such language package: [" + Languages.current + "]");
          }
          Languages.package['$current'] = Languages.current;
          if (typeof callback === 'function')
              callback(Languages.package);
      },
      names: LanguageNames,
      package: null
  };
  exports.Languages = Languages;
    

});

;/*!ts/util/api.ts*/
define('ts/util/api.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var app_cfg_1 = require("ts/app.cfg.ts");
  var store_1 = require("ts/util/store.ts");
  var utils_1 = require("ts/util/utils.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  //noinspection TypeScriptUnresolvedVariable
  //cfg.apiServer = window.apiServer ;
  if (!app_cfg_1.default.apiServer) {
      app_cfg_1.default.onUnauthorizedError();
  }
  var onServerError = app_cfg_1.default.onServerError || function (code, errorMsg, callback) {
      alert(code + 'error: ' + errorMsg);
  };
  var loading = {
      dom: $('#opgAjaxLoading'),
      handlers: 0,
      timer: 0,
      show: function () {
          loading.dom.stop(true, true).fadeIn();
      },
      hide: function () {
          if (!loading.handlers)
              loading.dom.stop(true, true).fadeOut();
      },
  };
  var xToken = (function () {
      var token = store_1.store.get('Authorization');
      if (token) {
          return {
              Authorization: 'Bearer ' + token,
              lng: Languages_1.Languages.current,
          };
      }
      else {
          if (window.location.pathname != app_cfg_1.default.loginPage) {
              app_cfg_1.default.onUnauthorizedError();
          }
          return {
              lng: Languages_1.Languages.current,
          };
      }
  })();
  var defaultErrorMsg = { message: 'Server echoes without meta data' };
  var ServerFn = /** @class */ (function () {
      function ServerFn(url, name, method, restful) {
          if (method === void 0) { method = 'GET'; }
          if (restful === void 0) { restful = true; }
          this.name = name;
          this.method = method;
          this.restful = restful;
          this.timeOut = app_cfg_1.default.ajaxTimeOut;
          if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0)
              this.url = url;
          else
              this.url = app_cfg_1.default.apiServer + url.replace(/^\//, '');
          this.unlimited = false;
          this.accessible = true;
      }
      ServerFn.prototype.handleError = function (code, error, callback) {
          if (typeof this.onError === 'function')
              return this.onError.call(this, code, error, callback);
          else
              return onServerError.call(this, code, error, callback);
      };
      ServerFn.prototype.invoke = function (data, callback) {
          var that = this;
          if (this.accessible || this.unlimited) {
              this.accessible = false;
              //return $[this.method].apply(this, makeParam.call(this, data, callback, type || 'json'));
              if ($.isFunction(data)) {
                  callback = data;
                  data = null;
              }
              var url = this.url, method = this.method;
              var contentType = 'application/json';
              var processData = true;
              if (method === 'UPLOAD') {
                  contentType = false;
                  processData = false;
                  method = 'POST';
              }
              else {
                  if (data) {
                      if (!this.restful && this.method != 'GET') {
                          data = JSON.stringify(data);
                      }
                      else if (this.restful) {
                          url = utils_1.format.json(url, data);
                          data = null;
                      }
                  }
              }
              return $.ajax({
                  headers: xToken,
                  contentType: contentType,
                  processData: processData,
                  dataType: 'json',
                  url: url,
                  data: data,
                  method: method,
                  cache: false,
                  timeout: that.timeOut,
                  beforeSend: function (jqXHR, settings) {
                      loading.handlers++;
                      if (loading.timer)
                          clearTimeout(loading.timer);
                      loading.timer = 0;
                      loading.show();
                  },
                  complete: function () {
                      loading.handlers--;
                      loading.timer = setTimeout(loading.hide, 1000);
                      that.accessible = true;
                      that = null;
                      return data;
                  },
                  error: function (jqXHR, textStatus, errorThrown) {
                      var code = jqXHR.status;
                      if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
                          that.handleError.call(that, code, jqXHR.responseJSON.error, callback);
                      }
                      else {
                          if (!errorThrown)
                              errorThrown = 'server connection lost';
                          that.handleError.call(that, code, errorThrown, callback);
                      }
                  },
                  success: function (json, textStatus, jqXHR) {
                      var error = json.error;
                      if (error) {
                          that.handleError.call(that, 200, error, callback);
                      }
                      else {
                          if (callback && typeof callback === 'function')
                              callback.call(that, json.data === undefined ? {} : json.data, textStatus, jqXHR);
                      }
                  },
              });
          }
          else {
              throw new Error('Server function [' + this.name + '] unusable now.');
          }
      };
      return ServerFn;
  }());
  var api = function (apiSet) {
      for (var key in apiSet) {
          var uArr = key.split('!');
          var pName = uArr[0];
          var pMethod = uArr[1] ? uArr[1].toString().toUpperCase() : 'GET';
          var restful = (!(uArr[2] === undefined)) || (apiSet[key].indexOf('${') > -1);
          if (!api[pName]) {
              api[pName] = (function (srvFn) {
                  var fn = function (data, callback) {
                      return srvFn.invoke.call(srvFn, data, callback);
                  };
                  fn.set = function (k, v) {
                      srvFn[k] = v;
                      return fn;
                  };
                  fn.get = function (k) { return srvFn[k]; };
                  fn.toString = function () { return srvFn.url; };
                  /*fn.post = (data , cb)=>{
                   fn.set('method' , 'POST') ;
                   return fn(data , cb);
                   };*/
                  return fn;
              })(new ServerFn(apiSet[key], pName, pMethod, restful));
          }
          else {
              //throw new Error('api [' + pName + '] duplicate definition');
              console.error("api [" + pName + "] duplicate definition");
          }
      }
      return api;
  };
  exports.api = api;
    

});

;/*!ts/ui/Table.ts*/
define('ts/ui/Table.ts', function(require, exports, module) {

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
  var Languages_1 = require("ts/util/Languages.ts");
  var jsonFormat = (function () {
      var pattern = /\${(\w+[.]*\w*)\}(?!})/g;
      return function (template, json) {
          return template.replace(pattern, function (match, key, value) {
              return json[key];
          });
      };
  })();
  function makeTemplate(sets) {
      var tdTmp = [], render, name, i = 0, l = sets.columns ? sets.columns.length : 0;
      for (var col = void 0; i < l, col = sets.columns[i]; i++) {
          if (typeof col.render === 'function') {
              name = col.src + '_render' + DisplayOject_1.DisplayObject.guid();
              render = ':=' + name;
              sets.bindOptions.itemRender[name] = col.render;
          }
          else
              render = '';
          if (col.cmd) {
              if (col.cmd === 'checkAll') {
                  tdTmp[i] = '<td class="text-center"><input type="checkbox" name="chk_' + i + '" value="${' + col.src + render + '}"></td>';
              }
              else {
                  tdTmp[i] = '<td class="text-center"><input type="radio" name="chk_' + i + '" value="${' + col.src + render + '}"></td>';
              }
              if (!this.cmd) {
                  this.cmd = col.cmd;
                  this.cmdColumnIndex = i;
              }
          }
          else {
              var classAlign = "text-" + (col.align ? col.align.toLowerCase() : "center");
              tdTmp[i] = '<td class="' + classAlign + '">${' + col.src + render + '}</td>';
          }
      }
      //console.log('<tr>' + tdTmp.join('') + '</tr>');
      var trSrc;
      if (sets.rows && sets.rows.render) {
          trSrc = sets.rows.src || '___';
          sets.bindOptions.itemRender['__renderTr'] = function (val, i, row, attr) {
              var cn = sets.rows.render(val, i, row, attr) || '';
              var sn = (i % 2 ? 'odd' : 'even');
              return sn + ' ' + cn;
          };
      }
      else {
          trSrc = '___';
          sets.bindOptions.itemRender['__renderTr'] = function (val, i) { return (i % 2 ? 'odd' : 'even'); };
      }
      return '<tr class="${' + trSrc + ':=__renderTr}">' + tdTmp.join('') + '</tr>';
  }
  function makeTbStructor(tb, sets) {
      var i = 0, l = sets.columns ? sets.columns.length : 0, colCss = [], th = [];
      for (var col = void 0; col = sets.columns[i]; i++) {
          if (col.cmd) {
              col.width = col.width || 32;
              if (col.cmd === 'checkAll')
                  col.text = '<input type="checkbox" name="' + col.src + '" value="chk_' + i + '">';
              else
                  col.text = '<input type="hidden" name="' + col.src + '" value="chk_' + i + '">';
          }
          colCss[i] = "width:" + (col.width ? col.width + "px;" : "auto; ");
          th[i] = '<th style="' + colCss[i] + '">' + (col.text || 'column_' + i) + '</th>';
      }
      var thead = '<thead><tr>' + th.join('') + '</tr></thead>';
      if (sets.fixFooter) {
          var tfoot = (sets.pagination) ? '<div class="gridPaginationFooter"></div>' : '';
          tb.prepend(thead + '<tbody id="' + tb[0].id + '_tbody"></tbody>').after(tfoot);
          var $by = $(document.body), $win_1 = $(window);
          function positionFooter() {
              var $tf = $('.gridPaginationFooter');
              var wh = $win_1.height();
              var dh = $tf.offset().top + $tf.outerHeight() - wh;
              var dw = tb.width();
              if ($win_1.scrollTop() > dh) {
                  $tf.css({ position: "fixed", bottom: 0, width: dw + 'px' });
              }
              else {
                  $tf.css({ position: "static" });
              }
              //console.log(dh , wh , $by.height() , $win.height() , $win.scrollTop() , $tf , $tf.offset().top , $tf.outerHeight())
          }
          $win_1.scroll(positionFooter).resize(positionFooter);
      }
      else {
          var tfoot = (sets.pagination) ? '<tfoot><tr><td colspan="' + (l || '1') + '"></td></tr></tfoot>' : '';
          tb.prepend(thead + '<tbody id="' + tb[0].id + '_tbody"></tbody>' + tfoot);
      }
  }
  function setupTitleBar(tb, sets) {
      var html = "<div class=\"grid-title-bar\">\n\t\t" + sets.title + "\n\t</div>", bar = $(html);
      var btns = "";
      if (sets.buttons && sets.buttons.length) {
          for (var i = 0, l = sets.buttons.length; i < l; i++) {
              var btn = sets.buttons[i];
              btns += "<button id=\"" + btn.id + "\" class=\"" + btn.className + "\">" + btn.html + "</button>";
          }
          bar.append(btns);
      }
      tb.before(bar);
  }
  var Table = /** @class */ (function (_super) {
      __extends(Table, _super);
      function Table(jq, cfg) {
          var _this = this;
          cfg = $.extend({
              bindOptions: {
                  itemRender: {}
              },
              resizable: true
          }, cfg);
          _this = _super.call(this, jq, cfg) || this;
          return _this;
      }
      Table.prototype.init = function (jq, cfg) {
          var _this = this;
          _super.prototype.init.call(this, jq, cfg);
          var isTable = jq[0].tagName === 'TABLE';
          if (isTable) {
              jq.addClass("grid");
              this.table = jq;
          }
          else {
              this.table = $('<table id="' + jq[0].id + '_table" class="grid"></table>');
          }
          this.fetching = false;
          this.resizable = cfg.resizable;
          this._bindOption.template = makeTemplate.call(this, cfg);
          makeTbStructor(this.table, cfg);
          if (cfg.titleBar)
              setupTitleBar(this.table, cfg.titleBar);
          if (!isTable)
              jq.append(this.table);
          this.thead = this.table.find("thead");
          this.cols = cfg.columns.length;
          this.tbody = this.table.find("tbody");
          this.container = this.tbody;
          this.tbody.on('click', 'tr', function (evt) {
              //log($(evt.currentTarget).parents("tr")[0].rowIndex);
              _this.selectHandler(evt);
          });
          if (this.resizable) {
              this.table.resizableColumns({
                  minWidth: 1
              });
          }
          if (cfg.pagination) {
              this.fixFooter = !!(cfg.fixFooter);
              var that_1 = this;
              var pageDefaults = {
                  append_number_input: true,
                  link_to: "javascript:void(0)",
                  num_edge_entries: 1,
                  num_display_entries: 5,
                  items_per_page: 10,
                  prev_text: "&laquo;",
                  next_text: "&raquo;",
                  load_first_page: false,
                  callback: function (pageIndex, paginationContainer) {
                      that_1._param.pageIndex = pageIndex;
                      that_1.update(_this._param);
                      //that.iptPageGo.val(that._param.pageNo);
                      return false;
                  },
                  pageSize: 10,
                  showCount: true,
                  customizable: true,
              };
              if (cfg.pagination.pageSize)
                  cfg.pagination.items_per_page = cfg.pagination.pageSize;
              cfg.pagination = $.extend(pageDefaults, cfg.pagination);
              this.pagination = cfg.pagination;
              this._param = $.extend({
                  pageIndex: 0,
                  pageSize: cfg.pagination.pageSize
              }, cfg.param);
          }
      };
      Table.prototype.createdHandler = function (data) {
          if (this.cmd === 'checkAll') {
              this.cmdCheckAll = this.thead.find('th:eq(' + this.cmdColumnIndex + ')').find('input');
              this.cmdCheckAll.syncCheckBoxGroup('td:eq(' + this.cmdColumnIndex + ')>:checkbox:enabled', this.tbody.find('tr'));
          }
          else if (this.cmd === 'checkOne') {
              this.cmdCheckOne = this.thead.find('th:eq(' + this.cmdColumnIndex + ')').find('input:hidden');
          }
          this._created = true;
          if (this._createdPromise) {
              this._createdPromise.resolve();
          }
          if (this.onCreate)
              this.onCreate(data);
      };
      Table.prototype.bindHandler = function (json) {
          if (this.pagination) {
              this.makePager(~~json.totalRecord);
          }
          if (typeof this.onBind === 'function')
              this.onBind(json);
      };
      Table.prototype.updateHandler = function (json) {
          if (this.cmdCheckAll) {
              this.cmdCheckAll.prop("checked", false);
              this.cmdCheckAll.syncCheckBoxGroup('td:eq(' + this.cmdColumnIndex + ')>:checkbox:enabled', this.tbody.find('tr'));
          }
          if ($.isFunction(this.onUpdate))
              this.onUpdate(json);
          return this;
      };
      //分页
      Table.prototype.makePager = function (rowCount) {
          var _this = this;
          var that = this;
          var pageCount = Math.ceil(rowCount / this._param.pageSize);
          if (pageCount === 0)
              pageCount = 1;
          //console.log(this._param , pageCount , this.pageCount , this.fetching);
          if (this._param.pageIndex > 0 && pageCount < this.pageCount) {
              if (this.fetching)
                  this.fetching = false;
              else {
                  this.fetching = true;
                  this._param.pageIndex -= (this.pageCount - pageCount) - 1;
                  return setTimeout(function () { return _this.update(); }, 0);
              }
          }
          this.pageCount = pageCount;
          var pageNum = this._param.pageIndex + 1;
          if (this.tPager) {
              this.pagination.current_page = this._param.pageIndex;
              this.tPager.pagination(rowCount, this.pagination);
              if (this.pagination.showCount) {
                  //this.pageCounter.html(format.json(this.pageTemplate, {rowCount, pageNum, pageCount}));
                  this.pageCounter.find('.bt').text(rowCount);
                  //this.iptPageGo.val(pageNum).data('total' , pageCount);
                  this.pageCounter.find('.bc').text(pageCount);
              }
          }
          else {
              this.tfoot = this.fixFooter ? this.table.next('.gridPaginationFooter') : this.table.find("tfoot td:eq(0)");
              this.tPager = $('<div class="pagination_container"></div>').appendTo(this.tfoot);
              this.tPager.pagination(rowCount, this.pagination);
              this.iptPageGo = this.tfoot.find('.iptPageGo');
              this.pagination.append_number_input = this.iptPageGo;
              this.pageCounter = $('<span></span>');
              this.tPager.after(this.pageCounter);
              if (this.pagination.showCount) {
                  if (typeof this.pagination.showCount === "string")
                      this.pageTemplate = this.pagination.showCount;
                  else {
                      if (Languages_1.Languages.current === Languages_1.Languages.names.cn) {
                          this.pageTemplate = '共<span class="bt">${rowCount}</span>条记录 , 第<span class="bf">${pageNum}</span> / <span class="bc">${pageCount}</span>页';
                      }
                      else {
                          this.pageTemplate = 'total: <span class="bt">${rowCount}</span> record(s), <span class="bf">${pageNum}</span> / <span class="bc">${pageCount}</span> page(s)';
                      }
                  }
                  this.pageCounter.html(jsonFormat(this.pageTemplate, { rowCount: rowCount, pageNum: pageNum, pageCount: pageCount }));
                  var bf = this.pageCounter.find('.bf');
                  this.iptPageGo.val(pageNum); //.data('total' , pageCount);
                  bf.replaceWith(this.iptPageGo);
              }
              if (this.pagination.customizable) {
                  if (typeof this.pagination.customizable != 'object')
                      this.pagination.customizable = [10, 20, 50];
                  var ps = this.pagination.customizable, arq = [];
                  for (var q = 0, ql = ps.length; q < ql; q++)
                      arq[q] = '<option value="' + ps[q] + '" ' + (ps[q] == this.pagination.pageSize ? 'selected' : '') + '>' + ps[q] + '</option>';
                  var pageSelector = $('<select>' + arq.join('') + '</select>');
                  if (Languages_1.Languages.current === Languages_1.Languages.names.cn)
                      this.pageCounter.after($('<label class="pageSelectorLabel">每页</label>').append(pageSelector).append('条'));
                  else
                      this.pageCounter.after($('<label class="pageSelectorLabel"></label>').append(pageSelector).append(' / page'));
                  //on change event
                  pageSelector.on('change.opg', function () {
                      that.pagination.items_per_page = that._param.pageSize = ~~this.options[this.selectedIndex].value;
                      that._param.pageIndex = 0;
                      that.update(that._param);
                      return false;
                  });
              }
          }
      };
      //@return object array
      Table.prototype.getCheckData = function () {
          if (this.cmd) {
              var key = (this.cmdCheckAll || this.cmdCheckOne).val(), chkBoxes = this.tbody.find("input[name='" + key + "']"), rev = this.cmdCheckAll ? [] : null;
              for (var i = 0, l = chkBoxes.length; i < l; i++) {
                  if (chkBoxes[i].checked) {
                      if (this.cmdCheckOne)
                          return this.data[i];
                      else
                          rev.push(this.data[i]);
                  }
              }
              return rev;
          }
          else
              return null;
      };
      //@return string value array
      Table.prototype.getCheckedValue = function () {
          if (this.cmd) {
              var key = (this.cmdCheckAll || this.cmdCheckOne).val(), chkBoxes = this.tbody.find("input[name='" + key + "']:checked");
              var rev_1;
              if (this.cmdCheckAll) {
                  rev_1 = [];
                  chkBoxes.each(function (i, elem) {
                      rev_1.push(elem.value);
                  });
              }
              else {
                  rev_1 = chkBoxes.length ? chkBoxes.val() : null;
              }
              return rev_1;
          }
          else
              return null;
      };
      return Table;
  }(DisplayOject_1.AjaxDisplayObject));
  exports.default = Table;
    

});

;/*!ts/ui/Popup.ts*/
define('ts/ui/Popup.ts', function(require, exports, module) {

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
  var utils_1 = require("ts/util/utils.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var DEFAULTS = {
      callback: null,
      title: null,
      btnClose: true,
      btnMax: false,
      drag: true,
      modal: true,
      modalClose: false,
      show: true,
      destroy: true,
      onClose: null,
      onDestroy: null,
      buttons: null
  };
  var BoxyStore = {
      manager: [],
      managerHash: {},
      dragging: null | [],
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
          var _this = this;
          this.state = 'normal';
          this.visible = false;
          this.mask = $('<div class="dg-mask"></div>');
          this.boxy = $('<div class="dg-wrapper" id="' + ('dialog_' + DisplayOject_1.DisplayObject.guid()) + '"></div>');
          this.content = $('<div class="dg-content"></div>');
          this.content.append(jq);
          this.boxy.append(this.content).appendTo(document.body);
          if (cfg.modalClose) {
              this.mask.on('click', function () {
                  _this.close();
              });
          }
          var titleBarHeight = 0, footBarHeight = 0;
          if (cfg.title) {
              setTitleBar.call(this, cfg);
              titleBarHeight = this.titleBar.outerHeight();
              this.boxy.find('.tb-row').css({ height: titleBarHeight });
          }
          if (cfg.buttons && Object.keys(cfg.buttons).length) {
              setFooter.call(this, cfg);
              this.boxy.find('.tf-row').css({ height: this.footBar.outerHeight() });
              footBarHeight = this.footBar.outerHeight();
          }
          else {
              this.content.css({ bottom: 0 });
          }
          if (this.jq[0].tagName === 'IFRAME') {
              this.iframe = this.jq[0];
              this.content.css({ position: 'absolute' });
          }
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
    

});

;/*!ts/ui/Panel.ts*/
define('ts/ui/Panel.ts', function(require, exports, module) {

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
          if (cfg.title) {
              this.titleBar = $('<div class="panel-title" />');
              this.titleBar.html(cfg.title);
              this.panel.append(this.titleBar);
          }
          this.body = $('<div class="panel-body" />');
          this.panel.append(this.body);
          this.foot = $('<div class="panel-foot" />');
          this.panel.append(this.foot);
          if (cfg.btnClose) {
              if (cfg.title) {
                  var self_1 = this;
                  this.btnClose = $('<b class="panel-collapse" />');
                  this.titleBar.append(this.btnClose);
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
    

});

;/*!ts/ui/Combo.ts*/
define('ts/ui/Combo.ts', function(require, exports, module) {

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
    

});

;/*!ts/ui/Tree.ts*/
define('ts/ui/Tree.ts', function(require, exports, module) {

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
  var Combo_1 = require("ts/ui/Combo.ts");
  var store_1 = require("ts/util/store.ts");
  function searchData(data, id) {
      var v;
      for (var i = 0, l = data.length; i < l; i++) {
          var obj = data[i];
          if (obj.id == id) {
              v = obj;
              break;
          }
          else if (obj.childMenus && obj.childMenus.length) {
              v = searchData(obj.childMenus, id);
              if (v) {
                  break;
              }
          }
      }
      return v;
  }
  var Tree = /** @class */ (function (_super) {
      __extends(Tree, _super);
      function Tree(jq, cfg) {
          var _this = this;
          cfg = $.extend({
              text: 'name',
              value: 'id',
              cache: true,
              childSrc: 'children',
          }, cfg);
          _this = _super.call(this, jq, cfg) || this;
          return _this;
      }
      /*set rootName(name: string) {
       this.jq.find('folder:eq(0)').text(name);
       }*/
      Tree.prototype.init = function (jq, cfg) {
          var _this = this;
          _super.prototype.init.call(this, jq, cfg);
          this.cache = cfg.cache;
          this.treeName = cfg.name;
          this.childSrc = cfg.childSrc;
          this._store = new store_1.LocalStore(false);
          this._cachedExpandedLeaf = {};
          if (!this.treeName) {
              this.treeName = "" + this.guid;
              if (this.cache)
                  this.cache = false;
          }
          this.treeName = "tree_" + this.treeName;
          if (this.cache) {
              this._cachedExpandedLeaf = this._store.get(this.treeName) || {};
          }
          console.log('aaa', this._cachedExpandedLeaf);
          if (!cfg.template) {
              if (cfg.cmd === 'checkAll') {
                  cfg.template = '<label><input id="' + this.treeName + 'Chk_${id}" name="' + this.treeName + 'Chk" type="checkbox" value="${' + cfg.value + '}"> ${' + cfg.text + '}</label>';
              }
              else if (cfg.cmd === 'checkOne') {
                  cfg.template = '<label><input id="' + this.treeName + 'Rd_${id}" name="' + this.treeName + 'Rd" type="radio" value="${' + cfg.value + '}"> ${' + cfg.text + '}</label>';
              }
              else {
                  cfg.template = '${' + cfg.text + '}';
              }
          }
          var self = this;
          this.cmd = cfg.cmd;
          if (cfg.root) {
              this.root = $('<ul></ul>');
              var node = $("<ul class=\"filetree treeview rootUl\"><li class=\"last rootLi\">\n\t\t\t\t\t\t\t<span class=\"folder rootSp\">" + cfg.root + "</span>\n\t\t\t\t\t\t</li></ul>");
              node.find('li').append(this.root);
              node.appendTo(this.jq);
          }
          else {
              this.root = $('<ul class="filetree treeview"></ul>');
              this.jq.append(this.root);
          }
          this.selectedItemId = -1;
          //this.currentData = null;
          this.currentLi = null;
          this.render = cfg.render;
          this.template = '<li id="' + this.treeName + 'Li_${id}" class="${id:=_getLiClass}" data-id="${id}" data-depth="${id:=_getDepth}">${id:=_getDiv}<span id="' + this.treeName + 'Sp_${id}" data-id="${id}" data-depth="${id:=_getDepth}" class="sp ${id:=_getSpClass}">' + cfg.template + '</span>${id:=_getUl}</li>';
          //this.render = {};
          this.root.on('click', '.hitarea', function (e) {
              e.stopImmediatePropagation();
              //
              //
              var $div = $(this);
              $div.toggleClass('collapsable-hitarea expandable-hitarea').siblings('ul').toggle();
              var $li = $div.parent(), leafId = $li.data('id');
              $li.toggleClass('collapsable expandable');
              if (self.cache) {
                  if (leafId in self._cachedExpandedLeaf) {
                      delete self._cachedExpandedLeaf[leafId];
                  }
                  else {
                      self._cachedExpandedLeaf[leafId] = 1;
                  }
                  self._store.set(self.treeName, self._cachedExpandedLeaf);
              }
              if (this.className.indexOf('last') > -1) {
                  $div.toggleClass('lastCollapsable-hitarea lastExpandable-hitarea');
                  $li.toggleClass('lastExpandable lastCollapsable');
              }
          });
          this.jq.on('click', '.sp', function (e) {
              var sp = $(this);
              if (self.selectedItemId != sp.data('id')) {
                  self.prevItemId = self.selectedItemId;
                  self.prevLi = self.currentLi;
                  self.selectedItemId = sp.data('id');
                  self.currentLi = sp.closest('li');
                  if (self.prevLi)
                      self.prevLi.find('.sp').removeClass('selected');
                  sp.addClass('selected');
                  if (typeof self.onSelect === 'function')
                      self.onSelect(e);
              }
          });
          //combo
          if (cfg.combo) {
              var textField = $(cfg.combo.textField);
              textField.after(this.jq);
              this.combo = new Combo_1.Combo(textField, {
                  allowBlank: cfg.combo.allowBlank,
                  target: this.jq.addClass('treeField-combo'),
                  valueField: cfg.combo.valueField,
              });
              this.textSrc = cfg.text;
              this.valueSrc = cfg.value;
              this.jq.on('click', '.sp', function () {
                  _this.syncData(_this.getSelectedData());
              });
              //
              if (cfg.combo.closeOnClick) {
                  this.jq.on('click', function () { return _this.combo.close(); });
              }
          }
      };
      Tree.prototype.getSelectedData = function () {
          //console.log(this.data , this.selectedItemId);
          return searchData(this.data, this.selectedItemId);
      };
      Tree.prototype.bindData = function (data) {
          var json = data, list;
          if ($.isArray(data)) {
              list = data;
          }
          else {
              list = data[this.arrSrc];
          }
          this.add(list, 1);
          this.prevItemId = this.selectedItemId;
          this.selectedItemId = -1;
          this.prevLi = this.currentLi;
          this.currentLi = null;
          this.data = list;
          this.bindHandler(json);
          return this;
      };
      Tree.prototype.add = function (data, addedTimes, parent) {
          var self = this, parentUl;
          console.warn(self._cachedExpandedLeaf);
          if (!parent) {
              parentUl = this.root;
          }
          else {
              parentUl = $('#' + self.treeName + 'Ul_' + parent.id);
          }
          var renders = {
              _getDepth: function () { return addedTimes; },
              _getDiv: function (id, i, row) {
                  if ((row[self.childSrc] && row[self.childSrc].length) || row.hasChildren) {
                      var cls = void 0;
                      if (id in self._cachedExpandedLeaf) {
                          cls = 'hitarea collapsable-hitarea';
                          if ((i + 1) === data.length)
                              cls += ' lastCollapsable-hitarea';
                      }
                      else {
                          cls = 'hitarea expandable-hitarea';
                          if ((i + 1) === data.length)
                              cls += ' lastExpandable-hitarea';
                      }
                      return '<div class="' + cls + '"></div>';
                  }
                  return '';
              },
              _getUl: function (id, i, row) {
                  if ((row[self.childSrc] && row[self.childSrc].length) || row.hasChildren) {
                      var style = (id in self._cachedExpandedLeaf) ? '' : ' style="display: none;"';
                      return "<ul id=\"" + self.treeName + ("Ul_" + id + "\" data-parent=\"" + id + "\" " + style + "></ul>");
                  }
                  return '';
              },
              _getLiClass: function (id, i, row) {
                  var cls = '';
                  if ((row[self.childSrc] && row[self.childSrc].length) || row.hasChildren) {
                      if (id in self._cachedExpandedLeaf) {
                          cls = 'collapsable';
                          if ((i + 1) === data.length)
                              cls += ' lastCollapsable';
                      }
                      else {
                          cls = 'expandable';
                          if ((i + 1) === data.length)
                              cls += ' lastExpandable';
                      }
                  }
                  else {
                      if ((i + 1) === data.length)
                          cls = 'last';
                  }
                  return cls;
              },
              _getSpClass: function (id, i, row) {
                  return ((row[self.childSrc] && row[self.childSrc].length) || row.hasChildren) ? 'folder' : 'file';
              },
          };
          if (self.render) {
              for (var ky in self.render) {
                  if (!(ky in renders)) {
                      renders[ky] = self.render[ky];
                  }
              }
          }
          parentUl.bindList({
              list: data,
              template: self.template,
              itemRender: renders,
              mode: (parent ? 'append' : 'html'),
          });
          addedTimes++;
          for (var i = 0, l = data.length; i < l; i++) {
              var node = data[i];
              if (node[self.childSrc] && node[self.childSrc].length) {
                  this.add(node[self.childSrc], addedTimes, node);
              }
          }
          if (this.cmd === 'checkAll') {
              parentUl.find('.folder').each(function (x, span) {
                  var sp = $(span), ul = sp.siblings('ul');
                  sp.find(':checkbox').checkBoxAll(':checkbox', ul);
              });
          }
      };
      Tree.prototype.findObjectById = function (id) {
          return searchData(this.data, id);
      };
      Tree.prototype.syncData = function (data) {
          console.log(data);
          this.combo.setValue(data[this.textSrc], data[this.valueSrc]);
      };
      return Tree;
  }(DisplayOject_1.AjaxDisplayObject));
  exports.default = Tree;
    

});

;/*!ts/ui/TabView.ts*/
define('ts/ui/TabView.ts', function(require, exports, module) {

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
          return this;
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
          return this;
      };
      TabView.prototype.addView = function (jqDiv) {
          this.views.push(jqDiv);
          this.stack.append(jqDiv.addClass('tabDivision'));
      };
      return TabView;
  }(DisplayOject_1.DisplayObject));
  exports.TabView = TabView;
    

});

;/*!ts/opg.ts*/
define('ts/opg.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var FormControls_1 = require("ts/ui/FormControls.ts");
  var api_1 = require("ts/util/api.ts");
  var Table_1 = require("ts/ui/Table.ts");
  var Popup_1 = require("ts/ui/Popup.ts");
  var Panel_1 = require("ts/ui/Panel.ts");
  var Tree_1 = require("ts/ui/Tree.ts");
  var TabView_1 = require("ts/ui/TabView.ts");
  var utils_1 = require("ts/util/utils.ts");
  //a ui factory class
  var OpgUi = /** @class */ (function () {
      function OpgUi(se) {
          this.jq = $(se);
          if (this.jq.length === 0) {
              throw new Error('There is no dom object to be processed.');
          }
      }
      OpgUi.prototype.table = function (cfg) {
          return new Table_1.default(this.jq, cfg);
      };
      OpgUi.prototype.tree = function (cfg) {
          return new Tree_1.default(this.jq, cfg);
      };
      OpgUi.prototype.listBox = function (cfg) {
          return new FormControls_1.ListBox(this.jq, cfg);
      };
      OpgUi.prototype.checkBox = function (cfg) {
          return new FormControls_1.CheckBox(this.jq, cfg);
      };
      OpgUi.prototype.radioBox = function (cfg) {
          return new FormControls_1.RadioBox(this.jq, cfg);
      };
      OpgUi.prototype.popup = function (cfg) {
          return new Popup_1.default(this.jq, cfg);
      };
      OpgUi.prototype.panel = function (cfg) {
          return new Panel_1.default(this.jq, cfg);
      };
      OpgUi.prototype.tabView = function (cfg) {
          return new TabView_1.TabView(this.jq, cfg);
      };
      return OpgUi;
  }());
  var opg = function (se) { return new OpgUi(se); };
  opg.api = api_1.api;
  opg.request = utils_1.request;
  opg.dateTime = utils_1.dateTime;
  opg.string = utils_1.string;
  opg.is = utils_1.is;
  opg.url = utils_1.url;
  opg.convert = utils_1.convert;
  opg.format = utils_1.format;
  opg.array = utils_1.array;
  //
  opg.popTop = Popup_1.default.popTop;
  opg.alert = Popup_1.default.alert;
  opg.confirm = Popup_1.default.confirm;
  opg.ok = function (message, callBack, options) {
      if (options === void 0) { options = {}; }
      Popup_1.default.alert('<i class="ico-ok"></i><span>' + message + '</span>', callBack, options);
  };
  opg.err = function (message, callBack, options) {
      if (options === void 0) { options = {}; }
      Popup_1.default.alert('<i class="ico-error"></i><span>' + message + '</span>', callBack, options);
  };
  opg.warn = function (message, callBack, options) {
      if (options === void 0) { options = {}; }
      Popup_1.default.alert('<i class="ico-warn"></i><span>' + message + '</span>', callBack, options);
  };
  opg.danger = function (message, callBack, options) {
      if (options === void 0) { options = {}; }
      Popup_1.default.confirm('<i class="ico-warn"></i><span>' + message + '</span>', callBack, options);
  };
  //Pub/Sub
  //https://github.com/cowboy/jquery-tiny-pubsub
  var ps_obj = $({});
  opg.listen = function (events, handler) {
      ps_obj.on.apply(ps_obj, arguments);
  };
  opg.dispatch = function (eventType, extraParameters) {
      ps_obj.trigger.apply(ps_obj, arguments);
  };
  opg.unListen = function () {
      ps_obj.off.apply(ps_obj, arguments);
  };
  /*
   //https://github.com/daniellmb/MinPubSub/
   // the topic/subscription hash
   let cache = {};
   opg.dispatch = function (topic: string, args ?: Array) {
   // summary:
   //    Publish some data on a named topic.
   // topic: String
   //    The channel to publish on
   // args: Array?
   //    The data to publish. Each array item is converted into an ordered
   //    arguments on the subscribed functions.
   //
   // example:
   //    Publish stuff on '/some/topic'. Anything subscribed will be called
   //    with a function signature like: function(a,b,c){ ... }
   //
   //    publish('/some/topic', ['a','b','c']);
  
   let subs = cache[topic],
   len = subs ? subs.length : 0;
  
   //can change loop or reverse array if the order matters
   while (len--) {
   subs[len].apply(null, args || []);
   }
   };
  
   opg.listen = function (topic: string, callback: Function) {
   // summary:
   //    Register a callback on a named topic.
   // topic: String
   //    The channel to subscribe to
   // callback: Function
   //    The handler event. Anytime something is publish'ed on a
   //    subscribed channel, the callback will be called with the
   //    published array as ordered arguments.
   //
   // returns: Array
   //    A handle which can be used to unsubscribe this particular subscription.
   //
   // example:
   //    subscribe('/some/topic', function(a, b, c){ handle data  });
  
   if (!cache[topic]) {
   cache[topic] = [];
   }
   cache[topic].push(callback);
   return [topic, callback]; // Array
   };
  
   opg.unListen = function ( handle,  callback) {
   // summary:
   //    Disconnect a subscribed function for a topic.
   // handle: Array
   //    The return value from a subscribe call.
   // example:
   //    var handle = subscribe('/some/topic', function(){});
   //    unsubscribe(handle);
  
   let subs = cache[callback ? handle : handle[0]],
   callback = callback || handle[1],
   len = subs ? subs.length : 0;
  
   while (len--) {
   if (subs[len] === callback) {
   subs.splice(len, 1);
   }
   }
   };
   */
  //
  opg.wrapPanel = Panel_1.default.wrapPanel;
  window['opg'] = opg;
  exports.default = opg;
    

});

;/*!ts/ui/Sp.ts*/
define('ts/ui/Sp.ts', function(require, exports, module) {

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
    

});

;/*!ts/util/Dictionary.ts*/
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
    

});
