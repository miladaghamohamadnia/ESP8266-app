var d3 = require('d3-browserify')
var moment = require('moment');
//-----------------------------------------------------------------------
module.exports = function updateData(packet, graphData) {
	// console.log("updateData loaded ...");
	var date_ = new Date().addHours(-4);   
	m = graphData.m;
	w = graphData.w;
	h = graphData.h;
	data = graphData.data;
	var tag = graphData.tag;
	console.log(graphData);
	data.time.push(date_);
	data.time.shift();
	data.value.push(parseInt(packet.payload));
	data.value.shift();
    //Firebase Update
    // console.log('Firebase Update');
    graphData.ref.push({ 'timestamp':date_ , 'value': parseInt(packet.payload) });
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
	var svg = d3.selectAll(tag);
	graphData.xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(30).tickFormat(d3.time.format.utc("%H-%M-%S"));
	graphData.yAxisLeft = d3.svg.axis().scale(yScale).orient("left");
	// Make the changes
    svg.select(".line")   // change the line
    .attr("d", line(data.value))
    svg.select(".x_axis") // change the x axis
    .call(graphData.xAxis).selectAll("text")	
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d) {
    	return "rotate(-85)" 
    });
    svg.select(".y_axis") // change the y axis
    .call(graphData.yAxisLeft);
};
