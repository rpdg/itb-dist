define('pages/system/timeSlot/TimeModifier.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var lpg = Languages_1.Languages.package;
  opg_1.default.api({
      'addTimeSlot!POST': 'timeslot/AddTimeSlot',
      'updateTimeSlot!POST': 'timeslot/UpTimeSlot',
  });
  var TimeModifier = /** @class */ (function () {
      function TimeModifier(srcTable, json) {
          var formJq = $("<form style=\"padding: 20px;\"><table class=\"search-table\" style=\"width: 100%;\">\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td class=\"lead\" style=\"width: 280px !important;\">" + lpg.beginTime + "</td>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<input id=\"beginTime\" name=\"begintime\" type=\"datetime\" readonly />\n\t\t\t\t\t\t\t<input type=\"hidden\" name=\"id\" value=\"\">\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td class=\"lead\" style=\"width: 280px !important;\">" + lpg.endTime + "</td>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<input id=\"endTime\" name=\"endtime\" type=\"datetime\" readonly />\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td class=\"lead\">" + lpg.slotType + "</td>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<select name=\"slottype\" id=\"slotType\">\n\t\t\t\t\t\t\t\t<option value=\"0\"></option>\n\t\t\t\t\t\t\t\t<option value=\"1\">" + lpg.org + "</option>\n\t\t\t\t\t\t\t\t<option value=\"2\">" + lpg.custom + "</option>\n\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td class=\"lead\">" + lpg.info + "</td>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<input id=\"info\" name=\"info\" type=\"text\" />\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</table></form>");
          if (json && json.id) {
              formJq.jsonToFields(json);
          }
          formJq.find('[type="datetime"]').datetimepicker({
              datepicker: false,
              format: 'H:i:00',
              step: 30,
          });
          var popWin = opg_1.default.confirm(formJq, function () {
              var param = formJq.fieldsToJson({
                  begintime: {
                      name: lpg.beginTime,
                      require: true,
                      type: 'time',
                  },
                  endtime: {
                      name: lpg.endTime,
                      require: true,
                      type: 'time',
                  },
              });
              if (param) {
                  console.log(param);
                  var action = param.id ? 'updateTimeSlot' : 'addTimeSlot';
                  opg_1.default.api[action](param, function () {
                      srcTable.update();
                      popWin.close();
                  });
              }
              return true;
          }, {
              title: lpg.timeSlotsSetting,
              width: 780,
              height: 200,
          });
      }
      return TimeModifier;
  }());
  exports.default = TimeModifier;
  //# sourceMappingURL=/itb-dist/pc/pages/system/timeSlot/TimeModifier.js.map?__=
  

});
