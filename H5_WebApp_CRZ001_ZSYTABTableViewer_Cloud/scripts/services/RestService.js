var h5;
(function (h5) {
    var application;
    (function (application) {
        var RestService = (function () {
            function RestService($http, $q, configService, odinMIService) {
                this.$http = $http;
                this.$q = $q;
                this.configService = configService;
                this.odinMIService = odinMIService;
                this.init();
            }
            RestService.prototype.init = function () {
                var _this = this;
                this.configService.getGlobalConfig().then(function (configData) {
                    _this.globalConfig = configData;
                    if (angular.isDefined(_this.globalConfig.inforIONAPI) && angular.isDefined(_this.globalConfig.inforIONAPI.URL)) {
                        _this.setOAuthInfoIONAPI();
                    }
                }, function (errorResponse) {
                    console.log("Error while getting global configurations " + errorResponse);
                });
            };
            RestService.prototype.setOAuthInfoIONAPI = function () {
                var _this = this;
                var deferred = this.$q.defer();
                var tokenURL = this.globalConfig.inforIONAPI.URL + "/connect/token";
                var formData = "grant_type=" + this.globalConfig.inforIONAPI.grant_type + "&username=" + this.globalConfig.inforIONAPI.username + "&password=" + this.globalConfig.inforIONAPI.password + "&client_id=" + this.globalConfig.inforIONAPI.client_id + "&client_secret=" + this.globalConfig.inforIONAPI.client_secret;
                this.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
                var response = this.$http.post(tokenURL, formData);
                response.then(function (response) {
                    _this.authInfoION = response.data;
                    deferred.resolve(response);
                });
                return deferred.promise;
            };
            RestService.prototype.executeIDMRestService = function (transaction, requestData) {
                if (angular.isUndefined(this.globalConfig.inforIDMAPI) || angular.isUndefined(this.globalConfig.inforIDMAPI.URL)) {
                    var deferred = this.$q.defer();
                    var reason = {};
                    reason.status = 500;
                    reason.statusText = "Required IDM REST API configurations are not available. Please contact support.";
                    deferred.reject(reason);
                    return deferred.promise;
                }
                else {
                    return this.executeIONRestService(this.globalConfig.inforIDMAPI.URL, transaction, requestData);
                }
            };
            RestService.prototype.executeM3RestService = function (transaction, requestData) {
                if (angular.isUndefined(this.globalConfig.inforM3API) || angular.isUndefined(this.globalConfig.inforM3API.URL)) {
                    var deferred = this.$q.defer();
                    var reason = {};
                    reason.status = 500;
                    reason.statusText = "Required M3 REST API configurations are not available. Please contact support.";
                    deferred.reject(reason);
                    return deferred.promise;
                }
                else {
                    return this.executeIONRestService(this.globalConfig.inforM3API.URL, transaction, requestData);
                }
            };
            RestService.prototype.executeIONRestService = function (baseURL, transaction, requestData) {
                var _this = this;
                var retries = 0;
                var maxRetry = 1;
                var deferred = this.$q.defer();
                if (angular.isUndefined(baseURL) || baseURL.length == 0) {
                    var reason = {};
                    reason.status = 500;
                    reason.statusText = "Required ION REST API configurations are not available. Please contact support.";
                    deferred.reject(reason);
                }
                else {
                    var URL_1 = baseURL + transaction;
                    var authInfo = this.authInfoION;
                    Odin.Log.debug("Execute ION REST API " + transaction + " Is authInfo present " + Odin.Util.hasValue(authInfo) + ": " + JSON.stringify(authInfo));
                    this.$http.defaults.headers.post['Content-Type'] = 'application/json';
                    if (Odin.Util.hasValue(authInfo)) {
                        this.$http.defaults.headers.post['Authorization'] = authInfo.token_type + ' ' + authInfo.access_token;
                    }
                    var response = this.$http.post(URL_1, requestData);
                    response.then(function (response) {
                        deferred.resolve(response.data);
                    }, function (reason) {
                        reason.data = requestData;
                        Odin.Log.debug("Execute ION REST API '" + transaction + "' failed " + reason.status + ":" + reason.statusText);
                        if (reason.status == 401) {
                            while (retries < maxRetry) {
                                Odin.Log.debug("Retrying " + retries + ", as previous call to ION REST API '" + transaction + " failed due to token expired");
                                _this.setOAuthInfoIONAPI().then(function (response) {
                                    _this.$http.defaults.headers.post['Content-Type'] = 'application/json';
                                    _this.$http.defaults.headers.post['Authorization'] = response.data.token_type + ' ' + response.data.access_token;
                                    _this.$http.post(URL_1, requestData).then(function (response) { deferred.resolve(response.data); }, function (reason) { deferred.reject(reason); });
                                });
                                retries++;
                            }
                        }
                        else {
                            if (reason.status == 0) {
                                reason.statusText = "An unexpected error occurred. Please check your network connection and try again in a moment. Contact support if the problem persists.";
                            }
                            deferred.reject(reason);
                        }
                    });
                }
                return deferred.promise;
            };
            RestService.prototype.executeM3MIRestService = function (program, transaction, requestData, maxReturnedRecords) {
                var deferred = this.$q.defer();
                return this.odinMIService.callWebService(program, transaction, requestData, maxReturnedRecords).then(function (val) {
                    val.requestData = requestData;
                    deferred.resolve(val);
                    return deferred.promise;
                }, function (val) {
                    val.requestData = requestData;
                    deferred.reject(val);
                    return deferred.promise;
                });
            };
            RestService.$inject = ["$http", "$q", "configService", "OdinMIService"];
            return RestService;
        }());
        application.RestService = RestService;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
