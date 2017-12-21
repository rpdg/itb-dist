define('pages/content/activity/subject.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  var UserManage_1 = require("pages/content/activity/UserManage.ts");
  var GuestManage_1 = require("pages/content/activity/GuestManage.ts");
  var store_1 = require("ts/util/store.ts");
  var activityId = ~~opg_1.default.request['activityId'];
  var subjectId = ~~opg_1.default.request['subjectId'];
  var cache = store_1.Cache.getInstance();
  var row = cache.get('rowSub');
  console.log(row);
  opg_1.default.api({
      'addSubjectMain!post': 'activity/AddActivityContent',
      'updateSubjectMain!post': 'activity/UpActivityContent',
  });
  var lng = Languages_1.Languages.package;
  var form = $('#tbMain');
  var panel = opg_1.default.wrapPanel(form, {
      title: "" + lng.subjectBody,
      btnSearchText: "<i class=\"ico-find\"></i> " + lng.save,
      btnSearchClick: function () {
          var param = form.fieldsToJson({
              title: {
                  name: lng.title,
                  require: true,
              },
              time0: {
                  name: lng.timeFrom,
                  require: true,
              },
              time1: {
                  name: lng.timeTo,
                  require: true,
              },
          });
          if (param) {
              param.activityId = activityId;
              param.occupyTime = param.occupyTime ? (param.occupyTime.join ? param.occupyTime.join(',') : param.occupyTime) : '';
              param.time = param.time0 + "-" + param.time1;
              delete param.time0;
              delete param.time1;
              if (subjectId) {
                  param.id = subjectId;
                  opg_1.default.api.updateSubjectMain(param, function () {
                      $.extend(row, param);
                      cache.set('rowSub', row);
                  });
              }
              else {
                  opg_1.default.api.addSubjectMain(param, function (data) {
                      subjectId = data;
                      param.id = subjectId;
                      $.extend(row, param);
                      cache.set('rowSub', row);
                      new GuestManage_1.default(subjectId);
                      new UserManage_1.default(subjectId);
                  });
              }
          }
      },
  });
  jQuery.datetimepicker.setLocale(Languages_1.Languages.current);
  $('#timeFrom,#timeTo').each(function (i, elem) {
      $(elem).datetimepicker({
          datepicker: false,
          //closeOnDateSelect: true,
          format: 'H:i',
          step: 10,
      });
  });
  var optArr = [];
  for (var i = 7, l = 20, s = 0, step = 30; i < l;) {
      var curH = utils_1.string.padLeft(i, 2);
      var curS = utils_1.string.padLeft(s, 2);
      s += step;
      var h = ~~(s / 60);
      if (h > 0) {
          i += h;
          s %= 60;
      }
      var nextH = utils_1.string.padLeft(i, 2);
      var nextS = utils_1.string.padLeft(s, 2);
      if (i < l) {
          var opt = curH + ":" + curS + "-" + nextH + ":" + nextS;
          //console.log(opt);
          optArr.push("<option value=\"" + opt + "\">" + opt + "</option>");
      }
  }
  var selOccupyTime = $('#occupyTime').html(optArr.join(''));
  if (subjectId) {
      var t = row.time ? row.time.split('-') : [];
      row.time0 = t[0];
      row.time1 = t[1];
      form.jsonToFields(row);
      var occ = row.occupytime ? row.occupytime.split(',') : [];
      var opts_1 = selOccupyTime.find('option');
      occ.map(function (v, i) {
          opts_1.each(function (j, elem) {
              var opt = elem;
              console.log(opt, v);
              if (opt.value === v) {
                  $(opt).prop('selected', true);
                  return true;
              }
          });
      });
      new GuestManage_1.default(subjectId);
      new UserManage_1.default(subjectId);
  }
  //# sourceMappingURL=/itb-dist/pc/pages/content/activity/subject.js.map?__=
  

});
