define('pages/system/systemSetting/AddMatchMeeting.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var api_1 = require("ts/util/api.ts");
  api_1.api({
      'add!post': 'focusonmeetinginfo/AddFocusOnMeetingInfo',
  });
  var AddMatchMeeting = /** @class */ (function () {
      function AddMatchMeeting(lng, srcTb) {
          var $form = $("<div>\n\t\t\t\t\t\t\t<table class=\"search-table\">\n\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t<td class=\"lead\"><label for=\"name\">" + lng.meetingName + "</label></td>\n\t\t\t\t\t\t\t\t\t<td><input id=\"name\" name=\"name\" type=\"text\"/></td>\n\t\t\t\t\t\t\t\t\t<td class=\"lead\"><label for=\"address\">" + lng.place + "</label></td>\n\t\t\t\t\t\t\t\t\t<td><input id=\"address\" name=\"address\" type=\"text\"/></td>\n\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t<td class=\"lead\"><label for=\"begindate\">" + lng.startTime + "</label></td>\n\t\t\t\t\t\t\t\t\t<td><input id=\"begindate\" name=\"begindate\" type=\"datetime\" style=\"width: 100%\"/></td>\n\t\t\t\t\t\t\t\t\t<td class=\"lead\"><label for=\"enddate\">" + lng.endTime + "</label></td>\n\t\t\t\t\t\t\t\t\t<td><input id=\"enddate\" name=\"enddate\" type=\"datetime\" style=\"width: 100%\"/></td>\n\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t</div>");
          var pop = opg_ts_1.default($form).popup({
              title: lng.add,
              width: 600,
              height: 200,
              buttons: {
                  ok: {
                      text: lng.add,
                      className: 'btn-success',
                      onClick: function () {
                          var param = $form.fieldsToJson({
                              name: {
                                  type: 'string',
                                  require: true,
                              },
                              address: {
                                  type: 'string',
                                  require: true,
                              },
                              begindate: {
                                  type: 'string',
                                  require: true,
                              },
                              enddate: {
                                  type: 'string',
                                  require: true,
                              },
                          });
                          if (param) {
                              api_1.api.add(param, function (res) {
                                  srcTb.update();
                                  pop.close();
                              });
                          }
                          return true;
                      },
                  },
              },
          });
          $('#begindate', $form).datetimepicker({
              timepicker: true,
              step: 30,
              closeOnDateSelect: false,
              format: 'Y-m-d H:i:00',
          });
          $('#enddate', $form).datetimepicker({
              timepicker: true,
              step: 30,
              closeOnDateSelect: false,
              format: 'Y-m-d H:i:00',
          });
      }
      return AddMatchMeeting;
  }());
  exports.default = AddMatchMeeting;
  //# sourceMappingURL=/itb-dist/pc/pages/system/systemSetting/AddMatchMeeting.js.map?__=1552033897847
  

});
