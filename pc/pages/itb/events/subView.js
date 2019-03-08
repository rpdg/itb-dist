define('pages/itb/events/subView.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var opg_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  var id = utils_1.request['id'];
  var img = utils_1.request['img'];
  api_1.api({
      getSubs: "activity/GetActivityContentsByActivityIdFront?id=" + id,
      getSubDetail: 'activity/GetActivityContentInfoById',
      sendApply: 'activity/ApplyingActivityContent',
      sendApplyNoApproval: 'activity/ApplyingActivityContentNoApproval'
  });
  api_1.api.getSubDetail.set('unlimited', true);
  var lpg = Languages_1.Languages.package;
  var moduleName = lpg.moduleName;
  opg_1.default.api.getSubs(function (data) {
      getSubjectsDetail(data, function (list) {
          var i = 0, ll = list.length;
          for (; i < ll; i++) {
              if (list[i].scope == "2" && list[i].invite == "-1")
                  delete list[i];
          }
          var tbSubjects = opg_1.default('#tbSub').table({
              data: list,
              titleBar: {
                  title: lpg.subjectsList,
              },
              columns: [
                  {
                      text: lpg.topic,
                      src: 'title', width: 100,
                      render: function (title, i, row) { return "<a class=\"aView\" href=\"javascript:void(0)\" data-id=\"" + row.id + "\">" + title + "</a>"; },
                  },
                  {
                      text: lpg.content,
                      width: 200,
                      src: 'content',
                      align: 'left',
                  },
                  {
                      text: lpg.scopetype, width: 100,
                      src: 'scope',
                      render: function (time, i, row) {
                          return "" + lpg.scope[row.scope];
                      },
                  },
                  {
                      text: lpg.time, width: 100,
                      src: 'time',
                      render: function (time, i, row) {
                          return row.begindate.split(' ')[0] + " " + time;
                      },
                  },
                  {
                      text: lpg.process, width: 200,
                      src: 'detail',
                      render: function (detail, i, row) {
                          var html = '';
                          if (row.scope == 1 || row.scope == 0) {
                              if (detail.applyState.applied) {
                                  if (detail.applyState.accept == -1) {
                                      html += lpg.waitingConfirm;
                                  }
                                  else if (detail.applyState.accept == 1) {
                                      html += lpg.agreed;
                                  }
                                  else if (detail.applyState.accept == 0) {
                                      html += lpg.denied;
                                  }
                              }
                              else {
                                  var msg = "" + lpg.sendApply;
                                  if (row.scope == 1)
                                      msg = "" + lpg.sendApply2;
                                  html += "<button class=\"btn-mini btn-info\" data-id=\"" + row.id + "\" data-scope=\"" + row.scope + "\">" + msg + "</button>";
                              }
                          }
                          else if (row.scope == 2) {
                              if (detail.applyState.invite == 1) {
                                  if (detail.applyState.accept == -1) {
                                      html += lpg.waitingConfirm;
                                  }
                                  else if (detail.applyState.accept == 1) {
                                      html += lpg.agreed;
                                  }
                                  else if (detail.applyState.accept == 0) {
                                      html += lpg.denied;
                                  }
                              }
                          }
                          return html;
                      },
                  },
              ],
          });
          var pageSrc = '/itb-dist/pc/pages/itb/events/detail.html?__=e3a7e5c';
          tbSubjects.tbody.on('click', '.aView', function () {
              var title = this.textContent, id = this.getAttribute('data-id');
              var src = utils_1.url.setParam(pageSrc, { id: id });
              opg_1.default.popTop("<iframe src=\"" + src + "\"></iframe>", {
                  title: lpg.viewDetail,
                  width: 500,
                  height: 500,
              });
          });
          tbSubjects.tbody.on('click', '.btn-info', function (e) {
              var scope = e.target.getAttribute("data-scope");
              if (scope == "0") {
                  api_1.api.sendApply({ id: this.getAttribute('data-id') }, function (data) {
                      location.reload(true);
                  });
              }
              else if (scope == "1") {
                  api_1.api.sendApplyNoApproval({ id: this.getAttribute('data-id') }, function (data) {
                      location.reload(true);
                  });
              }
          });
      });
  });
  function getSubjectsDetail(list, callback) {
      var i = 0, l = list.length, n = 0;
      var _loop_1 = function () {
          var an = list[i];
          api_1.api.getSubDetail({ id: an.id }, function (data) {
              an['detail'] = data;
              if (++n === l) {
                  callback(list);
              }
          });
      };
      for (; i < l; i++) {
          _loop_1();
      }
  }
  //# sourceMappingURL=/itb-dist/pc/pages/itb/events/subView.js.map?__=1552033897847
  

});
