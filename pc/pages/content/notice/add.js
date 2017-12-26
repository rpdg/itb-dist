define('pages/content/notice/add.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var store_1 = require("ts/util/store.ts");
  var utils_1 = require("ts/util/utils.ts");
  var cache = store_1.Cache.getInstance();
  var row = cache.get('row');
  console.log(row);
  var lpg = Languages_1.Languages.package;
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      'addMain!post': 'Information/AddInfomationSubject',
      'updateMain!post': 'Information/UpInfomationSubject',
      getSubjects: 'Information/InformationById',
      'upload!UPLOAD': 'upload/files',
  });
  var newsId;
  var subjectPage = '/itb-dist/pc/pages/content/notice/addSubject.html?__=';
  jQuery.datetimepicker.setLocale(Languages_1.Languages.current);
  $('#beginDate,#endDate').each(function (i, elem) {
      $(elem).datetimepicker({
          //timepicker: false,
          //closeOnDateSelect: true,
          format: 'Y-m-d H:i:00',
      });
  });
  var tbMain = $('#tbMain');
  var btnAddSubject = $('#btnAddSubject');
  var ulSubjects = $('#ulSubjects');
  if (row) {
      newsId = row.id;
      tbMain.jsonToFields(row);
      btnAddSubject.show();
      listSubjects();
  }
  function listSubjects() {
      opg_ts_1.default.api.getSubjects({ informationId: newsId }, function (data) {
          ulSubjects.bindList({
              list: data,
              template: '<li><button class="btn-mini btn-info btnEditSub" data-id="${id}">' + lpg.edit + '</button> <button class="btn-mini btn-danger btnDelSub" data-id="${id}">' + lpg.del + '</button><hr>${content}</li>',
          });
      });
  }
  //edit subjects
  ulSubjects.on('click', '.btnEditSub', function () {
      var btn = $(this), subId = btn.data('id');
      var src = utils_1.url.setParam(subjectPage, { id: newsId, subId: subId });
      var pop = top.opg.confirm("<iframe src=\"" + src + "\" />", function (i, ifr) {
          ifr.doSave(pop, listSubjects);
          return true;
      }, {
          title: "" + lpg.editSubject,
          width: 500,
          height: 450,
          buttons: {
              ok: "" + lpg.save,
              cancel: "" + lpg.cancel,
          },
      });
  });
  $('#btnSaveMain').click(function () {
      var param = tbMain.fieldsToJson({
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
          param.informationType = 1;
          param.enableStick = param.enableStick ? 1 : 0;
          if (newsId) {
              param.id = newsId;
              param.stick = param.enableStick;
              opg_ts_1.default.api.updateMain(param, function (data) {
              });
          }
          else {
              opg_ts_1.default.api.addMain(param, function (data) {
                  newsId = data;
                  //$('input,button', tbMain).prop('disabled', true);
                  btnAddSubject.show();
              });
          }
      }
  });
  btnAddSubject.click(function () {
      var src = utils_1.url.setParam(subjectPage, { id: newsId });
      var pop = top.opg.confirm("<iframe src=\"" + src + "\" />", function (i, ifr) {
          ifr.doSave(pop, listSubjects);
          return true;
      }, {
          title: "" + lpg.addSubject,
          width: 500,
          height: 450,
          buttons: {
              ok: "" + lpg.save,
              cancel: "" + lpg.cancel,
          },
      });
  });
  //# sourceMappingURL=/itb-dist/pc/pages/content/notice/add.js.map?__=
  

});
