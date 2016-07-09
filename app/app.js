require('angular');
var mainController = require('./controllers/mainController');

var app = angular.module('app', []);
app.controller('mainController', ['$scope', '$timeout', mainController])
