define('pages/system/integralMatch/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var ViewWishList_1 = require("pages/system/integralMatch/ViewWishList.ts");
  var ViewSchedule_1 = require("pages/system/integralMatch/ViewSchedule.ts");
  var PersonalScore_1 = require("pages/system/integralMatch/PersonalScore.ts");
  var QualifyDate_1 = require("pages/system/integralMatch/QualifyDate.ts");
  var ManualBuyerSchedule_1 = require("pages/system/integralMatch/ManualBuyerSchedule.ts");
  var ManualExhibitionSchedule_1 = require("pages/system/integralMatch/ManualExhibitionSchedule.ts");
  var lng = Languages_1.Languages.package;
  opg_1.default('#mainTab').tabView({
      data: [
          { label: lng.tab1, view: '#d1' },
          { label: lng.tab2, view: '#d2' },
          { label: lng.tab3, view: '#d3' },
          { label: lng.tab4, view: '#d4' },
          { label: lng.tab5, view: '#d5' },
          { label: lng.tab6, view: '#d6' }
      ]
  });
  new ViewWishList_1.default(lng);
  new ViewSchedule_1.default(lng);
  new PersonalScore_1.default(lng);
  new QualifyDate_1.default(lng);
  new ManualBuyerSchedule_1.default(lng);
  new ManualExhibitionSchedule_1.default(lng);
  //# sourceMappingURL=/itb-dist/pc/pages/system/integralMatch/index.js.map?__=1552033897847
  

});
