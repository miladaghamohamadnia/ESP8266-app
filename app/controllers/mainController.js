// var MQTT = require('../lib/MQTTreader');
var mqtt = require('mqtt');
require('moment-timezone');
require('angularfire');
require('client-firebase');
var initData = require('../lib/initData');
var updateData = require('../lib/updateData');


module.exports = function($scope, $firebaseArray, $timeout) {
	var ref = new Firebase("https://esp001-864dd.firebaseio.com/first_try");
	var broker = 'mqtt://a955900d:ade60d7ea25819d9@broker.shiftr.io';
	var client = mqtt.connect(broker);
	client.subscribe('esp001data/');

	var graphData = new function() {
		this.line = null;
		this.xAxis = null; 
		this.yAxisLeft = null;
		this.N = 200;
		this.m = [20, 80, 160, 80];
		this.w = 1200 - this.m[1] - this.m[3];
		this.h = 400 - this.m[0] - this.m[2];
		this.data = {time:new Array(this.N), value:new Array(this.N)};
		this.ref = ref;
	}

	// var line;
	// var xAxis;
	// var yAxisLeft;
	// var N = 200;
	// var data = {time:new Array(N), value:new Array(N)};
	
	once_init()

	client.handleMessage = function(packet, cb) {
		on_post_added(packet);
		cb();
	};

	// // define dimensions of graph
 //    var m = [20, 80, 160, 80]; // margins
 //    var w = 1200 - m[1] - m[3]; // width
 //    var h = 400 - m[0] - m[2]; // height



	//-----------------------------------------------------------------------
  function on_post_added(packet) {
  	$timeout(function(){
  		updateData(packet,graphData)
  	},0);
  };
  //-----------------------------------------------------------------------
  function once_init() {
  	$timeout(function(){
  		console.log("controller loaded ...");
  		// Firebase database cleaning
  		ref.remove();
  		console.log("firebase cleaned ...");
  		// D3 process begins
  		initData(graphData);
  	},0);
  };

	Date.prototype.addHours = function(hours) {
		this.setHours(this.getHours() + hours);
		return this;
	};

};
