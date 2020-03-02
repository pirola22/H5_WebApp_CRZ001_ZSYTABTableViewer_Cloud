var h5;
(function (h5) {
    var application;
    (function (application) {
        var OdinMIService = (function () {
            function OdinMIService(miService) {
                this.miService = miService;
            }
            OdinMIService.prototype.callWebService = function (program, transaction, requestData, maxReturnedRecords) {
                if (maxReturnedRecords === void 0) { maxReturnedRecords = 100; }
                var request = {
                    program: program,
                    transaction: transaction,
                    record: requestData,
                    maxReturnedRecords: maxReturnedRecords
                };
                return this.miService.executeRequest(request).then(function (val) { return val; });
            };
            OdinMIService.$inject = ["m3MIService"];
            return OdinMIService;
        }());
        application.OdinMIService = OdinMIService;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
