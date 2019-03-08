define('pages/logistics/myTrip/manage.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  console.log('Languages:', Languages_1.Languages);
  opg_ts_1.default.api({
      'gettriplist!post': 'Operation/Gettriplist'
  });
  var lpg = Languages_1.Languages.package;
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  var panel = opg_ts_1.default.wrapPanel('#tbSearch', {
      title: "" + lpg.searchService,
      btnSearchText: "<i class=\"ico-find\"></i> " + lpg.search,
      btnSearchClick: function () {
          // let param=$("#tbSearch").fieldsToJson();
          // console.log(param);
          refreshtable();
      }
  });
  jQuery.datetimepicker.setLocale(Languages_1.Languages.current);
  $('#takeofftime,#landingtime,#arrivetime,#leavetime').each(function (i, elem) {
      $(elem).datetimepicker({
          timepicker: true,
          //closeOnDateSelect: true,
          format: 'Y-m-d H:m:s',
      });
  });
  // $("#btnSearch").click(function(){
  //     refreshtable();
  // });
  function refreshtable() {
      var xparam = $('#tbSearch').fieldsToJson();
      xparam.pageIndex = 0;
      xparam.currentlng = clng;
      tb.update(xparam);
  }
  //const permission = store.get('permission');
  var tbButtons = [];
  tbButtons.push({ id: 'btnImportData', className: 'btn-warning', html: "" + lpg.ImportData });
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.getservicelist,
      lazy: true,
      titleBar: {
          title: "" + lpg.list,
          buttons: tbButtons,
      },
      columns: [
          {
              text: "" + lpg.flightcompany, width: 100,
              src: 'flightcompany',
          },
          {
              text: "" + lpg.flightno, width: 100,
              src: 'flightno',
          },
          {
              text: "" + lpg.takeofftime, width: 100,
              src: 'takeofftime',
          },
          {
              text: "" + lpg.landingtime, width: 100,
              src: 'landingtime',
          },
          {
              text: "" + lpg.username, width: 100,
              src: 'username',
          },
          {
              text: "" + lpg.hotel, width: 100,
              src: 'hotel',
          },
          {
              text: "" + lpg.arrivetime, width: 100,
              src: 'arrivetime',
          },
          {
              text: "" + lpg.leavetime, width: 100,
              src: 'leavetime',
          }
      ],
      pagination: true,
  });
  //# sourceMappingURL=/itb-dist/pc/pages/logistics/myTrip/manage.js.map?__=1552033897847
  

});
