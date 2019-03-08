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
  //# sourceMappingURL=/itb-dist/pc/ts/util/store.js.map?__=1552033897847
  

});
