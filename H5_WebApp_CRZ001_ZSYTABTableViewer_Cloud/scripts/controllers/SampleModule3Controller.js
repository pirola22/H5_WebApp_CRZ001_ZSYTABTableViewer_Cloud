var h5;
(function (h5) {
    var application;
    (function (application) {
        var SampleModule3Controller = (function () {
            function SampleModule3Controller(scope) {
                this.scope = scope;
                this.init();
            }
            SampleModule3Controller.prototype.init = function () {
            };
            SampleModule3Controller.$inject = ["$scope"];
            return SampleModule3Controller;
        }());
        application.SampleModule3Controller = SampleModule3Controller;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
