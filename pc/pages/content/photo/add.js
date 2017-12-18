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
  });
  var typeId = ~~opg_ts_1.default.request['typeId'];
  var imgArr = [];
  var fileIpt = document.getElementById('files');
  $('#btnUpload').click(function () {
      var files = fileIpt.files;
      if (files.length > 0) {
          var formData = new FormData();
          for (var i = 0; i < files.length; i++) {
              formData.append("file_" + i, files[i]);
          }
          opg_ts_1.default.api.upload(formData, function (data) {
              fileIpt.value = '';
              $('#panel').bindList({
                  list: data,
                  template: '<img src="${downloadLink}">',
                  mode: 'append'
              });
              data.map(function (val, i) {
                  imgArr.push({
                      typeId: typeId,
                      url: val.downloadLink
                  });
              });
          });
      }
  });
  window['save'] = function (pop) {
      var tag = $('#title').val();
      if (tag) {
          imgArr.forEach(function (img) {
              img.title = tag;
          });
      }
      opg_ts_1.default.api.addPhotos(imgArr, function () {
          pop.close();
      });
  };
  //# sourceMappingURL=/itb-dist/pc/pages/content/photo/add.js.map?__=
  

});
