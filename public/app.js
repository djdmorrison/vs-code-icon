angular.module("myApp", []).controller("myCtrl", function ($scope, $http) {
    $scope.background = "#ffffff";
    $scope.accent = "#049fd9";

    $scope.submit = function () {
        console.log("Submit");
        var image = document.getElementById("image");
        image = image.outerHTML.replace('{{ background }}', $scope.background);
        image = image.replace(/{{ accent }}/g, $scope.accent);

        console.log(image);
    }

});