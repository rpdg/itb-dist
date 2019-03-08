define('pages/itb/announcement/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var store_1 = require("ts/util/store.ts");
  var ViewNewsDetail_1 = require("pages/itb/news/ViewNewsDetail.ts");
  var cache = store_1.Cache.getInstance();
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      list: 'Information/QueryAllEnableInformations?type=1'
  });
  var lpg = Languages_1.Languages.package;
  var moduleName = lpg.news;
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.list,
      param: { informationType: 0 },
      fixFooter: true,
      titleBar: {
          title: "" + moduleName + lpg.list,
      },
      columns: [
          {
              text: "" + lpg.newsTitle,
              src: 'title',
              render: function (title, i, row) {
                  return "<a href=\"javascript:void(0)\" data-id=\"" + row.id + "\">" + title + "</a>";
              }
          },
          {
              text: lpg.publisher,
              src: 'from',
              width: 250,
          },
      ],
      pagination: true,
  });
  tb.tbody.on('click', 'a', function () {
      new ViewNewsDetail_1.default($(this).data('id'), Languages_1.Languages.package.readDetail);
  });
  //# sourceMappingURL=/itb-dist/pc/pages/itb/announcement/index.js.map?__=1552033897847
  

});
