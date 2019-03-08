define('pages/itb/events/list.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var opg_1 = require("ts/opg.ts");
  var utils_1 = require("ts/util/utils.ts");
  api_1.api({
      'getList!POST': 'activity/QueryActivitysByType',
  });
  var lng = Languages_1.Languages.package;
  var imgSrc = '/itb-dist/pc/pages/itb/events/assets/363-213.png?__=1552033897847';
  var List = /** @class */ (function () {
      function List(typeId) {
          var tb = opg_1.default('#tb').table({
              api: opg_1.default.api.getList,
              param: { informationType: typeId },
              titleBar: {
                  title: "" + lng.moduleName,
              },
              columns: [
                  {
                      text: lng.topic,
                      src: 'title', align: 'left',
                      render: function (title, i, row) { return "<a  href=\"javascript:void(0)\" data-id=\"" + row.id + "\" data-title=\"" + title + "\" data-img=\"" + (row.coverpicture || imgSrc) + "\"><div class=\"thumb\"><img src=\"" + (row.coverpicture || imgSrc) + "\"></div><b class=\"nTitle\">" + title + "</b> <br></a>"; }
                  },
                  {
                      text: lng.publisher,
                      src: 'from',
                      width: 150,
                  },
                  {
                      text: lng.publishBeginDate,
                      src: 'publishbegindate',
                      width: 150,
                      render: function (publishBeginDate) { return publishBeginDate.split(' ')[0]; }
                  },
              ],
              pagination: true,
          });
          var src = '/itb-dist/pc/pages/itb/events/subView.html?__=1c1a9c4';
          tb.tbody.on('click', 'a', function () {
              var sender = $(this), id = sender.data('id'), img = sender.data('img'), title = sender.data('title');
              opg_1.default.popTop("<iframe src=\"" + utils_1.url.setParam(src, { id: id, title: title, img: img }) + "\"></iframe>", {
                  title: title,
                  width: 1080,
                  height: 600
              });
              console.log(src);
          });
      }
      return List;
  }());
  exports.default = List;
  //# sourceMappingURL=/itb-dist/pc/pages/itb/events/list.js.map?__=1552033897847
  

});
