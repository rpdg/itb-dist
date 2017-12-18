define('pages/content/notice/add.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var lpg = Languages_1.Languages.package;
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      'addMain!post': 'Information/AddInfomationSubject',
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
  var ulSubjects = $('#ulSubjects');
  $('#btnSaveMain').click(function () {
      var param = tbMain.fieldsToJson({
          title: {
              name: Languages_1.Languages.package.title,
              type: 'ns',
              require: true,
          },
      });
      if (param) {
          param.informationType = 1;
          param.enableStick = param.enableStick ? 1 : 0;
          opg_ts_1.default.api.addMain(param, function (data) {
              newsId = data;
              $('input,button', tbMain).prop('disabled', true);
              $('#buttonSection').html("\n\t\t\t\t<button id=\"btnAddSubject\" class=\"btn-info\">" + lpg.addSubject + "</button>\n\t\t\t");
              $('#btnAddSubject').click(function () {
                  var pop = top.opg.confirm("<iframe src=\"" + subjectPage + "?id=" + newsId + "\" />", function (i, ifr) {
                      ifr.doSave(pop, ulSubjects);
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
          });
      }
  });
  //# sourceMappingURL=/itb-dist/pc/pages/content/notice/add.js.map?__=
  

});
