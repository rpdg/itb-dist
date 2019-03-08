define('pages/itb/dashboard/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("ts/util/api.ts");
  var ViewNewsDetail_1 = require("pages/itb/news/ViewNewsDetail.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  api_1.api({
      getCarousel: 'canrousel/GetAllCanrousel',
      getAnnouncement: 'Information/QueryAllEnableInformations?type=1&pageIndex=0&pageSize=2',
      getSubjects: 'Information/InformationById',
      getCurrentUserInfoAndMenus: 'user/GetCurrentUserInfoAndMenus',
      getbuyerwishlistresult: 'buyer/BuyerWishListResult',
      getexhibitionwishlistresult: 'exhibition/ExhibitionWishListResult',
      ExhibitorLogin: 'sync/ExhibitorLogin',
      getBuyerByBarCode: 'buyer/GetBuyerByBarCode',
      getBuyerReportByBarcode: 'buyer/GetBuyerReportByBarcode',
      getExhibitorReportByBarcode: 'exhibition/GetExhibitorReportByBarcode'
  });
  var lpg = Languages_1.Languages.package;
  var clng = 'en';
  var curStage = '';
  var barcode = '';
  if (localStorage.getItem("lngPkg") != null || localStorage.getItem("lngPkg") != undefined) {
      var currentlng = localStorage.getItem("lngPkg");
      clng = currentlng.replace(/["""]/g, "");
  }
  api_1.api.getSubjects.set('unlimited', true);
  api_1.api.getCarousel(function (data) {
      document.getElementById('swiper').innerHTML = template('tpl-swiper', data);
      new Swiper('#swiper', {
          autoplay: {
              delay: 2500,
              disableOnInteraction: false,
          },
          navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
          },
      });
  });
  api_1.api.getAnnouncement(function (data) {
      var results = data.results;
      if (results && results.length) {
          getSubject(results, function (list) {
              console.log(list);
              document.getElementById('an1').innerHTML = template('tpl-news', list);
              $('.aNews').click(function () {
                  new ViewNewsDetail_1.default($(this).data('id'), Languages_1.Languages.package.readDetail);
              });
          });
      }
  });
  function getSubject(list, callback) {
      var i = 0, l = list.length, n = 0;
      var _loop_1 = function () {
          var an = list[i];
          api_1.api.getSubjects({ informationId: an.id }, function (data) {
              an['subjects'] = data;
              if (++n === l) {
                  callback(list);
              }
          });
      };
      for (; i < l; i++) {
          _loop_1();
      }
  }
  $('#swiper').on('click', '.viewNews', function () {
      new ViewNewsDetail_1.default($(this).data('id'), Languages_1.Languages.package.readDetail);
  });
  var param = {};
  param.type = '1';
  api_1.api.getCurrentUserInfoAndMenus(param, function (data) {
      curStage = data.stage[0].name;
      barcode = data.barcode;
      if (data.RoleId == "12") {
          location.href = "../../content/photo/index.html";
      }
      else if (data.RoleId == "13") {
          location.href = "../../logistics/serviceRental/manage.html";
      }
      else if (data.RoleId == "14") {
          location.href = "../../logistics/cateringRental/manage.html";
      }
      else if (data.RoleId == "5") {
          initOperation(0);
          $("#newsandannoucement").show();
          $("#leftTop").hide();
          $("#leftBottom").hide();
      }
      else if (data.RoleId == "1") {
          initOperation(1);
          setTimeout(function () {
              initWishlist(1);
          }, 1000);
          initRegistration();
          $("#newsandannoucement").hide();
          $("#leftTop").show();
          $("#leftBottom").show();
      }
      else if (data.RoleId == "2") {
          initOperation(-1);
          setTimeout(function () {
              initWishlist(2);
          }, 1000);
          $("#newsandannoucement").hide();
          $("#leftTop").show();
          $("#leftBottom").hide();
      }
      else if (data.RoleId == "4" || data.RoleId == "3" || data.RoleId == "6") {
          initOperation(-1);
          $("#newsandannoucement").show();
          $("#leftTop").hide();
          $("#leftBottom").hide();
      }
      initSchedule(1);
  });
  function initWishlist(Roleid) {
      if (Roleid === 1) //展商
       {
          api_1.api.getexhibitionwishlistresult(function (data) {
              //" + data.selected + "
              //" + data.max + "
              //" + data.min +"
              //../wishlist/index.html
              //../wishlist/view.html
              var html = "<div class='redFont'>" + ("" + lpg.wishlisttitle) + "</div>";
              html += "<div class='contentleft' id='needappend'>";
              html += "<div class='blacktitle'><img src='assets/current.png' />&emsp;" + ("" + lpg.smalltitle3) + "&emsp;" + data.selected + "</div>";
              html += "<div class='blacktitle'><img src='assets/most.png'/>&emsp;" + ("" + lpg.icon14) + ("" + lpg.currentrole[Roleid - 1]) + "&emsp;" + data.max + "</div>";
              html += "<div class='blacktitle'><img src='assets/least.png'/>&emsp;" + ("" + lpg.icon15) + ("" + lpg.currentrole[Roleid - 1]) + "&emsp;" + data.min + "</div>";
              if (curStage === "Wishlist") {
                  html += "<div class='imgdiv'><img src='assets/select.png' class='widgetimg' />";
                  html += "<a class='canclicka' href='../wishlist/index.html' >" + ("" + lpg.icon16) + "</a></div>";
                  html += "<div class='imgdiv'><img src='assets/view.png' class='widgetimg' />";
                  html += "<a class='canclicka' href='../wishlist/view.html'  >" + ("" + lpg.icon17) + "</a></div>";
                  html += "</div>";
              }
              else {
                  html += "<div class='imgdivgray'><img src='assets/select.png' class='widgetimg' />";
                  html += "<a class='cantclicka' href='#' >" + ("" + lpg.icon16) + "</a></div>";
                  html += "<div class='imgdivgray'><img src='assets/view.png' class='widgetimg' />";
                  html += "<a class='cantclicka' href='#'  >" + ("" + lpg.icon17) + "</a></div>";
                  html += "</div>";
              }
              $("#leftTop").html("");
              $("#leftTop").append(html);
              //临时添加，每年4月份商贸配对开始就去掉
              // let html4="";
              // html4+="<div class='newredtitle'>" + `${lpg.icon23}` + "&emsp;" + "</div>";
              // $("#needappend").append(html4);
              //展会结束后，如果有报告生成，可下载
              setTimeout(function () {
                  api_1.api.getExhibitorReportByBarcode({ barcode: barcode }, function (data) {
                      var html3 = "";
                      if (data != "") {
                          html3 += "<div class='bigredbutton' onclick='location.href=\"" + data + "\"' ><img src='assets/report.png' /><span class='bigredbuttonT1' >" + ("" + lpg.icon22)
                              + "</span><br/><span class='bigredbuttonT2'>" + ("" + lpg.icon21) + "</span></div>";
                          $("#needappend").append(html3);
                      }
                  });
              }, 1500);
          });
      }
      else if (Roleid === 2) //买家
       {
          api_1.api.getbuyerwishlistresult(function (data) {
              var html = "<div class='redFont'>" + ("" + lpg.wishlisttitle) + "</div>";
              html += "<div class='contentleft' id='needappend'>";
              html += "<div class='blacktitle'><img src='assets/current.png' />&emsp;" + ("" + lpg.smalltitle3) + "&emsp;" + data.selected + "</div>";
              html += "<div class='blacktitle'><img src='assets/most.png'/>&emsp;" + ("" + lpg.icon14) + ("" + lpg.currentrole[Roleid - 1]) + "&emsp;" + data.max + "</div>";
              html += "<div class='blacktitle'><img src='assets/least.png'/>&emsp;" + ("" + lpg.icon15) + ("" + lpg.currentrole[Roleid - 1]) + "&emsp;" + data.min + "</div>";
              if (curStage === "Wishlist") {
                  html += "<div class='imgdiv'><img src='assets/select.png' class='widgetimg' />";
                  html += "<a class='canclicka' href='../wishlist/index.html' >" + ("" + lpg.icon16) + "</a></div>";
                  html += "<div class='imgdiv'><img src='assets/view.png' class='widgetimg' />";
                  html += "<a class='canclicka' href='../wishlist/view.html'  >" + ("" + lpg.icon17) + "</a></div>";
                  html += "</div>";
              }
              else {
                  html += "<div class='imgdivgray'><img src='assets/select.png' class='widgetimg' />";
                  html += "<a class='cantclicka' href='#' >" + ("" + lpg.icon16) + "</a></div>";
                  html += "<div class='imgdivgray'><img src='assets/view.png' class='widgetimg' />";
                  html += "<a class='cantclicka' href='#'  >" + ("" + lpg.icon17) + "</a></div>";
                  html += "</div>";
              }
              $("#leftTop").html("");
              $("#leftTop").append(html);
              //临时添加，每年4月份商贸配对开始就去掉
              // let html4="";
              // html4+="<div class='newredtitle'>" + `${lpg.icon23}` + "&emsp;" + "</div>";
              // $("#needappend").append(html4);
              //部分买家显示积分策略
              setTimeout(function () {
                  api_1.api.getBuyerByBarCode({ barcode: barcode }, function (data) {
                      var html2 = "";
                      if (data[0].N == "Fully" || data[0].N == "Partial") {
                          if (curStage == "Pre-exhibiton" || curStage == "Exhibition") {
                              html2 += "<div class='imgdiv'><img src='assets/score.png' class='widgetimg' />";
                              html2 += "<a class='canclicka' href='../myScore/index.html'  >" + ("" + lpg.icon18) + "</a></div>";
                          }
                          else {
                              html2 += "<div class='imgdiv'><img src='assets/score.png' class='widgetimg' />";
                              html2 += "<a class='canclicka' href='../myScore/description.html'  >" + ("" + lpg.icon18) + "</a></div>";
                          }
                          $("#needappend").append(html2);
                      }
                  });
              }, 1000);
              //展会结束后，如果有报告生成，可下载
              setTimeout(function () {
                  api_1.api.getBuyerReportByBarcode({ barcode: barcode }, function (data) {
                      var html3 = "";
                      if (data != "") {
                          html3 += "<div class='bigredbutton' onclick='location.href=\"" + data + "\"' ><img src='assets/report.png' /><span class='bigredbuttonT1' >" + ("" + lpg.icon22)
                              + "</span><br/><span class='bigredbuttonT2'>" + ("" + lpg.icon20) + "</span></div>";
                          $("#needappend").append(html3);
                      }
                  });
              }, 1500);
          });
      }
      else
          console.log("no");
  }
  function initRegistration() {
      // let html="<div class='redFont'>"+`${lpg.registrationtitle}`+ "</div>";
      // html+="<div class='contentleft'>";
      // html+="<div class='imgdivgray'><img src='assets/exhibitor.png' class='widgetimg' />";
      // html+="<a class='cantclicka'  href='jumpto.html?type=1' >" + `${lpg.icon11}` + "</a></div>";
      // html+="<div  class='imgdivgray'><img src='assets/co_exhibitor.png' class='widgetimg' />";
      // html+="<a class='cantclicka'  href='jumpto.html?type=2' >" + `${lpg.icon12}` + "</a></div>";
      // html+="<div  class='imgdivgray'><img src='assets/barcode.png' class='widgetimg' />";
      // html+="<a class='cantclicka'  href='jumpto.html?type=3' >" + `${lpg.icon13}` + "</a></div>";
      // html+="</div>";
      // $("#leftBottom").html("");
      // $("#leftBottom").append(html);
  }
  function initOperation(flag) {
      var page = "";
      if (flag == 0)
          page = "manage.html";
      else if (flag == 1)
          page = "index.html";
      else if (flag == -1) {
          $("#rightBottom2").html("");
          var imghtml = "<img src='assets/background.jpg' style='width:100%;boder:0;margin:0;' />";
          $("#rightBottom2").html(imghtml);
      }
      if (flag != -1) {
          var html = "<div class='redFont'>" + ("" + lpg.operationtitle) + "</div>";
          html += "<div class='content'>";
          html += "<div class='content-one'><div class='blacktitle'><img src='assets/plane.png' />&emsp;" + ("" + lpg.smalltitle1) + "</div>";
          html += "<div class='imgdiv'><img src='assets/invitation.png' class='widgetimg' />";
          html += "<a class='canclicka' href='../../logistics/invitation/" + page + "' >" + ("" + lpg.icon1) + "</a></div>";
          html += "<div  class='imgdiv'><img src='assets/hotel.png' class='widgetimg' />";
          html += "<a class='canclicka' href='../../logistics/myTrip/hotel.html'>" + ("" + lpg.icon2) + "</a></div>";
          // html+="<div  class='imgdivgray'><img src='assets/bus.png' class='widgetimg' />";
          // html+="<a class='cantclicka' href='#'>" + `${lpg.icon3}` + "</a></div>";
          html += "</div>";
          html += "<div class='content-two'><div class='blacktitle'><img src='assets/house.png' />&emsp;" + ("" + lpg.smalltitle2) + "</div>";
          html += "<div  class='imgdiv'><img src='assets/mybooth.png'  class='widgetimg' />";
          if (flag == 1)
              html += "<a class='canclicka' href='../../logistics/myBooth/booth.html'>" + ("" + lpg.icon4) + "</a></div>";
          else
              html += "<a class='canclicka' href='../../logistics/myBooth/" + page + "'>" + ("" + lpg.icon4) + "</a></div>";
          html += "<div  class='imgdiv'><img src='assets/boothrent.png' class='widgetimg' />";
          html += "<a class='canclicka' href='../../logistics/serviceRental/" + page + "'>" + ("" + lpg.icon5) + "</a></div>";
          html += "<div  class='imgdiv'><img src='assets/boothevent.png'  class='widgetimg' />";
          html += "<a class='canclicka' href='../../logistics/applicationForBoothActivity/" + page + "'>" + ("" + lpg.icon6) + "</a></div>";
          html += "<div  class='imgdiv'><img src='assets/catering.png'  class='widgetimg' />";
          html += "<a class='canclicka' href='../../logistics/cateringRental/" + page + "'>" + ("" + lpg.icon7) + "</a></div></div>";
          html += "</div>";
          html += "<div class='content-three'><div class='blacktitle'>&emsp;</div>";
          html += "<div  class='imgdiv'><img src='assets/translate.png' class='widgetimg' />";
          html += "<a class='canclicka' href='../../logistics/translation/" + page + "'>" + ("" + lpg.icon8) + "</a></div>";
          // html+="<div  class='imgdiv'><img src='assets/board.png'  class='widgetimg' />";
          // html+="<a class='canclicka' href='../../logistics/faciaboard/"+page+"'>"+ `${lpg.icon9}` + "</a></div>";
          html += "<div  class='imgdiv'><img src='assets/sign.png'  class='widgetimg' />";
          html += "<a class='canclicka' href='../../logistics/emailbanner/" + page + "'>" + ("" + lpg.icon10) + "</a></div>";
          html += "<div  class='imgdiv'><img src='assets/digitalpress.png'  class='widgetimg' />";
          html += "<a class='canclicka' href='../../logistics/digitalpress/" + page + "'>" + ("" + lpg.icon19) + "</a></div></div>";
          html += "</div>";
          $("#rightBottom2").html("");
          $("#rightBottom2").append(html);
      }
  }
  function initSchedule(flag) {
      if (flag == 0)
          $("#scheduleFrame").hide();
      else
          $("#scheduleFrame").show();
  }
  /*
  
  Schedule.fetch(function (fullObj) {
      console.log(fullObj);
  });*/
  //# sourceMappingURL=/itb-dist/pc/pages/itb/dashboard/index.js.map?__=1552033897847
  

});
