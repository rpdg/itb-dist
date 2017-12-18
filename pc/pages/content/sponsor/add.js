define('pages/content/sponsor/add.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var Combo_1 = require("ts/ui/Combo.ts");
  var lpg = Languages_1.Languages.package;
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      'addMain!post': 'Information/AddInfomationSubject',
      'upload!UPLOAD': 'upload/files',
  });
  var sponsorId;
  var subjectPage = '/itb-dist/pc/pages/content/sponsor/addSubject.html?__=';
  Combo_1.Combo.makeClearableInput($('#logoPicture'), $({}));
  var tdLogo = $('#td_logoPicture');
  $('.ipt-eraser', '#tdUploadLogo').on('click', function () {
      tdLogo.empty();
  });
  Combo_1.Combo.makeClearableInput($('#coverPicture'), $({}));
  var tdCover = $('#td_coverPicture');
  $('.ipt-eraser', '#tdUploadCover').on('click', function () {
      tdCover.empty();
  });
  var uploadForm = $("<form>\n\t\t\t\t\t\t<input name=\"file\" type=\"file\" accept=\"image/jpg,image/jpeg,image/png\">\n\t\t\t\t</form>");
  $('#btnUploadDialog1,#btnUploadDialog2').click(function () {
      var target = $(this).data('target');
      uploadForm[0].reset();
      var pop = top.opg.confirm(uploadForm, function () {
          var formData = new FormData(uploadForm[0]);
          opg_ts_1.default.api.upload(formData, function (data) {
              var iptCoverPicture = $("#" + target);
              iptCoverPicture.val(data[0].downloadLink);
              var tdCover = $("#td_" + target);
              tdCover.html("<img src=\"" + data[0].downloadLink + "\" style=\"max-height: 100px;\"/>");
              pop.close();
          });
          return true;
      }, {
          title: "" + lpg.upload,
          width: 200,
          height: 50,
          buttons: {
              ok: "" + lpg.upload,
              cancel: "" + lpg.cancel,
          },
      });
  });
  var tbMain = $('#tbMain');
  var ulSubjects = $('#ulSubjects');
  $('#btnSaveMain').click(function () {
      var param = tbMain.fieldsToJson({
          title: {
              name: lpg.sponsorTitle,
              type: 'ns',
              require: true,
          },
      });
      if (param) {
          param.informationType = 2;
          opg_ts_1.default.api.addMain(param, function (data) {
              sponsorId = data;
              $('input,button', tbMain).prop('disabled', true);
              $('#buttonSection').html("\n\t\t\t\t<button id=\"btnAddSubject\" class=\"btn-info\">" + lpg.addSubject + "</button>\n\t\t\t");
              $('#btnAddSubject').click(function () {
                  var pop = top.opg.confirm("<iframe src=\"" + subjectPage + "?id=" + sponsorId + "\" />", function (i, ifr) {
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
  //# sourceMappingURL=/itb-dist/pc/pages/content/sponsor/add.js.map?__=
  

});
