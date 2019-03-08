define('pages/itb/schedule/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  var opg_1 = require("ts/opg.ts");
  var utils_2 = require("ts/util/utils.ts");
  var schedule_1 = require("pages/itb/schedule/schedule.ts");
  var store_1 = require("ts/util/store.ts");
  api_1.api({
      deleteSchedule: 'schedule/DelScheduleById',
  });
  template.defaults.imports.dateFormat = utils_1.format.date;
  template.defaults.imports.parseInt = parseInt;
  //template.defaults.imports.log = console.log;
  schedule_1.default.fetch(function (fullObj) {
      document.getElementById('divSec').innerHTML = template('tpl', fullObj);
      var iframe = (utils_1.request['iframe'] == 1);
      if (iframe) {
          document.body.style.cssText += 'background-color:#fff;';
      }
      var role = store_1.store.get('RoleName');
      var stage = store_1.store.get('Stage');
      $('#divSec').on('click', '.divMeeting,.divActivity', function () {
          var keys = this.getAttribute('data-key').split('/');
          var obj = fullObj.dayArr[keys[0]].time[keys[1]].acts[keys[2]];
          var d = dialog({
              id: 'id-demo' + obj.activitycontent_id,
              align: 'right top',
              content: "\t<h3>" + obj.title + "</h3>\n\t\t\t\t\t<p class=\"ab\"><b class=\"red\">" + fullObj.lng.time + ":</b>" + obj.begindate.split(' ')[0] + " " + obj.time + "</p>\n\t\t\t\t\t<p class=\"ab\"><b class=\"red\">" + fullObj.lng.location + ":</b>" + obj.location + "</p>\n\t\t\t\t\t<p class=\"ab\"><b class=\"red\">" + fullObj.lng.content + ":</b>" + obj.content + "</p>\t\t\t\n\t\t\t\t\t<p><a class=\"aView\" href=\"javascript:view(" + obj.activitycontent_id + ")\">" + fullObj.lng.viewDetail + "</a></p>\n\t\t\t\t\t",
              quickClose: true,
          });
          d.show(this);
      }).on('click', '.divAppoint,.divTempAppoint,.divAppointSpeed', function () {
          var keys = this.getAttribute('data-key').split('/');
          var obj = fullObj.dayArr[keys[0]].time[keys[1]].acts[keys[2]];
          if (stage == "open diary") {
              if (role === 'exhibition') {
                  var d = window['current_dialog'] = dialog({
                      id: 'id-demo' + obj.activitycontent_id,
                      align: 'right top',
                      content: "\t<h3>" + (obj.title || fullObj.lng.Appoint) + "</h3>\n\t\t\t\t\t<p class=\"ab\"><b class=\"red\">" + fullObj.lng.time + ":</b>" + obj.begindate.substr(0, 16) + " - " + obj.enddate.substr(11, 5) + "</p>\n\t\t\t\t\t<p class=\"ab\"><b class=\"red\">" + fullObj.lng.location + ":</b>" + obj.address + "</p>\n\t\t\t\t\t<p class=\"ab\"><b class=\"red\">" + fullObj.lng.buyer + ":</b>" + obj.name + "</p>\n\t\t\t\t\t<p class=\"ab\"><b class=\"red\">" + fullObj.lng.exhibition + ":</b>" + obj.company + "</p>\n                \t<p><a class=\"aView\" href=\"javascript:view2(" + obj.barcode + ",'buyer')\">" + fullObj.lng.viewDetail + "</a></p>\n                \t<p><button class=\"btn-danger\" data-sid=\"" + obj.scheduleid + "\" onclick=\"deleteEntry('" + obj.scheduleid + "')\">" + fullObj.lng.del + "</button></p>",
                      quickClose: true,
                  });
                  d.show(this);
              }
              else {
                  var d = window['current_dialog'] = dialog({
                      id: 'id-demo' + obj.activitycontent_id,
                      align: 'right top',
                      content: "\t<h3>" + (obj.title || fullObj.lng.Appoint) + "</h3>\n\t\t\t\t\t<p class=\"ab\"><b class=\"red\">" + fullObj.lng.time + ":</b>" + obj.begindate.substr(0, 16) + " - " + obj.enddate.substr(11, 5) + "</p>\n\t\t\t\t\t<p class=\"ab\"><b class=\"red\">" + fullObj.lng.location + ":</b>" + obj.booth_no + "</p>\n\t\t\t\t\t<p class=\"ab\"><b class=\"red\">" + fullObj.lng.buyer + ":</b>" + obj.name + "</p>\n\t\t\t\t\t<p class=\"ab\"><b class=\"red\">" + fullObj.lng.exhibition + ":</b>" + obj.company + "</p>\n                \t<p><a class=\"aView\" href=\"javascript:view2(" + obj.barcode + ",'exhibition')\">" + fullObj.lng.viewDetail + "</a></p>\n                \t<p><button class=\"btn-danger\" data-sid=\"" + obj.scheduleid + "\" onclick=\"deleteEntry('" + obj.scheduleid + "')\">" + fullObj.lng.del + "</button></p>",
                      quickClose: true,
                  });
                  d.show(this);
              }
          }
          else {
              if (role === 'exhibition') {
                  var d = window['current_dialog'] = dialog({
                      id: 'id-demo' + obj.activitycontent_id,
                      align: 'right top',
                      content: "\t<h3>" + (obj.title || fullObj.lng.Appoint) + "</h3>\n\t\t\t\t\t<p class=\"ab\"><b class=\"red\">" + fullObj.lng.time + ":</b>" + obj.begindate.substr(0, 16) + " - " + obj.enddate.substr(11, 5) + "</p>\n\t\t\t\t\t<p class=\"ab\"><b class=\"red\">" + fullObj.lng.location + ":</b>" + obj.address + "</p>\n\t\t\t\t\t<p class=\"ab\"><b class=\"red\">" + fullObj.lng.buyer + ":</b>" + obj.name + "</p>\n\t\t\t\t\t<p class=\"ab\"><b class=\"red\">" + fullObj.lng.exhibition + ":</b>" + obj.company + "</p>\n                    <p><a class=\"aView\" href=\"javascript:view2(" + obj.barcode + ",'buyer')\">" + fullObj.lng.viewDetail + "</a></p>",
                      quickClose: true,
                  });
                  d.show(this);
              }
              else {
                  var d = window['current_dialog'] = dialog({
                      id: 'id-demo' + obj.activitycontent_id,
                      align: 'right top',
                      content: "\t<h3>" + (obj.title || fullObj.lng.Appoint) + "</h3>\n\t\t\t\t\t<p class=\"ab\"><b class=\"red\">" + fullObj.lng.time + ":</b>" + obj.begindate.substr(0, 16) + " - " + obj.enddate.substr(11, 5) + "</p>\n\t\t\t\t\t<p class=\"ab\"><b class=\"red\">" + fullObj.lng.location + ":</b>" + obj.booth_no + "</p>\n\t\t\t\t\t<p class=\"ab\"><b class=\"red\">" + fullObj.lng.buyer + ":</b>" + obj.name + "</p>\n\t\t\t\t\t<p class=\"ab\"><b class=\"red\">" + fullObj.lng.exhibition + ":</b>" + obj.company + "</p>\n\t\t\t\t\t<p><a class=\"aView\" href=\"javascript:view2(" + obj.barcode + ",'exhibition')\">" + fullObj.lng.viewDetail + "</a></p>",
                      quickClose: true,
                  });
                  d.show(this);
              }
          }
      }).on('click', '.divAddTo', function (e) {
          var target;
          if (role === 'exhibition') {
              target = '/itb-dist/pc/pages/itb/buyers/index.html?__=5a3a8e5';
          }
          else {
              target = '/itb-dist/pc/pages/itb/exhibitors/index.html?__=b0ffba7';
          }
          var curTimes = e.target.getAttribute('data-time').split('-');
          var beginDateTime = e.target.getAttribute('data-date') + ' ' + curTimes[0];
          var endDateTime = e.target.getAttribute('data-date') + ' ' + curTimes[1];
          //console.log(beginDateTime, endDateTime);
          store_1.store.set('scheduleAddtoTime', beginDateTime + '|' + endDateTime);
          location.href = utils_2.url.setParam(target, {
              from: 'schedule',
              info: beginDateTime + " ~ " + endDateTime
          });
      });
      var pageSrc = '/itb-dist/pc/pages/itb/events/detail.html?__=e3a7e5c';
      window['view'] = function (id) {
          var src = utils_2.url.setParam(pageSrc, { id: id });
          opg_1.default.popTop("<iframe src=\"" + src + "\"></iframe>", {
              title: Languages_1.Languages.package.viewDetail,
              width: 500,
              height: 500
          });
      };
      var pageSrc2 = '/itb-dist/pc/pages/itb/wishlist/barcode.html?__=6f043b6';
      window['view2'] = function (barcode, type) {
          var src2 = utils_2.url.setParam(pageSrc2, { barcode: barcode, type: type });
          opg_1.default.popTop("<iframe src=\"" + src2 + "\"></iframe>", {
              title: Languages_1.Languages.package.viewDetail,
              width: 950,
              height: 700
          });
      };
      api_1.api.deleteSchedule.set('onError', function (code, error, callback) {
          if (code === 200 && error === 'DelScheduleById_ERROR01') {
              opg_1.default.alert(Languages_1.Languages.package.deleteError_Max);
          }
      });
      window['deleteEntry'] = function (scheduleId) {
          window['current_dialog'].close();
          api_1.api.deleteSchedule({ scheduleId: scheduleId }, function (res) { return location.reload(true); });
      };
  });
  //# sourceMappingURL=/itb-dist/pc/pages/itb/schedule/index.js.map?__=1552033897847
  

});
