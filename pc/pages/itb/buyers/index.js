define('pages/itb/buyers/index.ts', function(require, exports, module) {

  "use strict";
  /// <reference path="../../../@types/jquery.d.ts" />
  /// <reference path="../../../@types/jquery.plugins.d.ts" />
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_1 = require("ts/opg.ts");
  var api_1 = require("ts/util/api.ts");
  var utils_1 = require("ts/util/utils.ts");
  var store_1 = require("ts/util/store.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  api_1.api({
      product: 'product/GetProductGroup',
      region: 'country/GetAllContinent',
      myList: 'exhibition/GetExhibitionChooseBuyers',
      allList: 'buyer/GetAllBuyers',
      'search!POST': 'buyer/SearchBuyersByFilter',
      'sendScheduleMessage!post': 'message/SendScheduleMessage',
      likeBuyerForExhibtionByBarCodeInList: 'exhibition/LikeBuyerForExhibtionByBarCodeInList',
      unlike: 'exhibition/UnLikeBuyerForExhibtionByBarCode',
      'updateListSort!post': 'exhibition/UpdateExhibitionChooseBuyers'
  });
  var currentLng = Languages_1.Languages.current;
  var lngPkg = Languages_1.Languages.package;
  var selCreated = 0;
  var by = utils_1.request['by'];
  var scheduleAddtoTime = store_1.store.get('scheduleAddtoTime') == null ? '' : store_1.store.get('scheduleAddtoTime');
  var fromSchedule = utils_1.request['from'] === 'schedule';
  var wishListStage = store_1.store.get('Stage') === 'wishlist' && store_1.store.get('RoleName') == 'exhibition' && by != 'choose';
  var slippyList = document.querySelector('#slippyList');
  slippyList.addEventListener('slip:beforewait', function (e) {
      e.preventDefault();
  }, false);
  slippyList.addEventListener('slip:beforereorder', function (e) {
      if (/ico-remove/.test(e.target.className)) {
          e.preventDefault();
          top.opg.confirm(lngPkg.Content, function () {
              api_1.api.unlike({ buyerBarcode: $(e.target).data('barcode') }, function () {
                  showMyList();
              });
          }, {
              title: lngPkg.Tips
          });
      }
  }, false);
  slippyList.addEventListener('slip:reorder', function (e) {
      e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
      updateSort();
      return false;
  }, false);
  new Slip(slippyList);
  showMyList();
  //api.search({"keyword":"","region":"","product":""}, data => showData(data));
  var pic = '/itb-dist/pc/pages/itb/exhibitors/assets/bge.jpg?__=a9cfb35';
  var noShow = {
      barcode: 1,
      company_logo: 1,
      logourl: 1
  };
  var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var list = {};
  var data;
  var divList = $('#divList');
  divList.on('click', 'li', function (e) {
      var item = list[this.getAttribute('data-key')][this.getAttribute('data-index')];
      var toBarCode = item.barcode;
      if (e.target.tagName === 'IMG') {
          addBuyer(toBarCode);
          return false;
      }
      var ppic = filterRegistrationLogoUrl(item.company_logo);
      var ppic2 = filterRegistrationLogoUrl(item.logourl);
      var html = '';
      if (ppic != '' && ppic != undefined && ppic != null)
          html +=
              "<img onerror=\"src='../../pages/itb/exhibitors/assets/bge.jpg'\" src=\"" +
                  ppic +
                  "\" style=\"display: block;height: 154px;width: auto;margin: 20px auto;\"><div style=\"padding:20px; height: 300px; overflow: auto\">";
      else if (ppic2 != '' && ppic2 != undefined && ppic2 != null)
          html +=
              "<img onerror=\"src='../../pages/itb/exhibitors/assets/bge.jpg'\" src=\"" +
                  ppic2 +
                  "\"style=\"display: block;height: 154px;width: auto;margin: 20px auto;\"><div style=\"padding:20px; height: 300px; overflow: auto\">";
      else
          html += "<img src=\"../../pages/itb/exhibitors/assets/bge.jpg\" style=\"width: 200px;height: 154px;display: block;margin: 20px auto;\">\n\t\t\t\t\t<div style=\"padding:20px; height: 300px; overflow: auto\">";
      html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/country.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lngPkg.country + "</p>";
      html += "<p >" + item['country_name'] + "</p>";
      html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/city.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lngPkg.city + "</p>";
      html += "<p >" + item['city'] + "</p>";
      html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/person.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lngPkg.person + "</p>";
      html += "<p >" + item['name'] + " " + item['sex_name'] + "</p>";
      html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/department.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lngPkg.department + "</p>";
      html += "<p >" + item['department'] + "</p>";
      html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/position.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lngPkg.position + "</p>";
      html += "<p >" + item['position'] + "</p>";
      html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/company_describe.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lngPkg.company_describe + "</p>";
      html += "<p style=\"word-wrap:break-word;width:95%;\">" + item['company_describe'] + "</p>";
      html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/web.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lngPkg.web + "</p>";
      html += "<p >" + item['company_url'] + "</p>";
      html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/segments.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lngPkg.segments + "</p>";
      html += "<p >" + item['O'] + "</p>";
      html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/product.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lngPkg.product + "</p>";
      html += "<p >" + item['P'] + "</p>";
      html += "<p style=\"color:#3ca9e2;font-size:16px;display:flex;align-items:center;\"><img src=\"../../pages/itb/exhibitors/assets/regions.png\" style=\"width:20px;height:20px;border:0px;\"/>&emsp;" + lngPkg.regions + "</p>";
      html += "<p >" + item['Q'] + "</p>";
      html += '</div>';
      var height = 540;
      if (height === 200) {
          html = '<div style="height: 200px; overflow-y: auto">' + html + '</div>';
      }
      else {
          html = '<div>' + html + '</div>';
      }
      var topbutton = '', buttons = null;
      if (fromSchedule) {
          height = 200;
          if (!buttons)
              buttons = {};
          buttons['btn1'] = {
              text: lngPkg.dating,
              onClick: function () {
                  api_1.api.sendScheduleMessage({
                      msgTitle: lngPkg.msgTitle,
                      msgContent: utils_1.request['info'].replace(/\+/gi, ' '),
                      toBarCode: toBarCode
                  }, function (data) {
                      window.location.href = '/itb-dist/pc/pages/itb/schedule/index.html?__=ee0a3ad';
                  });
              }
          };
          topbutton =
              "<button  style=\"float:right;margin-top:5px;margin-right:40px;\" class=\"topbtn\" data-index=\"1\" data-id=\"" +
                  toBarCode +
                  "\" >" +
                  lngPkg.dating +
                  "</button>";
      }
      if (wishListStage) {
          if (!buttons)
              buttons = {};
          buttons['btn2'] = {
              text: lngPkg.wishListLike,
              onClick: function () {
                  pop.close();
                  addBuyer(toBarCode);
                  return true;
              }
          };
          topbutton =
              "<button  style=\"float:right;margin-top:5px;margin-right:40px;\" class=\"topbtn\" data-index=\"2\" data-id=\"" +
                  toBarCode +
                  "\" >" +
                  lngPkg.wishListLike +
                  "</button>";
      }
      var pop = opg_1.default.popTop($(html), {
          title: item.company.length > 30 ? item.company.substr(0, 30) + '...' + topbutton : item.company + topbutton,
          width: 600,
          height: height,
          buttons: buttons
      });
      pop.titleBar.on('click', '.topbtn', function () {
          var btn = $(this), toBarCode = btn.data('id'), index = btn.data('index');
          if (index == '1') {
              api_1.api.sendScheduleMessage({
                  msgTitle: lngPkg.msgTitle,
                  msgContent: utils_1.request['info'].replace(/\+/gi, ' '),
                  toBarCode: toBarCode
              }, function (data) {
                  window.location.href = '/itb-dist/pc/pages/itb/schedule/index.html?__=ee0a3ad';
              });
          }
          else if (index == '2') {
              pop.close();
              addBuyer(toBarCode);
              return true;
          }
      });
  });
  function showData(arr) {
      list = {};
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
              var it = data[i], f = makePy(it['company'])[0]
                  .substr(0, 1)
                  .toUpperCase();
              if (!list[f]) {
                  if (alpha.indexOf(f) === -1)
                      f = '#';
                  list[f] = [];
              }
              list[f].push(it);
          }
      }
      //console.log(list);
      divList.html('');
      for (var key in list) {
          divList.append("<h1> " + key + "</h1>");
          var ul = $("<ul class=\"" + (currentStyle === 'list' ? 'ulNewList' : 'ulList') + "\"></ul>");
          ul.bindList({
              list: list[key],
              template: '<li data-index="${:index}" data-key="' +
                  key +
                  '"> ${appointment_total:=showIcon} ${selected:=selectedIcon}' +
                  '<div class="imgHold" style="background-image: url(${company_logo:=gLogo})"></div> ${company} </li>',
              itemRender: {
                  gLogo: function (company_logo, i, row) {
                      var x = filterRegistrationLogoUrl(company_logo) ||
                          filterRegistrationLogoUrl(row.logourl) ||
                          'assets/no-logo.png';
                      return "'" + x + "'";
                  },
                  showIcon: function (appointment_total, i, row) {
                      var html = '';
                      if (wishListStage && appointment_total != '0') {
                          html += "<img src=\"./assets/pc02.png\" class=\"ico-add\" />";
                      }
                      return html;
                  },
                  selectedIcon: function (selected) {
                      return "<img src=\"./assets/ico-heart.png\" class=\"icon-heart\" style=\"visibility:" + (selected ? 'visible' : 'hidden') + ";\" />";
                  }
              }
          });
          divList.append(ul);
      }
  }
  var toggleViewStyle = document.querySelector('#toggleViewStyle');
  var currentStyle = store_1.store.get('wishListViewStyle', 'list');
  toggleViewStyle.className = currentStyle;
  $('#toggleViewStyle').click(function () {
      currentStyle = currentStyle === 'thumb' ? 'list' : 'thumb';
      $(toggleViewStyle).toggleClass('list thumb');
      $('ul', divList).toggleClass('ulNewList ulList');
      store_1.store.set('wishListViewStyle', currentStyle);
  });
  function filterRegistrationLogoUrl(logourl) {
      if (logourl != null && logourl != undefined && $.trim(logourl) != 'N/A' && $.trim(logourl) != '未提供') {
          var newurl = logourl.split('/');
          return '/Logo/' + newurl[newurl.length - 1];
      }
      else
          return '';
  }
  document.getElementById('btnSearch').addEventListener('click', searchContents, false);
  document.getElementById('btnReset').addEventListener('click', resetContents, false);
  function showMyList() {
      api_1.api.myList({ scheduleAddtoTime: scheduleAddtoTime }, function (data) {
          $(slippyList).bindList({
              list: data,
              template: '<li data-barcode="${barcode}"><b class="ico-remove" data-barcode="${barcode}">-</b> [${:rowNum}] ${company} <b class="ico-handle">≡</b></li>'
          });
      });
  }
  function addBuyer(buyerBarcode) {
      api_1.api.likeBuyerForExhibtionByBarCodeInList({ buyerBarcode: buyerBarcode }, function (data) {
          showMyList();
          var popy = opg_1.default.popTop($("<div style=\"border-radius: 5px;background-color: #999;line-height: 100px; color:#ffffff;width:300px;height:100px;text-align: center;font-size:22px;\">" + lngPkg.addWishListOk + "</div>"), {
              modalClose: true
          });
          setTimeout(function () { return popy.close(); }, 1000);
      });
  }
  function updateSort() {
      var buyerBarCodes = [];
      $('li', slippyList).each(function (i, li) {
          buyerBarCodes.push(li.getAttribute('data-barcode'));
      });
      api_1.api.updateListSort({ buyerBarCodes: buyerBarCodes }, showMyList);
  }
  function searchContents() {
      if (selCreated === -1) {
          var param = $('#divSearch').fieldsToJson();
          api_1.api.search(param, function (data) { return showData(data); });
      }
  }
  function resetContents() {
      $('#selRegion option:first').prop('selected', 'selected');
      $('#selProduct option:first').prop('selected', 'selected');
      $('#iptKeyword').val('');
  }
  var selRegion, selProduct;
  $.when(api_1.api.region(function (data) {
      selRegion = opg_1.default('#selRegion').listBox({
          data: data,
          name: 'region',
          autoPrependBlank: '----',
          text: "chau_" + currentLng,
          value: "chau_" + currentLng,
          onSelect: searchContents
      });
  }), api_1.api.product(function (data) {
      selProduct = opg_1.default('#selProduct').listBox({
          data: data,
          name: 'product',
          autoPrependBlank: '----',
          text: "group_" + currentLng,
          value: "id",
          onSelect: searchContents
      });
  })).then(function () {
      selCreated = -1;
      switch (by) {
          case 'product':
              //api.product({productId: request['regionId'],scheduleAddtoTime:scheduleAddtoTime}, data => showData(data));
              selProduct.setValue(utils_1.request['regionId']);
              searchContents();
              break;
          case 'choose':
              //api.choose({scheduleAddtoTime:scheduleAddtoTime},data => showData(data));
              //$("#mytext2").html(lpg.tips5);
              break;
          case 'region':
              //api.region({continent: request['regionId'],scheduleAddtoTime:scheduleAddtoTime}, data => showData(data));
              selRegion.setValue(utils_1.request['regionId']);
              searchContents();
              break;
          case 'interestedregion':
              //api.interestedregion({continent: request['regionId'],scheduleAddtoTime:scheduleAddtoTime}, data => showData(data));
              selRegion.setValue(utils_1.request['regionId']);
              searchContents();
              break;
          case 'segment':
              //api.segment({group: request['productId'],scheduleAddtoTime:scheduleAddtoTime}, data => showData(data));
              break;
          case 'search':
              $('#iptKeyword').val(utils_1.request['keyword']);
              searchContents();
              break;
          case 'all':
              resetContents();
              searchContents();
              break;
          default:
      }
  });
  //# sourceMappingURL=/itb-dist/pc/pages/itb/buyers/index.js.map?__=1552033897847
  

});
