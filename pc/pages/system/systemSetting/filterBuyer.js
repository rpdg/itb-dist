define('pages/system/systemSetting/filterBuyer.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var opg_1 = require("ts/opg.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var api_1 = require("ts/util/api.ts");
  opg_1.default.api({
      product: 'product/GetProductGroup',
      region: 'country/GetAllCountryExceptChina',
      segments: 'product/GetProductTypes',
      getBuyers: 'buyer/FilterBuyers',
  });
  var lng = Languages_1.Languages.package;
  var tbSearch = $('#tbSearch');
  opg_1.default.wrapPanel(tbSearch, {
      title: null,
      btnSearchText: lng.search,
      btnSearchClick: function () {
          var param = tbSearch.fieldsToJson();
          // if(param.country === '' && param.group === '' && param.product==='')
          // 	return opg.warn(lng.filterWarn) ;
          tb.update(param);
      },
  });
  opg_1.default('#region').listBox({
      //text : lng.current === 'en'? 'name_en': 'name_cn',
      api: api_1.api.region,
      value: 'id',
      bindOptions: {
          template: '<option value="${id}">${name:=some}</option>',
          itemRender: {
              some: function (name, index, row) {
                  return row.name_en + " " + row.name_cn;
              }
          }
      }
  });
  opg_1.default('#segments').listBox({
      api: api_1.api.segments,
      text: lng.current === 'en' ? 'groupBuyer_en' : 'groupBuyer_cn',
  });
  opg_1.default('#product').listBox({
      api: api_1.api.product,
      text: lng.current === 'en' ? 'groupBuyer_en' : 'groupBuyer_cn',
  });
  var tb = opg_1.default('#tb').table({
      api: api_1.api.getBuyers,
      lazy: true,
      pagination: false,
      columns: [
          {
              src: 'barcode',
              cmd: 'checkAll',
          },
          {
              text: "" + lng.name,
              src: 'name',
              width: 120,
          },
          {
              text: "" + lng.barcode,
              src: 'barcode',
          },
      ]
  });
  window['getTbData'] = function () {
      console.log(tb.getCheckedValue());
      return tb.getCheckedValue();
  };
  //# sourceMappingURL=/itb-dist/pc/pages/system/systemSetting/filterBuyer.js.map?__=1552033897847
  

});
