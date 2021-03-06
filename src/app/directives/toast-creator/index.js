import { toastSelector } from '../../selectors/toast';

function component () {
    return {
        restrict: 'A',
        bindToController: {
            message: '@',
            icon: '@',
            location: '@',
            timeout: '@'
        },
        controller: ToastCreator,
        controllerAs: 'ctrl'
    };
}

class ToastCreator {
    // @ngInject
    constructor ($ngRedux, $scope, $element, $compile) {
        const unsubscribe = $ngRedux.connect(toastSelector)(this);
        $scope.$on('$destroy', unsubscribe);

        $scope.$watch(() => {
            return this.toast;
        }, (current, previous) => {
            if (current !== previous) {
        const toast = $compile(`<toast message="${current.message}"></toast>`)($scope);
        $element.parent().prepend(toast);
            }
        });
    }
}

export default component;