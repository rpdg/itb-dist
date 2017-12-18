define('ts/util/Languages.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var store_1 = require("ts/util/store.ts");
  var LanguageNames = {
      cn: 'cn',
      en: 'en',
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
          title: 'title',
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
          title: '标题',
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
      package: null,
  };
  exports.Languages = Languages;
  //# sourceMappingURL=/itb-dist/pc/ts/util/Languages.js.map?__=
  

});
