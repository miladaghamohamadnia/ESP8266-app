require('angular');
var mainController = require('./controllers/mainController');
// require('angularfire-browserify');
require('jquery');
require('angularfire');
require('client-firebase');


var app = angular.module('app', ['firebase']);
app.controller('mainController', ['$scope', '$firebaseArray', '$timeout', mainController])
