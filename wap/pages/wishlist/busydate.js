define('pages/wishlist/busydate.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({
      getTime: 'system/GetExhibitionPublicData',
      getBusyDateByBarCode: 'userBusyDate/GetBusyDateByBarCode',
      delBusyDate: 'userBusyDate/DelBusyDate',
      'addBusyDate!post': 'userBusyDate/AddBusyDate'
  });
  template.defaults.imports.dateFormat = util_1.format.date;
  template.defaults.imports.parseInt = parseInt;
  template.defaults.imports.log = console.log;
  var lng = util_1.Store.get('lngPkg') === 'en' ? 'en' : 'cn';
  var lngpackage = util_1.Languages.package;
  template.defaults.imports.lng = lng;
  template.defaults.imports.lngpackage = lngpackage;
  var role = util_1.Store.get('RoleName') === 'exhibition' ? 'exhibition' : 'buyer';
  var nowdate = new Date;
  function makeSerial(startTime, endTime) {
      var st = startTime.split(':'), et = endTime.split(':');
      var arr = [];
      for (var i = parseInt(st[0], 10) + (st[1] == '30' ? 0.5 : 0), l = parseInt(et[0], 10) + (et[1] == '30' ? 0.5 : 0); i < l; i += 0.5) {
          var tick = '' + util_1.string.padLeft(~~i, 2) + (i % 1 === 0 ? ':00' : ':30');
          var tick2 = '' + util_1.string.padLeft(~~(i + 0.5), 2) + ((i + 0.5) % 1 === 0 ? ':00' : ':30');
          arr.push(tick + '-' + tick2);
      }
      return arr;
  }
  var fullObj = {
      lng: util_1.Languages.package,
      year: nowdate.getFullYear(),
      days: {},
      dayArr: [],
  };
  var busyDateData;
  $.when(api_1.api.getTime(function (timeData) {
      var startDate = new Date(Date.parse(timeData.beginDate));
      var endDate = new Date(Date.parse(timeData.endDate));
      var days = util_1.dateTime.daySpan(startDate, endDate) + 1;
      fullObj.year = startDate.getFullYear();
      for (var a = 0, b = days; a < b; a++) {
          var theDay = util_1.dateTime.addDays(startDate, a);
          var dayObj = {
              date: theDay,
              time: {
                  '09:30-12:00': {},
                  '13:00-15:00': {},
                  '15:00-17:30': {}
              },
          };
          fullObj.days[util_1.format.date(theDay)] = dayObj;
          fullObj.dayArr.push(dayObj);
      }
  }), api_1.api.getBusyDateByBarCode(function (data) {
      busyDateData = data;
  })).then(function () {
      if (busyDateData && busyDateData.length) {
          busyDateData.forEach(function (it, index) {
              var beginDate = util_1.convert.stringToDate(it.busybegindate), beginDateDay = util_1.format.date(beginDate), beginDateTime = util_1.format.date(beginDate, 'HH:mm'), tarDay = fullObj.days[beginDateDay];
              if (tarDay) {
                  var endDate = util_1.convert.stringToDate(it.busyenddate), endDateTime = util_1.format.date(endDate, 'HH:mm');
                  var key = beginDateTime + "-" + endDateTime;
                  if (tarDay.time[key]) {
                      tarDay.time[key].isBusy = true;
                      tarDay.time[key].busyId = it.id;
                  }
                  else {
                      tarDay.time[key].isBusy = false;
                      tarDay.time[key].busyId = '';
                  }
              }
          });
      }
      document.getElementById('divBusyDateList').innerHTML = template('tpl', fullObj);
      var switchDates = document.getElementsByClassName('switchDate');
      var _loop_1 = function (i) {
          var switchDate = switchDates[i];
          mui(switchDate).switch();
          switchDate.addEventListener("toggle", function (event) {
              var curObj = $(event.target), busyId = curObj.attr('busy-id');
              if (event.detail.isActive) {
                  var busyDate = curObj.attr('busy-date'), busyTimes = curObj.attr('busy-time').split('-');
                  api_1.api.addBusyDate.set('onError', function (code, error, callback) {
                      var errorMsg = error;
                      if (code === 200) {
                          if (error === 'Maximum on more the 3') {
                              errorMsg = util_1.Languages.package['addTipOne'];
                          }
                          else if (errorMsg === 'The date of disabling') {
                              errorMsg = util_1.Languages.package['addTipTwo'];
                          }
                      }
                      mui.alert("" + errorMsg, '', 'OK');
                      //debugger;
                      mui(switchDate).switch().toggle();
                  });
                  api_1.api.addBusyDate({
                      BusyBeginDate: busyDate + " " + busyTimes[0],
                      BusyEndDate: busyDate + " " + busyTimes[1]
                  }, function (data) {
                  });
              }
              else {
                  if (busyId) {
                      api_1.api.delBusyDate({ id: busyId }, function (data) {
                          //console.log("删除成功:", busyId);
                      });
                  }
              }
          });
      };
      for (var i = 0; i < switchDates.length; i++) {
          _loop_1(i);
      }
  });
  //
  //# sourceMappingURL=/itb-dist/wap/pages/wishlist/busydate.js.map?__=1552030651276
  

});
