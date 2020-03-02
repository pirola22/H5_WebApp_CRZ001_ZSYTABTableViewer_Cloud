module h5.application {

    export interface IAppService {
        getAuthority(company: string, division: string, m3User: string, programName: string, charAt: number): ng.IPromise<boolean>;
        getDivisionList(company: string, division: string): ng.IPromise<M3.IMIResponse>;
        getWarehouseList(company: string): ng.IPromise<M3.IMIResponse>;
        getFacilityList(company: string, division: string): ng.IPromise<M3.IMIResponse>;
        lstZCSYTABTableNames(): ng.IPromise<M3.IMIResponse>;
        lstAlphaZSYTABRecords(fileName: string): ng.IPromise<M3.IMIResponse>;
        lstNumericZSYTABRecords(fileName: string): ng.IPromise<M3.IMIResponse>;
        getAlphaZSYTABRecord(fileName: string): ng.IPromise<M3.IMIResponse>;
        getNumericZSYTABRecord(fileName: string): ng.IPromise<M3.IMIResponse>;
    }

    export class AppService implements IAppService {

        static $inject = ["RestService", "$filter", "$q"];

        constructor(private restService: h5.application.IRestService, private $filter: h5.application.AppFilter, private $q: ng.IQService) {
        }

        public getAuthority(company: string, division: string, m3User: string, programName: string, charAt: number): ng.IPromise<boolean> {
            let request = {
                DIVI: division,
                USID: m3User,
                PGNM: programName
            };

            return this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30", request).then((val: M3.IMIResponse) => {
                if (angular.equals([], val.items)) {
                    request.DIVI = "";

                    return this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30", request).then((val: M3.IMIResponse) => {

                        if (angular.equals([], val.items)) {

                            return false;
                        } else {
                            let test = val.item.ALO;
                            if (charAt < test.length && '1' == test.charAt(charAt)) {
                                return true;
                            } else {
                                return false;
                            }

                        }
                    });
                } else {

                    let test = val.item.ALO;
                    if (charAt < test.length && '1' == test.charAt(charAt)) {
                        return true;
                    } else {

                        return false;
                    }
                }
            });
        }
        public lstAlphaZSYTABRecords(fileName: string): ng.IPromise<M3.IMIResponse> {

            let requestData = {
                KPID: "ZSYTAB",
                PK01: fileName

            };

            return this.restService.executeM3MIRestService("CUSEXTMI", "LstAlphaKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public lstNumericZSYTABRecords(fileName: string): ng.IPromise<M3.IMIResponse> {

            let requestData = {
                KPID: "ZSYTAB",
                PK01: fileName

            };

            return this.restService.executeM3MIRestService("CUSEXTMI", "LstNumericKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public getAlphaZSYTABRecord(fileName: string): ng.IPromise<M3.IMIResponse> {

            let requestData = {
                KPID: "ZSYTAB",
                PK01: fileName,


            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "GetAlphaKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public getNumericZSYTABRecord(fileName: string): ng.IPromise<M3.IMIResponse> {

            let requestData = {
                KPID: "ZSYTAB",
                PK01: fileName,


            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "GetNumericKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public lstZCSYTABTableNames(): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                KPID: "ZSYTAB"

            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "LstAlphaKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public getZCSYTABRecord(fileName: string): ng.IPromise<M3.IMIResponse> {

            let requestData = {
                KPID: "ZSYTAB",
                PK01: fileName,


            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "GetAlphaKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public getZCSYTABColumnNamesRecord(fileName: string): ng.IPromise<M3.IMIResponse> {

            let requestData = {
                KPID: "ZCSYTAB",
                PK01: fileName,
                PK02: "COLUMNS",
                PK03: "NA",
                PK04: "NA"

            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "GetAlphaKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public getDivisionList(company: string, division: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company,
                DIVI: division
            };
            return this.restService.executeM3MIRestService("MNS100MI", "LstDivisions", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public getWarehouseList(company: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company
            };
            return this.restService.executeM3MIRestService("MMS005MI", "LstWarehouses", requestData, 0).then((val: M3.IMIResponse) => { return val; });
        }

        public getFacilityList(company: string, division: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company,
                DIVI: division
            };
            return this.restService.executeM3MIRestService("CRS008MI", "ListFacility", requestData).then((val: M3.IMIResponse) => { return val; });
        }



        public getCustomerList(company: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company
            }
            return this.restService.executeM3MIRestService("CRS610MI", "LstByName", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public chgZCSYTABRecord(fileName: string, keyVal: string, language: string, divi: string, desc: string, name: string, parmValue: string, textIdentity: string,
            qtyQualifier: string, lotQual: string, serialQual: string, custPOReqd: boolean, createSuffix: boolean, lblPrintFmnt: string): ng.IPromise<M3.IMIResponse> {

            let requestData = {
                KPID: "ZCSYTAB",
                PK01: fileName,
                PK02: keyVal,
                PK03: language,
                PK04: divi,
                AL30: name,
                AL31: desc,
                AL32: parmValue,
                AL33: textIdentity,
                AL34: qtyQualifier,
                AL35: lotQual,
                AL36: serialQual,
                AL37: createSuffix,
                AL38: custPOReqd,
                AL39: lblPrintFmnt,

                // finish adding values
            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "ChgAlphaKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public addCSYTABRecord(fileName: string, keyVal: string, language: string, divi: string, desc: string, name: string, parmValue: string, textIdentity: string,
            qtyQualifier: string, lotQual: string, serialQual: string, createSuffix: boolean, lblPrintFmnt: string, parmVal: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                KPID: "ZCSYTAB",
                PK01: fileName,
                PK02: keyVal,
                PK03: language,
                PK04: divi,
                AL30: desc,
                AL31: name,
                AL32: parmVal,
                AL33: textIdentity,
                AL34: qtyQualifier,
                AL35: lotQual,
                AL36: serialQual,
                AL37: createSuffix,
                AL38: lotQual,
                AL39: lblPrintFmnt,
            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "AddAlphaKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public deleteCSYTABRecord(fileName: string, keyVal: string, language: string, divi: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                KPID: "ZCSYTAB",
                PK01: fileName,
                PK02: keyVal,
                PK03: language,
                PK04: divi,


            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "DelAlphaKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }


    }
}