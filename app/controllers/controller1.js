// var MQTT = require('../lib/MQTTreader');
var mqtt = require('mqtt');
require('moment-timezone');
require('angularfire');
require('client-firebase');
var initData = require('../lib/initData');
var updateData = require('../lib/updateData');


module.exports = function($scope, $firebaseArray, $timeout) {
	var ref1 = new Firebase("https://esp001-864dd.firebaseio.com/001");
	var broker = 'mqtt://a955900d:ade60d7ea25819d9@broker.shiftr.io';
	var client1 = mqtt.connect(broker);
	client1.subscribe('esp001data/');

	var graphData = new function() {
		this.line = null;
		this.xAxis = null; 
		this.yAxisLeft = null;
		this.N = 100;
		this.m = [20, 80, 160, 80];
		this.w = 1200 - this.m[1] - this.m[3];
		this.h = 400 - this.m[0] - this.m[2];
		this.data = {time:new Array(this.N), value:new Array(this.N)};
		this.ref = ref1;
		this.tag = ".Graph1";
		this.id = 1;
	}

	once_init(graphData)
	client1.handleMessage = function(packet, cb) {
		on_post_added(packet, graphData);
		cb();
	};

	//-----------------------------------------------------------------------
  function on_post_added(packet, graphData) {
  	$timeout(function(){
  		updateData(packet,graphData)
  	},0);
  };
  //-----------------------------------------------------------------------
  function once_init(graphData) {
  	$timeout(function(){
  		console.log("controller loaded ...");
  		// Firebase database cleaning
  		graphData.ref.remove();
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
