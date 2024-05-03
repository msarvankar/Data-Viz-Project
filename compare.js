(function() {
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function createDropdowns(data) {
        var features = Object.keys(data[0]).filter(function(key) {
            return isNumeric(data[0][key]);
        });

        var selectX = d3.select("#x-axis-dropdown").html("");
        var selectY = d3.select("#y-axis-dropdown").html("");

        features.forEach(function(feature) {
            selectX.append("option").text(feature).attr("value", feature);
            selectY.append("option").text(feature).attr("value", feature);
        });

        selectX.node().value = features[0];
        selectY.node().value = features.length > 1 ? features[1] : features[0];

        updateChart(data, features[0], features[1]);  // Initial update on creation
    }

    function updateChart(data, xFeature, yFeature) {
        d3.select("#scatterplot").selectAll("*").remove();

        var margin = {top: 20, right: 20, bottom: 50, left: 80},
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        var svg = d3.select("#scatterplot").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear()
            .domain([d3.min(data, d => +d[xFeature]) * 0.9, d3.max(data, d => +d[xFeature]) * 1.1])
            .range([0, width]);

        var y = d3.scaleLinear()
            .domain([d3.min(data, d => +d[yFeature]) * 0.9, d3.max(data, d => +d[yFeature]) * 1.1])
            .range([height, 0]);

        var r = d3.scaleSqrt()
            .domain([d3.min(data, d => +d[yFeature]), d3.max(data, d => +d[yFeature])])
            .range([5, 20]);  // Radius between 4 and 12 pixels
        

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        var colorScale = d3.scaleOrdinal(d3.schemeCategory10); // Define a color scale

        var tooltip = d3.select('#tooltip');

        svg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", d => x(+d[xFeature]))
            .attr("cy", d => y(+d[yFeature]))
            .attr("r", d => r(+d[yFeature])) // Use the new scale for radius
            .style("fill", d => colorScale(d.Country)) // Apply the color scale here
            .style("opacity", 0.5)
            .on('mouseover', function(event, d) {
                d3.selectAll("circle").style("opacity", 0.2);
                d3.select(this).style("opacity", 1);
                tooltip.style('display', 'block')
                        .html(`<strong>Country:</strong> ${d.Country}<br>
                              <strong>${xFeature}:</strong> ${(+d[xFeature]).toFixed(2)}<br>
                              <strong>${yFeature}:</strong> ${(+d[yFeature]).toFixed(2)}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseout", function() {
                d3.selectAll("circle").style("opacity", 0.5);
                tooltip.style("display", "none");
            });
    }

    function loadDataAndCreateViz() {
        d3.csv("world-data-2023.csv").then(function(data) {
            data.forEach(function(d) {
                Object.keys(d).forEach(function(key) {
                    var formatted = d[key].replace(/,/g, '').replace(/%/g, '');
                    var parsedNumber = parseFloat(formatted);
                    d[key] = isNaN(parsedNumber) ? d[key] : parsedNumber;
                });
            });

            createDropdowns(data);

            d3.select("#x-axis-dropdown").on("change", function() {
                var xFeature = this.value;
                var yFeature = document.getElementById('y-axis-dropdown').value;
                updateChart(data, xFeature, yFeature);
            });

            d3.select("#y-axis-dropdown").on("change", function() {
                var xFeature = document.getElementById('x-axis-dropdown').value;
                var yFeature = this.value;
                updateChart(data, xFeature, yFeature);
            });
        }).catch(function(error) {
            console.error("Error loading the CSV file:", error);
        });
    }

    window.loadDataAndCreateViz = loadDataAndCreateViz;
})();
