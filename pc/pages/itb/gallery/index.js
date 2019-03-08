define('pages/itb/gallery/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  opg_ts_1.default.api({
      getTypes: 'phototype/getallphototypes',
      getPhotosByTypeId: 'photo/GetPhotosByTypeId',
      getPhotosByTag: 'photo/QueryPhotosByTitle',
  });
  var lpg = Languages_1.Languages.package;
  var treeName = 'photoTypes';
  var tree = opg_ts_1.default('#tree').tree({
      api: opg_ts_1.default.api.getTypes,
      name: treeName,
      root: "<label><input type=\"radio\" name=\"tree_" + treeName + "Rd\" value=\"0\" checked> " + lpg.root + "</label>",
      cmd: 'checkOne',
      childSrc: 'childPhotoTypes',
  });
  tree.jq.on('change', ':radio', function () {
      var elem = $(this), id = elem.val(), deal = elem.prop('checked');
      //console.warn('deal' , this);
      if (deal) {
          currentCategoryId = id;
          showPhotos(id);
      }
  });
  var ul = $('#photos');
  var currentCategoryId = 0;
  function bindPhotoList(data) {
      ul.bindList({
          list: data,
          itemRender: {
              gName: function (v) { return v.substr(v.lastIndexOf('/') + 1); },
          },
          template: '<li><img class="thumb" src="${url}" alt="${title}"><p><label><input type="checkbox" name="photo" value="${id}"> ${title}</label></p></li>',
      });
  }
  function showPhotos(typeid) {
      opg_ts_1.default.api.getPhotosByTypeId({ typeid: typeid }, function (data) { return bindPhotoList(data); });
  }
  showPhotos(currentCategoryId);
  ul.on('click', '.thumb', function () {
      opg_ts_1.default.popTop($("<img src=\"" + this.getAttribute('src') + "\" style=\"max-width: 1000px; max-height: 700px;\">"), {
          modalClose: true
      });
  });
  var iptPhotoTag = $('#iptPhotoTag');
  $('#btnSearch').click(function () {
      var title = iptPhotoTag.val();
      if (title)
          opg_ts_1.default.api.getPhotosByTag({ title: title }, function (data) { return bindPhotoList(data); });
  });
  //防止在第二层添加节点
  /*function removeRadioBox() {
      tree.jq.find(':radio').each((i, elem) => {
          let sp = $(elem).closest('span');
          if (~~sp.data('depth') === 1) {
              elem.remove();
          }
      })
  }*/
  //# sourceMappingURL=/itb-dist/pc/pages/itb/gallery/index.js.map?__=1552033897847
  

});
