define('pages/navigation/FMap.ts', function(require, exports, module) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var FloorSelector_1 = require("pages/navigation/FloorSelector.ts");
  var util_1 = require("js/util.ts");
  var FMap = /** @class */ (function () {
      function FMap() {
          this.initMap('10347', 'ITB', '7be95456a5867df0cb3b276dadeb52ad');
      }
      FMap.prototype.initMap = function (mapID, appName, appKey) {
          var _this = this;
          window['map'] = this.map = new fengmap.FMMap({
              //渲染dom
              container: document.getElementById('fengMap'),
              //地图数据位置
              mapServerURL: './assets/data/' + mapID,
              //主题数据位置
              mapThemeURL: './assets/data/theme',
              //设置主题
              defaultThemeName: '3007',
              // 默认比例尺级别设置为20级
              defaultMapScaleLevel: 20,
              //对不可见图层启用透明设置 默认为true
              focusAlphaMode: false,
              //关闭聚焦层切换的动画显示
              focusAnimateMode: false,
              //对不聚焦图层启用透明设置，当focusAlphaMode = true时有效
              focusAlpha: 0.1,
              //开启2维，3维切换的动画显示
              viewModeAnimateMode: true,
              //设置最大倾斜角
              defaultMaxTiltAngle: 80,
              //设置倾斜角，默认倾斜角为60度
              defaultTiltAngle: 30,
              //开发者申请应用下web服务的key
              key: appKey,
              //开发者申请应用名称
              appName: appName,
          });
          this.map.openMapById(mapID);
          //地图加载完成回调
          this.map.on('loadComplete', function () {
              //默认楼层加载完后不显示，需自定义设置要显示的楼层和聚焦层
              _this.map.visibleGroupIDs = _this.map.groupIDs;
              _this.map.focusGroupID = _this.map.groupIDs[0];
              layerGroup.init(_this.map.listGroups, _this.map.focusGroupID);
              //获取搜索类
              _this.searchAnalyser = _this.map.searchAnalyser;
              //
              _this.initSearcher();
              _this.nav = new fengmap.FMNavigation({
                  map: _this.map,
                  lineStyle: {
                      lineType: fengmap.FMLineType.FMARROW,
                      lineWidth: 6,
                  },
              });
          });
      };
      FMap.prototype.findCoordinate = function (fid) {
          var _this = this;
          this.oHotwords.style.display = 'none';
          var searchReq = new fengmap.FMSearchRequest(fengmap.FMNodeType.MODEL); //设置查询地图元素类型
          searchReq.FID(fid);
          this.searchAnalyser.query(searchReq, function (request, result) {
              //result 为查询到的结果集。
              var models = result[0];
              if (models != null) {
                  _this.filldata(models);
              }
          });
      };
      FMap.prototype.filldata = function (model) {
          this.addMarkers(model.groupID, model.mapCoord.x, model.mapCoord.y);
          var coord = {
              x: model.mapCoord.x,
              y: model.mapCoord.y,
              groupID: model.groupID,
          };
          this.moveTo(coord); //定位跳转
          //地图上当前设置的模型元素处于高亮状态。
          //如果最后一个参数设置为true,storeSelect(model,true,true)，表示之前的和当前的模型都处于高亮转态。可使用map.selectNull()方法清除。
          this.map.storeSelect(model, true, false);
      };
      FMap.prototype.moveTo = function (coord) {
          this.map.visibleGroupIDs = [coord.groupID];
          this.map.focusGroupID = coord.groupID;
          this.map.moveTo(coord);
      };
      //添加Marker
      FMap.prototype.addMarkers = function (gid, X, Y) {
          this.removeMarkers();
          var group = this.map.getFMGroup(gid);
          //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
          var layer = group.getOrCreateLayer('imageMarker');
          var im = new fengmap.FMImageMarker({
              x: X,
              y: Y,
              url: './assets/image/blueImageMarker.png',
              size: 32,
              callback: function () {
                  im.alwaysShow();
              },
          });
          layer.addMarker(im);
      };
      FMap.prototype.removeMarkers = function () {
          //获取多楼层Marker
          this.map.callAllLayersByAlias('imageMarker', function (layer) {
              layer.removeAll();
          });
      };
      FMap.prototype.initSearcher = function () {
          var _this = this;
          this.oSeachText = document.getElementById('seachText');
          this.oHotwords = document.getElementById('hotwords');
          var that = this;
          //创建提示下拉框
          var createLi = function (data) {
              that.oHotwords.innerHTML = '';
              var li = '';
              for (var i in data) {
                  var model = data[i];
                  li += '<li data-id="' + model.FID + '">' + (!model.name ? '空' : model.name) + '</li>';
              }
              that.oHotwords.innerHTML = li;
              var aLi = that.oHotwords.getElementsByTagName('li');
              for (var i = 0; i < aLi.length; i++) {
                  (function (i) {
                      aLi[i].onclick = function () {
                          var index = i;
                          that.oSeachText.value = this.innerHTML;
                          var fid = this.attributes['data-id'].nodeValue;
                          that.findCoordinate(fid);
                          that.oHotwords.style.display = 'none';
                      };
                  })(i);
              }
          };
          //根据关键字查询店铺
          this.oSeachText.addEventListener('keyup', function (e) {
              var keyword = _this.oSeachText.value;
              if (keyword !== '') {
                  var searchReq = new fengmap.FMSearchRequest(fengmap.FMNodeType.MODEL);
                  searchReq.keyword(keyword);
                  _this.searchAnalyser.query(searchReq, function (request, result) {
                      var models = result;
                      if (models != null && models.length > 0) {
                          _this.oHotwords.style.display = 'block';
                          createLi(models);
                      }
                      else {
                          _this.oHotwords.style.display = 'none';
                      }
                  });
              }
          });
      };
      //楼层选择器
      FMap.prototype.initFloorSelector = function () {
          var _this = this;
          var floorArr = [
              { value: 1, text: util_1.Languages.package.floor1 },
              { value: 2, text: util_1.Languages.package.floor2 },
          ];
          this.floorSelector = new FloorSelector_1.FloorSelector(floorArr, 'sel1');
          this.floorSelector.button.addEventListener('tap', function (event) {
              _this.floorSelector.picker.show(function (items) {
                  _this.floorSelector.button.innerText = items[0].text;
              });
          });
      };
      return FMap;
  }());
  exports.default = FMap;
  //# sourceMappingURL=/itb-dist/wap/pages/navigation/FMap.js.map?__=
  

});
