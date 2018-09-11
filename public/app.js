angular.module("myApp", []).controller("myCtrl", function ($scope, $http) {
    $scope.background = "#ffffff";
    $scope.accent = "#049fd9";
    $scope.generating = false;

    $scope.submit = function () {
        $scope.generating = true;
        console.log("Submit");
        var image = document.getElementById("image");
        image = image.outerHTML.replace('{{ background }}', $scope.background);
        image = image.replace(/{{ accent }}/g, $scope.accent);

        console.log(image);

        $http.post('/api/convert', {'image': image}).then(function(res) {
            $scope.generating = false;

            name = res.data;
            window.location.href = '/api/download/' + name;
        }, function(err) {
            console.log(err);
        });
    }

});