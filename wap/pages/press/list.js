define('pages/press/list.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  var util_2 = require("js/util.ts");
  var typeId = util_1.request['id'];
  var pageSize = 1000;
  var pageIndex = 0;
  var pageCount = 0;
  var totalRecord = 0;
  var newsList = $('#newsList');
  var pullRef;
  var render = template.compile(document.getElementById('tpl-atom').innerHTML);
  api_1.api({
      getList: "mediaexhibtion/QueryAllEnableMediaExhibtionInfos?type=0&mediaExhitionInfoTypeId=" + typeId + "&pageSize=" + pageSize
  });
  /**
   * 下拉刷新具体业务实现
   */
  function pulldownRefresh() {
      api_1.api.getList({ pageIndex: 0 }, function (data) {
          pageIndex = 0;
          pageCount = Math.ceil(data.totalRecord / pageSize);
          totalRecord = data.totalRecord;
          data.readMore = util_2.Languages.package.readMore;
          newsList.html(render(data));
          pullRef.endPulldownToRefresh(); //refresh completed
      });
  }
  /**
   * 上拉加载具体业务实现
   */
  function pullupRefresh() {
      api_1.api.getList({ pageIndex: pageIndex }, function (data) {
          if (pageIndex === 0) {
              pageCount = Math.ceil(data.totalRecord / pageSize);
              totalRecord = data.totalRecord;
          }
          pageIndex++;
          data.readMore = util_2.Languages.package.readMore;
          newsList.append(render(data));
          pullRef.endPullupToRefresh(pageIndex + 1 >= pageCount); //refresh completed
      });
  }
  mui.init({
      pullRefresh: {
          container: '#pullrefresh',
          down: {
              callback: pulldownRefresh
          },
          up: {
              contentdown: util_2.Languages.package.contentdown,
              contentinit: util_2.Languages.package.contentinit,
              contentrefresh: util_2.Languages.package.contentrefresh,
              contentnomore: util_2.Languages.package.contentnomore,
              callback: pullupRefresh
          }
      }
  });
  if (mui.os.plus) {
      mui.plusReady(function () {
          setTimeout(function () {
              pullRef = mui('#pullrefresh').pullRefresh();
              pullRef.pullupLoading();
          }, 1000);
      });
  }
  else {
      mui.ready(function () {
          pullRef = mui('#pullrefresh').pullRefresh();
          pullRef.pullupLoading();
      });
  }
  //# sourceMappingURL=/itb-dist/wap/pages/press/list.js.map?__=1552030651276
  

});
