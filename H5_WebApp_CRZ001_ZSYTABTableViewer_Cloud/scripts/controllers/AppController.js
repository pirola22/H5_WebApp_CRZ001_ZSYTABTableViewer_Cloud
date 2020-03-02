var h5;
(function (h5) {
    var application;
    (function (application) {
        (function (MessageType) {
            MessageType[MessageType["Information"] = 0] = "Information";
            MessageType[MessageType["Warning"] = 1] = "Warning";
            MessageType[MessageType["Error"] = 2] = "Error";
        })(application.MessageType || (application.MessageType = {}));
        var MessageType = application.MessageType;
        var AppController = (function () {
            function AppController(scope, configService, appService, restService, storageService, gridService, userService, languageService, $uibModal, $interval, $timeout, $filter, $q, $window, formService, $location) {
                this.scope = scope;
                this.configService = configService;
                this.appService = appService;
                this.restService = restService;
                this.storageService = storageService;
                this.gridService = gridService;
                this.userService = userService;
                this.languageService = languageService;
                this.$uibModal = $uibModal;
                this.$interval = $interval;
                this.$timeout = $timeout;
                this.$filter = $filter;
                this.$q = $q;
                this.$window = $window;
                this.formService = formService;
                this.$location = $location;
                this.formatTime = function (statusBarItem) {
                    return statusBarItem.timestamp.getHours() + ':' + Odin.NumUtil.pad(statusBarItem.timestamp.getMinutes(), 2);
                };
                this.removeAt = function (index) {
                    if (index || index == 0) {
                        this.scope.statusBar.splice(this.scope.statusBar.length - 1 - index, 1);
                    }
                    this.scope.statusBarIsCollapsed = this.scope.statusBar.length == 0;
                };
                this.init();
            }
            AppController.prototype.init = function () {
                var _this = this;
                this.scope.appReady = false;
                this.scope.loadingData = false;
                this.scope.statusBar = [];
                this.scope.statusBarIsCollapsed = true;
                this.scope.statusBarVisible = true;
                this.scope.hasValidlicense = false;
                this.languageService.getAppLanguage().then(function (val) {
                    _this.scope.languageConstants = _this.languageService.languageConstants;
                    _this.initApplication();
                }, function (errorResponse) {
                    Odin.Log.error("Error getting language constants " + errorResponse);
                    _this.scope.statusBar.push({ message: "Error getting language constants" + errorResponse, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });
                if (this.$window.innerWidth < 768) {
                    this.scope.showSideNavLabel = false;
                }
                else {
                    this.scope.showSideNavLabel = true;
                }
            };
            AppController.prototype.initApplication = function () {
                var _this = this;
                this.initGlobalConfig();
                this.initAppScope();
                this.initUIGrids();
                this.initScopeFunctions();
                this.$timeout(function () { _this.scope.appReady = true; }, 5000);
            };
            AppController.prototype.initGlobalConfig = function () {
                var _this = this;
                this.configService.getGlobalConfig().then(function (configData) {
                    _this.scope.globalConfig = configData;
                    _this.initLanguage();
                    _this.initTheme();
                    _this.getUserContext();
                    if (_this.scope.appConfig.authorizedUser) {
                        _this.scope.showSideNavLabel = false;
                    }
                    else {
                        _this.scope.loadingData = false;
                    }
                    _this.initModule();
                }, function (errorResponse) {
                    Odin.Log.error("Error while getting global configuration " + errorResponse);
                    _this.scope.statusBar.push({ message: "Error while getting global configuration " + errorResponse, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });
            };
            AppController.prototype.initAppScope = function () {
                this.scope.transactionStatus = {
                    appConfig: false
                };
                this.scope["errorMessages"] = [];
                this.scope.infiniteScroll = {
                    numToAdd: 20,
                    currentItems: 20
                };
                this.scope.themes = [
                    { themeId: 1, themeIcon: 'leanswiftchartreuse.png', themeName: "Theme1Name", panel: "panel-h5-theme-LC", navBar: "navbar-h5-theme-LC", sideNav: "sideNav-h5-theme-LC", button: "h5Button-h5-theme-LC", h5Grid: "h5Grid-h5-theme-LC", h5Dropdown: "h5Dropdown-h5-theme-LC", navTabs: "navtabs-h5-theme-LC", active: false, available: true },
                    { themeId: 2, themeIcon: 'royalinfor.png', themeName: "Theme2Name", panel: "panel-h5-theme-RI", navBar: "navbar-h5-theme-RI", sideNav: "sideNav-h5-theme-RI", button: "h5Button-h5-theme-RI", h5Grid: "h5Grid-h5-theme-RI", h5Dropdown: "h5Dropdown-h5-theme-RI", navTabs: "navtabs-h5-theme-RI", active: false, available: true },
                    { themeId: 3, themeIcon: 'summersmoothe.png', themeName: "Theme3Name", panel: "panel-h5-theme-SS", navBar: "navbar-h5-theme-SS", sideNav: "sideNav-h5-theme-SS", button: "h5Button-h5-theme-SS", h5Grid: "h5Grid-h5-theme-SS", h5Dropdown: "h5Dropdown-h5-theme-SS", navTabs: "navtabs-h5-theme-SS", active: false, available: true },
                    { themeId: 4, themeIcon: 'pumkinspice.png', themeName: "Theme4Name", panel: "panel-h5-theme-PS", navBar: "navbar-h5-theme-PS", sideNav: "sideNav-h5-theme-PS", button: "h5Button-h5-theme-PS", h5Grid: "h5Grid-h5-theme-PS", h5Dropdown: "h5Dropdown-h5-theme-PS", navTabs: "navtabs-h5-theme-PS", active: false, available: true },
                    { themeId: 5, themeIcon: 'visionimpared.png', themeName: "Theme5Name", panel: "panel-h5-theme-VI", navBar: "navbar-h5-theme-VI", sideNav: "sideNav-h5-theme-VI", button: "h5Button-h5-theme-VI", h5Grid: "h5Grid-h5-theme-VI", h5Dropdown: "h5Dropdown-h5-theme-VI", navTabs: "navtabs-h5-theme-VI", active: false, available: true },
                    { themeId: 6, themeIcon: 'lipstickjungle.png', themeName: "Theme6Name", panel: "panel-h5-theme-LJ", navBar: "navbar-h5-theme-LJ", sideNav: "sideNav-h5-theme-LJ", button: "h5Button-h5-theme-LJ", h5Grid: "h5Grid-h5-theme-LJ", h5Dropdown: "h5Dropdown-h5-theme-LJ", navTabs: "navtabs-h5-theme-LJ", active: false, available: true },
                    { themeId: 7, themeIcon: 'silverlining.png', themeName: "Theme7Name", panel: "panel-h5-theme-SL", navBar: "navbar-h5-theme-SL", sideNav: "sideNav-h5-theme-SL", button: "h5Button-h5-theme-SL", h5Grid: "h5Grid-h5-theme-SL", h5Dropdown: "h5Dropdown-h5-theme-SL", navTabs: "navtabs-h5-theme-SL", active: false, available: true },
                    { themeId: 8, themeIcon: 'steelclouds.png', themeName: "Theme8Name", panel: "panel-h5-theme-SC", navBar: "navbar-h5-theme-SC", sideNav: "sideNav-h5-theme-SC", button: "h5Button-h5-theme-SC", h5Grid: "h5Grid-h5-theme-SC", h5Dropdown: "h5Dropdown-h5-theme-SC", navTabs: "navtabs-h5-theme-SC", active: false, available: true }
                ];
                this.scope.textures = [
                    { textureId: 1, textureIcon: 'diamond.png', textureName: "Wallpaper1Name", appBG: "h5-texture-one", active: false, available: true },
                    { textureId: 2, textureIcon: 'grid.png', textureName: "Wallpaper2Name", appBG: "h5-texture-two", active: false, available: true },
                    { textureId: 3, textureIcon: 'linen.png', textureName: "Wallpaper3Name", appBG: "h5-texture-three", active: false, available: true },
                    { textureId: 4, textureIcon: 'tiles.png', textureName: "Wallpaper4Name", appBG: "h5-texture-four", active: false, available: true },
                    { textureId: 5, textureIcon: 'wood.png', textureName: "Wallpaper5Name", appBG: "h5-texture-five", active: false, available: true }
                ];
                this.scope.supportedLanguages = [{ officialTranslations: false, languageCode: "ar-AR", active: false, available: true }, { officialTranslations: false, languageCode: "cs-CZ", active: false, available: true },
                    { officialTranslations: false, languageCode: "da-DK", active: false, available: true }, { officialTranslations: false, languageCode: "de-DE", active: false, available: true },
                    { officialTranslations: false, languageCode: "el-GR", active: false, available: true }, { officialTranslations: true, languageCode: "en-US", active: true, available: true },
                    { officialTranslations: false, languageCode: "es-ES", active: false, available: true }, { officialTranslations: false, languageCode: "fi-FI", active: false, available: true },
                    { officialTranslations: true, languageCode: "fr-FR", active: false, available: true }, { officialTranslations: false, languageCode: "he-IL", active: false, available: true },
                    { officialTranslations: false, languageCode: "hu-HU", active: false, available: true }, { officialTranslations: false, languageCode: "it-IT", active: false, available: true },
                    { officialTranslations: false, languageCode: "ja-JP", active: false, available: true }, { officialTranslations: false, languageCode: "nb-NO", active: false, available: true },
                    { officialTranslations: false, languageCode: "nl-NL", active: false, available: true }, { officialTranslations: false, languageCode: "pl-PL", active: false, available: true },
                    { officialTranslations: false, languageCode: "pt-PT", active: false, available: true }, { officialTranslations: false, languageCode: "ru-RU", active: false, available: true },
                    { officialTranslations: true, languageCode: "sv-SE", active: false, available: true }, { officialTranslations: false, languageCode: "tr-TR", active: false, available: true },
                    { officialTranslations: false, languageCode: "zh-CN", active: false, available: true }, { officialTranslations: false, languageCode: "ta-IN", active: false, available: true }
                ];
                this.scope.views = {
                    h5Application: { url: "views/Application.html" },
                    selection: { url: "views/Selection.html" },
                    ZSYTABModule: { url: "views/ZSYTABModule.html" },
                    errorModule: { url: "views/Error.html" }
                };
                this.scope.modules = [
                    { moduleId: 1, activeIcon: 'SampleModule1.png', inactiveIcon: 'SampleModule1-na.png', heading: 'Applications Module', content: this.scope.views.ZSYTABModule.url, active: true, available: true },
                ];
                this.scope.appConfig = {};
                this.scope.userContext = new M3.UserContext();
                this.scope["dateRef"] = new Date();
                this.initGlobalSelection();
            };
            AppController.prototype.initGlobalSelection = function () {
                this.scope.globalSelection = {
                    reload: true,
                    transactionStatus: {
                        ZSYTABTableList: false,
                    },
                    ZSYTABTableList: [],
                    ZSYTABTable: {},
                    ZSYTABListGrid: {},
                    division: {},
                };
            };
            AppController.prototype.initApplicationConstants = function () {
            };
            AppController.prototype.initScopeFunctions = function () {
                var _this = this;
                this.scope.globalSelection.openWindowForSelectedRow = function (fieldName, rowEntity) { _this.openWindowForSelectedRow(fieldName, rowEntity); };
            };
            AppController.prototype.initUIGrids = function () {
                this.scope.globalSelection.ZSYTABListGrid = this.gridService.getZSYTABListGrid();
                this.initUIGridsOnRegisterApi();
            };
            AppController.prototype.initUIGridsOnRegisterApi = function () {
                var _this = this;
                this.scope.globalSelection.ZSYTABListGrid.onRegisterApi = function (gridApi) {
                    _this.gridService.adjustGridHeight("ZSYTABListGrid", _this.scope.globalSelection.ZSYTABListGrid.data.length, 500);
                    gridApi.core.on.renderingComplete(_this.scope, function (handler) { _this.gridService.restoreGridState("ZSYTABListGrid", gridApi); });
                    gridApi.core.on.sortChanged(_this.scope, function (handler) { _this.gridService.saveGridState("ZSYTABListGrid", gridApi); });
                    gridApi.core.on.columnVisibilityChanged(_this.scope, function (handler) { _this.gridService.saveGridState("ZSYTABListGrid", gridApi); });
                    gridApi.core.on.filterChanged(_this.scope, function (handler) { _this.gridService.saveGridState("ZSYTABListGrid", gridApi); });
                    gridApi.colMovable.on.columnPositionChanged(_this.scope, function (handler) { _this.gridService.saveGridState("ZSYTABListGrid", gridApi); });
                    gridApi.colResizable.on.columnSizeChanged(_this.scope, function (handler) { _this.gridService.saveGridState("ZSYTABListGrid", gridApi); });
                    gridApi.cellNav.on.viewPortKeyDown(_this.scope, function (event) {
                        if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                            var cells = gridApi.cellNav.getCurrentSelection();
                            _this.copyCellContentToClipBoard(cells);
                        }
                    });
                    gridApi.selection.on.rowSelectionChanged(_this.scope, function (row) {
                        _this.gridService.saveGridState("ZSYTABListGrid", gridApi);
                    });
                    gridApi.selection.on.rowSelectionChangedBatch(_this.scope, function (row) {
                        _this.gridService.saveGridState("ZSYTABListGrid", gridApi);
                    });
                };
            };
            AppController.prototype.resetUIGridsColumnDefs = function () {
            };
            AppController.prototype.initTheme = function () {
                var _this = this;
                var themeId = this.storageService.getLocalData('h5.app.appName.theme.selected');
                var textureId = this.storageService.getLocalData('h5.app.appName.texture.selected');
                themeId = angular.isNumber(themeId) ? themeId : angular.isNumber(this.scope.globalConfig.defaultThemeId) ? this.scope.globalConfig.defaultThemeId : 1;
                textureId = angular.isNumber(textureId) ? textureId : angular.isNumber(this.scope.globalConfig.defaultTextureId) ? this.scope.globalConfig.defaultTextureId : 1;
                this.themeSelected(themeId);
                this.textureSelected(textureId);
                this.scope.themes.forEach(function (theme) {
                    if (_this.scope.globalConfig.excludeThemes.indexOf(theme.themeId) > -1) {
                        theme.available = false;
                    }
                    else {
                        theme.available = true;
                    }
                });
                this.scope.textures.forEach(function (texture) {
                    if (_this.scope.globalConfig.excludeWallpapers.indexOf(texture.textureId) > -1) {
                        texture.available = false;
                    }
                    else {
                        texture.available = true;
                    }
                });
            };
            AppController.prototype.initModule = function () {
                var _this = this;
                var moduleId = this.storageService.getLocalData('h5.app.appName.module.selected');
                moduleId = angular.isNumber(moduleId) ? moduleId : 1;
                this.scope.activeModule = moduleId;
                this.scope.modules.forEach(function (appmodule) {
                    if (angular.equals(moduleId, appmodule.moduleId)) {
                        appmodule.active = true;
                    }
                    else {
                        appmodule.active = false;
                    }
                    if (_this.scope.globalConfig.excludeModules.indexOf(appmodule.moduleId) > -1) {
                        appmodule.available = false;
                    }
                    else {
                        appmodule.available = true;
                    }
                });
            };
            AppController.prototype.initLanguage = function () {
                var _this = this;
                var languageCode = this.storageService.getLocalData('h5.app.appName.language.selected');
                languageCode = angular.isString(languageCode) ? languageCode : angular.isString(this.scope.globalConfig.defaultLanguage) ? this.scope.globalConfig.defaultLanguage : "en-US";
                this.scope.currentLanguage = languageCode;
                if (!angular.equals(this.scope.currentLanguage, "en-US")) {
                    this.languageService.changeAppLanguage(languageCode).then(function (val) {
                        _this.resetUIGridsColumnDefs();
                    }, function (errorResponse) {
                        Odin.Log.error("Error getting language " + errorResponse);
                        _this.scope.statusBar.push({ message: "Error getting language " + errorResponse, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                    });
                }
                this.scope.supportedLanguages.forEach(function (language) {
                    if (angular.equals(language.languageCode, languageCode)) {
                        language.active = true;
                    }
                    else {
                        language.active = false;
                    }
                    if (_this.scope.globalConfig.excludeLanguages.indexOf(language.languageCode) > -1) {
                        language.available = false;
                    }
                    else {
                        language.available = true;
                    }
                });
            };
            AppController.prototype.themeSelected = function (themeId) {
                var _this = this;
                this.scope.themes.forEach(function (theme) {
                    if (angular.equals(theme.themeId, themeId)) {
                        theme.active = true;
                        _this.scope.theme = theme;
                    }
                    else {
                        theme.active = false;
                    }
                });
                this.storageService.setLocalData('h5.app.appName.theme.selected', themeId);
            };
            AppController.prototype.textureSelected = function (textureId) {
                var _this = this;
                this.scope.textures.forEach(function (texture) {
                    if (angular.equals(texture.textureId, textureId)) {
                        texture.active = true;
                        _this.scope.texture = texture;
                    }
                    else {
                        texture.active = false;
                    }
                });
                this.storageService.setLocalData('h5.app.appName.texture.selected', textureId);
            };
            AppController.prototype.getUserContext = function () {
                var _this = this;
                Odin.Log.debug("is H5 " + this.userService.isH5() + " is Iframe " + Odin.Util.isIframe());
                this.scope.loadingData = true;
                this.userService.getUserContext().then(function (val) {
                    _this.scope.userContext = val;
                    _this.loadGlobalData();
                }, function (reason) {
                    Odin.Log.error("Can't get user context from h5 due to " + reason.errorMessage);
                    _this.scope.statusBar.push({ message: "Can't get user context from h5 " + [reason.errorMessage], statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                    _this.showError("Can't get user context from h5 ", [reason.errorMessage]);
                    _this.loadGlobalData();
                });
            };
            AppController.prototype.launchM3Program = function (link) {
                Odin.Log.debug("H5 link to launch -->" + link);
                this.formService.launch(link);
            };
            AppController.prototype.mapKeyUp = function (event) {
                if (event.keyCode === 115) {
                    this.loadApplicationData();
                }
            };
            AppController.prototype.addMoreItemsToScroll = function () {
                this.scope.infiniteScroll.currentItems += this.scope.infiniteScroll.numToAdd;
            };
            ;
            AppController.prototype.copyCellContentToClipBoard = function (cells) {
                var hiddenTextArea = angular.element(document.getElementById("gridClipboard"));
                hiddenTextArea.val("");
                var textToCopy = '', rowId = cells[0].row.uid;
                cells.forEach(function (cell) {
                    textToCopy = textToCopy == '' ? textToCopy : textToCopy + ",";
                    var cellValue = cell.row.entity[cell.col.name];
                    if (angular.isDefined(cellValue)) {
                        if (cell.row.uid !== rowId) {
                            textToCopy += '\n';
                            rowId = cell.row.uid;
                        }
                        textToCopy += cellValue;
                    }
                });
                hiddenTextArea.val(textToCopy);
                hiddenTextArea.select();
            };
            AppController.prototype.openAboutPage = function () {
                var options = {
                    animation: true,
                    templateUrl: "views/About.html",
                    size: "md",
                    scope: this.scope
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.openChangeThemePage = function () {
                var options = {
                    animation: true,
                    templateUrl: "views/ChangeThemeModal.html",
                    size: "md",
                    scope: this.scope
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.openChangeWallpaperPage = function () {
                var options = {
                    animation: true,
                    templateUrl: "views/ChangeWallpaperModal.html",
                    size: "md",
                    scope: this.scope
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.openChangeAppLanguagePage = function () {
                var options = {
                    animation: true,
                    templateUrl: "views/ChangeLanguageModal.html",
                    size: "md",
                    scope: this.scope
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.changeAppLanguage = function (languageCode) {
                var _this = this;
                this.scope.supportedLanguages.forEach(function (language) {
                    if (angular.equals(language.languageCode, languageCode)) {
                        language.active = true;
                        _this.scope.currentLanguage = languageCode;
                    }
                    else {
                        language.active = false;
                    }
                });
                this.languageService.changeAppLanguage(languageCode).then(function (val) {
                    _this.scope.appReady = false;
                    _this.closeModalWindow();
                    _this.resetUIGridsColumnDefs();
                    _this.$timeout(function () { _this.scope.appReady = true; }, 1000);
                }, function (errorResponse) {
                    Odin.Log.error("Error getting language " + errorResponse);
                    _this.scope.statusBar.push({ message: "Error getting language " + errorResponse, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });
                this.storageService.setLocalData('h5.app.appName.language.selected', languageCode);
            };
            AppController.prototype.closeModalWindow = function () {
                this.scope.modalWindow.close("close");
                this.refreshTransactionStatus();
            };
            AppController.prototype.closeWindow = function () {
                window.close();
            };
            AppController.prototype.statusBarClose = function () {
                this.scope.statusBarIsCollapsed = true;
                this.scope.statusBar = [];
            };
            AppController.prototype.parseError = function (errorResponse) {
                var error = "Error occurred while processing below request(s)";
                var errorMessages = this.scope["errorMessages"];
                var errorMessage = "Request URL: " + errorResponse.config.url + ", Status: " + errorResponse.status +
                    " (" + errorResponse.statusText + ")";
                if (angular.isObject(errorResponse.data) && angular.isObject(errorResponse.data.eLink)) {
                    errorMessage = errorMessage + ", Error : " + errorResponse.data.eLink.code + " (" + errorResponse.data.eLink.message + ") ";
                    if (angular.isString(errorResponse.data.eLink.details)) {
                        errorMessage = errorMessage + errorResponse.data.eLink.details;
                    }
                }
                if (errorMessages.indexOf(errorMessage) == -1) {
                    errorMessages.push(errorMessage);
                }
                this.showError(error, errorMessages);
                this.scope.statusBar.push({ message: error + " " + errorMessages, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
            };
            AppController.prototype.showError = function (error, errorMessages) {
                var _this = this;
                this.scope["hasError"] = true;
                this.scope["error"] = error;
                this.scope["errorMessages"] = errorMessages;
                if (angular.isObject(this.scope["destroyErrMsgTimer"])) {
                    this.$timeout.cancel(this.scope["destroyErrMsgTimer"]);
                }
                this.scope["destroyErrMsgTimer"] = this.$timeout(function () { _this.hideError(); }, 30000);
            };
            AppController.prototype.hideError = function () {
                this.scope["hasError"] = false;
                this.scope["error"] = null;
                this.scope["errorMessages"] = [];
                this.scope["destroyErrMsgTimer"] = undefined;
            };
            AppController.prototype.showWarning = function (warning, warningMessages) {
                var _this = this;
                this.scope["hasWarning"] = true;
                this.scope["warning"] = warning;
                this.scope["warningMessages"] = warningMessages;
                if (angular.isObject(this.scope["destroyWarnMsgTimer"])) {
                    this.$timeout.cancel(this.scope["destroyWarnMsgTimer"]);
                }
                this.scope["destroyWarnMsgTimer"] = this.$timeout(function () { _this.hideWarning(); }, 10000);
            };
            AppController.prototype.hideWarning = function () {
                this.scope["hasWarning"] = false;
                this.scope["warning"] = null;
                this.scope["warningMessages"] = null;
                this.scope["destroyWarnMsgTimer"] = undefined;
            };
            AppController.prototype.showInfo = function (info, infoMessages) {
                var _this = this;
                this.scope["hasInfo"] = true;
                this.scope["info"] = info;
                this.scope["infoMessages"] = infoMessages;
                if (angular.isObject(this.scope["destroyInfoMsgTimer"])) {
                    this.$timeout.cancel(this.scope["destroyInfoMsgTimer"]);
                }
                this.scope["destroyInfoMsgTimer"] = this.$timeout(function () { _this.hideInfo(); }, 10000);
            };
            AppController.prototype.hideInfo = function () {
                this.scope["hasInfo"] = false;
                this.scope["info"] = null;
                this.scope["infoMessages"] = null;
                this.scope["destroyInfoMsgTimer"] = undefined;
            };
            AppController.prototype.loadGlobalData = function () {
                var _this = this;
                var userContext = this.scope.userContext;
                var globalConfig = this.scope.globalConfig;
                this.loadAppConfig(userContext.company, userContext.division, userContext.m3User, globalConfig.environment).then(function (val) {
                    if (_this.scope.appConfig.authorizedUser === true) {
                        console.log("authorized");
                        _this.loadZSYTABTableListGrid();
                        _this.loadData(_this.scope.activeModule);
                        _this.loadDefaultFields();
                        _this.hideWarning();
                    }
                    else {
                        console.log("NOT authorized");
                        window.alert("NOT Authorized, Please Contact Security");
                    }
                });
            };
            AppController.prototype.loadDefaultFields = function () {
                var userContext = this.scope.userContext;
                var appConfig = this.scope.appConfig;
                var division = angular.isString(appConfig.searchQuery.divi) ? appConfig.searchQuery.divi : userContext.division;
                var warehouse = angular.isString(appConfig.searchQuery.whlo) ? appConfig.searchQuery.whlo : userContext.WHLO;
                var facility = angular.isString(appConfig.searchQuery.faci) ? appConfig.searchQuery.faci : userContext.FACI;
                this.scope.globalSelection.division = { selected: division };
            };
            AppController.prototype.loadApplicationData = function () {
                var categories = ['globalSelection', 'ZSYTABModule', 'customerMasterModule', 'ZSYTABModule'];
                this.clearData(categories);
                this.resetReloadStatus();
                this.loadData(this.scope.activeModule);
            };
            AppController.prototype.clearData = function (categories) {
                categories.forEach(function (category) {
                    if (category == "globalSelection") {
                    }
                });
            };
            AppController.prototype.resetReloadStatus = function () {
            };
            AppController.prototype.moduleSelected = function (moduleId) {
                this.scope.activeModule = moduleId;
                this.scope.modules.forEach(function (appmodule) {
                    if (angular.equals(moduleId, appmodule.moduleId)) {
                        appmodule.active = true;
                    }
                    else {
                        appmodule.active = false;
                    }
                });
                this.storageService.setLocalData('h5.app.appName.module.selected', moduleId);
                this.loadData(this.scope.activeModule);
            };
            AppController.prototype.loadData = function (activeModule) {
                this.refreshTransactionStatus();
                switch (activeModule) {
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                }
            };
            AppController.prototype.refreshTransactionStatus = function () {
                var isLoading = false;
                for (var transaction in this.scope.transactionStatus) {
                    var value = this.scope.transactionStatus[transaction];
                    if (value == true) {
                        isLoading = true;
                        break;
                    }
                }
                for (var transaction in this.scope.globalSelection.transactionStatus) {
                    var value = this.scope.globalSelection.transactionStatus[transaction];
                    if (value == true) {
                        isLoading = true;
                        break;
                    }
                }
                this.scope.loadingData = isLoading;
                if (isLoading) {
                    return;
                }
                switch (this.scope.activeModule) {
                    case 1:
                        this.scope.loadingData = isLoading;
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                }
            };
            AppController.prototype.loadAppConfig = function (company, division, user, environment) {
                var _this = this;
                var deferred = this.$q.defer();
                this.scope.appConfig = this.scope.globalConfig.appConfig;
                this.scope.appConfig.searchQuery = this.$location.search();
                this.scope.appConfig.enableM3Authority = true;
                if (this.scope.appConfig.enableM3Authority) {
                    this.scope.loadingData = true;
                    this.scope.transactionStatus.appConfig = true;
                    var programName = "CRZ001";
                    var promise1 = this.appService.getAuthority(company, division, user, programName, 1).then(function (result) {
                        _this.scope.appConfig.authorizedUser = result;
                    });
                    var promises = [promise1];
                    this.$q.all(promises).finally(function () {
                        deferred.resolve(_this.scope.appConfig);
                        _this.scope.transactionStatus.appConfig = false;
                        _this.refreshTransactionStatus();
                    });
                }
                else {
                    deferred.resolve(this.scope.appConfig);
                }
                return deferred.promise;
            };
            AppController.prototype.loadZSYTABTableList = function () {
                var _this = this;
                this.scope.loadingData = true;
                this.scope.globalSelection.transactionStatus.ZSYTABTableList = true;
                this.appService.lstZCSYTABTableNames().then(function (val) {
                    _this.scope.globalSelection.ZSYTABTableList = val.items;
                    console.log("Val");
                    console.log(val);
                    _this.scope.globalSelection.transactionStatus.ZSYTABTableList = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    console.log("FAILED 949");
                    _this.scope.globalSelection.transactionStatus.ZSYTABTableList = false;
                    _this.refreshTransactionStatus();
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });
            };
            AppController.prototype.filterZZUDF8 = function (fileName, val) {
                var filteredValues = [];
                val.items.forEach(function (value) {
                    if (value.KPID === fileName) {
                        filteredValues.push(value);
                    }
                });
                return filteredValues;
            };
            AppController.prototype.loadZSYTABTableListGrid = function () {
                var _this = this;
                var table = "ZSYTAB";
                this.scope.loadingData = true;
                this.scope.globalSelection.transactionStatus.ZSYTABTableList = true;
                this.appService.lstZCSYTABTableNames().then(function (val) {
                    var filteredVal = _this.filterZZUDF8(table, val);
                    _this.scope.globalSelection.ZSYTABListGrid.data = filteredVal;
                    console.log(val);
                    _this.scope.globalSelection.transactionStatus.ZSYTABTableList = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    console.log("FAILED 949");
                    _this.scope.globalSelection.transactionStatus.ZSYTABTableList = false;
                    _this.refreshTransactionStatus();
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });
            };
            AppController.prototype.loadRecordList = function () {
                var selectedZSYTABTable = this.scope.globalSelection.ZSYTABTable.selected;
            };
            AppController.prototype.isValidInput = function (val) {
                console.log("Validatiing");
                var server = val.items[0].AL32;
                var port = val.items[0].AL34;
                var folderPath = val.items[0].AL33;
                var appName = val.items[0].AL31;
                if (server == undefined) {
                    return false;
                }
                if (port == undefined) {
                    return false;
                }
                if (folderPath == undefined) {
                    return false;
                }
                if (appName == undefined) {
                    return false;
                }
                return true;
            };
            AppController.prototype.openWindowForSelectedRow = function (fieldName, selectedRow) {
                var _this = this;
                console.log(selectedRow);
                var selectedZSYTABTable = selectedRow.PK01;
                this.scope.globalSelection.ZSYTABTableList = selectedRow;
                var pathString = "";
                var server = "";
                var port = 0;
                var folderPath = "";
                var appName = "";
                var protocol = "";
                this.scope.loadingData = true;
                this.appService.getAlphaZSYTABRecord(selectedZSYTABTable).then(function (val) {
                    if (_this.isValidInput(val)) {
                        protocol = val.items[0].AL34;
                        server = val.items[0].AL31;
                        folderPath = val.items[0].AL32;
                        appName = val.items[0].AL35;
                        port = val.items[0].AL33;
                        pathString = protocol + server + ":" + port + folderPath + appName;
                        _this.openTab(pathString);
                        console.log(selectedRow);
                    }
                }, function (err) {
                    _this.refreshTransactionStatus();
                    var error = selectedZSYTABTable + " Does not exist";
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                }).finally(function () {
                    _this.scope.loadingData = false;
                });
            };
            AppController.prototype.openAppManager = function (fieldName, selectedRow) {
                var _this = this;
                console.log(selectedRow);
                var selectedZSYTABTable = "ZSYTAB";
                var pathString = "";
                var server = "";
                var port = 0;
                var folderPath = "";
                var appName = "";
                var protocol = "";
                this.scope.loadingData = true;
                this.appService.getAlphaZSYTABRecord(selectedZSYTABTable).then(function (val) {
                    protocol = val.items[0].AL34;
                    server = val.items[0].AL31;
                    folderPath = val.items[0].AL32;
                    appName = val.items[0].AL35;
                    port = val.items[0].AL33;
                    pathString = protocol + server + ":" + port + folderPath + appName;
                    console.log(pathString);
                    _this.openTab(pathString);
                }, function (err) {
                    _this.refreshTransactionStatus();
                    var error = selectedZSYTABTable + " Does not exist";
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                }).finally(function () {
                    _this.scope.loadingData = false;
                });
            };
            AppController.prototype.openTab = function (pathString) {
                console.log(pathString);
                window.open(pathString, "_blank");
            };
            AppController.$inject = ["$scope", "configService", "AppService", "RestService", "StorageService", "GridService", "m3UserService", "languageService", "$uibModal", "$interval", "$timeout", "$filter", "$q", "$window", "m3FormService", "$location"];
            return AppController;
        }());
        application.AppController = AppController;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
