module h5.application {

    interface IOauthToken {
        access_token: string;
        token_type: string;
        refresh_token: string;
        expires_in: number;
        scope: string;
    }

    export interface IRestService {
        executeIDMRestService(transaction: string, requestData: any): ng.IPromise<any>;
        executeM3RestService(transaction: string, requestData: any): ng.IPromise<any>;
        executeM3MIRestService(program: string, transaction: string, requestData: any, maxReturnedRecords?: number): ng.IPromise<M3.IMIResponse>;
    }

    export class RestService implements IRestService {

        private authInfoION: IOauthToken;
        private globalConfig: IGlobalConfiguration;

        static $inject = ["$http", "$q", "configService", "OdinMIService"];
        constructor(private $http: ng.IHttpService, private $q: ng.IQService, private configService: h5.application.ConfigService, private odinMIService: h5.application.OdinMIService) {
            this.init();
        }

        private init() {
            this.configService.getGlobalConfig().then((configData: any) => {
                this.globalConfig = configData;
                if (angular.isDefined(this.globalConfig.inforIONAPI) && angular.isDefined(this.globalConfig.inforIONAPI.URL)) {
                    this.setOAuthInfoIONAPI();
                }
            }, (errorResponse: any) => {
                console.log("Error while getting global configurations " + errorResponse);
            });
        }

        private setOAuthInfoIONAPI(): ng.IPromise<any> {
            let deferred = this.$q.defer();
            let tokenURL = this.globalConfig.inforIONAPI.URL + "/connect/token";
            let formData = "grant_type=" + this.globalConfig.inforIONAPI.grant_type + "&username=" + this.globalConfig.inforIONAPI.username + "&password=" + this.globalConfig.inforIONAPI.password + "&client_id=" + this.globalConfig.inforIONAPI.client_id + "&client_secret=" + this.globalConfig.inforIONAPI.client_secret;
            this.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            let response = this.$http.post(tokenURL, formData);
            response.then((response: ng.IHttpPromiseCallbackArg<IOauthToken>) => {
                this.authInfoION = response.data;
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        public executeIDMRestService(transaction: string, requestData: any): ng.IPromise<any> {
            if (angular.isUndefined(this.globalConfig.inforIDMAPI) || angular.isUndefined(this.globalConfig.inforIDMAPI.URL)) {
                let deferred = this.$q.defer();
                let reason: ng.IHttpPromiseCallbackArg<any> = {};
                reason.status = 500;
                reason.statusText = "Required IDM REST API configurations are not available. Please contact support.";
                deferred.reject(reason);
                return deferred.promise
            } else {
                return this.executeIONRestService(this.globalConfig.inforIDMAPI.URL, transaction, requestData);
            }
        }

        public executeM3RestService(transaction: string, requestData: any): ng.IPromise<any> {
            if (angular.isUndefined(this.globalConfig.inforM3API) || angular.isUndefined(this.globalConfig.inforM3API.URL)) {
                let deferred = this.$q.defer();
                let reason: ng.IHttpPromiseCallbackArg<any> = {};
                reason.status = 500;
                reason.statusText = "Required M3 REST API configurations are not available. Please contact support.";
                deferred.reject(reason);
                return deferred.promise
            } else {
                return this.executeIONRestService(this.globalConfig.inforM3API.URL, transaction, requestData);
            }
        }

        public executeIONRestService(baseURL: string, transaction: string, requestData: any): ng.IPromise<any> {
            let retries = 0;
            let maxRetry = 1;
            let deferred = this.$q.defer();
            if (angular.isUndefined(baseURL) || baseURL.length == 0) {
                let reason: ng.IHttpPromiseCallbackArg<any> = {};
                reason.status = 500;
                reason.statusText = "Required ION REST API configurations are not available. Please contact support.";
                deferred.reject(reason);
            } else {
                let URL = baseURL + transaction;
                let authInfo: IOauthToken = this.authInfoION;
                Odin.Log.debug("Execute ION REST API " + transaction + " Is authInfo present " + Odin.Util.hasValue(authInfo) + ": " + JSON.stringify(authInfo));
                this.$http.defaults.headers.post['Content-Type'] = 'application/json';
                if (Odin.Util.hasValue(authInfo)) {
                    this.$http.defaults.headers.post['Authorization'] = authInfo.token_type + ' ' + authInfo.access_token;
                }
                let response = this.$http.post(URL, requestData);
                response.then((response: ng.IHttpPromiseCallbackArg<any>) => {
                    deferred.resolve(response.data);
                }, (reason: ng.IHttpPromiseCallbackArg<any>) => {
                    reason.data = requestData;
                    Odin.Log.debug("Execute ION REST API '" + transaction + "' failed " + reason.status + ":" + reason.statusText);
                    if (reason.status == 401) {
                        while (retries < maxRetry) {
                            Odin.Log.debug("Retrying " + retries + ", as previous call to ION REST API '" + transaction + " failed due to token expired");
                            this.setOAuthInfoIONAPI().then((response: ng.IHttpPromiseCallbackArg<IOauthToken>) => {
                                this.$http.defaults.headers.post['Content-Type'] = 'application/json';
                                this.$http.defaults.headers.post['Authorization'] = response.data.token_type + ' ' + response.data.access_token;
                                this.$http.post(URL, requestData).then(
                                    (response: ng.IHttpPromiseCallbackArg<any>) => { deferred.resolve(response.data) },
                                    (reason: ng.IHttpPromiseCallbackArg<any>) => { deferred.reject(reason); });
                            });
                            retries++;
                        }
                    } else {
                        if (reason.status == 0) {
                            reason.statusText = "An unexpected error occurred. Please check your network connection and try again in a moment. Contact support if the problem persists.";
                        }
                        deferred.reject(reason);
                    }
                });
            }
            return deferred.promise;
        }

        public executeM3MIRestService(program: string, transaction: string, requestData: any, maxReturnedRecords?: number): ng.IPromise<any> {
            let deferred = this.$q.defer();
            return this.odinMIService.callWebService(program, transaction, requestData, maxReturnedRecords).then((val: M3.IMIResponse) => {
                val.requestData = requestData;
                deferred.resolve(val);
                return deferred.promise;
            }, (val: M3.IMIResponse) => {
                val.requestData = requestData;
                deferred.reject(val);
                return deferred.promise;
            });

        }

    }
}