module h5.application {
    export interface IItemGroupModule {
        
        reload: boolean;
        transactionStatus: {
            itemGroupList: boolean;
            addItemGroup: boolean;
        };
        itemGroupList: any;
        itemGroupListGrid: IUIGrid;
        selectedItemGroupListRow: any;
        addItemGroup: any;
        openItemGroupDetailModal?(fieldName: string, rowEntity: any): any;
    }
}