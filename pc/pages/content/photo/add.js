define('pages/content/photo/add.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var lpg = Languages_1.Languages.package;
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      'upload!UPLOAD': 'upload/files',
      'addPhotos!post': 'photo/AddPhotos',
      'deleteFile!post': 'file/deltempfile',
      getAllTags: 'photo/GetAllPhotoTitles',
  });
  var typeId = ~~opg_ts_1.default.request['typeId'];
  var imgArr = [];
  var fileIpt = document.getElementById('files');
  var imgPanel = $('#panel');
  imgPanel.on('click', '.btn-danger', function () {
      var btn = $(this), fileName = btn.data('target');
      opg_ts_1.default.api.deleteFile({ fileName: fileName }, function () {
          btn.parent().remove();
          var index = -1;
          imgArr.forEach(function (photo, i) {
              if (photo.url.indexOf(fileName) > -1) {
                  index = i;
                  return true;
              }
          });
          imgArr.splice(index, 1);
          /*imgPanel.bindList({
              list: imgArr,
              template: '<div><img src="${downloadLink}"><button class="btn-mini btn-danger" data-target="${storageFileName}">'+lpg.del+'</button></div>',
          });*/
      });
  });
  $(fileIpt).on('change', function () {
      var files = fileIpt.files;
      if (files.length > 0) {
          var formData = new FormData();
          for (var i = 0; i < files.length; i++) {
              formData.append('file_' + i, files[i]);
          }
          opg_ts_1.default.api.upload(formData, function (data) {
              fileIpt.value = '';
              imgPanel.bindList({
                  list: data,
                  template: '<div><img src="${downloadLink}"><br><button class="btn-mini btn-danger" data-target="${storageFileName}">' + lpg.del + '</button></div>',
                  mode: 'append',
              });
              data.map(function (val, i) {
                  imgArr.push({
                      typeId: typeId,
                      url: val.downloadLink,
                  });
              });
          });
      }
  });
  var iptTitle = $('#title');
  opg_ts_1.default.api.getAllTags(function (data) {
      var tags = [];
      for (var key in data) {
          data[key].forEach(function (name, i) {
              tags.push({ name: name });
          });
      }
      var div = $('<div style="padding: 20px;"></div>');
      var chkTags = opg_ts_1.default(div).checkBox({
          data: tags,
          name: 'photoTags'
      });
      //console.log(div);
      $('#btnShowTags').click(function () {
          opg_ts_1.default.confirm(div, function () {
              var tagVal = iptTitle.val();
              var tagArr = tagVal.split(',');
              var chked = chkTags.getText();
              chked.map(function (name) {
                  if (tagArr.indexOf(name) === -1) {
                      tagArr.push(name);
                  }
              });
              if (tagArr[0] === '')
                  tagArr.splice(0, 1);
              iptTitle.val(tagArr.join(','));
          }, {});
      });
  });
  window['save'] = function (pop) {
      var tag = iptTitle.val();
      if (tag) {
          imgArr.forEach(function (img) {
              img.title = tag;
          });
      }
      opg_ts_1.default.api.addPhotos(imgArr, function () {
          pop.close();
      });
  };
  //# sourceMappingURL=/itb-dist/pc/pages/content/photo/add.js.map?__=1552033897847
  

});
