define('ts/ui/Table.ts', function(require, exports, module) {

  "use strict";
  var __extends = (this && this.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });
  var DisplayOject_1 = require("ts/ui/DisplayOject.ts");
  var Languages_1 = require("ts/util/Languages.ts");
  var jsonFormat = (function () {
      var pattern = /\${(\w+[.]*\w*)\}(?!})/g;
      return function (template, json) {
          return template.replace(pattern, function (match, key, value) {
              return json[key];
          });
      };
  })();
  function makeTemplate(sets) {
      var tdTmp = [], render, name, i = 0, l = sets.columns ? sets.columns.length : 0;
      for (var col = void 0; i < l, col = sets.columns[i]; i++) {
          if (typeof col.render === 'function') {
              name = col.src + '_render' + DisplayOject_1.DisplayObject.guid();
              render = ':=' + name;
              sets.bindOptions.itemRender[name] = col.render;
          }
          else
              render = '';
          if (col.cmd) {
              if (col.cmd === 'checkAll') {
                  tdTmp[i] = '<td class="text-center"><input type="checkbox" name="chk_' + i + '" value="${' + col.src + render + '}"></td>';
              }
              else {
                  tdTmp[i] = '<td class="text-center"><input type="radio" name="chk_' + i + '" value="${' + col.src + render + '}"></td>';
              }
              if (!this.cmd) {
                  this.cmd = col.cmd;
                  this.cmdColumnIndex = i;
              }
          }
          else {
              var classAlign = "text-" + (col.align ? col.align.toLowerCase() : "center");
              tdTmp[i] = '<td class="' + classAlign + '">${' + col.src + render + '}</td>';
          }
      }
      //console.log('<tr>' + tdTmp.join('') + '</tr>');
      var trSrc;
      if (sets.rows && sets.rows.render) {
          trSrc = sets.rows.src || '___';
          sets.bindOptions.itemRender['__renderTr'] = function (val, i, row, attr) {
              var cn = sets.rows.render(val, i, row, attr) || '';
              var sn = (i % 2 ? 'odd' : 'even');
              return sn + ' ' + cn;
          };
      }
      else {
          trSrc = '___';
          sets.bindOptions.itemRender['__renderTr'] = function (val, i) { return (i % 2 ? 'odd' : 'even'); };
      }
      return '<tr class="${' + trSrc + ':=__renderTr}">' + tdTmp.join('') + '</tr>';
  }
  function makeTbStructor(tb, sets) {
      var i = 0, l = sets.columns ? sets.columns.length : 0, colCss = [], th = [];
      for (var col = void 0; col = sets.columns[i]; i++) {
          if (col.cmd) {
              col.width = col.width || 32;
              if (col.cmd === 'checkAll')
                  col.text = '<input type="checkbox" name="' + col.src + '" value="chk_' + i + '">';
              else
                  col.text = '<input type="hidden" name="' + col.src + '" value="chk_' + i + '">';
          }
          colCss[i] = "width:" + (col.width ? col.width + "px;" : "auto; ");
          th[i] = '<th style="' + colCss[i] + '">' + (col.text || 'column_' + i) + '</th>';
      }
      var thead = '<thead><tr>' + th.join('') + '</tr></thead>';
      if (sets.fixFooter) {
          var tfoot = (sets.pagination) ? '<div class="gridPaginationFooter"></div>' : '';
          tb.prepend(thead + '<tbody id="' + tb[0].id + '_tbody"></tbody>').after(tfoot);
          var $by = $(document.body), $win_1 = $(window);
          function positionFooter() {
              var $tf = $('.gridPaginationFooter');
              var wh = $win_1.height();
              var dh = $tf.offset().top + $tf.outerHeight() - wh;
              var dw = tb.width();
              if ($win_1.scrollTop() > dh) {
                  $tf.css({ position: "fixed", bottom: 0, width: dw + 'px' });
              }
              else {
                  $tf.css({ position: "static" });
              }
              //console.log(dh , wh , $by.height() , $win.height() , $win.scrollTop() , $tf , $tf.offset().top , $tf.outerHeight())
          }
          $win_1.scroll(positionFooter).resize(positionFooter);
      }
      else {
          var tfoot = (sets.pagination) ? '<tfoot><tr><td colspan="' + (l || '1') + '"></td></tr></tfoot>' : '';
          tb.prepend(thead + '<tbody id="' + tb[0].id + '_tbody"></tbody>' + tfoot);
      }
  }
  function setupTitleBar(tb, sets) {
      var html = "<div class=\"grid-title-bar\">\n\t\t" + sets.title + "\n\t</div>", bar = $(html);
      var btns = "";
      if (sets.buttons && sets.buttons.length) {
          for (var i = 0, l = sets.buttons.length; i < l; i++) {
              var btn = sets.buttons[i];
              btns += "<button id=\"" + btn.id + "\" class=\"" + btn.className + "\">" + btn.html + "</button>";
          }
          bar.append(btns);
      }
      tb.before(bar);
  }
  var Table = /** @class */ (function (_super) {
      __extends(Table, _super);
      function Table(jq, cfg) {
          var _this = this;
          cfg = $.extend({
              bindOptions: {
                  itemRender: {}
              },
              resizable: true
          }, cfg);
          _this = _super.call(this, jq, cfg) || this;
          return _this;
      }
      Table.prototype.init = function (jq, cfg) {
          var _this = this;
          _super.prototype.init.call(this, jq, cfg);
          var isTable = jq[0].tagName === 'TABLE';
          if (isTable) {
              jq.addClass("grid");
              this.table = jq;
          }
          else {
              this.table = $('<table id="' + jq[0].id + '_table" class="grid"></table>');
          }
          this.fetching = false;
          this.resizable = cfg.resizable;
          this._bindOption.template = makeTemplate.call(this, cfg);
          makeTbStructor(this.table, cfg);
          if (cfg.titleBar)
              setupTitleBar(this.table, cfg.titleBar);
          if (!isTable)
              jq.append(this.table);
          this.thead = this.table.find("thead");
          this.cols = cfg.columns.length;
          this.tbody = this.table.find("tbody");
          this.container = this.tbody;
          this.tbody.on('click', 'tr', function (evt) {
              //log($(evt.currentTarget).parents("tr")[0].rowIndex);
              _this.selectHandler(evt);
          });
          if (this.resizable) {
              this.table.resizableColumns({
                  minWidth: 1
              });
          }
          if (cfg.pagination) {
              this.fixFooter = !!(cfg.fixFooter);
              var that_1 = this;
              var pageDefaults = {
                  append_number_input: true,
                  link_to: "javascript:void(0)",
                  num_edge_entries: 1,
                  num_display_entries: 5,
                  items_per_page: 10,
                  prev_text: "&laquo;",
                  next_text: "&raquo;",
                  load_first_page: false,
                  callback: function (pageIndex, paginationContainer) {
                      that_1._param.pageIndex = pageIndex;
                      that_1.update(_this._param);
                      //that.iptPageGo.val(that._param.pageNo);
                      return false;
                  },
                  pageSize: 10,
                  showCount: true,
                  customizable: true,
              };
              if (cfg.pagination.pageSize)
                  cfg.pagination.items_per_page = cfg.pagination.pageSize;
              cfg.pagination = $.extend(pageDefaults, cfg.pagination);
              this.pagination = cfg.pagination;
              this._param = $.extend({
                  pageIndex: 0,
                  pageSize: cfg.pagination.pageSize
              }, cfg.param);
          }
      };
      Table.prototype.createdHandler = function (data) {
          if (this.cmd === 'checkAll') {
              this.cmdCheckAll = this.thead.find('th:eq(' + this.cmdColumnIndex + ')').find('input');
              this.cmdCheckAll.syncCheckBoxGroup('td:eq(' + this.cmdColumnIndex + ')>:checkbox:enabled', this.tbody.find('tr'));
          }
          else if (this.cmd === 'checkOne') {
              this.cmdCheckOne = this.thead.find('th:eq(' + this.cmdColumnIndex + ')').find('input:hidden');
          }
          this._created = true;
          if (this._createdPromise) {
              this._createdPromise.resolve();
          }
          if (this.onCreate)
              this.onCreate(data);
      };
      Table.prototype.bindHandler = function (json) {
          if (this.pagination) {
              this.makePager(~~json.totalRecord);
          }
          if (typeof this.onBind === 'function')
              this.onBind(json);
      };
      Table.prototype.updateHandler = function (json) {
          if (this.cmdCheckAll) {
              this.cmdCheckAll.prop("checked", false);
              this.cmdCheckAll.syncCheckBoxGroup('td:eq(' + this.cmdColumnIndex + ')>:checkbox:enabled', this.tbody.find('tr'));
          }
          if ($.isFunction(this.onUpdate))
              this.onUpdate(json);
          return this;
      };
      //分页
      Table.prototype.makePager = function (rowCount) {
          var _this = this;
          var that = this;
          var pageCount = Math.ceil(rowCount / this._param.pageSize);
          if (pageCount === 0)
              pageCount = 1;
          //console.log(this._param , pageCount , this.pageCount , this.fetching);
          if (this._param.pageIndex > 0 && pageCount < this.pageCount) {
              if (this.fetching)
                  this.fetching = false;
              else {
                  this.fetching = true;
                  this._param.pageIndex -= (this.pageCount - pageCount) - 1;
                  return setTimeout(function () { return _this.update(); }, 0);
              }
          }
          this.pageCount = pageCount;
          var pageNum = this._param.pageIndex + 1;
          if (this.tPager) {
              this.pagination.current_page = this._param.pageIndex;
              this.tPager.pagination(rowCount, this.pagination);
              if (this.pagination.showCount) {
                  //this.pageCounter.html(format.json(this.pageTemplate, {rowCount, pageNum, pageCount}));
                  this.pageCounter.find('.bt').text(rowCount);
                  //this.iptPageGo.val(pageNum).data('total' , pageCount);
                  this.pageCounter.find('.bc').text(pageCount);
              }
          }
          else {
              this.tfoot = this.fixFooter ? this.table.next('.gridPaginationFooter') : this.table.find("tfoot td:eq(0)");
              this.tPager = $('<div class="pagination_container"></div>').appendTo(this.tfoot);
              this.tPager.pagination(rowCount, this.pagination);
              this.iptPageGo = this.tfoot.find('.iptPageGo');
              this.pagination.append_number_input = this.iptPageGo;
              this.pageCounter = $('<span></span>');
              this.tPager.after(this.pageCounter);
              if (this.pagination.showCount) {
                  if (typeof this.pagination.showCount === "string")
                      this.pageTemplate = this.pagination.showCount;
                  else {
                      if (Languages_1.Languages.current === Languages_1.Languages.names.cn) {
                          this.pageTemplate = '共<span class="bt">${rowCount}</span>条记录 , 第<span class="bf">${pageNum}</span> / <span class="bc">${pageCount}</span>页';
                      }
                      else {
                          this.pageTemplate = 'total: <span class="bt">${rowCount}</span> record(s), <span class="bf">${pageNum}</span> / <span class="bc">${pageCount}</span> page(s)';
                      }
                  }
                  this.pageCounter.html(jsonFormat(this.pageTemplate, { rowCount: rowCount, pageNum: pageNum, pageCount: pageCount }));
                  var bf = this.pageCounter.find('.bf');
                  this.iptPageGo.val(pageNum); //.data('total' , pageCount);
                  bf.replaceWith(this.iptPageGo);
              }
              if (this.pagination.customizable) {
                  if (typeof this.pagination.customizable != 'object')
                      this.pagination.customizable = [10, 20, 50];
                  var ps = this.pagination.customizable, arq = [];
                  for (var q = 0, ql = ps.length; q < ql; q++)
                      arq[q] = '<option value="' + ps[q] + '" ' + (ps[q] == this.pagination.pageSize ? 'selected' : '') + '>' + ps[q] + '</option>';
                  var pageSelector = $('<select>' + arq.join('') + '</select>');
                  if (Languages_1.Languages.current === Languages_1.Languages.names.cn)
                      this.pageCounter.after($('<label class="pageSelectorLabel">每页</label>').append(pageSelector).append('条'));
                  else
                      this.pageCounter.after($('<label class="pageSelectorLabel"></label>').append(pageSelector).append(' / page'));
                  //on change event
                  pageSelector.on('change.opg', function () {
                      that.pagination.items_per_page = that._param.pageSize = ~~this.options[this.selectedIndex].value;
                      that._param.pageIndex = 0;
                      that.update(that._param);
                      return false;
                  });
              }
          }
      };
      //@return object array
      Table.prototype.getCheckData = function () {
          if (this.cmd) {
              var key = (this.cmdCheckAll || this.cmdCheckOne).val(), chkBoxes = this.tbody.find("input[name='" + key + "']"), rev = this.cmdCheckAll ? [] : null;
              for (var i = 0, l = chkBoxes.length; i < l; i++) {
                  if (chkBoxes[i].checked) {
                      if (this.cmdCheckOne)
                          return this.data[i];
                      else
                          rev.push(this.data[i]);
                  }
              }
              return rev;
          }
          else
              return null;
      };
      //@return string value array
      Table.prototype.getCheckedValue = function () {
          if (this.cmd) {
              var key = (this.cmdCheckAll || this.cmdCheckOne).val(), chkBoxes = this.tbody.find("input[name='" + key + "']:checked");
              var rev_1;
              if (this.cmdCheckAll) {
                  rev_1 = [];
                  chkBoxes.each(function (i, elem) {
                      rev_1.push(elem.value);
                  });
              }
              else {
                  rev_1 = chkBoxes.length ? chkBoxes.val() : null;
              }
              return rev_1;
          }
          else
              return null;
      };
      return Table;
  }(DisplayOject_1.AjaxDisplayObject));
  exports.default = Table;
  //# sourceMappingURL=/itb-dist/pc/ts/ui/Table.js.map?__=1552033897847
  

});
