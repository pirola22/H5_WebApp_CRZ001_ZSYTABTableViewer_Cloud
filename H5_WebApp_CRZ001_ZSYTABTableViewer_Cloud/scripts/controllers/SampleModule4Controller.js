var h5;
(function (h5) {
    var application;
    (function (application) {
        var SampleModule4Controller = (function () {
            function SampleModule4Controller(scope) {
                this.scope = scope;
                this.init();
            }
            SampleModule4Controller.prototype.init = function () {
            };
            SampleModule4Controller.$inject = ["$scope"];
            return SampleModule4Controller;
        }());
        application.SampleModule4Controller = SampleModule4Controller;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
