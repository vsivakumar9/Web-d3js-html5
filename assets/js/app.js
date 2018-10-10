// d3 visualization to read csv and plot graphs using svg.
//Author Siva. Sep-Oct 2018 
//Final version:
//html code id = scatter for the plot.
console.log("In javascript app.js")
// Define chart area
var svgWidth = 900;
var svgHeight = 500;

//Define margins.
var margin = {
  top: 20,
  right: 100,
  bottom: 70,
  left: 100
};

// chart area  minus margins.
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth  = svgWidth - margin.left - margin.right;

// create svg container and shift everything over by the margins using transform/translate.
var svg = d3
    .select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var chartGroup = svg.append("g")
    // shift everything over by the margins
    // .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read data from data.csv
//d3.csv("../Web-d3js-html5/assets/data/data.csv", function(err, brfssdata) {
    d3.csv("/data/data.csv", function(err, brfssdata) {
    if (err) throw err;
    //if (error) return console.warn(error);
    console.log(brfssdata)
    
    //process csv file using a for loop.
    for (var i = 0; i < brfssdata.length; i++) {
        console.log(i, brfssdata[i].state, brfssdata[i].poverty, brfssdata[i].healthcare );
        console.log(i, brfssdata[i].obesity, brfssdata[i].income  );
    }

    brfssdata.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      })
  
       // Create scale functions. scale y to chart height.
      var yLinearScale = d3.scaleLinear().range([chartHeight, 0]);
      // scale x to chart width.
      var xLinearScale = d3.scaleLinear().range([0, chartWidth]);
  
      // Create axis functions
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);
  
      // Scale the domain
      xLinearScale.domain([7,
          d3.max(brfssdata, function(data) {
          return +data.poverty;
        }),
      ]);

      yLinearScale.domain([0,
          d3.max(brfssdata, function(data) {
          return +data.healthcare * 1.1;
        }),
      ]);
  
      console.log("creating tooltip")
      // Create tool tip
      var toolTip = d3
        .tip()
        .attr('class', 'tooltip')
        .offset([80, -60])
        .html(function(data) {
            var state = data.state;
            var poverty = +data.poverty;
            var healthcare = +data.healthcare;
            return (
            state + '<br> Poverty Percentage: ' + poverty + '<br> Lacks Healthcare Percentage: ' + healthcare
            );
        });
  
      chartGroup.call(toolTip);
      
      // Generate Scatter Plot
      chartGroup
      .selectAll('circle')
      .data(brfssdata)
      .enter()
      .append('circle')
      .attr('cx', function(data, index) {
        return xLinearScale(data.poverty);
      })
      .attr('cy', function(data, index) {
        return yLinearScale(data.healthcare);
      })
      .attr('r', '17')
      .attr('fill', 'lightblue')
      .on('click', function(data) {
        toolTip.show(data);
      })
      // Hide and Show on mouseout
      .on('mouseout', function(data, index) {
        toolTip.hide(data);
      });
  
      chartGroup
        .append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(bottomAxis);
  
      chartGroup.append('g').call(leftAxis);
  
      svg.selectAll(".dot")
      .data(brfssdata)
      .enter()
      .append("text")
      .text(function(data) { return data.abbr; })
      .attr('x', function(data) {
        return xLinearScale(data.poverty);
      })
      .attr('y', function(data) {
        return yLinearScale(data.healthcare);
      })
      .attr("font-size", "10px")
      .attr("fill", "black")
      .style("text-anchor", "middle");
  
      chartGroup
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left + 40)
        .attr('x', 0 - chartHeight / 2)
        .attr('dy', '1em')
        .attr('class', 'axisText')
        .text('Lacks Healthcare (%)');
  
      // x-axis labels
      chartGroup
        .append('text')
        .attr(
          'transform',
          'translate(' + chartWidth / 2 + ' ,' + (chartHeight + margin.top + 30) + ')',
        )
        .attr('class', 'axisText')
        .text('Poverty (%)');



})
