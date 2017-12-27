define('pages/news/pull.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({
      getList: 'Information/QueryAllEnableInformations?type=0'
  });
  var pageSize = 10;
  var pageIndex = 0;
  var pageCount = 0;
  var totalRecord = 0;
  var newsList = $('#newsList');
  var pullRef;
  var render = template.compile(document.getElementById('tpl-atom').innerHTML);
  /**
   * 下拉刷新具体业务实现
   */
  function pulldownRefresh() {
      api_1.api.getList({ pageIndex: 0, pageSize: pageSize }, function (data) {
          pageIndex = 0;
          pageCount = Math.ceil(data.totalRecord / pageSize);
          totalRecord = data.totalRecord;
          data.readMore = util_1.Languages.package.readMore;
          newsList.html(render(data));
          pullRef.endPulldownToRefresh(); //refresh completed
      });
  }
  /**
   * 上拉加载具体业务实现
   */
  function pullupRefresh() {
      api_1.api.getList({ pageIndex: pageIndex, pageSize: pageSize }, function (data) {
          if (pageIndex === 0) {
              pageCount = Math.ceil(data.totalRecord / pageSize);
              totalRecord = data.totalRecord;
          }
          pageIndex++;
          data.readMore = util_1.Languages.package.readMore;
          newsList.append(render(data));
          pullRef.endPullupToRefresh(pageIndex + 1 >= pageCount); //refresh completed
      });
  }
  //console.log(Languages.package);
  mui.init({
      pullRefresh: {
          container: '#pullrefresh',
          down: {
              callback: pulldownRefresh
          },
          up: {
              contentdown: util_1.Languages.package.contentdown,
              contentinit: util_1.Languages.package.contentinit,
              contentrefresh: util_1.Languages.package.contentrefresh,
              contentnomore: util_1.Languages.package.contentnomore,
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
  //# sourceMappingURL=/itb-dist/wap/pages/news/pull.js.map?__=
  

});
