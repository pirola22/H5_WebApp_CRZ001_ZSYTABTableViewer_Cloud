module h5.application {

    interface ITheme {
        themeId: number;
        themeName: string;
        themeIcon: string;
        panel: string;
        navBar: string;
        sideNav: string;
        button: string;
        h5Grid: string;
        h5Dropdown: string;
        navTabs: string;
        active: boolean;
        available: boolean;
    }

    interface ITexture {
        textureId: number;
        textureName: string;
        textureIcon: string;
        appBG: string;
        active: boolean;
        available: boolean;
    }

    interface IModule {
        moduleId: number;
        activeIcon: string;
        inactiveIcon: string;
        heading: string;
        content: string;
        active: boolean;
        available: boolean;
    }

    interface ISupportedLanguage {
        officialTranslations: boolean;
        languageCode: string;
        active: boolean;
        available: boolean;
    }

    export interface IAppScope extends ng.IScope {

        appReady: boolean;
        showSideNavLabel: boolean;
        themes: ITheme[];
        theme: ITheme;
        textures: ITexture[];
        texture: ITexture;
        loadingData: boolean;
        modules: IModule[];
        activeModule: number;
        modalWindow?: ng.ui.bootstrap.IModalServiceInstance;
        infiniteScroll: {
            numToAdd: number;
            currentItems: number;
        };
        globalConfig: IGlobalConfiguration;
        appConfig: IAppConfiguration;
        userContext: M3.IUserContext;
        languageConstants: Odin.ILanguage;
        currentLanguage: string;
        supportedLanguages?: ISupportedLanguage[];
        transactionStatus: {
            appConfig?: boolean;
        };
        views: {
            h5Application: {
                url: string;
            },
            selection: {
                url: string;
            },
            ZSYTABModule: {
                url: string;
            },
            errorModule: {
                url: string;
            },


        };
        globalSelection: IGlobalSelection;



        statusBar: IStatusBarObj[];
        statusBarIsCollapsed: boolean;
        statusBarVisible: boolean;
        hasValidlicense: boolean;
    }
}