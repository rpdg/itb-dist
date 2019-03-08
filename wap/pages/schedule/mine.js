define('pages/schedule/mine.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({
      getTime: 'system/GetExhibitionPublicData',
      mySchedule: 'user/GetCurUserActivitySchedule',
      buyerDating: 'schedule/GetBuyerSchedules',
      exhibitionDating: 'schedule/GetExhibitionSchedules',
      getBusyDateByBarCode: 'userBusyDate/GetBusyDateByBarCode',
  });
  template.defaults.imports.dateFormat = util_1.format.date;
  template.defaults.imports.parseInt = parseInt;
  template.defaults.imports.log = console.log;
  var roleName = util_1.Store.get('RoleName').toLowerCase();
  var role = roleName === 'exhibition' ? 'exhibition' : 'buyer';
  var stage = util_1.Store.get('Stage');
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
      roleName: roleName,
      stage: stage,
      year: 2018,
      dayArr: [],
      days: {},
  };
  var scheduleData;
  var datingData;
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
              time: {},
          };
          fullObj.days[util_1.format.date(theDay)] = dayObj;
          fullObj.dayArr.push(dayObj);
      }
      var lunchTime = timeData.publicDate[0].dateTimes[0].split('-');
      var unusableTimeArr = makeSerial(lunchTime[0], lunchTime[1]);
      var startTime = timeData.beginTime, endTime = timeData.endTime;
      //console.warn(unusableTimeArr);
      var timeSerial = makeSerial(startTime, endTime);
      var _loop_1 = function (d) {
          var alreadyAddedRestTime = false;
          var dayObj = fullObj.days[d];
          var canUse = true, willAdd = true;
          timeSerial.forEach(function (spanStr) {
              if (unusableTimeArr.indexOf(spanStr) > -1) {
                  if (alreadyAddedRestTime) {
                      willAdd = false;
                  }
                  else {
                      canUse = false;
                      alreadyAddedRestTime = true;
                  }
              }
              else {
                  canUse = true;
                  willAdd = true;
              }
              if (willAdd) {
                  dayObj.time[spanStr] = {
                      usable: canUse,
                      acts: [],
                  };
              }
          });
      };
      for (var d in fullObj.days) {
          _loop_1(d);
      }
  }), api_1.api.mySchedule(function (data) {
      scheduleData = data;
  }), api_1.api[role + "Dating"](function (data) {
      datingData = data;
  }), api_1.api.getBusyDateByBarCode(function (data) {
      busyDateData = data;
  }))
      .then(function () {
      mergeBusyDateData(fullObj, busyDateData);
      mergeAppointData(fullObj, datingData);
      mergeScheduleData(fullObj, scheduleData);
      // if(stage==='open diary' || stage==='pre-exhibiton' || stage==='exhibition') {
      if (stage === 'open diary') {
          if (!(roleName === 'visitor' && stage === 'open diary')) {
              fullObj.dayArr.forEach(function (day) {
                  for (var timeCode in day.time) {
                      var timeSlot = day.time[timeCode];
                      if (!timeSlot.hasAppointment && !timeSlot.isBusy) {
                          timeSlot.showAddTo = true;
                      }
                  }
              });
          }
      }
      console.log(fullObj);
      document.getElementById('divSec').innerHTML = template('tpl', fullObj);
      var role = util_1.Store.get('RoleName');
      $('#tbSchedule').on('click', '.mc', function () {
          location.href = '../meetings/detail.html' + this.getAttribute('data-search') + '&comepage=schedule';
      }).on('click', '.pt', function () {
          var keys = this.getAttribute('data-key').split('/');
          var obj = fullObj.dayArr[keys[0]].time[keys[1]].acts[keys[2]];
          //console.log(obj);
          util_1.Store.set("Apt_" + obj.barcode, obj);
          //console.log(this.getAttribute('data-aid'));
          location.href = '../meetings/detailAppoint.html?aid=' + obj.barcode;
      }).on('click', '.divAddTo', function (e) {
          var target;
          if (role === 'exhibition') {
              target = '/itb-dist/wap/pages/buyer/buyer1.html?__=1552030651276';
          }
          else {
              target = '/itb-dist/wap/pages/exhibitors/exhibitors1.html?__=1552030651276';
          }
          var curTimes = e.target.getAttribute('data-time').split('-');
          var beginDateTime = e.target.getAttribute('data-date') + ' ' + curTimes[0];
          var endDateTime = e.target.getAttribute('data-date') + ' ' + curTimes[1];
          //console.log(beginDateTime, endDateTime);
          util_1.Store.set('scheduleAddtoTime', beginDateTime + '|' + endDateTime);
          location.href = util_1.url.setParam(target, {
              from: 'schedule',
              info: beginDateTime + " ~ " + endDateTime
          });
      });
  });
  //被占用时间段
  function mergeBusyDateData(fullObj, busyDateData) {
      if (busyDateData && busyDateData.length) {
          busyDateData.forEach(function (it, index) {
              var //beginDate = convert.stringToDate(it.busybegindate),
              beginDateDay = it.busybegindate.substr(0, 10), beginTime = it.busybegindate.substr(11, 5), endTime = it.busyenddate.substr(11, 5), tarDay = fullObj.days[beginDateDay];
              //console.log(beginDateDay,beginTime,endTime);
              if (tarDay) {
                  var timeArr = makeSerial(beginTime, endTime);
                  timeArr.forEach(function (timecode) {
                      var timePart = tarDay.time[timecode];
                      if (timePart && timePart.usable) {
                          timePart.isBusy = true;
                          it.cantAdd = false;
                      }
                      else {
                          it.cantAdd = true;
                      }
                  });
                  if (it.cantAdd)
                      console.warn('BusyDate', it);
                  else
                      delete it.cantAdd;
              }
          });
      }
  }
  //面谈
  function mergeAppointData(fullObj, datingData) {
      if (datingData && datingData.length) {
          datingData.forEach(function (it, index) {
              var dateStr = it.begindate.split(' ')[0], tarDay = fullObj.days[dateStr];
              if (tarDay) {
                  var fromTimeStr = void 0;
                  if (it.begindate.substr(14, 2) == '15') {
                      fromTimeStr = it.begindate.substr(0, 14) + '00:00';
                  }
                  else if (it.begindate.substr(14, 2) == '45') {
                      fromTimeStr = it.begindate.substr(0, 14) + '30:00';
                  }
                  else {
                      fromTimeStr = it.begindate;
                  }
                  var fromTime = util_1.convert.stringToDate(fromTimeStr);
                  var toTime = util_1.convert.stringToDate(it.enddate);
                  var arrTimes_1 = [fromTime];
                  while (true) {
                      fromTime = util_1.dateTime.addSeconds(fromTime, 30 * 60);
                      arrTimes_1.push(fromTime);
                      if (fromTime.valueOf() >= toTime.valueOf()) {
                          break;
                      }
                  }
                  //console.log('arrTimes', arrTimes);
                  //
                  arrTimes_1.forEach(function (date, i) {
                      //
                      if (i > 0) {
                          //
                          var time = util_1.format.date(arrTimes_1[i - 1], 'HH:mm') + '-' + util_1.format.date(date, 'HH:mm');
                          //console.log('time', i, time);
                          var timePart = tarDay.time[time];
                          if (timePart && timePart.usable) {
                              it.isAppoint = true;
                              it.informationtype = 3;
                              it.activity_id = it.id;
                              it.accept = 1;
                              timePart.acts.push(it);
                              timePart.hasAppointment = true;
                              it.cantAdd = false;
                          }
                          else {
                              it.cantAdd = true;
                          }
                          if (it.cantAdd)
                              console.warn('AppointDate', it);
                          else
                              delete it.cantAdd;
                      }
                  });
              }
          });
      }
  }
  //活动或会议 SCHDULE
  function mergeScheduleData(fullObj, scheduleData) {
      if (scheduleData && scheduleData.length) {
          scheduleData.forEach(function (it, index) {
              var dateStr = it.begindate.split(' ')[0], tarDay = fullObj.days[dateStr];
              if (tarDay) {
                  var occupyTimes = it.occupytime.split(','); //10:30-11:00,15:30-16:00
                  occupyTimes.forEach(function (timeRange) {
                      timeRange = timeRange.replace(/ /g, '');
                      var timePart = tarDay.time[timeRange];
                      if (timePart && timePart.usable) {
                          timePart.hasActivity = true;
                          timePart.acts.push(it);
                          /*if (stage == 'open diary' || stage == 'pre-exhibiton' || stage == 'exhibition') {
                              tarDay.time[timeRange].acts.push({
                                  informationtype: 4
                              });
                          }*/
                          it.cantAdd = false;
                      }
                      else {
                          it.cantAdd = true;
                      }
                  });
                  if (it.cantAdd)
                      console.warn('ScheduleDate', it);
                  else
                      delete it.cantAdd;
              }
          });
      }
  }
  $('#btnExport').click(function () {
      // alert(Languages.package.exportResult);
  });
  //# sourceMappingURL=/itb-dist/wap/pages/schedule/mine.js.map?__=1552030651276
  

});
