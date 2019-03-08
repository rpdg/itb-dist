define('pages/itb/myScore/description.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var lpg = Languages_1.Languages.package;
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  var data1 = [{ 'title': '按时完成“买家感兴趣的参展商”配对选择', 'score': '3000分' }, { 'title': '准时出席ITB为买家与展商已预约的洽谈', 'score': '1000分/个' }, { 'title': '现场拜访更多参展商展位进行洽谈（非预约）', 'score': '500分/个' }, { 'title': '参加ITB指定的同期活动', 'score': '1000分/个' }];
  var data2 = [{ 'title': '尊享豪礼买家获得价值RMB 1500元的礼品', 'score': '12000分' }, { 'title': '全程接待买家获得往返上海参会的差旅报销', 'score': '21000分' }];
  var data3 = [{ 'title': '获得星巴克咖啡券，价值RMB 100元', 'score': '24000分' }, { 'title': '获得星巴克咖啡券，价值RMB 200元', 'score': '27000分' }, { 'title': '获得三亚金都蔚景温德姆酒店免费住房券3晚', 'score': '积分最高的第6-12名' }, { 'title': '大奖：获得ITB Berlin 2019机酒接待免费参观。主办方承担国内往返柏林的国际机票（经济舱），柏林当地的3晚住宿，ITB BERLIN的入场券等。', 'score': '积分最高的第1-5名' }];
  var tb = opg_ts_1.default('#tb').table({
      data: data1,
      titleBar: {
          title: "" + lpg.list
      },
      columns: [
          {
              text: "" + lpg.th1, width: 400,
              src: 'title'
          },
          {
              text: "" + lpg.th2, width: 200,
              src: 'score'
          }
      ],
      pagination: false
  });
  var tb = opg_ts_1.default('#tb2').table({
      data: data2,
      titleBar: {
          title: "" + lpg.list2
      },
      columns: [
          {
              text: "" + lpg.th3, width: 400,
              src: 'title'
          },
          {
              text: "" + lpg.th2, width: 200,
              src: 'score'
          }
      ],
      pagination: false
  });
  var tb = opg_ts_1.default('#tb3').table({
      data: data3,
      titleBar: {
          title: "" + lpg.list2
      },
      columns: [
          {
              text: "" + lpg.th4, width: 400,
              src: 'title'
          },
          {
              text: "" + lpg.th2, width: 200,
              src: 'score'
          }
      ],
      pagination: false
  });
  setTimeout(function () {
      if (clng == "cn") {
          $("#descn").show();
      }
  }, 500);
  //# sourceMappingURL=/itb-dist/pc/pages/itb/myScore/description.js.map?__=1552033897847
  

});
