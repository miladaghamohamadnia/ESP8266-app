var d3 = require('d3-browserify')
var moment = require('moment');
//-----------------------------------------------------------------------
function initData(graphData) {
	console.log("initData loaded ...");
	m = graphData.m;
	w = graphData.w;
	h = graphData.h;
	times_ext = d3.extent(graphData.data.time, function(el) {
		return el;
	});
	value_ext = d3.extent(graphData.data.value, function(el) {
		return el;
	});
	xScale = d3.time.scale().domain(times_ext).range([0, w]);
	yScale = d3.scale.linear().domain(value_ext).range([h, 0]);

	// create a line function that can convert data[] into x and y points
	graphData.line = d3.svg.line()
	  // assign the X function to plot our line as we wish
	  .x(function(d,i) { 
	    // return the X coordinate where we want to plot this datapoint
	    return xScale(graphData.data.time[i]); 
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
	graphData.xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(30).tickFormat(d3.time.format("%%H.%M.%S %Z"));
	// var xAxis = d3.svg.axis().scale(x).ticks(4);
	// Add the x-axis.
	graph.append("svg:g")
	.attr("class", "x_axis")
	.attr("transform", "translate(0," + h + ")")
	.call(graphData.xAxis)
	.selectAll("text")	
	.style("text-anchor", "end")
	.attr("dx", "-.8em")
	.attr("dy", ".15em")
	.attr("transform", function(d) {
		return "rotate(-85)" 
	});

	// create left yAxis
	graphData.yAxisLeft = d3.svg.axis().scale(yScale).orient("left");
	// Add the y-axis to the left
	graph.append("svg:g")
	.attr("class", "y_axis")
	.attr("transform", "translate(-25,0)")
	.call(graphData.yAxisLeft);

	// Add the line by appending an svg:path element with the data line we created above
	// do this AFTER the axes above so that the line is above the tick-lines
	graph.append("svg:path").attr("class", "line").attr("d", graphData.line(graphData.data.value));

	d3.selectAll("*").style("background-color","whitesmoke")

};

module.exports=initData
