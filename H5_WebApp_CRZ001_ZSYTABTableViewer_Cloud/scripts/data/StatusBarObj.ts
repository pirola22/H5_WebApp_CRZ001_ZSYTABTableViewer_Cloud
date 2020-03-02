module h5.application {

    

    export interface IStatusBarObj {
        message : any;
        statusBarMessageType : h5.application.MessageType;
        timestamp : Date;
    }
}