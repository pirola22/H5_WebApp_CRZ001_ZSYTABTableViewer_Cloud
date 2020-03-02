var h5;
(function (h5) {
    var application;
    (function (application) {
        var AppService = (function () {
            function AppService(restService, $filter, $q) {
                this.restService = restService;
                this.$filter = $filter;
                this.$q = $q;
            }
            AppService.prototype.getAuthority = function (company, division, m3User, programName, charAt) {
                var _this = this;
                var request = {
                    DIVI: division,
                    USID: m3User,
                    PGNM: programName
                };
                return this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30", request).then(function (val) {
                    if (angular.equals([], val.items)) {
                        request.DIVI = "";
                        return _this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30", request).then(function (val) {
                            if (angular.equals([], val.items)) {
                                return false;
                            }
                            else {
                                var test = val.item.ALO;
                                if (charAt < test.length && '1' == test.charAt(charAt)) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                        });
                    }
                    else {
                        var test = val.item.ALO;
                        if (charAt < test.length && '1' == test.charAt(charAt)) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                });
            };
            AppService.prototype.lstAlphaZSYTABRecords = function (fileName) {
                var requestData = {
                    KPID: "ZSYTAB",
                    PK01: fileName
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "LstAlphaKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.lstNumericZSYTABRecords = function (fileName) {
                var requestData = {
                    KPID: "ZSYTAB",
                    PK01: fileName
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "LstNumericKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getAlphaZSYTABRecord = function (fileName) {
                var requestData = {
                    KPID: "ZSYTAB",
                    PK01: fileName,
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "GetAlphaKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getNumericZSYTABRecord = function (fileName) {
                var requestData = {
                    KPID: "ZSYTAB",
                    PK01: fileName,
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "GetNumericKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.lstZCSYTABTableNames = function () {
                var requestData = {
                    KPID: "ZSYTAB"
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "LstAlphaKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getZCSYTABRecord = function (fileName) {
                var requestData = {
                    KPID: "ZSYTAB",
                    PK01: fileName,
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "GetAlphaKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getZCSYTABColumnNamesRecord = function (fileName) {
                var requestData = {
                    KPID: "ZCSYTAB",
                    PK01: fileName,
                    PK02: "COLUMNS",
                    PK03: "NA",
                    PK04: "NA"
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "GetAlphaKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getDivisionList = function (company, division) {
                var requestData = {
                    CONO: company,
                    DIVI: division
                };
                return this.restService.executeM3MIRestService("MNS100MI", "LstDivisions", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getWarehouseList = function (company) {
                var requestData = {
                    CONO: company
                };
                return this.restService.executeM3MIRestService("MMS005MI", "LstWarehouses", requestData, 0).then(function (val) { return val; });
            };
            AppService.prototype.getFacilityList = function (company, division) {
                var requestData = {
                    CONO: company,
                    DIVI: division
                };
                return this.restService.executeM3MIRestService("CRS008MI", "ListFacility", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getCustomerList = function (company) {
                var requestData = {
                    CONO: company
                };
                return this.restService.executeM3MIRestService("CRS610MI", "LstByName", requestData).then(function (val) { return val; });
            };
            AppService.prototype.chgZCSYTABRecord = function (fileName, keyVal, language, divi, desc, name, parmValue, textIdentity, qtyQualifier, lotQual, serialQual, custPOReqd, createSuffix, lblPrintFmnt) {
                var requestData = {
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
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "ChgAlphaKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.addCSYTABRecord = function (fileName, keyVal, language, divi, desc, name, parmValue, textIdentity, qtyQualifier, lotQual, serialQual, createSuffix, lblPrintFmnt, parmVal) {
                var requestData = {
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
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "AddAlphaKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.deleteCSYTABRecord = function (fileName, keyVal, language, divi) {
                var requestData = {
                    KPID: "ZCSYTAB",
                    PK01: fileName,
                    PK02: keyVal,
                    PK03: language,
                    PK04: divi,
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "DelAlphaKPI", requestData).then(function (val) { return val; });
            };
            AppService.$inject = ["RestService", "$filter", "$q"];
            return AppService;
        }());
        application.AppService = AppService;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
