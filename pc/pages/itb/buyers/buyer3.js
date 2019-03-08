define('pages/itb/buyers/buyer3.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  var utils_2 = require("ts/util/utils.ts");
  var store_1 = require("ts/util/store.ts");
  var opg_1 = require("ts/opg.ts");
  api_1.api({
      product: 'buyer/GetBuyersByProduct',
      choose: 'exhibition/GetExhibitionChooseBuyers',
      //region: 'buyer/GetBuyersByCountry',
      region: 'buyer/GetBuyersByContinent',
      interestedregion: 'buyer/GetBuyersByContinent2',
      segment: 'buyer/GetBuyersByGroup',
      all: 'buyer/GetAllBuyers',
      search: 'buyer/SearchBuyers',
      'sendScheduleMessage!post': 'message/SendScheduleMessage',
      likeBuyerForExhibtionByBarCodeInList: 'exhibition/LikeBuyerForExhibtionByBarCodeInList',
  });
  var lpg = Languages_1.Languages.package;
  var by = utils_1.request['by'];
  var scheduleAddtoTime = store_1.store.get('scheduleAddtoTime') == null ? '' : store_1.store.get('scheduleAddtoTime');
  var fromSchedule = utils_1.request['from'] === 'schedule';
  var wishListStage = store_1.store.get('Stage') === 'wishlist' && store_1.store.get('RoleName') == 'exhibition' && by != 'choose';
  // console.log(fromSchedule);
  // console.log(wishListStage);
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
  api_1.api.sendScheduleMessage.set('onError', function (code, error, callback) {
      if (code === 200 && error === 'message_error05') {
          var errorMsg = lpg['tips4'];
          top.opg.confirm("" + errorMsg, function () {
          });
      }
  });
  api_1.api.likeBuyerForExhibtionByBarCodeInList.set('onError', function (code, error, callback) {
      if (code === 200 && error === 'LikeBuyerForExhibtionByBarCodeInList_Error01') {
          var errorMsg = lpg['tips3'];
          top.opg.confirm("" + errorMsg, function () {
          });
      }
  });
  switch (by) {
      case 'product':
          api_1.api.product({ productId: utils_1.request['regionId'], scheduleAddtoTime: scheduleAddtoTime }, function (data) { return showData(data); });
          break;
      case 'choose':
          api_1.api.choose({ scheduleAddtoTime: scheduleAddtoTime }, function (data) { return showData(data); });
          $("#mytext2").html(lpg.tips5);
          break;
      case 'region':
          api_1.api.region({ continent: utils_1.request['regionId'], scheduleAddtoTime: scheduleAddtoTime }, function (data) { return showData(data); });
          break;
      case 'interestedregion':
          api_1.api.interestedregion({ continent: utils_1.request['regionId'], scheduleAddtoTime: scheduleAddtoTime }, function (data) { return showData(data); });
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
          data = utils_2.array.sort(arr, 'company', function (a, b) {
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
          data = utils_2.array.sort(arr, 'company', function (a, b) {
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
      //console.log(list);
      var divList = $('#divList');
      for (var key in list) {
          divList.append("<h1> " + key + "</h1>");
          var ul = $("<ul class=\"ulList\"></ul>");
          ul.bindList({
              list: list[key],
              template: '<li data-index="${:index}" data-key="' + key + '"><div class="imgHold" style="background-image: url(${company_logo:=gLogo})"></div> ${company}<br/> ${name}&nbsp;${sex_name}</li>',
              itemRender: {
                  gLogo: function (company_logo, i, row) {
                      var x = filterRegistrationLogoUrl(company_logo) || filterRegistrationLogoUrl(row.logourl) || '../exhibitors/assets/no-logo.png';
                      return "'" + x + "'";
                  },
              },
          });
          divList.append(ul);
      }
      divList.on('click', 'li', function () {
          var item = list[this.getAttribute('data-key')][this.getAttribute('data-index')];
          var ppic = filterRegistrationLogoUrl(item.company_logo);
          var ppic2 = filterRegistrationLogoUrl(item.logourl);
          var toBarCode = item.barcode;
          var html = ' ';
          if (ppic != "" && ppic != undefined && ppic != null)
              html += "<img onerror=\"src='../../pages/itb/exhibitors/assets/bge.jpg'\" src=\"" + ppic + "\" style=\"display: block;height: 154px;width: auto;margin: 20px auto;\"><div style=\"padding:20px; height: 300px; overflow: auto\">";
          else if (ppic2 != "" && ppic2 != undefined && ppic2 != null)
              html += "<img onerror=\"src='../../pages/itb/exhibitors/assets/bge.jpg'\" src=\"" + ppic2 + "\"style=\"display: block;height: 154px;width: auto;margin: 20px auto;\"><div style=\"padding:20px; height: 300px; overflow: auto\">";
          else
              html += "<img src=\"../../pages/itb/exhibitors/assets/bge.jpg\" style=\"width: 200px;height: 154px;display: block;margin: 20px auto;\">\n\t\t\t\t\t<div style=\"padding:20px; height: 300px; overflow: auto\">";
          // html += `<p style="color:#3ca9e2;font-size:16px;display:flex;align-items:center;"><img src="../../pages/itb/exhibitors/assets/barcode.png" style="width:20px;height:20px;border:0px;"/>&emsp;${lpg.barcode}</p>`;
          // html += `<p >${item["barcode"]}</p>`;
          // html += `<p style="color:#3ca9e2;font-size:16px;display:flex;align-items:center;"><img src="../../pages/itb/exhibitors/assets/company.png" style="width:20px;height:20px;border:0px;"/>&emsp;${lpg.company}</p>`;
          // html += `<p >${item["company"]}</p>`;
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/country.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.country + "</p>";
          html += "<p >" + item["country_name"] + "</p>";
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/city.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.city + "</p>";
          html += "<p >" + item["city"] + "</p>";
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/person.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.person + "</p>";
          html += "<p >" + item["name"] + " " + item["sex_name"] + "</p>";
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/department.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.department + "</p>";
          html += "<p >" + item["department"] + "</p>";
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/position.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.position + "</p>";
          html += "<p >" + item["position"] + "</p>";
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/company_describe.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.company_describe + "</p>";
          html += "<p style=\"word-wrap:break-word;width:95%;\">" + item["company_describe"] + "</p>";
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/web.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.web + "</p>";
          html += "<p >" + item["company_url"] + "</p>";
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/segments.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.segments + "</p>";
          html += "<p >" + item["O"] + "</p>";
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/product.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.product + "</p>";
          html += "<p >" + item["P"] + "</p>";
          html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/regions.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lpg.regions + "</p>";
          html += "<p >" + item["Q"] + "</p>";
          // html += `<p style="color:#3ca9e2;font-size:16px;display:flex;align-items:center;"><img src="../../pages/itb/exhibitors/assets/email.png" style="width:20px;height:20px;border:0px;"/>&emsp;${lpg.email}</p>`;
          // html += `<p >${item["email"]}</p>`;
          // html += `<p style="color:#3ca9e2;font-size:16px;display:flex;align-items:center;"><img src="../../pages/itb/exhibitors/assets/fax.png" style="width:20px;height:20px;border:0px;"/>&emsp;${lpg.fax}</p>`;
          // html += `<p >${item["fax"]}</p>`;
          // html += `<p style="color:#3ca9e2;font-size:16px;display:flex;align-items:center;"><img src="../../pages/itb/exhibitors/assets/tel.png" style="width:20px;height:20px;border:0px;"/>&emsp;${lpg.tel}</p>`;
          // html += `<p >${item["tel"]}</p>`;
          // html += `<p style="color:#3ca9e2;font-size:16px;display:flex;align-items:center;"><img src="../../pages/itb/exhibitors/assets/zipcode.png" style="width:20px;height:20px;border:0px;"/>&emsp;${lpg.zipcode}</p>`;
          // html += `<p >${item["zipcode"]}</p>`;
          html += '</div>';
          var height = 540;
          if (height === 200) {
              html = '<div style="height: 200px; overflow-y: auto">' + html + '</div>';
          }
          else {
              html = '<div>' + html + '</div>';
          }
          var topbutton = '', buttons = null, pop;
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
                          window.location.href = '/itb-dist/pc/pages/itb/schedule/index.html?__=ee0a3ad';
                      });
                  }
              };
              topbutton = "<button  style=\"float:right;margin-top:5px;margin-right:40px;\" class=\"topbtn\" data-index=\"1\" data-id=\"" + toBarCode + "\" >" + lpg.dating + "</button>";
          }
          if (wishListStage) {
              if (!buttons)
                  buttons = {};
              buttons['btn2'] = {
                  text: lpg.wishListLike,
                  onClick: function () {
                      api_1.api.likeBuyerForExhibtionByBarCodeInList({ buyerBarcode: toBarCode }, function (data) {
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
          var pop = opg_1.default.popTop($(html), {
              title: item.company.length > 30 ? item.company.substr(0, 30) + "..." + topbutton : item.company + topbutton,
              width: 600,
              height: height,
              buttons: buttons,
          });
          pop.titleBar.on('click', '.topbtn', function () {
              var btn = $(this), toBarCode = btn.data('id'), index = btn.data('index');
              if (index == "1") {
                  api_1.api.sendScheduleMessage({
                      msgTitle: lpg.msgTitle,
                      msgContent: utils_1.request['info'].replace(/\+/gi, ' '),
                      toBarCode: toBarCode,
                  }, function (data) {
                      window.location.href = '/itb-dist/pc/pages/itb/schedule/index.html?__=ee0a3ad';
                  });
              }
              else if (index == "2") {
                  api_1.api.likeBuyerForExhibtionByBarCodeInList({ buyerBarcode: toBarCode }, function (data) {
                      pop.close();
                      var popy = opg_1.default.popTop($("<div style=\"border-radius: 5px;background-color: #999;line-height: 100px; color:#ffffff;width:300px;height:100px;text-align: center;font-size:22px;\">" + lpg.addWishListOk + "</div>"), {
                          modalClose: true
                      });
                      setTimeout(function () { return popy.close(); }, 1000);
                  });
                  return true;
              }
          });
      });
  }
  document.getElementById('btnSearch').addEventListener('click', function (evt) {
      var val = document.getElementById('iptKeyword').value;
      if (val) {
          location.href = './buyer3.html?by=search' + (utils_1.request['from'] ? '&from=' + utils_1.request['from'] : '') + (utils_1.request['info'] ? '&info=' + utils_1.request['info'] : '') + '&keyword=' + val;
      }
  }, false);
  $("#iptKeyword").attr('placeholder', lpg.searchtips);
  function filterRegistrationLogoUrl(logourl) {
      if (logourl != null && logourl != undefined && $.trim(logourl) != "N/A" && $.trim(logourl) != "未提供") {
          var newurl = logourl.split('/');
          return "/Logo/" + newurl[newurl.length - 1];
      }
      else
          return "";
  }
  //# sourceMappingURL=/itb-dist/pc/pages/itb/buyers/buyer3.js.map?__=1552033897847
  

});
