define('pages/content/exhibition/index.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_ts_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var utils_1 = require("ts/util/utils.ts");
  var store_1 = require("ts/util/store.ts");
  var Combo_1 = require("ts/ui/Combo.ts");
  var store_2 = require("ts/util/store.ts");
  var categoryType = 1; //0为媒体...1为展会信息
  var cache = store_2.Cache.getInstance();
  opg_ts_1.default.api({
      getTypes: 'meinfotype/GetMediaExhibtionInfoType?type=' + categoryType,
      'addType!POST': 'meinfotype/AddMediaExhibitionInfoType',
      'editType!POST': 'meinfotype/UpMediaExhibitionInfoType',
      delType: 'meinfotype/DelMediaExhibitionInfoType',
      'getMedia!POST': 'mediaexhibtion/QueryMediaExhibitionInfos',
      'delPhotosByIds!POST': 'photo/DelPhotosByIds',
      setStick: 'mediaexhibtion/SetMediaExhibitionInfoStick',
      cancelStick: 'mediaexhibtion/CancelMediaExhibitionInfoStick',
      'setStatus!post': 'mediaexhibtion/EnableOrDisableMediaExhibitionInfoById',
  });
  var lpg = Languages_1.Languages.package;
  var permission = store_1.store.get('permission') || '';
  var categoryData = [];
  function setCategoryData() {
      /*categoryData = {};
      let arr = <Array> tree.data;
      arr.forEach((v)=>{
          categoryData[v.id] = v.name;
      });*/
      categoryData = tree.data;
      categoryData.splice(0, 0, { id: 0, name: lpg.root });
      cache.set('categoryData', categoryData);
      console.log('categoryData', categoryData);
  }
  var treeName = 'mediaTypes';
  var tree = opg_ts_1.default('#tree').tree({
      api: opg_ts_1.default.api.getTypes,
      name: treeName,
      root: "<label><input type=\"radio\" name=\"tree_" + treeName + "Rd\" value=\"0\" checked> " + lpg.root + "</label>",
      cmd: 'checkOne',
      childSrc: 'childPhotoTypes',
      onCreate: setCategoryData,
      onUpdate: setCategoryData,
  });
  tree.jq.on('change', ':radio', function () {
      var elem = $(this), id = elem.val(), deal = elem.prop('checked');
      var name = elem.closest('label').text();
      //console.warn(elem.parent() , elem.parent().text() , name);
      if (deal) {
          currentCategoryId = id;
          currentCategoryName = name.trim();
          tb.update({ mediaExhibtionInfoTypeId: id });
          document.getElementById('form1').reset();
      }
  });
  var currentCategoryId = 0;
  var currentCategoryName = lpg.root;
  var panel = opg_ts_1.default.wrapPanel('#form1', {
      title: "" + lpg.current + lpg.exhibitionCategory + lpg.search,
      btnSearchText: "<i class=\"ico-find\"></i> " + lpg.search,
      btnSearchClick: function () {
          var param = $('#tbSearch').fieldsToJson();
          if (param.beginDate && param.beginDate.indexOf(' ') < 0) {
              param.beginDate += ' 00:00:00';
          }
          if (param.endDate && param.endDate.indexOf(' ') < 0) {
              param.endDate += ' 23:59:59';
          }
          //console.log(panel.jq, param);
          tb.update(param);
      },
  });
  jQuery.datetimepicker.setLocale(Languages_1.Languages.current);
  Combo_1.Combo.makeClearableInput($('#beginDate').datetimepicker({
      timepicker: false,
      closeOnDateSelect: true,
      format: 'Y-m-d',
  }), $({}));
  Combo_1.Combo.makeClearableInput($('#endDate').datetimepicker({
      timepicker: false,
      closeOnDateSelect: true,
      format: 'Y-m-d',
  }), $({}));
  var tbButtons = [];
  if (permission) {
      if (permission['AddExhibitionInfo']) {
          tbButtons.push({ id: 'btnAdd', className: 'btn-create', html: "<i class=\"ico ico-create\"></i> " + lpg.add });
      }
  }
  var tb = opg_ts_1.default('#tb').table({
      api: opg_ts_1.default.api.getMedia,
      param: {
          informationType: categoryType,
          mediaExhibtionInfoTypeId: currentCategoryId,
      },
      titleBar: {
          title: "" + lpg.exhibitionUnderCurrentCategory,
          buttons: tbButtons,
      },
      columns: [
          {
              text: 'ID', width: 120,
              src: 'id',
          },
          {
              text: lpg.exhibitionTitle,
              src: 'title',
          },
          {
              text: lpg.publisher,
              src: 'from',
              width: 150,
          },
          {
              text: lpg.stick,
              src: 'stick',
              width: 60,
              render: function (v) { return v ? lpg.yes : lpg.no; },
          },
          {
              text: lpg.status,
              src: 'status',
              width: 100,
              render: function (v) { return v ? lpg.online : lpg.offline; },
          },
          {
              text: lpg.process,
              src: 'id',
              width: 180,
              align: 'left',
              render: function (id, index, row) {
                  var html = "<button data-id=\"" + id + "\" data-index=\"" + row[':index'] + "\" class=\"btn-mini btn-info btnEdit\">" + lpg.edit + "</button> ";
                  if (!row.stick) {
                      html += "<button data-id=\"" + id + "\" class=\"btn-mini btn-success btnSetStick\">" + lpg.stick + "</button> ";
                  }
                  else {
                      html += "<button data-id=\"" + id + "\" class=\"btn-mini btn-warning btnCancelStick\">" + lpg.cancelStick + "</button> ";
                  }
                  if (row.status) {
                      html += "<button data-id=\"" + id + "\" class=\"btn-mini btn-danger btnOffline\">" + lpg.offline + "</button>";
                  }
                  else {
                      html += "<button data-id=\"" + id + "\" class=\"btn-mini btn-success btnOnline\">" + lpg.online + "</button>";
                  }
                  return html;
              },
          },
      ],
      pagination: true,
  });
  if (permission.ExhibitionInfoType) {
      $('#pButton').show();
      // add category
      $('#btnAddType').click(function () {
          var checkedRadio = tree.jq.find(':radio:checked');
          var sp = checkedRadio.closest('span');
          if (~~sp.data('depth') === 1) {
              return top.opg.warn(lpg.addCategoryWarn);
          }
          var nameInput = $('<input type="text" name="name">');
          var pop = top.opg.confirm($("<div style=\"padding: 20px;\">" + lpg.categoryName + ": </div>").append(nameInput), function () {
              var name = nameInput.val();
              if (name) {
                  opg_ts_1.default.api.addType({ type: categoryType, name: name }, function () {
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
                  opg_ts_1.default.api.editType({ type: categoryType, name: name, id: id }, function () {
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
  if (permission.AddExhibitionInfo) {
      var infoPage_1 = '/itb-dist/pc/pages/content/exhibition/add.html?__=1552033897847';
      $('#btnAdd').click(function () {
          var src = utils_1.url.setParam(infoPage_1, { categoryId: currentCategoryId });
          var pop = opg_ts_1.default.popTop("<iframe src=\"" + src + "\" />", {
              title: "" + lpg.add,
              btnMax: true,
              width: 800,
              height: 550,
              onClose: function () {
                  tb.update(currentCategoryId);
              },
          });
      });
      //edit item
      tb.tbody.on('click', '.btnEdit', function () {
          var btn = $(this), id = btn.data('id'), index = btn.data('index');
          var row = tb.data[index];
          row.enableStick = row.stick ? 1 : 0;
          row.mediaTypeName = categoryType['mediaexhibitiontype_id'];
          cache.set('row', row);
          var src = utils_1.url.setParam(infoPage_1, { categoryId: currentCategoryId, id: id });
          var pop = opg_ts_1.default.popTop("<iframe src=\"" + src + "\" />", {
              title: lpg.edit + ": " + row.title,
              btnMax: true,
              width: 800,
              height: 550,
              onClose: function () {
                  cache.remove('row');
                  tb.update(currentCategoryId);
              },
          });
      });
      //offline
      tb.tbody.on('click', '.btnOffline', function () {
          var btn = $(this), id = btn.data('id');
          opg_ts_1.default.api.setStatus({ id: id, status: 0 }, function () { return tb.update(); });
      });
      //online
      tb.tbody.on('click', '.btnOnline', function () {
          var btn = $(this), id = btn.data('id');
          opg_ts_1.default.api.setStatus({ id: id, status: 1 }, function () { return tb.update(); });
      });
      //stick
      tb.tbody.on('click', '.btnSetStick', function () {
          var btn = $(this), informationId = btn.data('id');
          opg_ts_1.default.api.setStick({ informationId: informationId }, function () { return tb.update(); });
      });
      //stick
      tb.tbody.on('click', '.btnCancelStick', function () {
          var btn = $(this), informationId = btn.data('id');
          opg_ts_1.default.api.cancelStick({ informationId: informationId }, function () { return tb.update(); });
      });
  }
  //# sourceMappingURL=/itb-dist/pc/pages/content/exhibition/index.js.map?__=1552033897847
  

});
