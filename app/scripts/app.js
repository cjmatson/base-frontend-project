var Firebase = require("firebase");
var blocTime = angular.module('BlocTime', ['ui.router', 'firebase']);
blocTime.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$stateProvider.state('home', {
		url: '/',
		controller: 'Home.controller',
		templateUrl: '/templates/home.html'
	});
}])

blocTime.controller('Home.controller', ['$scope', '$firebase', function($scope, $firebase) {
	var ref = new Firebase("https://popping-heat-8018.firebaseio.com");
	$scope.data = $firebase(ref);
}])

blocTime.directive('tracker',['$interval', function($interval) {
	return {
		restrict: 'E',
		templateUrl: '/templates/directives/tracker.html',
		scope: true,
		link: function(scope, element, attribute) {
			scope.watch = 1500;
			scope.buttonText = "Start";
			scope.breakButton = "Break";
			var countdown = function () {
				scope.watch--;
			}
			scope.buttonTextClicked = function () {
				if (scope.buttonText === "Start") {
					scope.buttonText = "Reset";
					scope.interval = $interval(countdown, 1000);
				}
				else {
					scope.buttonText = "Start";
					$interval.cancel(scope.interval);
					scope.watch = 1500;
				}
			}
			
	 	}

	}

}])

blocTime.filter('timecode', function() {
	return function(seconds) {
		seconds = Number.parseFloat(seconds);
		if (Number.isNaN(seconds)) {
			return '--:--';
		}
		var wholeSeconds = Math.floor(seconds);
		var minutes = Math.floor(wholeSeconds / 60);
		var remainingSeconds = wholeSeconds % 60;
		var output = minutes + ':';
		if (remainingSeconds < 10) {
			output += '0';
		}
		output += remainingSeconds;
		return output;
	}
})
 
		

