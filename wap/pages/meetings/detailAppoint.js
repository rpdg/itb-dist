define('pages/meetings/detailAppoint.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  var util_2 = require("js/util.ts");
  api_1.api({
      deleteSchedule: 'schedule/DelScheduleById',
      'getExhibitionDetailByBarCode': 'exhibition/GetExhibitionDetailByBarCode',
      'getBuyerDetailByBarCode': 'buyer/GetBuyerDetailByBarCode',
      'getScheduleById': 'schedule/GetScheduleById',
      'getExhibitionDetailByBarCode': 'exhibition/GetExhibitionDetailByBarCode',
      'getBuyerDetailByBarCode': 'buyer/GetBuyerDetailByBarCode'
  });
  var lpg = util_2.Languages.package;
  var id = util_1.request['aid'];
  var obj = util_2.Store.get("Apt_" + id);
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  var scheduleId = obj.scheduleid;
  var curStage = util_2.Store.get('Stage');
  var act = util_2.Store.get('RoleName') === 'exhibition' ? 'exhibition' : 'buyer';
  template.defaults.imports.act = act;
  obj.lng = util_2.Languages.package;
  obj.title = obj.name;
  obj.role = act;
  if (act == 'buyer') {
      api_1.api.getExhibitionDetailByBarCode({ 'barcode': id }, function (data) {
          if (data.length > 0) {
              api_1.api.getScheduleById({ scheduleid: obj.scheduleid }, function (data2) {
                  if (data2.length > 0) {
                      obj.logourl = data[0].logourl;
                      obj.company = data[0].company;
                      obj.name = data[0].name;
                      obj.address = data2[0].focusonmeetinginfo_id == '0' ? data2[0].booth_no : data2[0].address + '  Seat Number(座位号): ' + data2[0].seatnumber;
                      obj.isShowDeleteBtn = (curStage == 'open diary');
                      obj.isShowSignBtn = (curStage == 'exhibition');
                  }
                  else {
                      obj.logourl = data[0].logourl;
                      obj.company = data[0].company;
                      obj.name = data[0].name;
                      obj.address = data[0].booth_no;
                      obj.isShowDeleteBtn = (curStage == 'open diary');
                      obj.isShowSignBtn = (curStage == 'exhibition');
                  }
                  document.getElementById('main').innerHTML = template('tpl', obj);
              });
          }
          else {
              mui.alert(lpg['tips2'], lpg['tipTitle'], lpg['okb']);
          }
      });
  }
  else if (act == 'exhibition') {
      api_1.api.getBuyerDetailByBarCode({ 'barcode': id }, function (data) {
          if (data.length > 0) {
              api_1.api.getScheduleById({ scheduleid: obj.scheduleid }, function (data2) {
                  if (data2.length > 0) {
                      obj.logourl = data[0].company_logo;
                      obj.company = data[0].company;
                      obj.name = data[0].name;
                      obj.address = data2[0].focusonmeetinginfo_id == '0' ? data2[0].booth_no : data2[0].address + '  Seat Number(座位号): ' + data2[0].seatnumber;
                      obj.isShowDeleteBtn = (curStage == 'open diary');
                      obj.isShowSignBtn = (curStage == 'exhibition');
                  }
                  else {
                      obj.logourl = data[0].company_logo;
                      obj.company = data[0].company;
                      obj.name = data[0].name;
                      obj.address = lpg['tempaddress'];
                      obj.isShowDeleteBtn = (curStage == 'open diary');
                      obj.isShowSignBtn = (curStage == 'exhibition');
                  }
                  document.getElementById('main').innerHTML = template('tpl', obj);
              });
          }
          else {
              mui.alert(lpg['tips2'], lpg['tipTitle'], lpg['okb']);
          }
      });
  }
  api_1.api.deleteSchedule.set('onError', function (code, error, callback) {
      if (code === 200 && error === 'DelScheduleById_ERROR01') {
          var errorMsg = lpg['tips'];
          mui.alert("" + errorMsg, lpg['tipTitle'], lpg['okb']);
      }
  });
  $('#main').on('click', '.btnDelete', function () {
      api_1.api.deleteSchedule({ scheduleId: scheduleId }, function (data) {
          location.href = '../schedule/mine.html';
      });
  });
  $('#main').on('click', '.btnSign', function () {
      location.href = "../meetings/signin.html?from=schedule&typeCode=2&score=1000&isa=1&id=" + obj.scheduleid + "&end=" + obj.begindate.substr(11, 5) + "-" + obj.enddate.substr(11, 5);
  });
  $('#main').on('click', '.btnShowmask', function () {
      getInfoBybarcode(id);
  });
  $('#main').on('click', '.S3', function () {
      getInfoBybarcode(id);
  });
  var maskFlag = 1;
  function getInfoBybarcode(barcode) {
      var p = {};
      p.barcode = barcode;
      if (act == "buyer") {
          api_1.api.getExhibitionDetailByBarCode(p, function (data) {
              var renderDetail = template.compile(document.getElementById('tpl-detail').innerHTML);
              var it = data[0];
              it.clng = clng;
              it.lng = lpg;
              console.log(it);
              maskFlag = 1;
              showMask(renderDetail(it));
          });
      }
      else if (act == "exhibition") {
          api_1.api.getBuyerDetailByBarCode(p, function (data) {
              var renderDetail = template.compile(document.getElementById('tpl-detail').innerHTML);
              var it = data[0];
              it.clng = clng;
              it.lng = lpg;
              console.log(it);
              maskFlag = 1;
              showMask(renderDetail(it));
          });
      }
  }
  ;
  function showMask(htmlContent) {
      var mask = $("<div id=\"mymask\" class=\"mask\" style=\"background-color: rgba(0,0,0,0.6)\"></div>");
      mask.on('click', function () {
          if (maskFlag === 1) {
              mask.remove();
          }
      });
      mask.append(htmlContent);
      $('body').append(mask);
      return mask;
  }
  template.defaults.imports.locationsearch = location.search;
  //# sourceMappingURL=/itb-dist/wap/pages/meetings/detailAppoint.js.map?__=1552030651276
  

});
