define('pages/itb/schedule/schedule.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  var store_1 = require("ts/util/store.ts");
  api_1.api({
      getTime: 'system/GetExhibitionPublicData',
      mySchedule: 'user/GetCurUserActivitySchedule',
      getBusyDateByBarCode: 'userBusyDate/GetBusyDateByBarCode',
      buyerDating: 'schedule/GetBuyerSchedules',
      exhibitionDating: 'schedule/GetExhibitionSchedules',
  });
  var roleName = store_1.store.get('RoleName').toLowerCase();
  var role = roleName === 'exhibition' ? 'exhibition' : 'buyer';
  var stage = store_1.store.get('Stage');
  function makeSerial(startTime, endTime) {
      var st = startTime.split(':'), et = endTime.split(':');
      var arr = [];
      for (var i = parseInt(st[0], 10) + (st[1] == '30' ? 0.5 : 0), l = parseInt(et[0], 10) + (et[1] == '30' ? 0.5 : 0); i < l; i += 0.5) {
          var tick = '' + utils_1.string.padLeft(~~i, 2) + (i % 1 === 0 ? ':00' : ':30');
          var tick2 = '' + utils_1.string.padLeft(~~(i + 0.5), 2) + ((i + 0.5) % 1 === 0 ? ':00' : ':30');
          arr.push(tick + '-' + tick2);
      }
      return arr;
  }
  var fullObj = {
      lng: Languages_1.Languages.package,
      roleName: roleName,
      stage: stage,
      year: 2018,
      days: {},
      dayArr: [],
  };
  var scheduleData;
  var datingData;
  var busyDateData;
  var Schedule = /** @class */ (function () {
      function Schedule() {
      }
      Schedule.fetch = function (callback) {
          $.when(
          //全部时间列表
          api_1.api.getTime(function (timeData) {
              var startDate = new Date(Date.parse(timeData.beginDate));
              var endDate = new Date(Date.parse(timeData.endDate));
              var days = utils_1.dateTime.daySpan(startDate, endDate) + 1;
              fullObj.year = startDate.getFullYear();
              for (var a = 0, b = days; a < b; a++) {
                  var theDay = utils_1.dateTime.addDays(startDate, a);
                  var dayObj = {
                      date: theDay,
                      time: {},
                  };
                  fullObj.days[utils_1.format.date(theDay)] = dayObj;
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
              console.log(datingData);
          }), api_1.api.getBusyDateByBarCode(function (data) {
              busyDateData = data;
          }))
              .then(function () {
              Schedule.mergeBusyDateData(fullObj, busyDateData);
              Schedule.mergeAppointData(fullObj, datingData);
              Schedule.mergeScheduleData(fullObj, scheduleData);
              if (stage === 'open diary') {
                  var timeSlot_1;
                  if (!(roleName === 'visitor' && stage === 'open diary')) {
                      fullObj.dayArr.forEach(function (day) {
                          for (var timeCode in day.time) {
                              timeSlot_1 = day.time[timeCode];
                              if (!timeSlot_1.hasAppointment && !timeSlot_1.isBusy) {
                                  timeSlot_1.showAddTo = true;
                              }
                          }
                      });
                  }
                  else
                      timeSlot_1.showAddTo = false;
              }
              console.log(fullObj);
              callback(fullObj);
          });
      };
      //被占用时间段
      Schedule.mergeBusyDateData = function (fullObj, datingData) {
          if (datingData && datingData.length) {
              datingData.forEach(function (it, index) {
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
      };
      //面谈
      Schedule.mergeAppointData = function (fullObj, datingData) {
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
                      var fromTime = utils_1.convert.stringToDate(fromTimeStr);
                      var toTime = utils_1.convert.stringToDate(it.enddate);
                      var arrTimes_1 = [fromTime];
                      while (true) {
                          fromTime = utils_1.dateTime.addSeconds(fromTime, 30 * 60);
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
                              var time = utils_1.format.date(arrTimes_1[i - 1], 'HH:mm') + '-' + utils_1.format.date(date, 'HH:mm');
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
      };
      // 活动或会议 SCHDULE
      Schedule.mergeScheduleData = function (fullObj, scheduleData) {
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
      };
      return Schedule;
  }());
  exports.default = Schedule;
  //# sourceMappingURL=/itb-dist/pc/pages/itb/schedule/schedule.js.map?__=1552033897847
  

});
