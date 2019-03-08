define('pages/system/integralMatch/ManualBuyerSchedule.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var opg_1 = require("ts/opg.ts");
  api_1.api({
      getExhibitionByBarCode: 'exhibition/getExhibitionByBarCode',
      'maunalAddBuyerSchedule!post': 'schedule/MaunalAddBuyerSchedule'
  });
  var ManualBuyerSchedule = /** @class */ (function () {
      function ManualBuyerSchedule(lng) {
          opg_1.default.wrapPanel('#formBuyerSchedule', {
              title: "",
              btnSearchText: "" + lng.calc,
              btnSearchClick: function () {
                  var param = $('#formBuyerSchedule').fieldsToJson();
                  if (param.barcode && param.name && exhibitions.length) {
                      var exhibitionsBarCode_1 = [];
                      exhibitions.forEach(function (item) {
                          exhibitionsBarCode_1.push(item.barcode);
                      });
                      api_1.api.maunalAddBuyerSchedule({
                          barcode: param.barcode,
                          addCount: param.name,
                          exhibitions: exhibitionsBarCode_1
                      }, function (data) {
                          opg_1.default.ok('ok');
                          $('#formBuyerSchedule').jsonToFields({
                              barcode: '', name: '', exBarcode: ''
                          });
                          exhibitions = [];
                          tb.update(exhibitions);
                      });
                  }
              }
          });
          var exhibitions = [];
          var exBarcode = opg_1.default('#exBarcode').jq;
          opg_1.default('#btnExBarCode').jq.on('click', function () {
              if (exBarcode.val()) {
                  var barcode = exBarcode.val();
                  api_1.api.getExhibitionByBarCode({ barcode: barcode }, function (data) {
                      if (data.length) {
                          data.forEach(function (item) {
                              var itemBarcode = item.barcode;
                              var flag = false;
                              for (var i = 0; i < exhibitions.length; i++) {
                                  var eItem = exhibitions[i];
                                  if (eItem.barcode == itemBarcode) {
                                      flag = true;
                                      break;
                                  }
                              }
                              if (!flag) {
                                  exhibitions.push(item);
                              }
                          });
                          tb.update(exhibitions);
                          $('#exBarcode').val('');
                      }
                  });
              }
          });
          var tb = opg_1.default('#tbExhibitions').table({
              data: exhibitions,
              columns: [
                  {
                      text: "" + lng.barcode,
                      src: 'barcode',
                      width: 100
                  },
                  {
                      text: "" + lng.name,
                      width: 100,
                      render: function (id, index, row) {
                          if (row.company_cn && row.company) {
                              return row.company_cn + "(" + row.company + ")";
                          }
                          else if (row.company) {
                              return row.company;
                          }
                          else {
                              return row.company_cn;
                          }
                      }
                  },
                  {
                      text: lng.process,
                      width: 250,
                      render: function (id, index, row) {
                          return "<button data-id=\"" + row.barcode + "\" data-index=\"" + row[':index'] + "\" class=\"btn-mini btn-danger btnDelete\">" + lng.delete + "</button> ";
                      }
                  }
              ]
          });
          tb.tbody.on('click', '.btnDelete', function (e) {
              var barcode = e.target.getAttribute('data-id');
              var deleteIndexs = [];
              exhibitions.forEach(function (item, index) {
                  var itemBarcode = item.barcode;
                  if (itemBarcode == barcode) {
                      deleteIndexs.push(index);
                  }
              });
              deleteIndexs.forEach(function (i) {
                  exhibitions.splice(i, 1);
              });
              tb.update(exhibitions);
          });
      }
      return ManualBuyerSchedule;
  }());
  exports.default = ManualBuyerSchedule;
  //# sourceMappingURL=/itb-dist/pc/pages/system/integralMatch/ManualBuyerSchedule.js.map?__=1552033897847
  

});
