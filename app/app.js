require('angular');
var mainController = require('./controllers/mainController');
require('jquery');
require('angularfire');
require('client-firebase');
var d3 = require('d3-browserify')
var moment = require('moment');


var app = angular.module('app', ['firebase']);
app.controller('mainController', ['$scope', '$firebaseArray', '$timeout', mainController])
