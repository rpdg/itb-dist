define('pages/exhibitors/list.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  var util_2 = require("js/util.ts");
  api_1.api({
      product: 'product/GetProductGroup',
      //region: 'country/GetAllCountry',
      region: 'country/GetAllContinent',
      segment: 'product/GetProductTypes',
  });
  var by = util_1.request['by'];
  var mytext = util_1.request['text'];
  if (mytext != undefined && mytext != "") {
      $("#mytext").html('- ' + mytext);
  }
  template.defaults.imports.mytextobj = mytext;
  var lng = util_1.Languages.package;
  var clng = 'en';
  if (localStorage.getItem('lngPkg') != null || localStorage.getItem('lngPkg') != undefined) {
      var currentlng = localStorage.getItem('lngPkg');
      clng = currentlng.replace(/["""]/g, '');
  }
  if (by === 'product') {
      api_1.api.product(function (data) {
          data.lng = util_1.Languages.current;
          data.request = util_1.request;
          document.getElementById('ulBuyerList').innerHTML = template('tpl', data);
      });
  }
  else if (by === 'region') {
      api_1.api.region(function (data) {
          makeRegion(data);
      });
  }
  else if (by === 'segment') {
      api_1.api.segment(function (data) {
          data.lng = util_1.Languages.current;
          data.request = util_1.request;
          document.getElementById('ulBuyerList').innerHTML = template('tpl', data);
      });
  }
  function makeRegion(arr) {
      var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var list = {};
      var data;
      if (util_1.Languages.current === 'en') {
          var fieldName_1 = 'chau_en';
          data = util_2.array.sort(arr, fieldName_1, function (a, b) {
              var A = a[fieldName_1].toUpperCase(), B = b[fieldName_1].toUpperCase();
              return A === B ? 0 : A > B ? 1 : -1;
          });
          for (var i = 0, l = data.length; i < l; i++) {
              var it = data[i], f = it[fieldName_1].substr(0, 1).toUpperCase();
              if (!list[f]) {
                  if (alpha.indexOf(f) === -1)
                      f = '#';
                  list[f] = [];
              }
              it.label = it[fieldName_1];
              it.id = it.label;
              list[f].push(it);
          }
      }
      else {
          var fieldName_2 = 'chau_cn';
          data = util_2.array.sort(arr, fieldName_2, function (a, b) {
              var A = makePy(a[fieldName_2])[0].toUpperCase(), B = makePy(b[fieldName_2])[0].toUpperCase();
              return A === B ? 0 : A > B ? 1 : -1;
          });
          for (var i = 0, l = data.length; i < l; i++) {
              var it = data[i], f = makePy(it[fieldName_2])[0].substr(0, 1).toUpperCase();
              if (!list[f]) {
                  if (alpha.indexOf(f) === -1)
                      f = '#';
                  list[f] = [];
              }
              it.label = it[fieldName_2];
              it.id = it.label;
              list[f].push(it);
          }
      }
      list.request = util_1.request;
      document.getElementById('divBuyerList').innerHTML = template('tpl-regions', list);
  }
  function isGroup(pd) {
      if (pd.indexOf(".0") > -1) {
          return 'true';
      }
      else
          return 'false';
  }
  template.defaults.imports.isGroup = isGroup;
  document.getElementById('iptSearch').addEventListener('keypress', function (evt) {
      if (evt.keyCode === 13 && this.value) {
          //location.href = './exhibitors3.html?by=search' + (request['from']?'&from='+request['from']: '') + '&keyword=' + this.value;
          location.href = './exhibitors1.html?by=search' + (util_1.request['from'] ? '&from=' + util_1.request['from'] : '') + (util_1.request['info'] ? '&info=' + util_1.request['info'] : '') + '&keyword=' + this.value;
      }
  }, false);
  $("#iptSearch").attr('placeholder', lng.searchtips);
  $('#backurl').attr('href', 'old_exhibitors1.html');
  //# sourceMappingURL=/itb-dist/wap/pages/exhibitors/list.js.map?__=1552030651276
  

});
