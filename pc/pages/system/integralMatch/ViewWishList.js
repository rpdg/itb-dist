define('pages/system/integralMatch/ViewWishList.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var opg_1 = require("ts/opg.ts");
  api_1.api({
      searchBuyerWishListForBack: 'buyer/SearchBuyerWishListForBack',
      searchExhibitionWishListForBack: 'exhibition/SearchExhibitionWishListForBack',
      getBuyerChooseExhibitionWishListForBack: 'buyer/GetBuyerChooseExhibitionWishListForBack',
      exhibitionChooseWishListResultForBack: 'exhibition/ExhibitionChooseWishListResultForBack',
      exportBuyerWishList: 'buyer/ExportBuyerWishList',
      exportExhibitionWishList: 'exhibition/ExportExhibitionWishList',
      exportBuyerWishList2: 'buyer/ExportBuyerWishList2',
      exportExhibitionWishList2: 'exhibition/ExportExhibitionWishList2',
      buyerAutoSupplementWishList: 'buyer/AutoSupplementBuyerWishList',
      exhibitionAutoSupplementWishList: 'exhibition/AutoSupplementExhibitionWishList',
      getBuyerWishListForBackEnd: 'buyer/GetBuyerWishListForBackEnd',
      getExhibitionWishListForBackEnd: 'exhibition/GetExhibitionWishListForBackEnd',
      'manualSupplementBuyerWishList!post': 'buyer/ManualSupplementBuyerWishList',
      'manualSupplementExhibitionWishList!post': 'exhibition/ManualSupplementExhibitionWishList'
  });
  // api.exportBuyerWishList.set('timeOut',600000);
  // api.exportExhibitionWishList.set('timeOut',600000);
  var ViewWishList = /** @class */ (function () {
      function ViewWishList(lng) {
          window.exportWishList2 = function () {
              var params = {
                  'barcode': barCode.jq.val(),
                  'keyword': name.jq.val()
              };
              var downloadForm = $('#exportWishList');
              if (!downloadForm.length) {
                  downloadForm = $("<form id=\"exportWishList\" target=\"_blank\"><input type=\"hidden\" name=\"barcode\" value=\"\"><input type=\"hidden\" value=\"\" name=\"keyword\"></form>");
                  downloadForm.appendTo($('body'));
              }
              downloadForm.attr('action', selType.jq.val() == 0
                  ? api_1.api.exportBuyerWishList2.toString()
                  : api_1.api.exportExhibitionWishList2.toString());
              downloadForm.submit();
          };
          window.exportWishList = function () {
              var params = {
                  'barcode': barCode.jq.val(),
                  'keyword': name.jq.val()
              };
              var downloadForm = $('#exportWishList');
              if (!downloadForm.length) {
                  downloadForm = $("<form id=\"exportWishList\" target=\"_blank\"><input type=\"hidden\" name=\"barcode\" value=\"\"><input type=\"hidden\" value=\"\" name=\"keyword\"></form>");
                  downloadForm.appendTo($('body'));
              }
              downloadForm.attr('action', selType.jq.val() == 0
                  ? api_1.api.exportBuyerWishList.toString()
                  : api_1.api.exportExhibitionWishList.toString());
              downloadForm.submit();
          };
          opg_1.default.wrapPanel('#formWishlist', {
              title: "",
              btnSearchText: "" + lng.search,
              btnSearchClick: function () {
                  //let param = $('#formWishlist').fieldsToJson();
                  setApiUrl();
                  tb['_api'] = apiUri;
                  tb.update({
                      'barcode': barCode.jq.val(),
                      'keyword': name.jq.val(),
                      'sort': getDefaultSort()
                  });
              },
          }).addToFoot("<button class=\"btn-primary btn-small btn-export\" onclick=\"window.exportWishList();\">" + lng.wishListExport + "</button>"
              + ("<button class=\"btn-primary btn-small btn-export\" onclick=\"window.exportWishList2();\">" + lng.wishListExport2 + "</button>"));
          var barCode = opg_1.default('#barcode'), name = opg_1.default('#name');
          var selType = opg_1.default('#type');
          var apiUri;
          var setApiUrl = function () {
              if (selType.jq.val() == 0) {
                  apiUri = api_1.api.searchBuyerWishListForBack;
              }
              else if (selType.jq.val() == 1) {
                  apiUri = api_1.api.searchExhibitionWishListForBack;
              }
          };
          setApiUrl();
          var ascSort = true;
          var getDefaultSort = function () {
              return ascSort ? 0 : 1;
          };
          var tb = opg_1.default('#tbWishlist').table({
              api: apiUri,
              param: {
                  'barcode': barCode.jq.val(),
                  'keyword': name.jq.val(),
                  'sort': getDefaultSort()
              },
              columns: [
                  {
                      text: "" + lng.barcode,
                      src: 'barcode',
                      width: 100,
                  },
                  {
                      text: "" + lng.btype,
                      src: 'type',
                      width: 100,
                  },
                  {
                      text: "" + lng.name,
                      src: 'name',
                      width: 100,
                  },
                  {
                      text: "" + lng.email,
                      src: 'email',
                      width: 100,
                  },
                  {
                      text: "" + lng.company,
                      src: 'company',
                      width: 100
                  },
                  {
                      text: "" + lng.targetMM,
                      width: 100,
                      render: function (id, index, row) {
                          return row.max + "/" + row.min;
                      }
                  },
                  {
                      text: "" + lng.currency,
                      src: 'selected',
                      width: 80
                  },
                  {
                      text: "" + lng.mainexhibitorcode,
                      src: 'mainexhibitorcode',
                      width: 100
                  },
                  {
                      text: "" + lng.mainexhibitonname,
                      src: 'mainexhibitonname',
                      width: 100
                  },
                  {
                      text: "" + lng.assignsales,
                      src: 'assignsales',
                      width: 80
                  },
                  {
                      text: lng.process,
                      src: 'id',
                      width: 250,
                      render: function (id, index, row) {
                          return "<button data-id=\"" + row.barcode + "\" data-index=\"" + row[':index'] + "\" class=\"btn-mini btn-info btnDetail\">" + lng.viewDetail + "</button> \n\t\t\t\t\t\t\t<button data-id=\"" + row.barcode + "\" data-index=\"" + row[':index'] + "\" class=\"btn-mini btn-danger btnAuto\">" + lng.autoComplete + "</button> \n\t\t\t\t\t\t\t<button data-id=\"" + row.barcode + "\" data-index=\"" + row[':index'] + "\" class=\"btn-mini btn-success btnManu\">" + lng.manuComplete + "</button> ";
                      },
                  },
              ]
          });
          tb.thead.find('th').eq(6).addClass('th-asc').on('click', function () {
              if (ascSort) {
                  $(this).removeClass('th-asc').addClass('th-desc');
              }
              else {
                  $(this).removeClass('th-desc').addClass('th-asc');
              }
              ascSort = !ascSort;
              tb.update({
                  'sort': getDefaultSort()
              });
          });
          tb.tbody.on('click', '.btnDetail', function (e) {
              var $tb = $('<table></table>');
              var $divTb = $('<div style="height: 353px; overflow-x: hidden; overflow-y: auto;"></div>').append($tb);
              opg_1.default.popTop($divTb, {
                  title: lng.viewDetail,
                  width: 500,
                  height: 400
              });
              var apiUriInfo;
              if (selType.jq.val() == 0) {
                  apiUriInfo = api_1.api.getBuyerChooseExhibitionWishListForBack;
              }
              else if (selType.jq.val() == 1) {
                  apiUriInfo = api_1.api.exhibitionChooseWishListResultForBack;
              }
              var tb = opg_1.default($tb).table({
                  api: apiUriInfo,
                  param: {
                      barcode: e.target.getAttribute('data-id')
                  },
                  columns: [
                      {
                          text: "" + lng.barcode,
                          src: 'barcode',
                          width: 120,
                      },
                      {
                          text: "" + lng.name,
                          src: 'name',
                          width: 120,
                      },
                      {
                          text: "" + lng.company,
                          src: 'company',
                      }
                  ]
              });
          });
          tb.tbody.on('click', '.btnManu', function (e) {
              var rowData = tb.data[e.target.getAttribute('data-index')];
              var apiWishListUri;
              var apiManualSupplementUri;
              if (selType.jq.val() == 0) {
                  apiWishListUri = api_1.api.getBuyerWishListForBackEnd;
                  apiManualSupplementUri = api_1.api.manualSupplementBuyerWishList;
              }
              else if (selType.jq.val() == 1) {
                  apiWishListUri = api_1.api.getExhibitionWishListForBackEnd;
                  apiManualSupplementUri = api_1.api.manualSupplementExhibitionWishList;
              }
              var $tb = $('<table></table>');
              var $divTb = $('<div style="height: 353px; overflow-x: hidden; overflow-y: auto;"></div>').append($tb);
              var pop = opg_1.default.popTop($divTb, {
                  title: lng.manuComplete,
                  width: 500,
                  height: 400,
                  buttons: {
                      ok: {
                          text: lng.ok,
                          className: 'btn-success',
                          onClick: function () {
                              //pop.close();
                              apiManualSupplementUri({
                                  barcode: rowData.barcode,
                                  barcodes: tb1.getCheckedValue().join(",")
                              }, function (data) {
                                  tb.update();
                                  pop.close();
                              });
                              return true;
                          }
                      },
                      cancel: lng.cancel,
                  }
              });
              var tb1 = opg_1.default($tb).table({
                  api: apiWishListUri,
                  param: {
                      barcode: e.target.getAttribute('data-id')
                  },
                  columns: [
                      {
                          src: 'barcode',
                          cmd: 'checkAll',
                      },
                      {
                          text: "" + lng.barcode,
                          src: 'barcode',
                          width: 120,
                      },
                      {
                          text: "" + lng.company,
                          src: 'company',
                          width: 120,
                      },
                      {
                          text: "" + lng.country,
                          src: 'countryname',
                          width: 200,
                      },
                  ]
              });
          });
          tb.tbody.on('click', '.btnAuto', function (e) {
              var rowData = tb.data[e.target.getAttribute('data-index')];
              var apiAutoSupplementUri;
              if (selType.jq.val() == 0) {
                  apiAutoSupplementUri = api_1.api.buyerAutoSupplementWishList;
              }
              else if (selType.jq.val() == 1) {
                  apiAutoSupplementUri = api_1.api.exhibitionAutoSupplementWishList;
              }
              apiAutoSupplementUri({
                  barcode: rowData.barcode,
                  maxSelect: rowData.max,
                  minSelect: rowData.min,
                  selected: rowData.selected
              }, function (data) {
                  tb.update();
              });
          });
      }
      return ViewWishList;
  }());
  exports.default = ViewWishList;
  //# sourceMappingURL=/itb-dist/pc/pages/system/integralMatch/ViewWishList.js.map?__=1552033897847
  

});
