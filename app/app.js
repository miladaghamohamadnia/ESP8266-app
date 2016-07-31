require('angular');
require('jquery');
require('angularfire');
require('client-firebase');
var controller1 = require('./controllers/controller1');
var controller2 = require('./controllers/controller2');
var d3  		= require('d3-browserify');
var moment 		= require('moment');


var app = angular.module('app', ['firebase']);
app.controller('controller1', ['$scope', '$firebaseArray', '$timeout', controller1]);
app.controller('controller2', ['$scope', '$firebaseArray', '$timeout', controller2]);
