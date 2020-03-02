module h5.application {

    export function uiSelectWrap($document: ng.IDocumentService, uiGridEditConstants) {
        return function link($scope, $elm, $attr) {
            $document.on('click', docClick);

            function docClick(evt) {
                if ($(evt.target).closest('.ui-select-container').length === 0) {
                    $scope.$emit(uiGridEditConstants.events.END_CELL_EDIT);
                    $document.off('click', docClick);
                }
            }
        };
    }
}