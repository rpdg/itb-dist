define('pages/dashboard/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var api_1 = require("js/api.ts");
  var util_1 = require("js/util.ts");
  api_1.api({
      getcurrentuserInfo: 'user/getcurrentuserInfo',
      GetCurrentUserInfoAndMenus: 'user/GetCurrentUserInfoAndMenus?type=0',
      getSlider: 'canrousel/GetAllCanrousel'
  });
  var menu = {
      Wishlist: {
          icon: '/itb-dist/wap/pages/dashboard/assets/ico96-like.png?__=77752db',
          url: '../wishlist/wishlist.html'
      },
      Schedule: {
          icon: '/itb-dist/wap/pages/dashboard/assets/ico96-calendar.png?__=5ef52f5',
          url: '/itb-dist/wap/pages/schedule/mine.html?__=d0d0c28'
      },
      MessageBox: {
          icon: '/itb-dist/wap/pages/dashboard/assets/ico96-chat.png?__=f1f97c1',
          url: '/itb-dist/wap/pages/msgBox/msgBox.html?__=69e2b77'
      },
      Exhibitors: {
          icon: '/itb-dist/wap/pages/dashboard/assets/ico96-house.png?__=d594dcd',
          url: '/itb-dist/wap/pages/wishlist/wishlist.html?__=8dd63ba'
      },
      Buyers: {
          icon: '/itb-dist/wap/pages/dashboard/assets/ico96-user.png?__=3c2d5cf',
          url: '/itb-dist/wap/pages/buyer/buyer1.html?__=7e51697'
      },
      Events: {
          icon: '/itb-dist/wap/pages/dashboard/assets/ico96-bloom.png?__=710c8e4',
          url: '/itb-dist/wap/pages/meetings/list.html?__=59c2cdc'
      },
      Navigation: {
          icon: '/itb-dist/wap/pages/dashboard/assets/ico96-paper.png?__=90af55a',
          url: '/itb-dist/wap/pages/wishlist/wishlist.html?__=8dd63ba'
      },
      PhotoGallary: {
          icon: '/itb-dist/wap/pages/dashboard/assets/ico96-camera.png?__=892346f',
          url: '/itb-dist/wap/pages/gallery/gallery.html?__=df0c4c5'
      },
      ExhibitionInfo: {
          icon: '/itb-dist/wap/pages/dashboard/assets/ico96-paste.png?__=0805019',
          url: '/itb-dist/wap/pages/wishlist/wishlist.html?__=8dd63ba'
      },
      Press: {
          icon: '/itb-dist/wap/pages/dashboard/assets/ico96-media.png?__=dbfc801',
          url: '/itb-dist/wap/pages/wishlist/wishlist.html?__=8dd63ba'
      },
      MyScore: {
          icon: '/itb-dist/wap/pages/dashboard/assets/ico96-config.png?__=31f9465',
          url: '/itb-dist/wap/pages/wishlist/wishlist.html?__=8dd63ba'
      },
  };
  api_1.api.GetCurrentUserInfoAndMenus(function (data) {
      console.log(data);
      var userMenu = data.menus;
      userMenu.forEach(function (v, i) {
          var m = menu[v.name];
          if (m) {
              v.icon = m.icon;
              v.url = m.url;
              v.txt = util_1.Languages.package['menu'][v.name];
          }
          else {
              console.warn(v);
          }
      });
      document.getElementById('board').innerHTML = template('tpl-board', data);
      document.getElementById('spUserName').innerText = util_1.Store.get('userName');
      document.getElementById('spRealName').innerText = data.firstName + " " + data.lastName;
  });
  api_1.api.getSlider(function (data) {
      document.getElementById('slider').innerHTML = template('tpl-slider', data);
      mui('#slider').slider();
  });
  mui('#myScroll').scroll();
  console.log(util_1.Languages.package['leftMenu']);
  document.getElementById('ulLeftMenu').innerHTML = template('tpl-leftMenu', util_1.Languages.package);
  mui('#swLgn').switch();
  document.getElementById('swLgn').addEventListener('toggle', function (event) {
      util_1.Store.set(util_1.Languages.configKeyName, util_1.Languages.names[util_1.Languages.current === util_1.Languages.names.cn ? 'en' : 'cn']);
      setTimeout(function () {
          location.href = './index.html?t=' + (new Date()).getTime();
      }, 300);
  });
  document.getElementById('message').addEventListener('tap', function () {
      location.href = '../announcement/announcement.html';
  });
  document.getElementById('lmWishList').addEventListener('tap', function () {
      location.href = '../wishlist/result.html';
  });
  document.getElementById('lmSignOut').addEventListener('tap', function () {
      location.href = '../login/index.html';
  });
  //# sourceMappingURL=/itb-dist/wap/pages/dashboard/index.js.map?__=
  

});
