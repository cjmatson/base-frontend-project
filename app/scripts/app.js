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
		link: function(scope, element, attributes) {
			scope.watch = 1500;
			scope.buttonText = "Start Work";
			scope.breakButton = "Pause Break";
			scope.onBreak = false;
			scope.completedWorkSessions = 0;
			scope.countdown = function () {
				scope.watch--;
			}
			scope.$watch('watch', function(newValue, oldValue) {
				if (newValue === 0) {
					if (scope.onBreak) {
						scope.onBreak = false;
						scope.watch = 1500;
						scope.buttonText = "Start Break";
					} else {
						scope.onBreak = true;
						scope.watch = 300;
						scope.breakButton = "Pause Break";
						scope.completedWorkSessions++;
					}
					if (scope.completedWorkSessions === 4) {
						if (newValue === 0) {
							if (scope.onBreak) {
						scope.watch = 1800;
						scope.onBreak = true;
						scope.buttonText = "Start Break";
						scope.completedWorkSessions = 0; }
						else {
							scope.onBreak = false;
							scope.watch = 1500;
							scope.buttonText = "Start Work";
							}
						}
					}
					scope.onBreakClicked();
				}
			});
			scope.buttonTextClicked = function () {
				if (scope.buttonText === "Start Work") {
					scope.buttonText = "Pause Work";
					scope.interval = $interval(scope.countdown, 1000);
				}
				else {
					scope.buttonText = "Start Work";
					$interval.cancel(scope.interval);
				}
			}
			scope.onBreakClicked = function () {
				if (scope.breakButton === "Pause Break") {
					scope.breakButton = "Start Break";
					$interval.cancel(scope.interval);
				}
				else {
					scope.breakButton = "Pause Break";
					scope.interval = $interval(scope.countdown, 1000);
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