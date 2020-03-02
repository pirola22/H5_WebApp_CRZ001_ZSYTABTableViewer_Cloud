module h5.application {
    export interface ICustomerMasterModule {
        
        reload: boolean;
        transactionStatus: {
            customerMasterList: boolean;
            
        };
        customerMasterList: any;
        customerMasterListGrid : IUIGrid;
        selectedCustomerMasterListRow: any;
        
    }
}