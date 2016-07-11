// var MQTT = require('../lib/MQTTreader');
var mqtt = require('mqtt');
var d3 = require('d3-browserify')
var moment = require('moment');
require('moment-timezone');
require('angularfire');
require('client-firebase');


module.exports = function($scope, $firebaseArray, $timeout) {
	var ref = new Firebase("https://esp001-864dd.firebaseio.com/first_try");
	var broker = 'mqtt://a955900d:ade60d7ea25819d9@broker.shiftr.io';
	var client = mqtt.connect(broker);
	client.subscribe('esp001data/');

	var line;
	var xAxis;
	var yAxisLeft;
	var N = 200;
	var data = {time:new Array(N), value:new Array(N)};
	
	once_init()

	client.handleMessage = function(packet, cb) {
		on_post_added(packet);
		cb();
	};

	// define dimensions of graph
    var m = [20, 80, 160, 80]; // margins
    var w = 1200 - m[1] - m[3]; // width
    var h = 400 - m[0] - m[2]; // height

//-----------------------------------------------------------------------
	function initData() {
		console.log("initData loaded ...");
	    times_ext = d3.extent(data.time, function(el) {
	    	return el;
	    });
	    value_ext = d3.extent(data.value, function(el) {
	    	return el;
	    });
	    xScale = d3.time.scale().domain(times_ext).range([0, w]);
	    yScale = d3.scale.linear().domain(value_ext).range([h, 0]);

		// create a line function that can convert data[] into x and y points
		line = d3.svg.line()
		  // assign the X function to plot our line as we wish
		  .x(function(d,i) { 
		    // return the X coordinate where we want to plot this datapoint
		    return xScale(data.time[i]); 
		})
		  .y(function(d) { 
		    // return the Y coordinate where we want to plot this datapoint
		    return yScale(d); 
		})

		// Add an SVG element with the desired dimensions and margin.
		graph = d3.select("#graph").append("svg:svg")
		.attr("class", "Graph")
		.attr("width", w + m[1] + m[3])
		.attr("height", h + m[0] + m[2])
		.append("svg:g")
		.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

		// DateTime Format
		// var formatDate = d3.time.format("%a %b %d %Y:%M:%S L");

		// create yAxis
		xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(30).tickFormat(d3.time.format("%%H.%M.%S %Z"));
		// var xAxis = d3.svg.axis().scale(x).ticks(4);
		// Add the x-axis.
		graph.append("svg:g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + h + ")")
		.call(xAxis)
		.selectAll("text")	
		.style("text-anchor", "end")
		.attr("dx", "-.8em")
		.attr("dy", ".15em")
		.attr("transform", function(d) {
			return "rotate(-85)" 
		});

		// create left yAxis
		yAxisLeft = d3.svg.axis().scale(yScale).orient("left");
		// Add the y-axis to the left
		graph.append("svg:g")
		.attr("class", "y_axis")
		.attr("transform", "translate(-25,0)")
		.call(yAxisLeft);

		// Add the line by appending an svg:path element with the data line we created above
		// do this AFTER the axes above so that the line is above the tick-lines
		graph.append("svg:path").attr("class", "line").attr("d", line(data.value));

		d3.selectAll("*").style("background-color","whitesmoke")

		};



//-----------------------------------------------------------------------
	function updateData(packet) {
		var date_ = new Date().addHours(-4);   
		// var date_ = moment();
		console.log(moment().format());
		data.time.push(date_);
		data.time.shift();
	    data.value.push(parseInt(packet.payload));
	    data.value.shift();
	    //Firebase Update
	    // console.log('Firebase Update');
	    ref.push({ 'timestamp':date_ , 'value': parseInt(packet.payload) });
	    // console.log(data.value);
	    times_ext = d3.extent(data.time, function(el) {
	    	return el;
	    });
	    value_ext = d3.extent(data.value, function(el) {
	    	return el;
	    });
		// Scale the range of the data again 
	    var xScale = d3.time.scale().domain(times_ext).range([0, w]);
	    var yScale = d3.scale.linear().domain(value_ext).range([h, 0]);

	    		// create a line function that can convert data[] into x and y points
		line = d3.svg.line()
		  // assign the X function to plot our line as we wish
		  .x(function(d,i) { 
		    // return the X coordinate where we want to plot this datapoint
		    return xScale(data.time[i]); 
		})
		  .y(function(d) { 
		    // return the Y coordinate where we want to plot this datapoint
		    return yScale(d); 
		})

		// Select the section we want to apply our changes to
		var svg = d3.selectAll(".Graph");
		xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(30).tickFormat(d3.time.format.utc("%H-%M-%S"));
		yAxisLeft = d3.svg.axis().scale(yScale).orient("left");
		// Make the changes
	    svg.select(".line")   // change the line
	        .attr("d", line(data.value))
	    svg.select(".x_axis") // change the x axis
	        .call(xAxis).selectAll("text")	
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", ".15em")
			.attr("transform", function(d) {
				return "rotate(-85)" 
			});
	    svg.select(".y_axis") // change the y axis
	        .call(yAxisLeft);
	};


	//-----------------------------------------------------------------------
  function on_post_added(packet) {
  	$timeout(function(){
  		updateData(packet)
  		ref
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
  		initData();
  	},0);
  };

	Date.prototype.addHours = function(hours) {
		this.setHours(this.getHours() + hours);
		return this;
	};

};
