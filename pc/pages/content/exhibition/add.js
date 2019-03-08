define('pages/content/exhibition/add.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var Combo_1 = require("ts/ui/Combo.ts");
  var utils_1 = require("ts/util/utils.ts");
  var store_1 = require("ts/util/store.ts");
  var lpg = Languages_1.Languages.package;
  console.log('Languages:', Languages_1.Languages);
  var cache = store_1.Cache.getInstance();
  var row = cache.get('row');
  console.log(row);
  var subjectPage = '/itb-dist/pc/pages/content/media/addSubject.html?__=ec0a71e';
  opg_ts_1.default.api({
      'addMain!post': 'mediaexhibtion/AddMediaExhibitonInfoSubject',
      'updateMain!post': 'mediaexhibtion/UpMediaExhibitonInfoSubject',
      getSubjects: 'mediaexhibtion/MediaExhibitionInfoById',
      delSubject: 'mediaexhibtion/DelMediaExhibitionCoontentById',
      'upload!UPLOAD': 'upload/files',
  });
  var categoryId = ~~opg_ts_1.default.request['categoryId'];
  var categoryData = cache.get('categoryData', []);
  console.log(categoryData);
  var selCategory = opg_ts_1.default('#mediaexhibitiontype_id').listBox({
      data: categoryData,
      autoPrependBlank: false,
  });
  var informationId;
  jQuery.datetimepicker.setLocale(Languages_1.Languages.current);
  $('#publishbegindate,#publishenddate').each(function (i, elem) {
      $(elem).datetimepicker({
          //timepicker: false,
          //closeOnDateSelect: true,
          format: 'Y-m-d H:i:00',
          step: 10
      });
  });
  var iptCoverPicture = $('#coverpicture');
  var tdCover = $('#tdCover');
  Combo_1.Combo.makeClearableInput(iptCoverPicture, $({}));
  $('.ipt-eraser', '#tdUpload').on('click', function () {
      //if(!this.value){
      tdCover.empty();
      //}
  });
  var uploadForm = $("<form>\n\t\t\t\t\t\t<input name=\"file\" type=\"file\" accept=\"image/jpg,image/jpeg,image/png\">\n\t\t\t\t</form>");
  $('#btnUploadDialog').click(function () {
      var pop = top.opg.confirm(uploadForm, function () {
          var formData = new FormData(uploadForm[0]);
          opg_ts_1.default.api.upload(formData, function (data) {
              iptCoverPicture.val(data[0].downloadLink);
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
  var ulSubjects = $('#ulSubjects');
  var tbMain = $('#tbMain');
  var btnAddSubject = $('#btnAddSubject');
  if (row) {
      informationId = row.id;
      tbMain.jsonToFields(row);
      btnAddSubject.show();
      listSubjects();
  }
  else {
      categoryData.forEach(function (v, i) {
          if (v.id === categoryId) {
              selCategory.selectedIndex = i;
          }
      });
  }
  function listSubjects() {
      opg_ts_1.default.api.getSubjects({ informationId: informationId }, function (data) {
          ulSubjects.bindList({
              list: data,
              template: '<li><button class="btn-mini btn-info btnEditSub" data-id="${id}">' + lpg.edit + '</button> <button class="btn-mini btn-danger btnDelSub" data-id="${id}">' + lpg.del + '</button><hr>${content}</li>'
          });
      });
  }
  //edit subjects
  ulSubjects.on('click', '.btnEditSub', function () {
      var btn = $(this), subId = btn.data('id');
      var src = utils_1.url.setParam(subjectPage, { id: informationId, subId: subId });
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
  //delete subjects
  ulSubjects.on('click', '.btnDelSub', function () {
      var btn = $(this), subId = btn.data('id');
      opg_ts_1.default.confirm(lpg.deleteConfirm, function () {
          opg_ts_1.default.api.delSubject({ id: subId }, function () {
              listSubjects();
          });
      });
  });
  $('#btnSaveMain').click(function () {
      var param = tbMain.fieldsToJson({
          title: {
              name: Languages_1.Languages.package.title,
              type: 'ns',
              require: true,
          },
      });
      if (param) {
          param.mediaExhibtionInfoTypeId = ~~categoryId;
          param.informationType = 1;
          param.enableStick = param.enableStick ? 1 : 0;
          //edit
          if (informationId) {
              param.id = informationId;
              param.stick = param.enableStick;
              opg_ts_1.default.api.updateMain(param, function (data) {
                  btnAddSubject.show();
              });
          }
          //add
          else {
              opg_ts_1.default.api.addMain(param, function (data) {
                  informationId = data;
                  //$('input,button', tbMain).prop('disabled', true);
                  btnAddSubject.show();
              });
          }
      }
  });
  btnAddSubject.click(function () {
      var src = utils_1.url.setParam(subjectPage, { id: informationId });
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
  //# sourceMappingURL=/itb-dist/pc/pages/content/exhibition/add.js.map?__=1552033897847
  

});
