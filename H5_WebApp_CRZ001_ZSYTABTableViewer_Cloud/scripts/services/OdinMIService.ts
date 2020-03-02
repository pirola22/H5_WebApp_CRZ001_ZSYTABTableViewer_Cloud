module h5.application {
   
    export interface IOdinMIService {
       
        callWebService(program: string, transaction: string, requestData: any, maxReturnedRecords: number): ng.IPromise<M3.IMIResponse>;
    }
    
    export class OdinMIService implements IOdinMIService {
       
        static $inject  = ["m3MIService"];
        constructor (private miService: M3.IMIService){}
        
        public callWebService(program: string, transaction: string, requestData: any, maxReturnedRecords=100): ng.IPromise<M3.IMIResponse> {
            
            let request: M3.IMIRequest = {
              program:  program,
              transaction: transaction,
              record: requestData,
              maxReturnedRecords: maxReturnedRecords
            };
            
            return this.miService.executeRequest(request).then((val: M3.IMIResponse) => {return val;});
        }
    }
}