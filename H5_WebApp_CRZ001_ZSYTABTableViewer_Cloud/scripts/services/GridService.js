var h5;
(function (h5) {
    var application;
    (function (application) {
        var GridService = (function () {
            function GridService($filter, $timeout, storageService, languageService) {
                this.$filter = $filter;
                this.$timeout = $timeout;
                this.storageService = storageService;
                this.languageService = languageService;
                this.init();
            }
            GridService.prototype.init = function () {
                var _this = this;
                this.baseGrid = {
                    enableGridMenu: true,
                    enableRowSelection: true,
                    enableFullRowSelection: false,
                    modifierKeysToMultiSelect: true,
                    modifierKeysToMultiSelectCells: true,
                    enableRowHeaderSelection: true,
                    enableSelectAll: true,
                    showGridFooter: true,
                    showColumnFooter: true,
                    enableColumnMenus: true,
                    enableSorting: true,
                    enableFiltering: true,
                    flatEntityAccess: true,
                    fastWatch: true,
                    scrollDebounce: 500,
                    wheelScrollThrottle: 500,
                    virtualizationThreshold: 10,
                    exporterCsvFilename: "grid_data.csv",
                    exporterPdfFilename: "grid_data.pdf",
                    exporterFieldCallback: function (grid, row, col, value) {
                        if (col.name.indexOf('Date') > 0) {
                            value = _this.$filter('m3Date')(value, grid.appScope.appConfig.globalDateFormat);
                        }
                        return value;
                    },
                    exporterPdfCustomFormatter: function (docDefinition) {
                        docDefinition.styles.pageHeader = { fontSize: 10, italics: true, alignment: 'left', margin: 10 };
                        docDefinition.styles.pageFooter = { fontSize: 10, italics: true, alignment: 'right', margin: 10 };
                        return docDefinition;
                    },
                    exporterPdfDefaultStyle: { fontSize: 9 },
                    exporterPdfHeader: {
                        columns: [
                            { text: 'H5 Application', style: 'pageHeader' }
                        ]
                    },
                    exporterPdfFooter: function (currentPage, pageCount) { return { text: 'Page ' + currentPage + ' of ' + pageCount, style: 'pageFooter' }; },
                    exporterPdfTableStyle: { margin: [20, 30, 20, 30] },
                    exporterPdfMaxGridWidth: 700,
                    columnDefs: [{}],
                    data: []
                };
            };
            GridService.prototype.getBaseGrid = function () {
                return angular.copy(this.baseGrid);
            };
            GridService.prototype.adjustGridHeight = function (gridId, noOfRows, timeDelay) {
                noOfRows = (noOfRows < 1 ? 1 : noOfRows);
                this.$timeout(function () {
                    var newHeight = noOfRows > 15 ? 600 : (150 + noOfRows * 30);
                    angular.element(document.getElementById(gridId)).css('height', newHeight + 'px');
                }, timeDelay);
            };
            GridService.prototype.saveGridState = function (gridId, gridApi) {
                var gridState = gridApi.saveState.save();
                this.storageService.setLocalData('h5.app.appName.gridState.' + gridId, gridState);
            };
            GridService.prototype.restoreGridState = function (gridId, gridApi) {
                var gridState = this.storageService.getLocalData('h5.app.appName.gridState.' + gridId);
                if (gridState) {
                    this.$timeout(function () {
                        gridApi.saveState.restore(undefined, gridState);
                    }, 100);
                }
            };
            GridService.prototype.clearGridStates = function () {
                var _this = this;
                var gridIds = ["sampleGrid1", "ZSYTABListGrid", "customerMasterListGrid", "itemGroupListGrid"];
                gridIds.forEach(function (gridId) {
                    _this.storageService.removeLocalData('h5.app.appName.gridState.' + gridId);
                });
            };
            GridService.prototype.getSampleGrid1 = function () {
                var _this = this;
                var sampleGrid1 = angular.copy(this.baseGrid);
                sampleGrid1.columnDefs = [
                    { name: "division", displayName: this.languageService.languageConstants.get('Division') },
                    { name: "payerNo", displayName: this.languageService.languageConstants.get('PayerNo'), headerCellClass: "text-right", cellClass: "text-right" },
                    { name: "customerNo", displayName: this.languageService.languageConstants.get('CustomerNo'), headerCellClass: "text-right", cellClass: "text-right" },
                    { name: "invoiceNo", displayName: this.languageService.languageConstants.get('InvoiceNo'), headerCellClass: "text-right", cellClass: "text-right" },
                    {
                        name: "invoiceDate", displayName: this.languageService.languageConstants.get('InvoiceDate'), cellFilter: "m3Date:grid.appScope.appConfig.globalDateFormat",
                        filters: [{ condition: function (searchTerm, cellValue) { return _this.$filter('m3DateFilter')(64, searchTerm, cellValue); }, placeholder: '> =' },
                            { condition: function (searchTerm, cellValue) { return _this.$filter('m3DateFilter')(256, searchTerm, cellValue); }, placeholder: '< =' }]
                    }];
                sampleGrid1.exporterCsvFilename = "sample_list.csv";
                sampleGrid1.exporterPdfFilename = "sample_list.pdf";
                sampleGrid1.saveSelection = false;
                return sampleGrid1;
            };
            GridService.prototype.getZSYTABListGrid = function () {
                var ZSYTABListGrid = angular.copy(this.baseGrid);
                var gridLinkCellTemplate = "<div class=\"ui-grid-cell-contents\" title=\"TOOLTIP\"><span class=\"h5-link\" ng-click=\"grid.appScope.globalSelection.openWindowForSelectedRow(col.field, row.entity)\">{{COL_FIELD CUSTOM_FILTERS}}</span></div>";
                ZSYTABListGrid.columnDefs = [
                    { name: "AL30", displayName: this.languageService.languageConstants.get('Application Name'), cellTemplate: gridLinkCellTemplate, enableCellEdit: false },
                    { name: "PK01", displayName: this.languageService.languageConstants.get('Table'), headerCellClass: "text-left", cellClass: "text-left", enableCellEdit: false },
                ],
                    ZSYTABListGrid.exporterCsvFilename = "sample_list.csv";
                ZSYTABListGrid.exporterPdfFilename = "sample_list.pdf";
                ZSYTABListGrid.saveSelection = false;
                return ZSYTABListGrid;
            };
            GridService.$inject = ["$filter", "$timeout", "StorageService", "languageService"];
            return GridService;
        }());
        application.GridService = GridService;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
