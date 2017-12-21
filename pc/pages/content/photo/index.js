define('pages/content/photo/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  var store_1 = require("ts/util/store.ts");
  opg_ts_1.default.api({
      getTypes: 'phototype/getallphototypes',
      'addType!POST': 'phototype/AddPhotoType',
      'editType!POST': 'phototype/UpPhotoType',
      delType: 'phototype/DelPhotoType',
      getPhotosByTypeId: 'photo/GetPhotosByTypeId',
      delPhotosByTypeId: 'photo/DelPhotosByTypeId',
      'delPhotosByIds!POST': 'photo/DelPhotosByIds',
  });
  var lpg = Languages_1.Languages.package;
  var permission = store_1.store.get('permission');
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
  function showPhotos(typeid) {
      opg_ts_1.default.api.getPhotosByTypeId({ typeid: typeid }, function (data) {
          ul.bindList({
              list: data,
              template: '<li><img src="${url}" alt="${title}"><p><label><input type="checkbox" name="photo" value="${id}"> ${title}</label></p></li>'
          });
      });
  }
  showPhotos(currentCategoryId);
  //防止在第二层添加节点
  /*function removeRadioBox() {
      tree.jq.find(':radio').each((i, elem) => {
          let sp = $(elem).closest('span');
          if (~~sp.data('depth') === 1) {
              elem.remove();
          }
      })
  }*/
  if (permission.PhotoTypeManagment) {
      $('#pButton').show();
      // add category
      $('#btnAddType').click(function () {
          var checkedRadio = tree.jq.find(':radio:checked');
          var sp = checkedRadio.closest('span');
          if (~~sp.data('depth') === 2) {
              return top.opg.warn(lpg.addCategoryWarn);
          }
          var nameInput = $('<input type="text" name="name">');
          var pop = top.opg.confirm($("<div style=\"padding: 20px;\">" + lpg.categoryName + ": </div>").append(nameInput), function () {
              var name = nameInput.val();
              if (name) {
                  var parentid = checkedRadio.val();
                  opg_ts_1.default.api.addType({ parentid: parentid, name: name }, function () {
                      tree.update();
                      pop.close();
                  });
              }
              return true;
          }, {
              title: lpg.addCategory,
              width: 500,
              height: 200,
          });
      });
      // edit category
      $('#btnEdit').click(function () {
          var checkedRadio = tree.jq.find(':radio:checked');
          var id = ~~checkedRadio.val();
          if (!id) {
              return top.opg.warn(lpg.editCategoryWarn);
          }
          var lb = checkedRadio.closest('label');
          var nameInput = $("<input type=\"text\" name=\"name\" value=\"" + lb.text() + "\">");
          var pop = top.opg.confirm($("<div style=\"padding: 20px;\">" + lpg.categoryName + ": </div>").append(nameInput), function () {
              var name = nameInput.val();
              if (name) {
                  var parentid = lb.closest('ul').closest('li').data('id');
                  opg_ts_1.default.api.editType({ parentid: parentid, name: name, id: id }, function () {
                      tree.update();
                      pop.close();
                  });
              }
              return true;
          }, {
              title: lpg.editCategory,
              width: 500,
              height: 200,
          });
      });
      // delete category
      $('#btnDelType').click(function () {
          var pop = top.opg.confirm(lpg.deleteCategoryWarn, function () {
              var id = $(":radio[name=tree_" + treeName + "Rd]:checked").val();
              opg_ts_1.default.api.delType({ id: id }, function () {
                  tree.update();
                  pop.close();
              });
          }, {});
      });
  }
  //
  if (permission.PhotoOperation) {
      $('#photoManage').show();
      var infoPage_1 = '/itb-dist/pc/pages/content/photo/add.html?__=';
      $('#btnAdd').click(function () {
          var src = utils_1.url.setParam(infoPage_1, { typeId: currentCategoryId });
          var pop = opg_ts_1.default.popTop("<iframe src=\"" + src + "\" />", {
              title: "" + lpg.add,
              btnMax: true,
              width: 800,
              height: 400,
              buttons: {
                  save: {
                      className: 'btn-success',
                      text: lpg.save,
                      onClick: function (i, ifr) {
                          ifr.save(pop);
                          return true;
                      }
                  },
                  cancel: lpg.cancel
              },
              onClose: function () {
                  showPhotos(currentCategoryId);
              }
          });
      });
      $('#btnDeleteSelected').click(function () {
          var ids = [];
          $(':checkbox[name=photo]:checked').each(function (i, elem) {
              ids.push(~~elem.value);
          });
          if (ids.length) {
              top.opg.confirm(lpg.deleteSelected, function () {
                  opg_ts_1.default.api.delPhotosByIds(ids, function () {
                      showPhotos(currentCategoryId);
                  });
              }, {
                  title: lpg.plsConfirm
              });
          }
      });
      $('#btnDeleteAll').click(function () {
          top.opg.confirm(lpg.deleteAll, function () {
              opg_ts_1.default.api.delPhotosByTypeId({ typeid: currentCategoryId }, function () {
                  showPhotos(currentCategoryId);
              });
          }, {
              title: lpg.plsConfirm
          });
      });
  }
  //# sourceMappingURL=/itb-dist/pc/pages/content/photo/index.js.map?__=
  

});
