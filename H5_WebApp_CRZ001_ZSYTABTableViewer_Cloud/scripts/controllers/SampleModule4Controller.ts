module h5.application {
    /**
     * Independent Module controller which can have it's scope functions and models and will be included as a Nested Controller
     */
    export class SampleModule4Controller {

        static $inject = ["$scope"];

        constructor(private scope: IAppScope) {
            this.init();
        }

        /**
        * The initialize function which will be called when the controller is created
        */
        private init() {

        }


        //*************************************************Module specific functions ends*************************************************/


        //*************************************************Module specific functions ends*************************************************/

    }
}