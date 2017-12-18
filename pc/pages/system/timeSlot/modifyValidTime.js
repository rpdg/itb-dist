define('pages/system/timeSlot/modifyValidTime.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  opg_ts_1.default.api({
      'addTimeSlot!POST': 'timeslot/AddTimeSlot',
  });
  var lpg = Languages_1.Languages.package;
  var ValidTimeModifier = /** @class */ (function () {
      function ValidTimeModifier(srcTable) {
          var _this = this;
          this.formJq = $("<form style=\"padding: 20px;\"><table class=\"search-table\" style=\"width: 100%;\">\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td class=\"lead\">" + lpg.beginTime + "</td>\n\t\t\t\t\t\t<td style=\"width: 200px !important;\">\n\t\t\t\t\t\t\t<input id=\"beginTime\" name=\"beginTime\" type=\"datetime\" readonly />\n\t\t\t\t\t\t\t<input type=\"hidden\" name=\"id\" value=\"\">\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td class=\"lead\">" + lpg.endTime + "</td>\n\t\t\t\t\t\t<td style=\"width: 200px !important;\">\n\t\t\t\t\t\t\t<input id=\"endTime\" name=\"endTime\" type=\"datetime\" readonly />\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td class=\"lead\">" + lpg.slotType + "</td>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<input id=\"slotType\" name=\"slotType\" type=\"text\" />\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td class=\"lead\">" + lpg.info + "</td>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<input id=\"info\" name=\"info\" type=\"text\" />\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</table></form>");
          this.formJq.find('[type="datetime"]').datetimepicker({
              datepicker: false,
              format: 'H:i',
          });
          this.popWin = opg_ts_1.default.confirm(this.formJq, function () {
              var param = _this.formJq.fieldsToJson({
                  beginTime: {
                      name: lpg.beginTime,
                      require: true,
                      type: 'time',
                  },
                  endTime: {
                      name: lpg.endTime,
                      require: true,
                      type: 'time',
                  },
              });
              if (param) {
                  console.log(param);
                  param.id = ~~param.id;
                  //param.validTime += ':00';
                  opg_ts_1.default.api.addTimeSlot(param, function () {
                      srcTable.update();
                      _this.popWin.close();
                  });
              }
              return true;
          }, {
              title: '修改生效时间',
              width: 480,
              height: 200,
          });
      }
      ValidTimeModifier.getInstance = function (json, srcTable) {
          if (!ValidTimeModifier.instance) {
              ValidTimeModifier.instance = new ValidTimeModifier(srcTable);
          }
          ValidTimeModifier.instance.formJq.jsonToFields(json);
          return ValidTimeModifier.instance;
      };
      return ValidTimeModifier;
  }());
  //# sourceMappingURL=/itb-dist/pc/pages/system/timeSlot/modifyValidTime.js.map?__=
  

});
