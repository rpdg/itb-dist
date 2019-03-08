define('pages/itb/exhibitors/exh3.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  var store_1 = require("ts/util/store.ts");
  var opg_1 = require("ts/opg.ts");
  api_1.api({
      product: 'exhibition/GetExhibitionByProduct',
      region: 'exhibition/GetExhibitionByContinent',
      segment: 'exhibition/GetExhibitionByGroup',
      choose: 'buyer/GetBuyerChooseExhibitions',
      all: 'exhibition/GetAllExhibtion',
      search: 'exhibition/SearchExhibitions',
      'sendScheduleMessage!post': 'message/SendScheduleMessage',
      'likeExhibtionForBuyerByBarCodeInList': 'buyer/LikeExhibtionForBuyerByBarCodeInList',
  });
  var lpg = Languages_1.Languages.package;
  var by = utils_1.request['by'];
  var scheduleAddtoTime = store_1.store.get('scheduleAddtoTime') == null ? '' : store_1.store.get('scheduleAddtoTime');
  var fromSchedule = utils_1.request['from'] === 'schedule';
  var wishListStage = store_1.store.get('Stage') === 'wishlist' && store_1.store.get('RoleName') == 'buyer' && by != 'choose';
  //console.log(fromSchedule);
  //console.log(wishListStage);
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  var mytext = utils_1.request['text'];
  if (mytext == undefined || mytext == "") {
      mytext = lpg.sr;
  }
  $("#mytext").html('> ' + mytext);
  var clng = 'en';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  api_1.api.likeExhibtionForBuyerByBarCodeInList.set('onError', function (code, error, callback) {
      if (code === 200 && error === 'LikeExhibtionForBuyerByBarCodeInList_Error01') {
          var errorMsg = lpg['tips3'];
          top.opg.confirm("" + errorMsg, function () {
          });
      }
  });
  api_1.api.sendScheduleMessage.set('onError', function (code, error, callback) {
      if (code === 200 && error === 'message_error05') {
          var errorMsg = lpg['tips4'];
          top.opg.confirm("" + errorMsg, function () {
          });
      }
  });
  switch (by) {
      case 'product':
          api_1.api.product({ product: utils_1.request['regionId'], scheduleAddtoTime: scheduleAddtoTime }, function (data) { return showData(data); });
          break;
      case 'choose':
          api_1.api.choose({ scheduleAddtoTime: scheduleAddtoTime }, function (data) { return showData(data); });
          $("#mytext2").html(lpg.tips5);
          break;
      case 'region':
          api_1.api.region({ continent: utils_1.request['regionId'], scheduleAddtoTime: scheduleAddtoTime }, function (data) { return showData(data); });
          break;
      case 'segment':
          api_1.api.segment({ group: utils_1.request['productId'], scheduleAddtoTime: scheduleAddtoTime }, function (data) { return showData(data); });
          break;
      case 'search':
          api_1.api.search({ keyword: utils_1.request['keyword'], scheduleAddtoTime: scheduleAddtoTime }, function (data) { return showData(data); });
          break;
      case 'all':
          api_1.api.all({ scheduleAddtoTime: scheduleAddtoTime }, function (data) { return showData(data); });
          break;
      default:
  }
  var pic = '/itb-dist/pc/pages/itb/exhibitors/assets/bge.jpg?__=a9cfb35';
  var noShow = {
      barcode: 1,
      company_logo: 1,
      logourl: 1,
  };
  var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var list = {};
  function showData(arr) {
      var data;
      if (Languages_1.Languages.current === 'en') {
          data = utils_1.array.sort(arr, 'company', function (a, b) {
              var A = a['company'].toUpperCase(), B = b['company'].toUpperCase();
              return A === B ? 0 : A > B ? 1 : -1;
          });
          for (var i = 0, l = data.length; i < l; i++) {
              var it = data[i], f = it['company'].substr(0, 1).toUpperCase();
              if (!list[f]) {
                  if (alpha.indexOf(f) === -1)
                      f = '#';
                  list[f] = [];
              }
              list[f].push(it);
          }
      }
      else {
          data = utils_1.array.sort(arr, 'company', function (a, b) {
              var A = makePy(a['company'])[0].toUpperCase(), B = makePy(b['company'])[0].toUpperCase();
              return A === B ? 0 : A > B ? 1 : -1;
          });
          for (var i = 0, l = data.length; i < l; i++) {
              var it = data[i], f = makePy(it['company'])[0].substr(0, 1).toUpperCase();
              if (!list[f]) {
                  if (alpha.indexOf(f) === -1)
                      f = '#';
                  list[f] = [];
              }
              list[f].push(it);
          }
      }
      var divList = $('#divList');
      for (var key in list) {
          divList.append("<h1> " + key + "</h1>");
          var ul = $("<ul class=\"ulList\"></ul>");
          ul.bindList({
              list: list[key],
              template: '<li data-index="${:index}" data-key="' + key + '" style="${appointment_total:=handStyle}"><div class="imgHold" style="background-image: url(${company_logo:=gLogo})"></div> ${company}</li>',
              itemRender: {
                  gLogo: function (company_logo, i, row) {
                      var x = filterRegistrationLogoUrl(company_logo) || filterRegistrationLogoUrl(row.logourl) || 'assets/no-logo.png';
                      return "'" + x + "'";
                  },
                  handStyle: function (appointment_total, i, row) {
                      if (appointment_total > 0)
                          return "background: url(assets/hand.png) no-repeat 2px 2px;";
                      else
                          return "background-color:#fff";
                  }
              },
          });
          divList.append(ul);
      }
      divList.on('click', 'li', function () {
          var item = list[this.getAttribute('data-key')][this.getAttribute('data-index')];
          var ppic = filterRegistrationLogoUrl(item.company_logo);
          var ppic2 = filterRegistrationLogoUrl(item.logourl);
          var toBarCode = item.barcode;
          var html = '';
          if (ppic != "" && ppic != undefined && ppic != null)
              html += "<img onerror=\"src='../../pages/itb/exhibitors/assets/bge.jpg'\" src=\"" + ppic + "\" style=\"width: auto;height: 154px;display: block;margin: 20px auto;\"><div style=\"padding:20px; height: 300px; overflow: auto\">";
          else if (ppic2 != "" && ppic2 != undefined && ppic2 != null)
              html += "<img onerror=\"src='../../pages/itb/exhibitors/assets/bge.jpg'\" src=\"" + ppic2 + "\" style=\"width: auto;height: 154px;display: block;margin: 20px auto;\"><div style=\"padding:20px; height: 300px; overflow: auto\">";
          else
              html += "<img src=\"../../pages/itb/exhibitors/assets/bge.jpg\" style=\"width: 200px;height: 154px;display: block;margin: 20px auto;\">\n\t\t\t\t\t<div style=\"padding:20px; height: 300px; overflow: auto\">";
          // html += `<p style="color:#3ca9e2;font-size:16px;display:flex;align-items:center;"><img src="../../pages/itb/exhibitors/assets/barcode.png" style="width:20px;height:20px;border:0px;"/>&emsp;${lpg.barcode}</p>`;
          // html += `<p >${item["barcode"]}</p>`;
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/booth_no.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.booth_no + "</p>";
          html += "<p ><a href=\"../itb/navigation/index.html?booth=" + item["booth_no"] + "\" target=\"_self\"><img src=\"../../pages/itb/exhibitors/assets/fid.png\" style=\"width:20px;height:20px;border:0px;\"/>" + item["booth_no"] + "</a></p>";
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/country.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.country + "</p>";
          html += "<p >" + item["countryname"] + "</p>";
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/company_describe.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.company_describe + "</p>";
          html += "<p style=\"word-wrap:break-word;width:500px;\">" + item["company_msg"] + "</p>";
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/web.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.web + "</p>";
          html += "<p >" + item["web"] + "</p>";
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/product.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.product + "</p>";
          html += "<p >" + item["product"] + "</p>";
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/segments.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.segments + "</p>";
          html += "<p >" + item["segments"] + "</p>";
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/regions.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.regions + "</p>";
          html += "<p >" + item["region1"] + " " + item["region2"] + "</p>";
          // html += `<p style="color:#3ca9e2;font-size:16px;display:flex;align-items:center;"><img src="../../pages/itb/exhibitors/assets/company.png" style="width:20px;height:20px;border:0px;"/>&emsp;${lpg.company}</p>`;
          // html += `<p >${item["company"]}</p>`;
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/email.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.email + "</p>";
          html += "<p >" + item["email"] + "</p>";
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/fax.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.fax + "</p>";
          html += "<p >" + item["fax"] + "</p>";
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/tel.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.tel + "</p>";
          html += "<p >" + item["tel"] + "</p>";
          // html += `<p style="color:#3ca9e2;font-size:16px;display:flex;align-items:center;"><img src="../../pages/itb/exhibitors/assets/zipcode.png" style="width:20px;height:20px;border:0px;"/>&emsp;${lpg.zipcode}</p>`;
          // html += `<p >${item["zipcode"]}</p>`;
          html += '</div>';
          var topbutton = '', buttons = null, pop;
          var height = 540;
          if (height === 200) {
              html = '<div style="height: 200px; overflow-y: auto">' + html + '</div>';
          }
          else {
              html = '<div>' + html + '</div>';
          }
          if (fromSchedule) {
              height = 200;
              if (!buttons)
                  buttons = {};
              buttons['btn1'] = {
                  text: lpg.dating,
                  onClick: function () {
                      api_1.api.sendScheduleMessage({
                          msgTitle: lpg.msgTitle,
                          msgContent: utils_1.request['info'].replace(/\+/gi, ' '),
                          toBarCode: toBarCode,
                      }, function (data) {
                          pop.close();
                          window.location.href = '/itb-dist/pc/pages/itb/schedule/index.html?__=ee0a3ad';
                      });
                      return true;
                  }
              };
              topbutton = "<button  style=\"float:right;margin-top:5px;margin-right:40px;\" class=\"topbtn\" data-index=\"1\" data-id=\"" + toBarCode + "\" >" + lpg.dating + "</button>";
          }
          if (wishListStage && item["appointment_total"] != "0") {
              if (!buttons)
                  buttons = {};
              buttons['btn2'] = {
                  text: lpg.wishListLike,
                  onClick: function () {
                      api_1.api.likeExhibtionForBuyerByBarCodeInList({ exhibitionBarCode: toBarCode }, function (data) {
                          pop.close();
                          var pop2 = opg_1.default.popTop($("<div style=\"border-radius: 5px;background-color: #999;line-height: 100px; color:#ffffff;width:300px;height:100px;text-align: center;font-size:22px;\">" + lpg.addWishListOk + "</div>"), {
                              modalClose: true
                          });
                          setTimeout(function () { return pop2.close(); }, 1000);
                      });
                      return true;
                  }
              };
              topbutton = "<button  style=\"float:right;margin-top:5px;margin-right:40px;\" class=\"topbtn\" data-index=\"2\" data-id=\"" + toBarCode + "\" >" + lpg.wishListLike + "</button>";
          }
          var pop = opg_1.default.popTop(html, {
              title: item.company.length > 30 ? item.company.substr(0, 30) + "..." + topbutton : item.company + topbutton,
              width: 600,
              height: height,
              buttons: buttons
          });
          pop.titleBar.on('click', '.topbtn', function () {
              var btn = $(this), toBarCode = btn.data('id'), index = btn.data('index');
              if (index == "1") {
                  api_1.api.sendScheduleMessage({
                      msgTitle: lpg.msgTitle,
                      msgContent: utils_1.request['info'].replace(/\+/gi, ' '),
                      toBarCode: toBarCode,
                  }, function (data) {
                      pop.close();
                      window.location.href = '/itb-dist/pc/pages/itb/schedule/index.html?__=ee0a3ad';
                  });
                  return true;
              }
              else if (index == "2") {
                  api_1.api.likeExhibtionForBuyerByBarCodeInList({ exhibitionBarCode: toBarCode }, function (data) {
                      pop.close();
                      var pop2 = opg_1.default.popTop($("<div style=\"border-radius: 5px;background-color: #999;line-height: 100px; color:#ffffff;width:300px;height:100px;text-align: center;font-size:22px;\">" + lpg.addWishListOk + "</div>"), {
                          modalClose: true
                      });
                      setTimeout(function () { return pop2.close(); }, 1000);
                  });
                  return true;
              }
          });
      });
  }
  document.getElementById('btnSearch').addEventListener('click', function (evt) {
      var val = document.getElementById('iptKeyword').value;
      if (val) {
          location.href = './exh3.html?by=search' + (utils_1.request['from'] ? '&from=' + utils_1.request['from'] : '') + (utils_1.request['info'] ? '&info=' + utils_1.request['info'] : '') + '&keyword=' + val;
      }
  }, false);
  function filterRegistrationLogoUrl(logourl) {
      if (logourl != null && logourl != undefined && $.trim(logourl) != "N/A" && $.trim(logourl) != "未提供") {
          var newurl = logourl.split('/');
          return "/Logo/" + newurl[newurl.length - 1];
      }
      else
          return "";
  }
  $("#iptKeyword").attr('placeholder', lpg.searchtips);
  //# sourceMappingURL=/itb-dist/pc/pages/itb/exhibitors/exh3.js.map?__=1552033897847
  

});
