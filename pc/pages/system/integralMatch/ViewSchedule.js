define('pages/system/integralMatch/ViewSchedule.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var opg_1 = require("ts/opg.ts");
  api_1.api({
      getBuyerScheduleForBack: 'schedule/GetBuyerScheduleForBack',
      getExhibitionScheduleForBack: 'schedule/GetExhibitionScheduleForBack',
      getBuyerSchedulesForBack: 'schedule/GetBuyerSchedulesForBack',
      getExhibitionSchedulesForBack: 'schedule/GetExhibitionSchedulesForBack',
      deleteScheduleById: 'schedule/DeleteScheduleById'
  });
  var ViewSchedule = /** @class */ (function () {
      function ViewSchedule(lng) {
          opg_1.default.wrapPanel('#formSchedule', {
              title: "",
              btnSearchText: "" + lng.search,
              btnSearchClick: function () {
                  //let param = $('#formWishlist').fieldsToJson();
                  setApiUrl();
                  tb['_api'] = apiUri;
                  tb.update({
                      'barcode': barCode.jq.val(),
                      'keyword': name.jq.val()
                  });
              },
          });
          var barCode = opg_1.default('#barcode2'), name = opg_1.default('#name2');
          var selType = opg_1.default('#type2');
          var apiUri;
          var setApiUrl = function () {
              if (selType.jq.val() == 0) {
                  apiUri = api_1.api.getBuyerScheduleForBack;
              }
              else if (selType.jq.val() == 1) {
                  apiUri = api_1.api.getExhibitionScheduleForBack;
              }
          };
          setApiUrl();
          var tb = opg_1.default('#tbSchedule').table({
              api: apiUri,
              param: {
                  'barcode': barCode.jq.val(),
                  'keyword': name.jq.val()
              },
              columns: [
                  {
                      text: "" + lng.barcode,
                      src: 'barcode',
                      width: 150,
                  },
                  {
                      text: "" + lng.name,
                      src: 'name',
                      width: 150,
                  },
                  {
                      text: "" + lng.company,
                      src: 'company',
                  },
                  {
                      text: "" + lng.matchTimes,
                      src: 'allcount',
                      width: 150,
                  },
                  {
                      text: "" + lng.status,
                      src: 'finished',
                      width: 150,
                  },
                  {
                      text: "" + lng.process,
                      src: 'id',
                      width: 120,
                      render: function (id, index, row) {
                          return "<button data-id=\"" + row.barcode + "\" data-index=\"" + row[':index'] + "\" class=\"btn-mini btn-info btnDetail\">" + lng.viewDetail + "</button>  ";
                      },
                  },
              ]
          });
          tb.tbody.on('click', '.btnDetail', function (e) {
              var $tb = $('<table></table>');
              var $divTb = $('<div style="height: 353px; overflow-x: hidden; overflow-y: auto;"></div>').append($tb);
              opg_1.default.popTop($divTb, {
                  title: lng.viewDetail,
                  width: 700,
                  height: 400
              });
              var apiUriInfo;
              if (selType.jq.val() == 0) {
                  apiUriInfo = api_1.api.getBuyerSchedulesForBack;
              }
              else if (selType.jq.val() == 1) {
                  apiUriInfo = api_1.api.getExhibitionSchedulesForBack;
              }
              var tb = opg_1.default($tb).table({
                  api: apiUriInfo,
                  param: {
                      barcode: e.target.getAttribute('data-id')
                  },
                  columns: [
                      {
                          text: "" + lng.name,
                          src: 'name',
                          width: 120,
                      },
                      {
                          text: "" + lng.company,
                          src: 'company',
                          width: 200,
                      },
                      {
                          text: "" + lng.time,
                          render: function (id, index, row) {
                              return row.begindate + " - " + row.enddate;
                          }
                      },
                      {
                          text: "" + lng.type,
                          render: function (id, index, row) {
                              return lng["sType" + row.type];
                          }
                      },
                      {
                          text: "" + lng.process,
                          render: function (id, index, row) {
                              return "<button data-id=\"" + row.scheduleid + "\" data-index=\"" + row[':index'] + "\" class=\"btn-mini btn-danger btnDelete\">" + lng.delete + "</button>  ";
                          }
                      },
                  ]
              });
              tb.tbody.on('click', '.btnDelete', function (e) {
                  var scheduleId = e.target.getAttribute('data-id');
                  top.opg.confirm(lng.askDeleteSchedule, function () {
                      api_1.api.deleteScheduleById({ scheduleId: scheduleId }, function () {
                          tb.update();
                      });
                  });
              });
          });
      }
      return ViewSchedule;
  }());
  exports.default = ViewSchedule;
  //# sourceMappingURL=/itb-dist/pc/pages/system/integralMatch/ViewSchedule.js.map?__=1552033897847
  

});
