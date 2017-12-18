define('pages/system/timeSlot/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var TimeModifier_1 = require("pages/system/timeSlot/TimeModifier.ts");
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      getTimeSlots: 'timeslot/GetTimeSlots',
      delTimeSlot: 'timeslot/DelTimeSlotById',
      getDate: 'system/GetExhibitionDate',
      'setDate!post': 'system/UpExhibitionDate',
  });
  var lpg = Languages_1.Languages.package;
  var moduleName = lpg.timeSlotsSetting;
  var formDate = $('#formDate');
  var panel = opg_ts_1.default.wrapPanel(formDate, {
      title: "" + lpg.exhibitionDateSetting,
      btnSearchText: "" + lpg.save,
      btnSearchClick: function () {
          var param = formDate.fieldsToJson({
              beginDate: {
                  require: true,
                  name: lpg.beginDateSetting,
              },
              endDate: {
                  require: true,
                  name: lpg.endDateSetting,
              },
          });
          if (param) {
              opg_ts_1.default.api.setDate([param.beginDate, param.endDate]);
          }
      },
  });
  jQuery.datetimepicker.setLocale(Languages_1.Languages.current);
  opg_ts_1.default.api.getDate(function (data) {
      formDate.jsonToFields(data);
      $('#beginDate').datetimepicker({
          timepicker: false,
          closeOnDateSelect: true,
          format: 'Y-m-d 00:00:00',
      });
      $('#endDate').datetimepicker({
          timepicker: false,
          closeOnDateSelect: true,
          format: 'Y-m-d 00:00:00',
      });
  });
  //[时间段性质,0为空，1为组委会，2自定义]
  var slotType = {
      0: '',
      1: lpg.org,
      2: lpg.custom,
  };
  var tbTime = opg_ts_1.default('#tbTime').table({
      api: opg_ts_1.default.api.getTimeSlots,
      param: { informationType: 1 },
      titleBar: {
          title: "" + moduleName + lpg.list,
          buttons: [
              { id: 'btnAdd', className: 'btn-create', html: "<i class=\"ico ico-create\"></i> " + lpg.add },
          ],
      },
      columns: [
          {
              text: 'ID', width: 100,
              src: 'id',
          },
          {
              text: "" + lpg.beginTime,
              src: 'begintime',
              width: 150,
          },
          {
              text: "" + lpg.endTime,
              src: 'endtime',
              width: 150,
          },
          {
              text: lpg.info,
              src: 'info',
          },
          {
              text: lpg.slotType,
              src: 'slottype',
              width: 160,
              render: function (v) { return slotType[v]; },
          },
          {
              text: lpg.process,
              src: 'id',
              width: 120,
              render: function (id, index, row) {
                  return "<button data-id=\"" + id + "\" data-index=\"" + row[':index'] + "\" class=\"btn-mini btn-info\">" + lpg.edit + "</button> \n\t\t\t\t<button data-id=\"" + id + "\" class=\"btn-mini btn-danger\">" + lpg.del + "</button> ";
              },
          },
      ],
      pagination: false,
  });
  //edit
  tbTime.tbody.on('click', '.btn-info', function () {
      var btn = $(this), index = btn.data('index');
      var item = tbTime.data[index];
      console.log(item);
      new TimeModifier_1.default(tbTime, item);
  });
  //delete
  tbTime.tbody.on('click', '.btn-danger', function () {
      var _this = this;
      opg_ts_1.default.confirm(lpg.slotDeleteTip + "?", function () {
          var btn = $(_this), id = btn.data('id');
          opg_ts_1.default.api.delTimeSlot({ id: id }, function () {
              tbTime.update();
          });
      });
  });
  //Add
  $('#btnAdd').click(function () {
      new TimeModifier_1.default(tbTime);
  });
  //# sourceMappingURL=/itb-dist/pc/pages/system/timeSlot/index.js.map?__=
  

});
