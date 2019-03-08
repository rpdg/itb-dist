define('pages/itb/press/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var opg_1 = require("ts/opg.ts");
  var ViewDetail_1 = require("pages/itb/press/ViewDetail.ts");
  api_1.api({
      getList: "mediaexhibtion/QueryAllEnableMediaExhibtionInfos?type=0",
      types: 'meinfotype/GetMediaExhibtionInfoType?type=0'
  });
  var lpg = Languages_1.Languages.package;
  var moduleName = lpg.moduleName;
  opg_1.default.wrapPanel('#tbSearch', {
      title: "" + moduleName,
      btnSearchId: null,
  });
  var selType = opg_1.default('#types').listBox({
      api: api_1.api.types,
      autoPrependBlank: false,
      onSelect: function () {
          tb.update({ mediaExhitionInfoTypeId: selType.getValue(), pageIndex: 0 });
      }
  });
  var tb = opg_1.default('#tb').table({
      api: opg_1.default.api.getList,
      lazy: true,
      titleBar: {
          title: "" + moduleName + lpg.list,
      },
      columns: [
          {
              text: lpg.title,
              width: 300,
              src: 'title',
              render: function (title, i, row) {
                  return "<a href=\"javascript:void(0)\" data-id=\"" + row.id + "\">" + title + "</a>";
              }
          },
          {
              text: lpg.publishbegindate,
              width: 150,
              src: 'publishbegindate',
          },
          {
              text: "" + lpg.digest,
              align: 'left',
              src: 'digest',
          },
      ],
      pagination: true,
  });
  tb.tbody.on('click', 'a', function () {
      new ViewDetail_1.default($(this).data('id'), Languages_1.Languages.package.readDetail);
  });
  //# sourceMappingURL=/itb-dist/pc/pages/itb/press/index.js.map?__=1552033897847
  

});
