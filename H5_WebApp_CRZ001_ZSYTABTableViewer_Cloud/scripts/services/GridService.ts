module h5.application {

    export class GridService {

        static $inject = ["$filter", "$timeout", "StorageService", "languageService"];
        private baseGrid: IUIGrid;

        constructor(private $filter: h5.application.AppFilter, private $timeout: ng.ITimeoutService, private storageService: h5.application.StorageService, private languageService: h5.application.LanguageService) {
            this.init();
        }

        private init() {
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
                exporterFieldCallback: (grid: any, row: any, col: any, value: any) => {
                    if (col.name.indexOf('Date') > 0) {
                        value = this.$filter('m3Date')(value, grid.appScope.appConfig.globalDateFormat);
                    }
                    return value;
                },
                exporterPdfCustomFormatter: (docDefinition: any) => {
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
                exporterPdfFooter: (currentPage: number, pageCount: number) => { return { text: 'Page ' + currentPage + ' of ' + pageCount, style: 'pageFooter' }; },
                exporterPdfTableStyle: { margin: [20, 30, 20, 30] },
                exporterPdfMaxGridWidth: 700,
                columnDefs: [{}],
                data: []
            };
        }

        public getBaseGrid(): IUIGrid {
            return angular.copy(this.baseGrid);
        }

        public adjustGridHeight(gridId: string, noOfRows: number, timeDelay: number) {
            noOfRows = (noOfRows < 1 ? 1 : noOfRows);
            this.$timeout(() => {
                let newHeight = noOfRows > 15 ? 600 : (150 + noOfRows * 30);
                angular.element(document.getElementById(gridId)).css('height', newHeight + 'px');
            }, timeDelay);
        }

        public saveGridState(gridId: string, gridApi: any) {
            let gridState = gridApi.saveState.save();
            this.storageService.setLocalData('h5.app.appName.gridState.' + gridId, gridState);
        }

        public restoreGridState(gridId: string, gridApi: any) {
            let gridState = this.storageService.getLocalData('h5.app.appName.gridState.' + gridId);
            if (gridState) {
                this.$timeout(() => {
                    gridApi.saveState.restore(undefined, gridState);
                }, 100);
            }
        }

        public clearGridStates() {
            let gridIds = ["sampleGrid1", "ZSYTABListGrid", "customerMasterListGrid", "itemGroupListGrid"]; //added
            gridIds.forEach((gridId: string) => {
                this.storageService.removeLocalData('h5.app.appName.gridState.' + gridId);
            });

        }

        public getSampleGrid1(): IUIGrid {
            let sampleGrid1: IUIGrid = angular.copy(this.baseGrid);
            sampleGrid1.columnDefs = [
                { name: "division", displayName: this.languageService.languageConstants.get('Division') },
                { name: "payerNo", displayName: this.languageService.languageConstants.get('PayerNo'), headerCellClass: "text-right", cellClass: "text-right" },
                { name: "customerNo", displayName: this.languageService.languageConstants.get('CustomerNo'), headerCellClass: "text-right", cellClass: "text-right" },
                { name: "invoiceNo", displayName: this.languageService.languageConstants.get('InvoiceNo'), headerCellClass: "text-right", cellClass: "text-right" },
                {//DATE
                    name: "invoiceDate", displayName: this.languageService.languageConstants.get('InvoiceDate'), cellFilter: "m3Date:grid.appScope.appConfig.globalDateFormat",
                    filters: [{ condition: (searchTerm, cellValue) => { return this.$filter('m3DateFilter')(64, searchTerm, cellValue) }, placeholder: '> =' },
                        { condition: (searchTerm, cellValue) => { return this.$filter('m3DateFilter')(256, searchTerm, cellValue) }, placeholder: '< =' }]
                }];
            sampleGrid1.exporterCsvFilename = "sample_list.csv";
            sampleGrid1.exporterPdfFilename = "sample_list.pdf";
            sampleGrid1.saveSelection = false;
            return sampleGrid1;
        }


      
        public getZSYTABListGrid(): IUIGrid {
            let ZSYTABListGrid: IUIGrid = angular.copy(this.baseGrid);
            let gridLinkCellTemplate = "<div class=\"ui-grid-cell-contents\" title=\"TOOLTIP\"><span class=\"h5-link\" ng-click=\"grid.appScope.globalSelection.openWindowForSelectedRow(col.field, row.entity)\">{{COL_FIELD CUSTOM_FILTERS}}</span></div>";
            

            ZSYTABListGrid.columnDefs = [
                { name: "AL30", displayName: this.languageService.languageConstants.get('Application Name'), cellTemplate: gridLinkCellTemplate , enableCellEdit: false},
                { name: "PK01", displayName: this.languageService.languageConstants.get('Table'), headerCellClass: "text-left", cellClass: "text-left" , enableCellEdit: false},
               
                ],
                  
            ZSYTABListGrid.exporterCsvFilename = "sample_list.csv";
            ZSYTABListGrid.exporterPdfFilename = "sample_list.pdf";
            ZSYTABListGrid.saveSelection = false;
            return ZSYTABListGrid;
        }

    }

}