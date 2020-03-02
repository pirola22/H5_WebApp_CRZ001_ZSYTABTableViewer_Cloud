module h5.application {

    export interface IGlobalSelection {

        reload: boolean;
        transactionStatus: {
            ZSYTABTableList: boolean;
        };
         ZSYTABListGrid: IUIGrid;
        ZSYTABTable: any;
        ZSYTABTableList: any
        division: any;
        openWindowForSelectedRow?(fieldName: string, rowEntity: any): any;
        
        
    }
}