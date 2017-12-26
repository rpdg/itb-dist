define('pages/content/activity/edit.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var store_1 = require("ts/util/store.ts");
  var utils_1 = require("ts/util/utils.ts");
  var cache = store_1.Cache.getInstance();
  var row = cache.get('row');
  console.log(row);
  var lpg = Languages_1.Languages.package;
  console.log('Languages:', Languages_1.Languages);
  opg_1.default.api({
      'addMain!post': 'activity/AddInfomationSubject',
      'updateMain!post': 'activity/UpActivitySubject',
      getSubjects: 'activity/GetActivityContentsByActivityId',
      delSubject: 'activity/DelActivityContentById',
  });
  var ID;
  var subjectPage = '/itb-dist/pc/pages/content/activity/subject.html?__=';
  jQuery.datetimepicker.setLocale(Languages_1.Languages.current);
  $('#beginDate,#endDate').each(function (i, elem) {
      $(elem).datetimepicker({
          //timepicker: false,
          //closeOnDateSelect: true,
          format: 'Y-m-d H:i:00',
          step: 10,
      });
  });
  var btnAddSubject = $('#btnAddSubject');
  var $tbMain = $('#tbMain');
  var tbSubjects = opg_1.default('#tbSubjects').table({
      api: opg_1.default.api.getSubjects,
      lazy: true,
      titleBar: {
          title: lpg.subjectsList,
      },
      columns: [
          {
              text: lpg.topic,
              src: 'title',
          },
          {
              text: lpg.time, width: 120,
              src: 'time',
          },
          {
              text: lpg.process,
              src: 'id',
              width: 120,
              render: function (id, i, row) {
                  return "\n\t\t\t\t\t<button data-id=\"" + id + "\" data-index=\"" + row[':index'] + "\" class=\"btn-mini btn-info btnEdit\">" + lpg.edit + "</button> \n\t\t\t\t\t<button data-id=\"" + id + "\" class=\"btn-mini btn-danger btnDel\">" + lpg.del + "</button> \n\t\t\t\t\t";
              },
          },
      ],
  });
  //edit
  tbSubjects.tbody.on('click', '.btnEdit', function () {
      var btn = $(this), id = btn.data('id'), index = btn.data('index');
      var row = tbSubjects.data[index];
      row.enableStick = row.stick ? 1 : 0;
      cache.set('rowSub', row);
      var src = utils_1.url.setParam(subjectPage, { activityId: ID, subjectId: row.id });
      var pop = opg_1.default.popTop("<iframe src=\"" + src + "\" />", {
          title: lpg.edit + ": " + row.title,
          btnMax: true,
          width: 900,
          height: 600,
          onClose: function () {
              cache.remove('rowSub');
              tbSubjects.update();
          },
      });
  });
  //delete
  tbSubjects.tbody.on('click', '.btnDel', function () {
      var btn = $(this), id = btn.data('id');
      opg_1.default.confirm(lpg.subjectsDeleteConfirm, function () {
          opg_1.default.api.delSubject({ id: id }, function () {
              tbSubjects.update();
          });
      });
  });
  if (row) {
      ID = row.id;
      btnAddSubject.show();
      $tbMain.jsonToFields(row);
      tbSubjects.update({ id: ID });
  }
  $('#btnSaveMain').click(function () {
      var param = $tbMain.fieldsToJson({
          title: {
              name: Languages_1.Languages.package.title,
              type: 'ns',
              require: true,
          },
          publishbegindate: {
              name: Languages_1.Languages.package.publishTimeBegin,
              require: true,
          },
          publishenddate: {
              name: Languages_1.Languages.package.publishTimeEnd,
              require: true,
          },
      });
      if (param) {
          param.enableStick = param.enableStick ? 1 : 0;
          if (ID) {
              param.id = ID;
              param.stick = param.enableStick;
              opg_1.default.api.updateMain(param);
          }
          else {
              opg_1.default.api.addMain(param, function (data) {
                  ID = data;
                  btnAddSubject.show();
              });
          }
      }
  });
  btnAddSubject.click(function () {
      var src = utils_1.url.setParam(subjectPage, { activityId: ID });
      var pop = opg_1.default.popTop("<iframe src=\"" + src + "\" />", {
          title: "" + lpg.addSubject,
          width: 900,
          height: 600,
          btnMax: true,
          onClose: function () {
              tbSubjects.update();
          },
      });
  });
  //# sourceMappingURL=/itb-dist/pc/pages/content/activity/edit.js.map?__=
  

});
