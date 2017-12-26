define('pages/login/main.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var store_1 = require("ts/util/store.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var app_cfg_ts_1 = require("ts/app.cfg.ts");
  var Popup_1 = require("ts/ui/Popup.ts");
  opg_ts_1.default.api({
      GetCurrentUserInfoAndMenus: 'user/GetCurrentUserInfoAndMenus?type=1',
  });
  var menuPack = Languages_1.Languages.package['menu'];
  var menuDefine = {
      NewsManagement: '../content/news/index.html',
      NoticeManagement: '../content/notice/index.html',
      SponsorManagement: '../content/sponsor/index.html',
      CarouselManagement: '../content/carousel/index.html',
      RoleOperation: '../roles/role/index.html',
      RoleUserOperation: '../roles/roleUser/index.html',
      RoleAuthorityManagment: '../roles/roleRights/index.html',
      MessageManagement: '../content/message/index.html',
      ActivityManagement: '../content/activity/index.html',
      PhotoManagment: '../content/photo/index.html',
      MediaManagment: '../content/media/index.html',
      ExhibitionInfoManagment: '../content/exhibition/index.html',
      RoleAuthorityManagment: '../roles/roleRights/index.html',
      DisableWordsSetting: '../system/forbiddenWords/index.html',
      DisableWordsSetting: '../system/forbiddenWords/index.html',
      StageSetting: '../system/period/index.html',
      TimeSetting: '../system/timeSlot/index.html',
      PairingIntegralSetting: '../system/integralMatch/index.html',
      ExhibitionInfoManagment: '../content/exhibition/index.html',
      Wishlist: '../itb/wishlist/index.html',
  };
  opg_ts_1.default.api.GetCurrentUserInfoAndMenus(function (data) {
      var permissions = data.menus;
      console.dir(data);
      var menu = {}, curMainMenuId;
      for (var i = 0, l = permissions.length; i < l; i++) {
          var mn = permissions[i];
          menu['#' + mn.id] = mn;
      }
      var mainMenu = $('#mainMenu'), subMenu = $('#subMenu'), divTd = $('#td'), mainFrame = $('#mainFrame'), mainFrameWindow = mainFrame[0].contentWindow;
      /*if (permissions.length > 6) {
       mainMenu.addClass('small-menu');
       }*/
      $('#divPn1').click(function () {
          var that = $(this);
          if (that.hasClass('ellipse')) {
              that.removeClass('ellipse');
              subMenu.css('width', 200);
              divTd.css('left', 200);
          }
          else {
              that.addClass('ellipse');
              subMenu.css('width', 0);
              divTd.css('left', 0);
          }
      });
      var mainMenuSelector = 'a:eq(0)', subMenuSelector = 'a:eq(0)';
      if (location.hash.length > 1) {
          var ph = location.hash.split('/');
          mainMenuSelector = '#\\' + ph[0];
          if (ph[1]) {
              subMenuSelector = '#\\/' + ph[1];
          }
      }
      subMenu.on('click', 'a', function () {
          var sm = $(this);
          sm.addClass('cur').siblings('.cur').removeClass('cur');
          //mainFrame.attr('src', sm.attr('href') as string);
          store_1.Cache.empty();
          var p = sm.data('permission');
          console.log(sm, p);
          if (p) {
              var pm_1 = {}, pa = p.split(',');
              pa.forEach(function (v) { return pm_1[v] = true; });
              store_1.store.set('permission', pm_1);
              console.warn(sm.text() + ' has permission control!', p, pm_1);
          }
          mainFrameWindow.location.replace(sm.attr('href'));
          location.hash = curMainMenuId + sm[0].id;
          return false;
      });
      mainMenu.on('click', 'a', function () {
          var cur = $(this), mnId = cur.attr('href');
          curMainMenuId = mnId;
          cur.addClass('cur').siblings('.cur').removeClass('cur');
          subMenu.bindList({
              template: '<a id="/${id}" href="${name:=url}" target="mainFrame" data-permission="${id:=g}">${name:=t}</a>',
              list: menu[mnId].childMenus,
              itemRender: {
                  g: function (v, i, row) {
                      var arr = [];
                      if (row.childMenus && row.childMenus.length) {
                          row.childMenus.forEach(function (v, i) {
                              arr.push(v['name']);
                          });
                      }
                      return arr.join(',');
                  },
                  t: function (v) { return menuPack[v] || v; },
                  url: function (n) { return menuDefine[n] || 'about:blank'; },
              },
          }).find(subMenuSelector).click();
          if (subMenuSelector != 'a:eq(0)')
              subMenuSelector = 'a:eq(0)';
      });
      mainMenu.bindList({
          template: '<a id="#${id}" href="#${id}">${name:=t}</a>',
          list: permissions,
          itemRender: {
              t: function (v) { return menuPack[v] || v; },
          },
      }).find(mainMenuSelector).click();
      var aLogo = $('#aLogo');
      aLogo.click(function () {
          subMenu.find('.cur').eq(0).removeClass('cur');
      });
      if (permissions.length === 1) {
          subMenu.find('.cur').eq(0).removeClass('cur');
          mainFrame.attr('src', aLogo.attr('href'));
      }
      var wViewport = window.document.documentElement.clientWidth, wMenu = mainMenu.outerWidth();
      console.log(wViewport - wMenu);
      if (wViewport - wMenu < 0) {
          mainMenu.addClass('nano-menu');
      }
      if (wViewport - wMenu < 150) {
          mainMenu.addClass('mini-menu');
      }
      else if (wViewport - wMenu < 300) {
          mainMenu.addClass('small-menu');
      }
  });
  $('#liAbout').click(function () {
      console.log(Languages_1.Languages);
      var html = $("<div style=\" font-size: 12px; color: #555; padding: 12px 50px;\">\n\t\t\t\t\t<label><input type=\"radio\" name=\"lng\" value=\"" + Languages_1.Languages.names.cn + "\" " + (Languages_1.Languages.current === Languages_1.Languages.names.cn ? 'checked' : '') + "> \u4E2D\u6587</label>\n\t\t\t\t\t<br>\n\t\t\t\t\t<label><input type=\"radio\" name=\"lng\" value=\"" + Languages_1.Languages.names.en + "\" " + (Languages_1.Languages.current === Languages_1.Languages.names.en ? 'checked' : '') + "> English</label>\n\t\t\t\t</div>");
      opg_ts_1.default.confirm(html, function () {
          var selected = html.find(':radio:checked').val();
          console.log(selected);
          if (selected != Languages_1.Languages.current) {
              store_1.store.set(Languages_1.Languages.configKeyName, selected);
              location.reload(true);
          }
      }, {
          title: Languages_1.Languages.package['language'],
          width: 400,
      });
  });
  $('#liLogOff').click(function () {
      store_1.store.remove('Authorization');
      window.location.href = app_cfg_ts_1.default.loginPage;
  });
  history.pushState(null, null, document.URL);
  window.addEventListener('popstate', function () {
      //debugger;
      history.pushState(null, null, document.URL);
      Popup_1.default.closeLast();
  });
  $('#liFullScreen').click(function (evt) {
      // Test for each of the supported versions of full screen APIs and call
      // either requestFullscreen or cancelFullScreen (or exitFullScreen)
      //  Structure:
      //  Does the incoming target support requestFullscreen (or prefaced version)
      //  if (there is a fullscreen element)
      //      then cancel or exit
      //  else request full screen mode
      var divObj = evt.target; //  get the target element
      if (divObj.requestFullscreen)
          if (document.fullScreenElement) {
              document.cancelFullScreen();
          }
          else {
              document.documentElement.requestFullscreen();
          }
      else if (divObj.webkitRequestFullscreen)
          if (document.webkitFullscreenElement) {
              document.webkitCancelFullScreen();
          }
          else {
              document.documentElement.webkitRequestFullscreen();
          }
      else if (divObj.msRequestFullscreen)
          if (document.msFullscreenElement) {
              document.msExitFullscreen();
          }
          else {
              document.body.msRequestFullscreen();
          }
      else if (divObj.mozRequestFullScreen)
          if (document.mozFullScreenElement) {
              document.mozCancelFullScreen();
          }
          else {
              document.documentElement.mozRequestFullScreen();
          }
      //  stop bubbling so we don't get bounce back
      evt.stopPropagation();
  });
  //# sourceMappingURL=/itb-dist/pc/pages/login/main.js.map?__=
  

});
