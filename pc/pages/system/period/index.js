define('pages/system/period/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var store_1 = require("ts/util/store.ts");
  var app_cfg_1 = require("ts/app.cfg.ts");
  opg_ts_1.default.api({
      getInfo: 'system/GetSystemInfo',
      setYear: 'system/UpSystemInfoYear',
      getStage: 'system/GetSystemStage',
      setStage: 'system/EnableSystemStage',
      getLayout: 'system/GetSystemWebStage',
      setLayout: 'system/EnableSystemWebStage',
  });
  var lpg = Languages_1.Languages.package;
  //Year
  var formYear = $('#formYear');
  opg_ts_1.default.api.getInfo(function (data) { return formYear.jsonToFields(data); });
  opg_ts_1.default.wrapPanel(formYear, {
      title: "" + lpg.exhibitionYearSetting,
      btnSearchText: "" + lpg.save,
      btnSearchClick: function () {
          opg_ts_1.default.confirm(lpg.setYearTip, function () {
              var param = formYear.fieldsToJson();
              if (param) {
                  opg_ts_1.default.api.setYear(param, function () {
                      store_1.store.remove('Authorization');
                      top.window.location.href = app_cfg_1.default.loginPage;
                  });
              }
          });
      },
  });
  //Stage
  opg_ts_1.default.api.getStage(function (data) {
      var selectedIndex = -1;
      data.forEach(function (val, i) {
          if (val.enable === 1) {
              selectedIndex = i;
              return true;
          }
      });
      //alert(selectedIndex)
      var tdStage = opg_ts_1.default('#tdStage').radioBox({
          data: data,
          selectedIndex: selectedIndex,
      });
      opg_ts_1.default.wrapPanel(tdStage.jq, {
          title: "" + lpg.exhibitionStageSetting,
          btnSearchText: "" + lpg.save,
          btnSearchClick: function () {
              console.log(tdStage._items);
              opg_ts_1.default.api.setStage({ id: tdStage.getValue() });
          },
      });
  });
  //Layout
  opg_ts_1.default.api.getLayout(function (data) {
      var selectedIndex = -1;
      data.forEach(function (val, i) {
          if (val.enable === 1) {
              selectedIndex = i;
              return true;
          }
      });
      //alert(selectedIndex)
      var tdLayout = opg_ts_1.default('#tdLayout').radioBox({
          data: data,
          selectedIndex: selectedIndex,
      });
      opg_ts_1.default.wrapPanel(tdLayout.jq, {
          title: "" + lpg.exhibitionLayoutSetting,
          btnSearchText: "" + lpg.save,
          btnSearchClick: function () {
              console.log(tdLayout._items);
              opg_ts_1.default.api.setLayout({ id: tdLayout.getValue() });
          },
      });
  });
  //# sourceMappingURL=/itb-dist/pc/pages/system/period/index.js.map?__=1552033897847
  

});
