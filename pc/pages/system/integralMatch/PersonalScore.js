define('pages/system/integralMatch/PersonalScore.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var opg_1 = require("ts/opg.ts");
  api_1.api({
      buyerScores: 'buyer/BuyerScores',
      buyerScoreListByUserIdAndBarCode: 'buyer/BuyerScoreListByUserIdAndBarCode'
  });
  var PersonalScore = /** @class */ (function () {
      function PersonalScore(lng) {
          opg_1.default.wrapPanel('#formScore', {
              title: "",
              btnSearchText: "" + lng.search,
              btnSearchClick: function () {
                  tb.update({
                      'barcode': barCode.jq.val(),
                      'keyword': name.jq.val()
                  });
              },
          });
          var barCode = opg_1.default('#barcode3'), name = opg_1.default('#name3');
          var tb = opg_1.default('#tbScore').table({
              api: api_1.api.buyerScores,
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
                      text: "" + lng.score,
                      src: 'score',
                      width: 150,
                  },
                  {
                      text: lng.process,
                      src: 'id',
                      width: 120,
                      render: function (id, index, row) {
                          return "<button data-id=\"" + row.userId + "\" data-barcode=\"" + row.barcode + "\" data-index=\"" + row[':index'] + "\" class=\"btn-mini btn-info btnDetail\">" + lng.viewDetail + "</button>  ";
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
                  api: api_1.api.buyerScoreListByUserIdAndBarCode,
                  param: {
                      userId: e.target.getAttribute('data-id'),
                      barcode: e.target.getAttribute('data-barcode')
                  },
                  columns: [
                      {
                          text: "" + lng.name,
                          src: 'title',
                          width: 120,
                      },
                      {
                          text: "" + lng.score,
                          src: 'score',
                          width: 120,
                      },
                      {
                          text: "" + lng.event,
                          src: 'type',
                          width: 460,
                          render: function (id, index, row) {
                              if (row.type == 0) {
                                  return "" + lng.scoreType;
                              }
                              else if (row.type == 1) {
                                  return "" + lng.scoreType1;
                              }
                          }
                      },
                  ]
              });
          });
      }
      return PersonalScore;
  }());
  exports.default = PersonalScore;
  //# sourceMappingURL=/itb-dist/pc/pages/system/integralMatch/PersonalScore.js.map?__=1552033897847
  

});
