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
  //# sourceMappingURL=/itb-dist/pc/ts/opg.js.map?__=1552033897847
  

});
