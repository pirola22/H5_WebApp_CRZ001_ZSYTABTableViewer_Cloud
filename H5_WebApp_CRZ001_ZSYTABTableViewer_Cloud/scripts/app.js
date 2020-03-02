var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var h5;
(function (h5) {
    var application;
    (function (application) {
        var App = (function (_super) {
            __extends(App, _super);
            function App() {
                _super.apply(this, arguments);
            }
            App.prototype.onStart = function () {
                this.name = "H5 Applicationqwerty";
                this.description = "LeanSwift - H5 Application.";
                this.addUrlOverride("M3", "172.16.129.13", "http://172.16.129.13:8283");
                this.frameworkPath = "lib/odin";
                this.languageOptions = {
                    application: true,
                    applicationFilename: "translation.json",
                    language: "en-US",
                    defaultLanguage: "en-US",
                    standard: false,
                    supportedLanguages: []
                };
                this.module = angular.module("h5.application", ["ngAnimate", "odin", "m3", "ngSanitize", "ngTouch", "ui.select", "infinite.scroll", "ui.bootstrap",
                    "ui.grid", "ui.grid.autoResize", "ui.grid.resizeColumns", "ui.grid.moveColumns", "ui.grid.selection", "ui.grid.cellNav", "ui.grid.exporter", "ui.grid.saveState", "ui.grid.edit", "ui.grid.pinning", "sohoxi"]);
                this.module.service("configService", application.ConfigService).service("languageService", application.LanguageService).service("RestService", application.RestService).service("AppService", application.AppService).service("StorageService", application.StorageService).service("GridService", application.GridService).service("OdinMIService", application.OdinMIService);
                this.module.filter("m3Date", ["$filter", application.m3Date]).filter("rollingDate", ["$filter", application.rollingDate]).filter("m3DateFilter", ["$filter", application.m3DateFilter]).filter("numberStrFilter", ["$filter", application.numberStringFilter]);
                this.module.directive("uiSelectWrap", ["$document", "uiGridEditConstants", application.uiSelectWrap]);
                this.module.controller("AppController", application.AppController).controller("SampleModule3Controller", application.SampleModule3Controller).controller("SampleModule4Controller", application.SampleModule4Controller);
                this.module.config(['$compileProvider', function ($compileProvider) {
                        $compileProvider.debugInfoEnabled(false);
                    }]);
                this.module.config(['$locationProvider', function ($locationProvider) {
                        $locationProvider.html5Mode({
                            enabled: true,
                            requireBase: false
                        });
                    }]);
            };
            return App;
        }(M3.ApplicationBase));
        new App().start();
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
