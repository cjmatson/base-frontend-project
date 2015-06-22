(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
			scope.watch = 60;
			scope.buttonText = "Start";
			scope.breakButton = "Break";
			scope.onBreak = false;
			scope.completedWorkSessions = 0;
			scope.countdown = function () {
				scope.watch--;
				if (scope.watch === 0) {
					scope.watch = 300;
					scope.onBreak = true;
				}
			}
			var breakCountdown = function () {
				scope.watch--;
				if (scope.watch === 0) {
					scope.watch = 1500;
					scope.onBreak = false;
				}
			}
			scope.$watch('watch', function(newValue, oldValue) {
				if (newValue === 0) {
					if (scope.onBreak) {
						scope.onBreak = false;
						scope.watch = 60;
						scope.buttonText = "Start";
					} else {
						scope.onBreak = true;
						scope.watch = 30;
						scope.breakButton = "Break";
						scope.completedWorkSessions++;
					}
					if (scope.completedWorkSessions === 4) {
						if (newValue === 0) {
							if (scope.onBreak) {
						scope.watch = 1800;
						scope.onBreak = true;
						scope.buttonText = "Resume";
						scope.completedWorkSessions = 0; }
						else {
							scope.onBreak = false;
							scope.watch = 60;
							scope.buttonText = "Start";
							}
						}
					}
					scope.onBreakClicked();
				}
			});
			scope.buttonTextClicked = function () {
				if (scope.buttonText === "Start") {
					scope.buttonText = "Reset";
					scope.interval = $interval(scope.countdown, 1000);
				}
				else {
					scope.buttonText = "Start";
					$interval.cancel(scope.interval);
				}
			}
			scope.onBreakClicked = function () {
				if (scope.breakButton === "Break") {
					scope.breakButton = "Resume";
					$interval.cancel(scope.interval);
				}
				else {
					scope.breakButton = "Break";
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
},{}]},{},[1]);