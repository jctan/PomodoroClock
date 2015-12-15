var app = angular.module('app', []);

app.controller('MainController', ['$scope', '$interval',
    function($scope, $interval){
        $scope.status = "Session";
        $scope.glyphicon = "glyphicon glyphicon-play";
        $scope.disabled = false;
        $scope.session = 25;
        $scope.break = 5;
        $scope.progress = 0;
        $scope.temp = $scope.session * 60 * 1000;
        $scope.color = "progress-bar progress-bar-success";
        var audio = document.getElementById("audio");
        var toggle = "start";

        var clock = function() {
            if ($scope.status === "Session") {
                $scope.clock = $scope.session * 60 * 1000;
                $scope.temp = $scope.session * 60 * 1000;
                $scope.progress = 0;
            } else {
                $scope.clock = $scope.break * 60 * 1000;
                $scope.temp = $scope.break * 60 * 1000;
                $scope.progress = 0;
            }
        };

        //call clock (session and break)
        clock();

        //continue adding session that's is over 60 min, go back ot 0.
        $scope.sessionAdd = function() {
            if ($scope.session >= 60) {
                $scope.session += 0;
                clock();
            } else {
                $scope.session++;
                clock();
            }
        };

        $scope.sessionMinus = function() {
            if ($scope.session > 0) {
                $scope.session--; //decrease if time is more than 0, else stop at 0
                clock();
            } else {
                $scope.session = 0;
                clock();
            }
        };

        $scope.breakAdd = function() {
            if ($scope.break >= 60) {
                $scope.break += 0;
                clock();
            } else {
                $scope.break++;
                clock();
            }
        };

        $scope.breakMinus = function(){
            if($scope.break > 0){
                $scope.break--;
                clock();
            }
        };

        $scope.clockFunction = function(){
            if(toggle === "start"){
                toggle = "pause";
                $scope.glyphicon = "glyphicon glyphicon-pause";
                return clockStart();
            } else {
                toggle = "start";
                $scope.glyphicon = "glyphicon glyphicon-play";
                return clockPause();
            }
        };
        var clockStart = function(){
            $scope.interval = $interval(function(){
                $scope.clock -=1000;
                $scope.progress += 1000 / $scope.temp * 100;
                //turning Session into break when it hits under 0
                if($scope.clock < 0 && $scope.status === "Session"){
                    $scope.clock = $scope.break * 60 * 1000;
                    $scope.temp = $scope.break * 60 * 1000;
                    $scope.progress = 0;
                    $scope.status = "Break";
                    $scope.color = "progress-bar progress-bar-danger";
                    audio.play();
                } else if ($scope.clock < 0 && $scope.status === "Break"){
                    $scope.clock = $scope.session * 60 * 1000;
                    $scope.temp = $scope.session * 60 * 1000;
                    $scope.progress = 0;
                    $scope.status = "Session";
                    $scope.color = "progress-bar progress-bar-success";
                    audio.play();
                }
            }, 1000);
            $scope.disabled = true;
        };

        var clockPause = function(){
            $interval.cancel($scope.interval);
            $scope.disabled = false;
        };

        $scope.reset = function(){
            clockPause();
            toggle = "start";
            $scope.status = "Session";
            $scope.color = "progress-bar progress-bar-success";
            $scope.glyphicon = "glyphicon glyphicon-play";
            $scope.disabled = false;
            $scope.session = 25;
            $scope.break = 5;
            $scope.progress = 0;
            $scope.temp = $scope.session * 60 * 1000;
            clock();
        };
    }]);