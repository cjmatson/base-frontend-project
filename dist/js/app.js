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
	var ref = new Firebase("https://popping-heat-8018.firebaseio.com/");
	$scope.data = $firebase(ref);
	$scope.tasks = $scope.data.$asArray();
	$scope.task = {createdAt: Firebase.ServerValue.TIMESTAMP};
	$scope.addTask = function() {
		if ($scope.task.name) {
			$scope.tasks.$add($scope.task);
			$scope.task = {createdAt: Firebase.ServerValue.TIMESTAMP};
			return {
				all: $scope.tasks
			}
		}
	}
	$scope.returnTask = function($event) {
		if ($scope.task.name && $event.keyCode === 13) {
			$scope.tasks.$add($scope.task);
			$scope.task = {createdAt: Firebase.ServerValue.TIMESTAMP};
			return {
				all: $scope.tasks
			}
		}
	}
}])

blocTime.directive('tracker',['$interval', function($interval) {
	return {
		restrict: 'E',
		templateUrl: '/templates/directives/tracker.html',
		scope: true,
		link: function(scope, element, attributes) {
			scope.mySound = new buzz.sound('http://soundjax.com/reddo/4122%5Edingdong.mp3', {
				preload: true,
			});
			scope.volume = 90;
			scope.playing = false;
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
						scope.buttonText = "Start Work";
						scope.mySound.play();
						scope.mySound.setVolume(scope.volume);
						scope.playing = true;
					} else {
						scope.onBreak = true;
						scope.watch = 300;
						scope.breakButton = "Pause Break";
						scope.completedWorkSessions++;
						scope.mySound.play();
						scope.mySound.setVolume(scope.volume);
						scope.playing = true;
					}
					if (scope.completedWorkSessions === 4) {
						if (newValue === 0) {
							if (scope.onBreak) {
						scope.watch = 1800;
						scope.onBreak = true;
						scope.buttonText = "Start Break";
						scope.completedWorkSessions = 0;
						scope.mySound.play();
						scope.mySound.setVolume(scope.volume);
						scope.playing = true;
					        }
						else {
							scope.onBreak = false;
							scope.watch = 1500;
							scope.buttonText = "Start Work";
							scope.mySound.play();
							scope.mySound.setVolume(scope.volume);
							scope.playing = true;
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

},{}]},{},[1]);