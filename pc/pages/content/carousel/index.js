define('pages/content/carousel/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var store_1 = require("ts/util/store.ts");
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      getAll: 'canrousel/GetAllCanrouselNotLimit',
      getCount: 'canrousel/GetCurCanrouselCount',
      setCount: 'canrousel/SetCurCanrouselCount',
      delete: 'canrousel/DelCanrouselById',
      'position!post': 'canrousel/ChangeCanrouselPosition',
  });
  var lpg = Languages_1.Languages.package;
  var moduleName = lpg.carousel;
  var permission = store_1.store.get('permission');
  console.log('Permission:', permission);
  var tbButtons = [];
  if (permission) {
      if (permission['AddCarousel']) {
          tbButtons.push({ id: 'btnAdd', className: 'btn-create', html: "<i class=\"ico ico-create\"></i> " + lpg.add });
      }
      if (permission['CarouselSeeting']) {
          tbButtons.push({ id: 'btnSet', className: 'btn-warning', html: "<i class=\"ico ico-edit\"></i> " + lpg.set });
      }
  }
  var informationType = {
      0: 'news',
      1: 'announcement',
      2: 'sponsor',
  };
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.getAll,
      titleBar: {
          title: "" + moduleName + lpg.list,
          buttons: tbButtons,
      },
      columns: [
          {
              text: "" + lpg.serial, width: 120,
              src: 'cid',
          },
          {
              text: "" + lpg.newsTitle,
              src: 'title',
          },
          {
              text: "" + lpg.linkType,
              src: 'informationtype',
              width: 150,
              render: function (v) { return lpg[informationType[v]]; },
          },
          {
              text: "" + lpg.showIndex,
              src: 'cposition',
              width: 90,
          },
          {
              text: "" + lpg.linkBinding,
              src: 'informationtype',
              width: 120,
              render: function (v, i, row) { return lpg[informationType[v]] + ": " + row.id; },
          },
          {
              text: "" + lpg.process,
              src: 'cid',
              width: 200,
              render: function (val, i, row, keyName, arr) {
                  //console.log(arr);
                  return "\n\t\t\t\t\t\t<button class=\"btn-mini btn-info\" data-id=\"" + val + "\" data-index=\"" + row[':index'] + "\" \n\t\t\t\t\t\t        data-previd=\"" + (i > 0 ? arr[i - 1].cid : '') + "\"\n\t\t\t\t\t\t        data-nextid=\"" + (i < arr.length - 1 ? arr[i + 1].cid : '') + "\"\n\t\t\t\t\t\t\t\tdata-action=\"-1\" " + (row[':index'] === 0 ? 'disabled' : '') + ">" + lpg.up + "</button> \n\t\t\t\t\t\t<button class=\"btn-mini btn-info\" data-id=\"" + val + "\" data-index=\"" + row[':index'] + "\" \n\t\t\t\t\t\t        data-previd=\"" + (i > 0 ? arr[i - 1].cid : '') + "\"\n\t\t\t\t\t\t        data-nextid=\"" + (i < arr.length - 1 ? arr[i + 1].cid : '') + "\"\n\t\t\t\t\t\t\t\tdata-action=\"1\" " + (row[':rowNum'] === arr.length ? 'disabled' : '') + ">" + lpg.down + "</button> \n\t\t\t\t\t\t<button class=\"btn-mini btn-danger\" data-id=\"" + val + "\">" + lpg.del + "</button>\n\t\t\t\t";
              },
          },
      ],
      pagination: false,
  });
  //up/down
  tb.tbody.on('click', '.btn-info', function () {
      var btn = $(this), id = btn.data('id'), action = ~~btn.data('action'), swapId;
      var json = [];
      if (action === -1) {
          swapId = btn.data('previd');
          json.push({ id: id });
          json.push({ id: swapId });
      }
      else {
          swapId = btn.data('nextid');
          json.push({ id: swapId });
          json.push({ id: id });
      }
      //console.log(json);
      opg_ts_1.default.api.position(json, function () { return tb.update(); });
  });
  //del
  tb.tbody.on('click', '.btn-danger', function () {
      var btn = $(this), canrouselId = btn.data('id');
      opg_ts_1.default.danger("" + lpg.del + lpg.carousel + " [<b>" + canrouselId + "</b>] ? ", function () {
          opg_ts_1.default.api.delete({ canrouselId: canrouselId }, function () { return tb.update(); });
      }, {
          title: "" + lpg.please + lpg.confirm,
      });
  });
  var count = 0;
  opg_ts_1.default.api.getCount(function (data) {
      count = ~~data;
  });
  //set
  $('#btnSet').click(function () {
      var $elem = $("<input type=\"number\" style=\"width: 100%;\" value=\"" + count + "\">");
      var pop = top.opg.confirm($elem, function (i, ifr) {
          var c = ~~$elem.val();
          if (c && c != count) {
              opg_ts_1.default.api.setCount({ count: c }, function () {
                  count = c;
              });
          }
      }, {
          title: "" + lpg.carousel + lpg.count,
          buttons: {
              ok: "" + lpg.save,
              cancel: "" + lpg.cancel,
          },
      });
  });
  var infoPage = '/itb-dist/pc/pages/content/carousel/add.html?__=f3519e3';
  //Add
  $('#btnAdd').click(function () {
      var pop = top.opg.confirm("<iframe src=\"" + infoPage + "\" />", function (i, ifr) {
          return ifr.doSave(pop, tb);
      }, {
          title: "" + lpg.add + moduleName,
          btnMax: true,
          width: 600,
          height: 600,
          buttons: {
              ok: "" + lpg.save,
              cancel: "" + lpg.cancel,
          },
      });
  });
  //# sourceMappingURL=/itb-dist/pc/pages/content/carousel/index.js.map?__=
  

});
