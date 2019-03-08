define('pages/itb/exhibitors/list.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  api_1.api({
      product: 'product/GetProductGroup',
      region: 'country/GetAllContinent',
      segment: 'product/GetProductTypes',
  });
  var by = utils_1.request['by'];
  var mytext = utils_1.request['text'];
  if (mytext != undefined && mytext != "") {
      $("#mytext").html('> ' + mytext);
  }
  template.defaults.imports.mytextobj = mytext;
  var lpg = Languages_1.Languages.package;
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  if (by === 'product') {
      api_1.api.product(function (data) {
          makeProduct(data);
      });
  }
  else if (by === 'region') {
      api_1.api.region(function (data) {
          makeRegion(data);
      });
  }
  else if (by === 'segment') {
      api_1.api.segment(function (data) {
          data.lng = Languages_1.Languages.current;
          data.by = by;
          data.request = utils_1.request;
          document.getElementById('ulBuyerList').innerHTML = template('tpl', data);
      });
  }
  function makeProduct(arr) {
      var data = {};
      var key = 'group_' + Languages_1.Languages.current;
      for (var i = 0, l = arr.length, obj = void 0; i < l, obj = arr[i]; i++) {
          var x = ~~obj[key].substring(0, obj[key].indexOf('.'));
          if (!data[x]) {
              data[x] = [];
          }
          obj.label = obj[key];
          data[x].push(obj);
      }
      data.request = utils_1.request;
      document.getElementById('divRegionList').innerHTML = template('tpl-products', data);
  }
  function makeRegion(arr) {
      var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var list = {};
      var data;
      if (Languages_1.Languages.current === 'en') {
          var fieldName_1 = 'chau_en';
          data = utils_1.array.sort(arr, fieldName_1, function (a, b) {
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
          data = utils_1.array.sort(arr, fieldName_2, function (a, b) {
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
      list.request = utils_1.request;
      document.getElementById('divRegionList').innerHTML = template('tpl-regions', list);
  }
  function isGroup(pd) {
      if (pd.indexOf(".0") > -1) {
          return 'true';
      }
      else
          return 'false';
  }
  template.defaults.imports.isGroup = isGroup;
  document.getElementById('btnSearch').addEventListener('click', function (evt) {
      var val = document.getElementById('iptKeyword').value;
      if (val) {
          location.href = './exh3.html?by=search' + (utils_1.request['from'] ? '&from=' + utils_1.request['from'] : '') + (utils_1.request['info'] ? '&info=' + utils_1.request['info'] : '') + '&keyword=' + val;
      }
  }, false);
  $("#iptKeyword").attr('placeholder', lpg.searchtips);
  //# sourceMappingURL=/itb-dist/pc/pages/itb/exhibitors/list.js.map?__=1552033897847
  

});
