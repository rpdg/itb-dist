define('pages/system/integralMatch/QualifyDate.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var opg_1 = require("ts/opg.ts");
  api_1.api({
      queryQualifyDate: 'qualifydate/QueryQualifyDate',
      queryQualifyDateInfoByBarcode: 'qualifydate/QueryQualifyDateInfoByBarcode',
      'import!UPLOAD': 'qualifydate/import',
      delQualifyDateById: 'qualifydate/DelQualifyDateById',
      export: 'qualifydate/export'
  });
  var QualifyDate = /** @class */ (function () {
      function QualifyDate(lng) {
          window.importQualifyDate = function () {
              var fileIpt = document.getElementById('files');
              var files = fileIpt.files;
              if (files.length > 0) {
                  var formData = new FormData();
                  for (var i = 0; i < files.length; i++) {
                      formData.append('file_' + i, files[i]);
                  }
                  api_1.api.import(formData, function (data) {
                      fileIpt.value = '';
                      var msg = "" + lng.importmsg;
                      var ok = data.ok, error = data.error;
                      if (ok && ok.length) {
                          //msg += ok.join(',');
                      }
                      if (error && error.length) {
                          msg += error.join(',');
                      }
                      opg_1.default.ok(msg);
                      tb.update();
                  });
              }
          };
          opg_1.default.wrapPanel('#formQualifyDate', {
              title: "",
              btnSearchText: "" + lng.search,
              btnSearchClick: function () {
                  tb.update({
                      'barcode': barCode.jq.val(),
                      'keyword': name.jq.val(),
                      'sort': getDefaultSort()
                  });
              },
          }).addToFoot("<input type=\"file\" name=\"file\" id=\"files\" class=\"btn-export\"><button class=\"btn-primary btn-small btn-export\" onclick=\"window.importQualifyDate();\">" + lng.qualifyDateImport + "</button><a href=\"" + api_1.api.export + "\" target=\"_blank\" class=\"btn-export\">template</a>");
          var barCode = opg_1.default('#barcode4'), name = opg_1.default('#name4');
          var tb = opg_1.default('#tbQualifyDate').table({
              api: api_1.api.queryQualifyDate,
              param: {
                  'barcode': barCode.jq.val(),
                  'keyword': name.jq.val()
              },
              columns: [
                  {
                      text: "" + lng.barcode,
                      src: 'barcode',
                      width: 150,
                  },
                  {
                      text: "" + lng.name,
                      src: 'name',
                      width: 150,
                  },
                  {
                      text: "" + lng.company,
                      src: 'company',
                  },
                  {
                      text: "" + lng.rowcount,
                      src: 'rowcount',
                      width: 150,
                  },
                  {
                      text: lng.process,
                      src: 'id',
                      width: 120,
                      render: function (id, index, row) {
                          return "<button data-barcode=\"" + row.barcode + "\" data-index=\"" + row[':index'] + "\" class=\"btn-mini btn-info btnDetail\">" + lng.viewDetail + "</button>  ";
                      },
                  },
              ]
          });
          tb.tbody.on('click', '.btnDetail', function (e) {
              var $tb = $('<table></table>');
              var $divTb = $('<div style="height: 353px; overflow-x: hidden; overflow-y: auto;"></div>').append($tb);
              opg_1.default.popTop($divTb, {
                  title: lng.viewDetail,
                  width: 700,
                  height: 400
              });
              var tb = opg_1.default($tb).table({
                  api: api_1.api.queryQualifyDateInfoByBarcode,
                  param: {
                      barcode: e.target.getAttribute('data-barcode')
                  },
                  columns: [
                      {
                          text: "" + lng.barcode,
                          src: 'barcode',
                          width: 120,
                      },
                      {
                          text: "" + lng.beginDate,
                          src: 'begindate',
                      },
                      {
                          text: "" + lng.endDate,
                          src: 'enddate',
                      },
                      {
                          text: lng.process,
                          src: 'id',
                          width: 120,
                          render: function (id, index, row) {
                              return "<button data-id=\"" + row.id + "\" data-index=\"" + row[':index'] + "\" class=\"btn-mini btn-info btnDetail\">" + lng.delQualifyDate + "</button>  ";
                          },
                      }
                  ]
              });
              tb.tbody.on('click', '.btnDetail', function (e) {
                  var id = e.target.getAttribute('data-id');
                  api_1.api.delQualifyDateById({ id: id }, function (data) {
                      tb.update();
                  });
              });
          });
      }
      return QualifyDate;
  }());
  exports.default = QualifyDate;
  //# sourceMappingURL=/itb-dist/pc/pages/system/integralMatch/QualifyDate.js.map?__=1552033897847
  

});
